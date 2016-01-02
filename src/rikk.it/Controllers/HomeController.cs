using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using homepage.Api;
using Microsoft.AspNet.Mvc;
using Newtonsoft.Json.Linq;

namespace rikk.it.Controllers
{
    [ViewComponent(Name = "Tiles")]
    public class TilesViewComponent : ViewComponent
    {
        private readonly TileBuilderFactory _tileBuilderFactory;

        /// <summary>
        /// TODO dependency management
        /// </summary>
        public TilesViewComponent()
        {
            const string configFile = "../config.json";
            var configPath = Path.GetFullPath(configFile);
            if (!File.Exists(configPath))
            {
                throw new ArgumentException("Config is missing");
            }

            var configJo = JObject.Parse(File.ReadAllText(configPath));
            
            var configManager = new ApiConfigManager(configJo);
            _tileBuilderFactory = new TileBuilderFactory(configManager);
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            var builders = _tileBuilderFactory.GetBuilders();
            var tasks = builders.Select(b => b.GetTileAsync());
            var tiles = await Task.WhenAll(tasks);

            return View(tiles);
        }
    }

    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}
