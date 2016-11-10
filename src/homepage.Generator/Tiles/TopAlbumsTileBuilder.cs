using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using IF.Lastfm.Core.Api;

namespace homepage.Generator.Tiles
{
    public class TopAlbumsTileBuilder : TileBuilder
    {
        private readonly LastfmClient _lastfmClient;
        private readonly LastfmApiConfig _config;

        public TopAlbumsTileBuilder(LastfmApiConfig config, HttpClient httpClient)
        {
            _config = config;
            _lastfmClient = new LastfmClient(config.Key, config.Secret, httpClient);
        }

        protected override async Task<Tile> BuildAsync()
        {
            var albums = await _lastfmClient.User.GetTopAlbums(_config.Username, _config.AlbumChartPeriod, 1, _config.AlbumChartCount);

            var data = albums.Select(a => new TileContent
            {
                Name = a.Name,
                Image = a.Images.Largest,
                Overlay = true
            });

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