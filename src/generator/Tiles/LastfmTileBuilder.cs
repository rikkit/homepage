using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using IF.Lastfm.Core.Api;
using Newtonsoft.Json;
using SpotifyAPI.Web;
using static SpotifyAPI.Web.SearchRequest;

namespace generator.Tiles
{
    public class LastfmTileBuilder : TileBuilder
    {
        private readonly LastfmClient _lastfmClient;
        private readonly LastfmApiConfig _lastfmConfig;
        private readonly SpotifyApiConfig _spotifyConfig;
        private readonly SpotifyClient _spotifyClient;

        public LastfmTileBuilder(LastfmApiConfig lastfmConfig, SpotifyApiConfig spotifyConfig, HttpClient httpClient)
        {
            _lastfmConfig = lastfmConfig;
            _spotifyConfig = spotifyConfig;
            _lastfmClient = new LastfmClient(lastfmConfig.Key, lastfmConfig.Secret, httpClient);
            _spotifyClient = new SpotifyClient(_spotifyConfig.Key);
        }

        protected override async Task<Tile> BuildAsync()
        {
            var artists = await _lastfmClient.User.GetTopArtists(_lastfmConfig.Username, _lastfmConfig.Period, 1, _lastfmConfig.Count);

            var data = new List<TileContent>();
            foreach (var artist in artists)
            {
                var searchResult = await _spotifyClient.Search.Item(new SearchRequest(Types.Artist, artist.Name));
                var spotifyArtist = searchResult.Artists.Items.FirstOrDefault();
                var url = spotifyArtist.Images.OrderByDescending(x => x.Width).FirstOrDefault()?.Url;

                data.Add(new TileContent
                {
                    Name = artist.Name,
                    Overlay = true,
                    Image = url != null ? new Uri(url) : null,
                });
            }

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