using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using homepage.Generator.Tiles;
using HtmlTags;
using Humanizer;
using MarkdownSharp;
using Mustache;

namespace homepage.Generator
{
    public class PageBuilder
    {

        private readonly string _sourceDir;
        private readonly ApiConfig _config;
        private readonly string _outDir;

        private static readonly IReadOnlyCollection<string> MarkdownExtensions = new[]
        {
            "md",
            "mdown",
            "markdown"
        };

        public PageBuilder(string sourceDir, string outDir, ApiConfig config)
        {
            _sourceDir = EnsureTerminatingDirectorySeparator(sourceDir);
            _outDir = EnsureTerminatingDirectorySeparator(outDir);
            _config = config;
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
            var tileRoot = await BuildTileRoot(_config);

            Console.WriteLine($"Building pages...");
            var sourceFiles = EnumerateSourceFiles(_sourceDir)
                .Where(path => MarkdownExtensions.Any(path.EndsWith))
                .ToList();
            
            Console.WriteLine($"Found {sourceFiles.Count} markdown files in {_sourceDir}");

            var outDirUri = new Uri(_outDir);
            var sourceDirUri = new Uri(_sourceDir);
            var markdownParser = new Markdown();
            var formatCompiler = new FormatCompiler {RemoveNewLines = false};
            var generator = formatCompiler.Compile(Templates.skeleton);
            foreach (var sourceFile in sourceFiles)
            {
                var pageLines = File.ReadAllLines(sourceFile).ToList();
                var pageMeta = PageMeta.Parse(pageLines);

                var articleLines = pageLines.SkipWhile(line => line.StartsWith(PageMeta.MD_META_PREFIX));
                var articleMarkdown = string.Join(Environment.NewLine, articleLines);
                var articleHtml = markdownParser.Transform(articleMarkdown);

                var sourceFileDir = new Uri(EnsureTerminatingDirectorySeparator(Path.GetDirectoryName(sourceFile)));
                var sourceRelativeUri1 = sourceFileDir.MakeRelativeUri(sourceDirUri);
                var sourceRelativeUri2 = sourceDirUri.MakeRelativeUri(sourceFileDir);

                var sourceFileName = Path.GetFileNameWithoutExtension(sourceFile);
                var pageData = new
                {
                    title = pageMeta.Title ?? sourceFileName.Humanize("-"),
                    content = articleHtml,
                    tiles = tileRoot.RenderFromTop().ToHtmlString(),
                    webroot = sourceRelativeUri1.ToString().NullIfEmpty() ?? ".",
                    date = pageMeta.Date?.Humanize() ?? ""
                };
                var html = generator.Render(pageData);
                
                var outFileName = $"{sourceFileName.ToLowerInvariant()}.html";
                var outFileDir = new Uri(outDirUri, sourceRelativeUri2);
                var outFilePath = new Uri(outFileDir, outFileName);

                if (!Directory.Exists(outFileDir.AbsolutePath))
                {
                    Directory.CreateDirectory(outFileDir.AbsolutePath);
                }

                File.WriteAllText(outFilePath.AbsolutePath, html);
                Console.WriteLine($"Built {outFilePath.AbsolutePath.Replace(outDirUri.AbsolutePath, "")}");
            }
        }
        
        private async Task<HtmlTag> BuildTileRoot(ApiConfig apiConfig)
        {
            var tileBuilderFactory = new TileBuilderFactory(apiConfig);
            var tileBuilders = tileBuilderFactory.GetBuilders();

            var tileTasks = tileBuilders.Select(b => b.GetTileAsync());
            var tiles = await Task.WhenAll(tileTasks);

            var tileRoot = new HtmlTag("div").AddClass("tiles");

            foreach (var tile in tiles)
            {
                var html = tile.RenderHtml();
                tileRoot.AppendHtml(html);
            }

            return tileRoot;
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
    }
}