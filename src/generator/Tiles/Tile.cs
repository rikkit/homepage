using System;
using System.Collections.Generic;
using System.Globalization;
using Newtonsoft.Json;

namespace generator.Tiles
{
    public class Tile
    {
        private string _size;

        [JsonProperty("builtUtc")]
        public DateTimeOffset BuiltUtc { get; set; }

        [JsonProperty("tile-template")]
        public string TemplateName { get; set; }

        [JsonProperty("title")]
        public string Title { get; set; }

        [JsonProperty("style")]
        public string Style { get; set; }

        [JsonProperty("href")]
        public Uri Link { get; set; }

        [JsonProperty("size")]
        public string Size
        {
            get { return _size ?? "medium"; }
            set { _size = value; }
        }

        [JsonProperty("data")]
        public IEnumerable<TileContent> Content { get; set; }

        public Tile()
        {
            TemplateName = "tt-01";
            Size = "large";
        }
    }
}