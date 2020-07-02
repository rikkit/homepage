using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Octokit;
using Octokit.Internal;

namespace generator.Tiles
{
    public class GithubTileBuilder : TileBuilder
    {
        private readonly GitHubClient _client;
        private readonly GitHubApiConfig _config;

        public bool IsValid => !string.IsNullOrWhiteSpace(_config?.Token);

        public GithubTileBuilder(GitHubApiConfig config)
        {
            _config = config;

            if (IsValid)
            {
                var credentials = new Credentials(config.Token);
                var credentialStore = new InMemoryCredentialStore(credentials);
                _client = new GitHubClient(new ProductHeaderValue("HomepageTile"), credentialStore);
            }
        }

        protected override async Task<Tile> BuildAsync()
        {
            var data = IsValid
                ? await GetTileData()
                : Enumerable.Empty<TileContent>();

            var tile = new Tile
            {
                Title = "Current Projects",
                Style = "github",
                Size = "large",
                Link = new Uri("https://github.com/rikkit"),
                Content = data
            };

            return tile;
        }

        private async Task<IEnumerable<TileContent>> GetTileData()
        {
            var events = await _client.Activity.Events.GetAllUserPerformedPublic(_config.Username);
            var activeRepoIds = events.OrderByDescending(e => e.CreatedAt)
                .Where(e => e.CreatedAt > DateTimeOffset.UtcNow.AddMonths(-3))
                .Where(e => e.Public)
                .Where(e =>
                {
                    switch (e.Type)
                    {
                        case "CreateEvent":
                        //case "ForkEvent":
                        case "PushEvent":
                            return true;
                        default:
                            return false;
                    }
                })
                .Select(e => e.Repo.Id)
                .Distinct();

            var data = new List<TileContent>();
            foreach (var id in activeRepoIds)
            {
                try
                {
                    var repo = await _client.Repository.Get(id);

                    data.Add(new TileContent
                    {
                        Name = $"{repo.Owner.Login}/{repo.Name}",
                        Body = $"{repo.Description} ({repo.Language})",
                        Overlay = false
                    });
                }
                catch (Exception e)
                {
                    Console.Error.WriteLine($"GitHub | Error when getting repo {id}: {e.Message}");
                }
            }

            return data;
        }
    }
}