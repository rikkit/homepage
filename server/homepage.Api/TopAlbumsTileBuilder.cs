using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using IF.Lastfm.Core.Api;

namespace homepage.Api
{
    public class TopAlbumsTileBuilder : TileBuilder
    {
        private readonly LastfmClient _lastfmClient;

        public TopAlbumsTileBuilder(ApiConfigManager config, HttpClient httpClient)
            : base(config)
        {
            _lastfmClient = new LastfmClient(config.LastfmApiKey, config.LastfmSecret, httpClient);
        }

        public async override Task<Tile> Build()
        {
            var albums = await _lastfmClient.User.GetTopAlbums(_config.LastfmUsername, _config.LastfmAlbumTimeSpan, 0, _config.LastfmAlbumCount);

            var data = albums.Select(a => new TileContent
            {
                Name = a.Name,
                Image = a.Images.ExtraLarge ?? a.Images.Large ?? a.Images.Medium,
                Overlay = true
            });

            return new Tile
            {
                Title = "Last.fm",
                CssClass = "lastfm albums",
                Size = "large",
                Link = new Uri("http://last.fm/user/tehrikkit"),
                Content = data
            };
        }
    }
}