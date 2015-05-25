using System;
using System.IO;
using Nancy;
using Nancy.Bootstrapper;
using Nancy.Bootstrappers.Ninject;
using Nancy.TinyIoc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Ninject;

namespace homepage.Api
{
    public class CustomBootstrapper : NinjectNancyBootstrapper
    {
        protected override void ApplicationStartup(IKernel container, IPipelines pipelines)
        {
            const string configFile = "config.json";
            var configPath = Path.GetFullPath(configFile);
            if (!File.Exists(configPath))
            {
                throw new ArgumentException("Config is missing");
            }

            var configText = File.ReadAllText(configPath);
            var json = JObject.Parse(configText);
            var config = new ApiConfigManager(json);

            container.Bind<ApiConfigManager>().ToConstant(config);
            container.Bind<TileBuilderFactory>().ToSelf();

            var apiModule = container.Get<ApiModule>();
            container.Bind<ApiModule>().ToConstant(apiModule);
        }

        protected override void RequestStartup(IKernel container, IPipelines pipelines, NancyContext context)
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