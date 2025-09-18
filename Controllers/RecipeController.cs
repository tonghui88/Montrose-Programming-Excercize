using Microsoft.AspNetCore.Mvc;
using MyRecipes.Recipes;

namespace MyRecipes.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecipeController : ControllerBase
    {
        private readonly ILogger<RecipeController> _logger;

        public RecipeController(ILogger<RecipeController> logger)
        {
            _logger = logger;
        }

        [HttpGet("{id}")] // TODO: verify the url from the page
        public ActionResult<RecipeDetails> GetRecipe(int id)
        {
            var recipe = AllRecipes.GetRecipe(id);
            // TODO: any appropriate error handling
            if (recipe == null)
            {
                return NotFound();
            }

            return Ok(recipe);
        }
    }
}