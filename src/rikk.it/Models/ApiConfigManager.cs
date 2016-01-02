using System;
using IF.Lastfm.Core.Api.Enums;
using Newtonsoft.Json.Linq;

namespace homepage.Api
{
    public class ApiConfigManager
    {
        private LastStatsTimeSpan _lastfmAlbumTimeSpan;

        public string GithubToken { get; set; }

        public string GithubUsername { get; set; }

        public string LastfmApiKey { get; set; }

        public string LastfmSecret { get; set; }

        public int LastfmAlbumCount { get; set; }

        public LastStatsTimeSpan LastfmAlbumTimeSpan
        {
            get { return _lastfmAlbumTimeSpan; }
            set { _lastfmAlbumTimeSpan = value; }
        }

        public string LastfmUsername { get; set; }

        public ApiConfigManager(JObject configJson)
        {
            dynamic config = configJson;

            GithubUsername = config.github.username;
            GithubToken = config.github.token;

            LastfmApiKey = config.lastfm.key;
            LastfmSecret = config.lastfm.secret;
            LastfmUsername = config.lastfm.username;
            Enum.TryParse((string) config.lastfm.albumTimespan, out _lastfmAlbumTimeSpan);
            LastfmAlbumCount = (int) config.lastfm.albumCount;
        }
    }
}