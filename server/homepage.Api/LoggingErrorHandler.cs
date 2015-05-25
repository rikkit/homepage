using System;
using Nancy;
using Nancy.ErrorHandling;
using NLog;

namespace homepage.Api
{
    public class LoggingErrorHandler : IStatusCodeHandler
    {
        private readonly Logger _logger = LogManager.GetLogger("Api");

        public bool HandlesStatusCode(HttpStatusCode statusCode)
        {
            return statusCode == HttpStatusCode.InternalServerError;
        }

        public bool HandlesStatusCode(HttpStatusCode statusCode, NancyContext context)
        {
            return statusCode == HttpStatusCode.InternalServerError;
        }

        public void Handle(HttpStatusCode statusCode, NancyContext context)
        {
            object errorObject;
            context.Items.TryGetValue(NancyEngine.ERROR_EXCEPTION, out errorObject);
            var error = errorObject as Exception;
            if (error != null)
            {
                _logger.Error(error.Message, error);
            }
            else
            {
                _logger.Error("Unhandled error", errorObject);
            }
        }
    }
}