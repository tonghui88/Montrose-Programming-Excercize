using MyRecipes.Recipes;

namespace MyRecipes.Models
{
    public class HomePageModel
    {
        public List<RecipeSummary> Recipes { get; set; }
        public HomePageModel()
        {
            Recipes = AllRecipes.GetRecipeSummaries();
        }
    }
}
