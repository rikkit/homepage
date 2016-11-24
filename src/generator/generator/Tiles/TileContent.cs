using System;
using Newtonsoft.Json;

namespace homepage.Generator.Tiles
{
    public class TileContent
    {
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("body")]
        public string Body { get; set; }

        [JsonProperty("image")]
        public Uri Image { get; set; }

        [JsonProperty("overlay")]
        public bool Overlay { get; set; }
    }
}