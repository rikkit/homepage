using System.Threading.Tasks;

namespace homepage.Api
{
    public abstract class TileBuilder
    {
        private dynamic _config;

        protected TileBuilder(object config)
        {
            _config = config;
        }

        public abstract Task<Tile> Build();
    }
}