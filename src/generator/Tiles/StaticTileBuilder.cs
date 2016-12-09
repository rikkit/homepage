using System;
using System.Threading.Tasks;

namespace generator.Tiles
{
    public class StaticTileBuilder : TileBuilder
    {
        private readonly Tile _tile;

        public StaticTileBuilder(string template, string title, string style, string size, Uri uri)
        {
            _tile = new Tile
            {
                TemplateName = template,
                Title = title,
                Style = style,
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