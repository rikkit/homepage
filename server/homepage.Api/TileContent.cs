using System;
using Newtonsoft.Json;

namespace homepage.Api
{
    public class TileContent
    {
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("image")]
        public Uri Image { get; set; }

        [JsonProperty("overlay")]
        public bool Overlay { get; set; }
    }
}