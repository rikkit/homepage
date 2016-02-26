using System;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace homepage.Generator
{
    public class Program
    {
        public static void Main(string[] args) => MainAsync(args).GetAwaiter().GetResult();

        private static async Task MainAsync(string[] args)
        {
            var sourceDir = args.Take(1).SingleOrDefault() ?? "./pages";
            sourceDir = Path.GetFullPath(sourceDir);

            var outDir = args.Skip(1).Take(1).SingleOrDefault() ?? "./out";
            outDir = Path.GetFullPath(outDir);

            var apiConfig = GetConfig();
            
            var pageBuilder = new PageBuilder(sourceDir, outDir, apiConfig);

            await pageBuilder.Build();

#if DEBUG
            Console.ReadLine();
#endif
        }

        private static ApiConfig GetConfig()
        {
            const string configPath = "./config.json";
            if (!File.Exists(configPath))
            {
                throw new ApplicationException($"{configPath} is missing");
            }

            var configJson = File.ReadAllText(configPath);
            var apiConfig = JsonConvert.DeserializeObject<ApiConfig>(configJson);
            return apiConfig;
        }
    }
}
