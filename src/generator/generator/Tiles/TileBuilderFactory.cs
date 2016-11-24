using System;
using System.Collections.Generic;
using System.Net.Http;

namespace homepage.Generator.Tiles
{
    public class TileBuilderFactory
    {
        private readonly ApiConfig _config;

        public TileBuilderFactory(ApiConfig config)
        {
            _config = config;
        }

        public ICollection<TileBuilder> GetBuilders()
        {
            var httpClient = new HttpClient();

            return new List<TileBuilder>
            {
                new LastfmTileBuilder(_config.Lastfm, httpClient),
                new GithubTileBuilder(_config.GitHub),
                new StaticTileBuilder("tt-02", "Blog", "blog", "wide", new Uri("http://rikk.it/blog")),
                new TwitterTileBuilder(_config.Twitter, httpClient)
            };
        }
    }
}