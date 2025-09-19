using MyRecipes.Recipes;
using MyRecipes.Services;

namespace MyRecipes.Models
{
    public class HomePageModel
    {
        public List<RecipeSummary> Recipes { get; set; }

        public HomePageModel()
        {
            Recipes = AllRecipes.GetRecipeSummaries();
        }

        public HomePageModel(IRecipeService recipeService)
        {
            Recipes = recipeService.GetRecipeSummaries();
        }
    }
}
