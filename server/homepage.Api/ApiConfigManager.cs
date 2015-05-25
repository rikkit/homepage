using System;
using IF.Lastfm.Core.Api.Enums;
using Newtonsoft.Json.Linq;

namespace homepage.Api
{
    public class ApiConfigManager
    {
        private LastStatsTimeSpan _lastfmAlbumTimeSpan;

        public int LastfmAlbumCount { get; set; }

        public LastStatsTimeSpan LastfmAlbumTimeSpan
        {
            get { return _lastfmAlbumTimeSpan; }
            set { _lastfmAlbumTimeSpan = value; }
        }

        public string LastfmUsername { get; set; }

        public string LastfmApiKey { get; set; }

        public string LastfmSecret { get; set; }

        public ApiConfigManager(JObject configJson)
        {
            dynamic config = configJson;

            LastfmApiKey = config.lastfmApiKey;
            LastfmSecret = config.lastfmSecret;
            LastfmUsername = config.lastfmUsername;
            Enum.TryParse((string)config.lastfmAlbumTimespan, out _lastfmAlbumTimeSpan);
            LastfmAlbumCount = (int)config.lastfmAlbumCount;
        }
    }
}