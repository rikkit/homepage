using System;
using System.Linq;
using System.Threading.Tasks;
using Octokit;
using Octokit.Internal;

namespace homepage.Api
{
    public class GithubTileBuilder : TileBuilder
    {
        private readonly GitHubClient _client;

        public GithubTileBuilder(ApiConfigManager config) : base(config)
        {
            var credentials = new Credentials(_config.GithubToken);
            var credentialStore = new InMemoryCredentialStore(credentials);
            
            _client = new GitHubClient(new ProductHeaderValue("HomepageTile"), credentialStore);
        }

        protected async override Task<Tile> BuildAsync()
        {
            var events = await _client.Activity.Events.GetAllUserPerformedPublic(_config.GithubUsername);
            var activeRepos = events.OrderByDescending(e => e.CreatedAt)
                .Where(e => e.CreatedAt > DateTimeOffset.UtcNow.AddMonths(-1))
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
                .Select(e => e.Repo.Name)
                .Distinct();

            var data = activeRepos.Select(name => new TileContent
            {
                Name = name,
                Overlay = false
            });

            var tile = new Tile
            {
                Title = "Github",
                CssClass = "github",
                Size = "wide",
                Link = new Uri("https://github.com/rikkit"),
                Content = data
            };

            return tile;
        }
    }
}