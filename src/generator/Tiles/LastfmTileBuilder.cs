using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using IF.Lastfm.Core.Api;

namespace generator.Tiles
{
    public class LastfmTileBuilder : TileBuilder
    {
        private readonly LastfmClient _lastfmClient;
        private readonly LastfmApiConfig _config;

        public LastfmTileBuilder(LastfmApiConfig config, HttpClient httpClient)
        {
            _config = config;
            _lastfmClient = new LastfmClient(config.Key, config.Secret, httpClient);
        }

        protected override async Task<Tile> BuildAsync()
        {
            var artists = await _lastfmClient.User.GetTopArtists(_config.Username, _config.Period, 1, _config.Count);

            var data = artists.Select(a => new TileContent
            {
                Name = a.Name,
                Overlay = true,
                Body = String.Join(",", a.Tags.Select(tag => tag.Name.ToLower())),
            });

            Console.WriteLine(String.Join("\n", artists.SelectMany(x => x.MainImage)));

            return new Tile
            {
                Title = "Now Playing",
                Style = "lastfm albums",
                Size = "large",
                Link = new Uri("http://last.fm/user/tehrikkit"),
                Content = data
            };
        }
    }
}