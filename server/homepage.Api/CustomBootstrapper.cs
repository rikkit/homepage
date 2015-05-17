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

        protected override void RequestStartup(TinyIoCContainer container, IPipelines pipelines, NancyContext context)
        {
            base.RequestStartup(container, pipelines, context);

            pipelines.AfterRequest.AddItemToEndOfPipeline((ctx) =>
            {
                ctx.Response.WithHeader("Access-Control-Allow-Origin", "*")
                    .WithHeader("Access-Control-Allow-Methods", "POST,GET")
                    .WithHeader("Access-Control-Allow-Headers", "Accept, Origin, Content-type");
            });
        }
    }
}