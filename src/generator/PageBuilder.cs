using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using generator.Tiles;
using HeyRed.MarkdownSharp;
using Humanizer;
using Mustache;

namespace generator
{
    public class PageBuilder
    {
        private enum SourceType
        {
            Other = 0,
            Html,
            Markdown
        }

        private readonly string _sourceDir;
        private readonly ApiConfig _config;
        private readonly string _outDir;
        private readonly TemplateManager _templateManager;

        public PageBuilder(string sourceDir, string outDir, ApiConfig config, TemplateManager templateManager)
        {
            _sourceDir = EnsureTerminatingDirectorySeparator(sourceDir);
            _outDir = EnsureTerminatingDirectorySeparator(outDir);
            _config = config;
            _templateManager = templateManager;
        }

        public async Task Build()
        {
            if (!Directory.Exists(_sourceDir))
            {
                Console.WriteLine($"Didn't find any pages in {_sourceDir}.");
                return;
            }

            if (!Directory.Exists(_outDir))
            {
                Console.WriteLine($"Creating directory {_outDir}");
                Directory.CreateDirectory(_outDir);
            }

            Console.WriteLine($"Building tiles...");
            var tileRoot = await BuildTileHtml();

            Console.WriteLine($"Building pages...");
            var sourceFiles = EnumerateSourceFiles(_sourceDir)
                .Select(path =>
                {
                    SourceType type;
                    switch (Path.GetExtension(path))
                    {
                        case ".html":
                            type = SourceType.Html;
                            break;
                        case ".md":
                        case ".mdown":
                        case ".markdown":
                            type = SourceType.Markdown;
                            break;
                        default:
                            type = SourceType.Other;
                            break;
                    }

                    return new {path, type};
                })
                .Where(x => x.type != SourceType.Other)
                .ToList();
            
            Console.WriteLine($"Found {sourceFiles.Count} files in {_sourceDir}");
            
            var markdownParser = new Markdown();
            var formatCompiler = new FormatCompiler {RemoveNewLines = false};
            var markdownGenerator = formatCompiler.Compile(_templateManager.Templates["skeleton"]);
            foreach (var sourceFile in sourceFiles)
            {
                // dir structure should be maintained from source to out,
                // need to get the relative path from the source file to the root of all source files.
                var sourceToWebrootPath = GetRelativePath(sourceFile.path, _sourceDir);
                var sourceFileName = Path.GetFileNameWithoutExtension(sourceFile.path);
                var webrootToSourceFileDirPath = GetRelativePath(_sourceDir, Path.GetDirectoryName(sourceFile.path));

                var outFileName = $"{sourceFileName.ToLowerInvariant()}.html";
                var outFilePath = Path.Combine(_outDir, webrootToSourceFileDirPath, outFileName);
                
                string pageHtml;
                if (sourceFile.type == SourceType.Html)
                {
                    var pageTemplate = File.ReadAllText(sourceFile.path);
                    var compiler = formatCompiler.Compile(pageTemplate);
                    var pageData = new
                    {
                        title = sourceFileName,
                        tiles = tileRoot,
                        webroot = sourceToWebrootPath.NullIfEmpty() ?? ".",
                        date = ""
                    };
                    pageHtml = compiler.Render(pageData);
                }
                else if (sourceFile.type == SourceType.Markdown)
                {
                    var pageLines = File.ReadAllLines(sourceFile.path).ToList();
                    var pageMeta = PageMeta.Parse(pageLines);

                    var articleLines = pageLines.SkipWhile(line => line.StartsWith(PageMeta.MD_META_PREFIX));
                    var articleMarkdown = string.Join(Environment.NewLine, articleLines);
                    var articleHtml = markdownParser.Transform(articleMarkdown);

                    var pageData = new
                    {
                        title = pageMeta.Title ?? sourceFileName.Humanize("-"),
                        content = articleHtml,
                        tiles = tileRoot,
                        webroot = sourceToWebrootPath.NullIfEmpty() ?? ".",
                        date = pageMeta.Date?.Humanize() ?? ""
                    };

                    pageHtml = markdownGenerator.Render(pageData);
                }
                else
                {
                    throw new Exception($"Source type {sourceFile.type} not supported");
                }

                var outFileDir = Path.GetDirectoryName(outFilePath);
                if (!Directory.Exists(outFileDir))
                {
                    Directory.CreateDirectory(outFileDir);
                }

                File.WriteAllText(outFilePath, pageHtml);

                var colour = Console.ForegroundColor;
                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine($"Built {outFilePath.Replace(outFileDir, "")}");
                Console.ForegroundColor = colour;
            }
        }
        
        private async Task<string> BuildTileHtml()
        {
            var tileBuilderFactory = new TileBuilderFactory(_config);
            var tileBuilders = tileBuilderFactory.GetBuilders();

            var tileTasks = tileBuilders.Select(b => b.GetTileAsync());
            var tiles = await Task.WhenAll(tileTasks);

            const string tileRootStart = "<div class=\"tiles\">";
            var tilesHtml = tiles
                .Select(tile => tile.RenderHtml(_templateManager))
                .Aggregate(tileRootStart, (a, b) => a + b);
            tilesHtml += "</div>";
            
            return tilesHtml;
        }

        private static IEnumerable<string> EnumerateSourceFiles(string sourceDir)
        {
            var files = Directory.EnumerateFiles(sourceDir);
            var folders = Directory.EnumerateDirectories(sourceDir);
            var subfiles = folders.SelectMany(EnumerateSourceFiles);

            return files.Concat(subfiles);
        }

        /// <summary>
        /// Couldn't be bothered to write my own http://stackoverflow.com/a/34659715/268555
        /// </summary>
        private static string EnsureTerminatingDirectorySeparator(string path)
        {
            if (path == null) throw new ArgumentNullException(nameof(path));

            int length = path.Length;
            if (length == 0)
            {
                return "." + Path.DirectorySeparatorChar;
            }

            char lastChar = path[length - 1];
            if (lastChar == Path.DirectorySeparatorChar || lastChar == Path.AltDirectorySeparatorChar)
            {
                return path;
            }

            int lastSep = path.LastIndexOfAny(new char[] { Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar });

            return lastSep >= 0
                ? path + path[lastSep]
                : path + Path.DirectorySeparatorChar;
        }
        

        private static string GetRelativePath(string from, string to)
        {
            from = Path.GetFullPath(from);
            to = Path.GetFullPath(to);
            
            var fromFrags = from.Split(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar).ToArray();
            var toFrags = to.Split(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar).ToArray();

            int commonRootIndex = 0;
            for (int i = 0; i < fromFrags.Length; i++)
            {
                if (toFrags.Length <= i
                    || fromFrags[i] != toFrags[i])
                {
                    break;
                }

                commonRootIndex++;
            }

            var levelDiff = fromFrags.Length - 1 - commonRootIndex;

            var dirUpFragment = ".." + Path.DirectorySeparatorChar;
            var sb = new StringBuilder();
            for (int i = 0; i < levelDiff; i++) sb.Append(dirUpFragment);
            foreach (var toFrag in toFrags.Skip(commonRootIndex).Where(f => !string.IsNullOrWhiteSpace(f)))
            {
                sb.Append(toFrag);
                sb.Append(Path.DirectorySeparatorChar);
            }

            var relativePath = sb.ToString(0, sb.Length > 0 ? sb.Length - 1 : 0);

            return relativePath;
        }
    }
}