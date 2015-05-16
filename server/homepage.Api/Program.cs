using System.Runtime.InteropServices;
using System.Text;
using System.Threading;
using IF.Lastfm.Core;
using Nancy.Diagnostics;
using NLog;
using NLog.Config;
using NLog.Targets;

namespace homepage.Api
{
    internal class Program
    {
        private static void Main(string[] args)
        {
            var logConfig = new LoggingConfiguration();
            var consoleTarget = new ColoredConsoleTarget();
            logConfig.AddTarget("console", consoleTarget);
            var rule1 = new LoggingRule("*", LogLevel.Debug, consoleTarget);
            logConfig.LoggingRules.Add(rule1);
            LogManager.Configuration = logConfig;

            var pizza = new PizzaHost();
            pizza.Start();

            while (true)
            {
                Thread.Sleep(60000);
            }
        }
    }
}
