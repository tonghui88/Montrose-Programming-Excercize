using Microsoft.AspNetCore.Mvc;
using MyRecipes.Recipes;
using MyRecipes.Services;

namespace MyRecipes.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecipeController : ControllerBase
    {
        private readonly ILogger<RecipeController> _logger;
        private readonly IRecipeService _recipeService;

        public RecipeController(ILogger<RecipeController> logger, IRecipeService recipeService)
        {
            _logger = logger;
            _recipeService = recipeService;
        }

        [HttpGet("{id}")] // TODO: verify the url from the page
        public ActionResult<RecipeDetails> GetRecipe(int id)
        {
            var recipe = _recipeService.GetRecipe(id);
            // TODO: any appropriate error handling
            if (recipe == null)
            {
                return NotFound();
            }

            return Ok(recipe);
        }

        [HttpPost]
        public ActionResult<RecipeDetails> CreateRecipe([FromBody] CreateRecipeRequest request)
        {
            try
            {
                var recipe = _recipeService.CreateRecipe(request.Name, request.Recipe);
                return CreatedAtAction(nameof(GetRecipe), new { id = recipe.Id }, recipe);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public ActionResult UpdateRecipe(int id, [FromBody] UpdateRecipeRequest request)
        {
            try
            {
                var success = _recipeService.UpdateRecipe(id, request.Name, request.Recipe);
                if (!success)
                {
                    return NotFound();
                }
                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public ActionResult DeleteRecipe(int id)
        {
            var success = _recipeService.DeleteRecipe(id);
            if (!success)
            {
                return NotFound();
            }
            return NoContent();
        }
    }

    public class CreateRecipeRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Recipe { get; set; } = string.Empty;
    }

    public class UpdateRecipeRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Recipe { get; set; } = string.Empty;
    }
}