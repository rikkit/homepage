using System.Collections.Generic;
using System.Net.Http;

namespace homepage.Api
{
    public class TileBuilderFactory
    {
        private readonly object _config;

        public TileBuilderFactory(object config)
        {
            _config = config;
        }

        public List<TileBuilder> GetBuilders()
        {
            var httpClient = new HttpClient();

            return new List<TileBuilder>
            { 
                new TopAlbumsTileBuilder(_config, httpClient), 
            };
        }
    }
}