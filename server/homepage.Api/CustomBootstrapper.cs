using System;
using System.IO;
using Nancy;
using Nancy.Bootstrapper;
using Nancy.TinyIoc;
using Newtonsoft.Json;

namespace homepage.Api
{
    public class CustomBootstrapper : DefaultNancyBootstrapper
    {
        protected override void ApplicationStartup(TinyIoCContainer container, IPipelines pipelines)
        {
            const string configFile = "config.json";
            var configPath = Path.GetFullPath(configFile);
            if (!File.Exists(configPath))
            {
                throw new ArgumentException("Config is missing");
            }

            var configText = File.ReadAllText(configPath);
            var config = JsonConvert.DeserializeObject(configText);

            container.Register<TileBuilderFactory>(new TileBuilderFactory(config));
        }
    }
}