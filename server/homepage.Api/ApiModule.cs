using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Nancy;

namespace homepage.Api
{
    public class ApiModule : NancyModule
    {
        private readonly List<TileBuilder> _tileBuilders;

        public ApiModule(TileBuilderFactory tileFactory)
        {
            _tileBuilders = tileFactory.GetBuilders();

            Get["/all", true] = async (x, ct) => await GetAll();
        }

        private async Task<object> GetAll()
        {
            var tasks = _tileBuilders.Select(builder => builder.GetTileAsync());
            var tiles = await Task.WhenAll(tasks);

            var response = new
            {
                date = DateTimeOffset.UtcNow,
                tiles
            };

            return Response.AsJson(response);
        }
    }
}