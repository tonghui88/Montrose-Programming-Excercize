using MyRecipes.Recipes;

namespace MyRecipes.Services
{
    public class RecipeService : IRecipeService
    {
        private static List<RecipeDetails> _recipes = new List<RecipeDetails>();
        private static int _nextId = 1;

        static RecipeService()
        {
            // Initialize with some sample recipes
            _recipes.Add(new RecipeDetails { Id = 1, Name = "Pancakes", Recipe = "Mix flour, eggs, and milk. Cook on a griddle." });
            _recipes.Add(new RecipeDetails { Id = 2, Name = "Grilled Cheese", Recipe = "Butter two slices of bread. Add cheese. Cook in a pan." });
            _recipes.Add(new RecipeDetails { Id = 3, Name = "Spaghetti", Recipe = "Boil noodles. Add sauce." });
            _nextId = 4; // Set next ID to 4 since we have recipes 1, 2, 3
        }

        public List<RecipeSummary> GetRecipeSummaries()
        {
            return _recipes.Select(r => new RecipeSummary { Id = r.Id, Name = r.Name }).ToList();
        }

        public RecipeDetails? GetRecipe(int id)
        {
            return _recipes.FirstOrDefault(r => r.Id == id);
        }

        public RecipeDetails CreateRecipe(string name, string recipe)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Recipe name cannot be empty", nameof(name));
            
            if (string.IsNullOrWhiteSpace(recipe))
                throw new ArgumentException("Recipe content cannot be empty", nameof(recipe));

            var newRecipe = new RecipeDetails
            {
                Id = _nextId++,
                Name = name.Trim(),
                Recipe = recipe.Trim()
            };

            _recipes.Add(newRecipe);
            return newRecipe;
        }

        public bool UpdateRecipe(int id, string name, string recipe)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Recipe name cannot be empty", nameof(name));
            
            if (string.IsNullOrWhiteSpace(recipe))
                throw new ArgumentException("Recipe content cannot be empty", nameof(recipe));

            var existingRecipe = _recipes.FirstOrDefault(r => r.Id == id);
            if (existingRecipe == null)
                return false;

            existingRecipe.Name = name.Trim();
            existingRecipe.Recipe = recipe.Trim();
            return true;
        }

        public bool DeleteRecipe(int id)
        {
            var recipe = _recipes.FirstOrDefault(r => r.Id == id);
            if (recipe == null)
                return false;

            _recipes.Remove(recipe);
            return true;
        }
    }
}
