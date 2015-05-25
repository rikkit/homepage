using System.Collections.Generic;
using System.Net.Http;

namespace homepage.Api
{
    public class TileBuilderFactory
    {
        private readonly ApiConfigManager _config;

        public TileBuilderFactory(ApiConfigManager config)
        {
            _config = config;
        }

        public List<TileBuilder> GetBuilders()
        {
            var httpClient = new HttpClient();

            return new List<TileBuilder>
            {
                new TopAlbumsTileBuilder(_config, httpClient),
                new GithubTileBuilder(_config)
            };
        }
    }
}