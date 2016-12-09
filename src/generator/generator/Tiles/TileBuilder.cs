using System;
using System.Threading.Tasks;

namespace generator.Tiles
{
    public abstract class TileBuilder
    {
        private Tile _cachedTile;

        public async Task<Tile> GetTileAsync()
        {
            if (_cachedTile == null || _cachedTile.BuiltUtc < DateTimeOffset.UtcNow.AddDays(-1))
            {
                if (_cachedTile == null)
                {
                    await RefreshAsync();
                }
                else
                {
                    // TODO this isn't good
                    RefreshAsync();
                }
            }

            return _cachedTile;
        }

        private async Task<Tile> RefreshAsync()
        {
            var tile = await BuildAsync();
            tile.BuiltUtc = DateTimeOffset.UtcNow;

            _cachedTile = tile;

            return tile;
        }

        protected abstract Task<Tile> BuildAsync();
    }
}