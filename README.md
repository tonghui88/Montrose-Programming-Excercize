# MyRecipes – ASP.NET Core MVC & API

MyRecipes is a simple recipe management application built with **ASP.NET Core MVC**.  
It provides both a basic website with views and a RESTful API for managing recipes.  
Recipes are stored in-memory (no external database required).

---

## 🚀 Features

- **View Recipes**
  - List all recipe summaries (ID + Name)
  - View recipe details (full instructions)

- **Manage Recipes via API**
  - `GET /api/recipe/{id}` → Get details of a recipe by ID
  - `POST /api/recipe` → Create a new recipe (JSON body with `name` and `recipe`)

- **Preloaded Sample Recipes**
  - Pancakes  
  - Grilled Cheese  
  - Spaghetti  

- **MVC Support**
  - Controllers, Models, Views included
  - Shared layout and error handling

---

## 📂 Project Structure

```
Programming Exercise Result/
│── Controllers/
│    ├── HomeController.cs
│    ├── RecipeController.cs
│
│── Models/
│    ├── ErrorViewModel.cs
│    ├── HomePageModel.cs
│
│── Recipes/
│    ├── AllRecipes.cs
│    ├── RecipeDetails.cs
│    ├── RecipeSummary.cs
│
│── Services/
│    ├── IRecipeService.cs
│    ├── RecipeService.cs
│
│── Views/
│    ├── Home/ (Homepage & Privacy)
│    ├── Shared/ (Layout, Error handling)
│
│── wwwroot/
│    ├── css/site.css
│    ├── js/recipes.js
│
│── Program.cs
│── appsettings.json
│── MyRecipes.csproj
│── MyRecipes.sln
```

---

## ⚙️ Requirements

- [.NET 6 SDK or later](https://dotnet.microsoft.com/download)
- A code editor like [Visual Studio](https://visualstudio.microsoft.com/) or [Visual Studio Code](https://code.visualstudio.com/)

---

## ▶️ Running the Project

1. **Clone the repository / unzip project**
   ```bash
   git clone <repo-url>
   cd "Programming Exercise Result"
   ```

2. **Restore dependencies**
   ```bash
   dotnet restore
   ```

3. **Run the project**
   ```bash
   dotnet run
   ```

4. **Access the app**
   - Website: [http://localhost:5000](http://localhost:5000)  
   - API: [http://localhost:5000/api/recipe](http://localhost:5000/api/recipe)  

---

## 📡 API Examples

### Get a recipe by ID
```http
GET /api/recipe/1
```
Response:
```json
{
  "id": 1,
  "name": "Pancakes",
  "recipe": "Mix flour, eggs, and milk. Cook on a griddle."
}
```

### Create a new recipe
```http
POST /api/recipe
Content-Type: application/json

{
  "name": "French Toast",
  "recipe": "Dip bread in egg mixture and fry until golden brown."
}
```

Response:
```json
{
  "id": 4,
  "name": "French Toast",
  "recipe": "Dip bread in egg mixture and fry until golden brown."
}
```

---

## 🛠 Future Improvements

- Add database support (e.g., SQL Server, SQLite, or EF Core)
- Add authentication & user accounts
- Add recipe categories and search functionality
- Improve frontend (React/Angular integration possible)

---

## 📜 License

This project is provided as an exercise/demo.  
You’re free to modify and extend it for your own use.
