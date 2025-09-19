using MyRecipes.Recipes;

namespace MyRecipes.Services
{
    public interface IRecipeService
    {
        List<RecipeSummary> GetRecipeSummaries();
        RecipeDetails? GetRecipe(int id);
        RecipeDetails CreateRecipe(string name, string recipe);
        bool UpdateRecipe(int id, string name, string recipe);
        bool DeleteRecipe(int id);
    }
}
