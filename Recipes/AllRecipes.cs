namespace MyRecipes.Recipes
{
    public static class AllRecipes
    {
        private static List<RecipeDetails> _recipes = new List<RecipeDetails>();
        
        static AllRecipes()
        {
            _recipes.Add(new RecipeDetails { Id = 1, Name = "Pancakes", Recipe = "Mix flour, eggs, and milk. Cook on a griddle." });
            _recipes.Add(new RecipeDetails { Id = 2, Name = "Grilled Cheese", Recipe = "Butter two slices of bread. Add cheese. Cook in a pan." });
            _recipes.Add(new RecipeDetails { Id = 3, Name = "Spaghetti", Recipe = "Boil noodles. Add sauce." });
        }
       
        public static List<RecipeSummary> GetRecipeSummaries()
        {
            // TODO: Get sumaaries of all recipes
            return _recipes.Select(r => new RecipeSummary { Id = r.Id, Name = r.Name }).ToList();
        }

        public static object GetRecipe(int id)
        {
            // TODO: get the recipe by id
            throw new NotImplementedException();
        }
    }
}
