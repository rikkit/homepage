using IF.Lastfm.Core.Api.Enums;
using Newtonsoft.Json;

namespace generator
{
    public class GitHubApiConfig
    {
        [JsonProperty("username")]
        public string Username { get; set; }

        [JsonProperty("token")]
        public string Token { get; set; }
    }

    public class TwitterApiConfig
    {
        [JsonProperty("key")]
        public string Key { get; set; }

        [JsonProperty("secret")]
        public string Secret { get; set; }

        [JsonProperty("tweetCount")]
        public int Count { get; set; }

        [JsonProperty("username")]
        public string Username { get; set; }
    }

    public class LastfmApiConfig
    {
        [JsonProperty("key")]
        public string Key { get; set; }

        [JsonProperty("secret")]
        public string Secret { get; set; }

        [JsonProperty("username")]
        public string Username { get; set; }

        [JsonProperty("albumChartPeriod")]
        public LastStatsTimeSpan AlbumChartPeriod { get; set; } = LastStatsTimeSpan.Month;

        [JsonProperty("albumChartCount")]
        public int AlbumChartCount { get; set; }
    }

    public class ApiConfig
    {
        [JsonProperty("github")]
        public GitHubApiConfig GitHub { get; set; }
        
        [JsonProperty("lastfm")]
        public LastfmApiConfig Lastfm { get; set; }

        [JsonProperty("twitter")]
        public TwitterApiConfig Twitter { get; set; }
    }
}