using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using IF.Lastfm.Core.Api;
using IF.Lastfm.Core.Api.Enums;

namespace homepage.Api
{
    public class TopAlbumsTileBuilder : TileBuilder
    {
        private readonly LastfmClient _lastfmClient;
        private readonly string _username;
        private readonly LastStatsTimeSpan _timespan;
        private readonly int _count;

        public TopAlbumsTileBuilder(object configuration, HttpClient httpClient)
            : base(configuration)
        {
            dynamic config = configuration;
            _lastfmClient = new LastfmClient((string)config.lastfmApiKey, (string)config.lastfmSecret, httpClient);
            _username = config.lastfmUsername;
            Enum.TryParse((string)config.lastfmAlbumTimespan, out _timespan);
            _count = (int) config.lastfmAlbumCount;
        }

        public async override Task<Tile> Build()
        {
            var albums = await _lastfmClient.User.GetTopAlbums(_username, _timespan, 0, _count);

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