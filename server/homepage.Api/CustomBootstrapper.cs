using System;
using System.IO;
using Autofac;
using Nancy;
using Nancy.Bootstrapper;
using Nancy.Bootstrappers.Autofac;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace homepage.Api
{
    public class CustomBootstrapper : AutofacNancyBootstrapper
    {
        protected override void ConfigureApplicationContainer(ILifetimeScope existingContainer)
        {
            base.ConfigureApplicationContainer(existingContainer);

            var builder = new ContainerBuilder();
            builder.RegisterType<CustomJsonSerializer>().As<JsonSerializer>();
            builder.RegisterType<TileBuilderFactory>().AsSelf();

            const string configFile = "config.json";
            var configPath = Path.GetFullPath(configFile);
            if (!File.Exists(configPath))
            {
                throw new ArgumentException("Config is missing");
            }

            var configText = File.ReadAllText(configPath);
            var json = JObject.Parse(configText);
            var config = new ApiConfigManager(json);

            builder.RegisterInstance(config);
            builder.Update(existingContainer.ComponentRegistry);
        }

        protected override void ApplicationStartup(ILifetimeScope container, IPipelines pipelines)
        {
            base.ApplicationStartup(container, pipelines);
        }

        protected override void RequestStartup(ILifetimeScope container, IPipelines pipelines, NancyContext context)
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