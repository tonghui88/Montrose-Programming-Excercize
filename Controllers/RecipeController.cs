using Microsoft.AspNetCore.Mvc;
using MyRecipes.Recipes;

namespace MyRecipes.Controllers
{

    public class RecipeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public RecipeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }


        [HttpGet("{id}")] // TODO: verify the url from the page
        public ActionResult<RecipeDetails> GetRecipe(int id)
        {
            var recipe = AllRecipes.GetRecipe(id);
            // TODO: any appropriate error handling

            return Ok(recipe);
        }
    }
}