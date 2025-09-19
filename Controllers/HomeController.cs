using Microsoft.AspNetCore.Mvc;
using MyRecipes.Models;
using MyRecipes.Services;
using System.Diagnostics;

namespace MyRecipes.Controllers
{

    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IRecipeService _recipeService;

        public HomeController(ILogger<HomeController> logger, IRecipeService recipeService)
        {
            _logger = logger;
            _recipeService = recipeService;
        }

        public IActionResult Index()
        {
            // TODO: send the recipe summaries so they can be selected from
            var model = new HomePageModel(_recipeService);
            return View(model);
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}