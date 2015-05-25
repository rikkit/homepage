using System.Threading.Tasks;

namespace homepage.Api
{
    public abstract class TileBuilder
    {
        protected ApiConfigManager _config;

        protected TileBuilder(ApiConfigManager config)
        {
            _config = config;
        }

        public abstract Task<Tile> Build();
    }
}