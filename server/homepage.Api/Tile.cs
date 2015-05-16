using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace homepage.Api
{
    public class Tile
    {
        [JsonProperty("tile-template")]
        public string Template { get; set; }

        [JsonProperty("content-template")]
        public string ContentTemplate { get; set; }

        [JsonProperty("animation")]
        public string Animation { get; set; }

        [JsonProperty("title")]
        public string Title { get; set; }

        [JsonProperty("style")]
        public string CssClass { get; set; }

        [JsonProperty("href")]
        public Uri Link { get; set; }

        [JsonProperty("size")]
        public string Size { get; set; }

        [JsonProperty("data")]
        public IEnumerable<TileContent> Content { get; set; }

        public Tile()
        {
            Template = "tt-01";
            ContentTemplate = "ct-fill";
            Animation = "ease-01";
            Size = "large";
        }
    }
}