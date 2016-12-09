using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace generator
{
    public class Program
    {
        public static void Main(string[] args)
        {
            try
            {
                MainAsync(args).GetAwaiter().GetResult();
            }
            catch (Exception e)
            {
                var consoleColor = Console.ForegroundColor;
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine(e.ToString());
                Console.ForegroundColor = consoleColor;
            }
        }

        private static async Task MainAsync(string[] args)
        {
            var configPath = args.Skip(0).Take(1).SingleOrDefault() ?? "../../config.json";
            configPath = Path.GetFullPath(configPath);

            var sourceDir = args.Skip(1).Take(1).SingleOrDefault() ?? "../../pages";
            sourceDir = Path.GetFullPath(sourceDir);

            var outDir = args.Skip(2).Take(1).SingleOrDefault() ?? "../../public";
            outDir = Path.GetFullPath(outDir);

            var templateDir = args.Skip(3).Take(1).SingleOrDefault() ?? "../../res/html";
            templateDir = Path.GetFullPath(templateDir);
            var templateManager = new TemplateManager();
            templateManager.LoadFromDirectory(templateDir);

            var colour = Console.ForegroundColor;
            Console.ForegroundColor = ConsoleColor.DarkCyan;
            Console.WriteLine($"Config path: {configPath}");
            Console.WriteLine($"Page path: {sourceDir}");
            Console.WriteLine($"Out path: {outDir}");
            Console.WriteLine($"Template path: {templateDir}");
            Console.ForegroundColor = colour;

            var apiConfig = GetConfig(configPath);
            var pageBuilder = new PageBuilder(sourceDir, outDir, apiConfig, templateManager);

            await pageBuilder.Build();

#if DEBUG
            Console.ReadLine();
#endif
        }

        private static ApiConfig GetConfig(string configPath)
        {
            var fullConfigPath = Path.GetFullPath(configPath);
            if (!File.Exists(fullConfigPath))
            {
                throw new Exception($"{fullConfigPath} is missing");
            }

            var configJson = File.ReadAllText(configPath);
            var apiConfig = JsonConvert.DeserializeObject<ApiConfig>(configJson);
            return apiConfig;
        }
    }
}
