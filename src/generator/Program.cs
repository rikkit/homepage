using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using generator.Tiles;
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
            if (args.Length != 2)
            {
                Console.Error.WriteLine("Usage: generator.exe <config.json> <output.json>");
                return;
            }

            var configPath = Path.GetFullPath(args.ElementAtOrDefault(0));
            var apiConfig = GetConfigFromFile(configPath);
            var outputPath = Path.GetFullPath(args.ElementAtOrDefault(1));

            Console.WriteLine($"Generating tile json. Config: {configPath}, Out: {outputPath}");

            var httpClient = new HttpClient();

            var tileData = new
            {
                github = await new GithubTileBuilder(apiConfig.GitHub).GetTileAsync(),
                lastfm = await new LastfmTileBuilder(apiConfig.Lastfm, apiConfig.Spotify, httpClient).GetTileAsync(),
                twitter = await new TwitterTileBuilder(apiConfig.Twitter, httpClient).GetTileAsync(),
            };

            await File.WriteAllTextAsync(outputPath, JsonConvert.SerializeObject(tileData));
            Console.WriteLine("...complete");
        }

        private static ApiConfig GetConfigFromFile(string configPath)
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
