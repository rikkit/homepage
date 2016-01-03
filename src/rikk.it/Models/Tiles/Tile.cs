using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using Mustache;
using Newtonsoft.Json;

namespace homepage.Api
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

        public string RenderHtml()
        {
            var formatter = new FormatCompiler();
            var rootHtml = GetTemplateFormat(TemplateName);
            if (string.IsNullOrEmpty(rootHtml))
            {
                return null;
            }

            var rootTemplate = formatter.Compile(rootHtml);

            var html = rootTemplate.Render(this);

            return html;
        }

        private static string GetTemplateFormat(string templateName)
        {
            var file = Path.Combine(".", $"templates/{templateName}.html");
            var html = File.ReadAllText(file);

            return html;
        }
    }
}