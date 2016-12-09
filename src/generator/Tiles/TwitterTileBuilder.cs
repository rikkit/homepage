using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace generator.Tiles
{
    public class TwitterTileBuilder : TileBuilder
    {
        private const string TWITTER_API_ROOT = "https://api.twitter.com";

        private readonly TwitterApiConfig _config;
        private HttpClient _httpClient;

        public TwitterTileBuilder(TwitterApiConfig config, HttpClient httpClient)
        {
            _config = config;
            _httpClient = httpClient;
        }

        protected override async Task<Tile> BuildAsync()
        {
            var token = await GetAccessTokenAsync();

            var tweetParams = new Dictionary<string, string>
            {
                {"screen_name", _config.Username},
                {"exclude_replies", true.ToString() },
                {"trim_user", true.ToString() }
            };
            var tweetsUrl = $"{TWITTER_API_ROOT}/1.1/statuses/user_timeline.json?" + string.Join("&", tweetParams.Select(x => $"{x.Key}={x.Value}"));
            var message = new HttpRequestMessage(HttpMethod.Get, tweetsUrl)
            {
                Headers =
                {
                    {"Authorization", $"Bearer {token}"}
                }
            };
            var response = await _httpClient.SendAsync(message);
            var json = await response.Content.ReadAsStringAsync();
            var tweetList = JArray.Parse(json);
            var tweets = tweetList.Select(jo =>
            {
                var tileData = new TileContent
                {
                    Body = jo.Value<string>("text")
                };

                var attachedMedia = jo.SelectToken("entities.media") as JArray;
                var firstMedia = attachedMedia?.FirstOrDefault();
                var mediaUrl = firstMedia?.Value<string>("media_url");
                if (!string.IsNullOrEmpty(mediaUrl))
                {
                    tileData.Image = new Uri(mediaUrl);
                    tileData.Overlay = true;
                }

                return tileData;
            });

            await InvalidateAccessTokenAsync(token);

            return new Tile
            {
                Title = "@rikkilt",
                Style = "twitter tweets",
                Size = "large",
                Link = new Uri("https://twitter.com/rikkilt"),
                Content = tweets
            };
        }

        /// <summary>
        /// https://dev.twitter.com/oauth/application-only
        /// </summary>
        private async Task<string> GetAccessTokenAsync()
        {
            var appKey = Uri.EscapeUriString(_config.Key);
            var appSecret = Uri.EscapeUriString(_config.Secret);
            var bearerCred = $"{appKey}:{appSecret}";
            var bearerCred64 = Convert.ToBase64String(Encoding.UTF8.GetBytes(bearerCred));

            var postMessage = new HttpRequestMessage(HttpMethod.Post, $"{TWITTER_API_ROOT}/oauth2/token")
            {
                Headers =
                {
                    {"Authorization", $"Basic {bearerCred64}"},
                },
                Content = new StringContent("grant_type=client_credentials", Encoding.UTF8, "application/x-www-form-urlencoded")
            };

            var response = await _httpClient.SendAsync(postMessage);
            var json = await response.Content.ReadAsStringAsync();
            var jo = JObject.Parse(json);

            var tokenType = jo.Value<string>("token_type");
            if (tokenType != "bearer")
            {
                throw new Exception("Expected acceess token to be type `bearer`");
            }

            var accessToken = jo.Value<string>("access_token");

            return accessToken;
        }

        private async Task InvalidateAccessTokenAsync(string token)
        {
            var postMessage = new HttpRequestMessage(HttpMethod.Post, $"{TWITTER_API_ROOT}/oauth2/invalidate_token")
            {
                Headers =
                {
                    {"Authorization", $"Basic {token}"}
                },
                Content = new StringContent($"access_token={token}", Encoding.UTF8, "application/x-www-form-urlencoded")
            };

            var response = await _httpClient.SendAsync(postMessage);
            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine($"Didn't invalidate access token {token}\n{response.ReasonPhrase}");
            }
        }
    }
}