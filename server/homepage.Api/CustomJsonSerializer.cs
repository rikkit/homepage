using Newtonsoft.Json;

namespace homepage.Api
{
    public class CustomJsonSerializer : JsonSerializer
    {
        public CustomJsonSerializer()
        {
            NullValueHandling = NullValueHandling.Ignore;
        }
    }
}