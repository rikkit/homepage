using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using IF.Lastfm.Core.Api;
using Newtonsoft.Json;

namespace generator.Tiles
{
    public class LastfmTileBuilder : TileBuilder
    {
        private readonly LastfmClient _lastfmClient;
        private readonly LastfmApiConfig _lastfmConfig;

        public LastfmTileBuilder(LastfmApiConfig lastfmConfig, HttpClient httpClient)
        {
            _lastfmConfig = lastfmConfig;
            _lastfmClient = new LastfmClient(lastfmConfig.Key, lastfmConfig.Secret, httpClient);
        }

        protected override async Task<Tile> BuildAsync()
        {
            var albums = await _lastfmClient.User.GetTopAlbums(_lastfmConfig.Username, _lastfmConfig.Period, 1, _lastfmConfig.Count);

            var data = new List<TileContent>();
            foreach (var album in albums)
            {
                data.Add(new TileContent
                {
                    Name = $"{album.ArtistName} // {album.Name}",
                    Overlay = true,
                    Image = album.Images.LastOrDefault(),
                });
            }

            return new Tile
            {
                Title = "Now Playing",
                Style = "lastfm",
                Size = "large",
                Link = new Uri("http://last.fm/user/tehrikkit"),
                Content = data
            };
        }
    }
}