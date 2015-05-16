using System;
using Nancy.Hosting.Self;
using NLog;

namespace homepage.Api
{
    public class PizzaHost : IDisposable
    {
        private static NancyHost _host;
        private static Uri _uri;

        private const string DEFAULT_API_ROOT = "http://localhost:4420";

        public Uri Uri => _uri;

        public void Start(string root = null)
        {
            var logger = LogManager.GetLogger("Api");

            _uri = new Uri(root ?? DEFAULT_API_ROOT);

            var hostConfig = new HostConfiguration
            {
                UrlReservations = new UrlReservations { CreateAutomatically = true }
            };

            try
            {
                _host = new NancyHost(hostConfig, _uri);
                _host.Start();
            }
            catch (Exception e)
            {
                logger.ErrorException($"Failed to start PizzaHost: {e.Message}", e);
                throw;
            }

            logger.Info("PizzaHost listening on {0}", _uri);
        }

        public void Dispose()
        {
            if (_host != null)
            {
                _uri = null;
                _host.Stop();
                _host.Dispose();
                _host = null;
            }
        }
    }
}