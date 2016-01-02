using System;
using System.Threading.Tasks;

namespace homepage.Api
{
    public class StaticTileBuilder : TileBuilder
    {
        private readonly Tile _tile;

        public StaticTileBuilder(ApiConfigManager config, string template, string title, string style, string size, Uri uri) : base(config)
        {
            _tile = new Tile
            {
                Template = template,
                Title = title,
                CssClass = style,
                Size = size,
                Link = uri
            };
        }

        protected override Task<Tile> BuildAsync()
        {
            return Task.FromResult(_tile);
        }
    }
}