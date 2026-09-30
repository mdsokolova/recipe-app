import { useEffect, useState } from "react";
import "./App.css";
import video from "./assets/food.mp4";
import img from "./assets/fry.png";
import MyRecipesComponents from "./myRecipesComponents";

const loadFavorites = () => {
  try {
    return JSON.parse(localStorage.getItem("favorites")) || [];
  } catch {
    return [];
  }
};

function App() {
  const MY_KEY = import.meta.env.VITE_SPOONACULAR_KEY;
  const [mySearch, setMySearch] = useState("");
  const [myRecipe, setMyRecipe] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState(loadFavorites);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    } catch {
      // Storage unavailable - favorites last until the page is closed
    }
  }, [favorites]);

  const getRecipe = async (word) => {
    const cacheKey = `recipes:${word.toLowerCase()}`;

    // Reuse results we already fetched, so repeat searches cost 0 API points
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        setMyRecipe(JSON.parse(cached));
        setMessage("");
        return;
      }
    } catch {
      // Storage unavailable (e.g. private window) - just fetch instead
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(word)}&number=5&minCalories=0&minProtein=0&minCarbs=0&minFat=0&fillIngredients=true&addRecipeInformation=true&apiKey=${MY_KEY}`
      );

      if (!response.ok) {
        console.error("Request failed:", response.status);
        setMessage(
          response.status === 402
            ? "Daily recipe limit reached. Please try again tomorrow."
            : `Something went wrong (error ${response.status}). Please try again.`
        );
        return;
      }

      const data = await response.json();
      console.log(data);
      setMyRecipe(data.results);
      setMessage(data.results.length === 0 ? `No recipes found for "${word}".` : "");

      try {
        localStorage.setItem(cacheKey, JSON.stringify(data.results));
      } catch {
        // Storage full or unavailable - results still show, just not cached
      }
    } catch (error) {
      console.error(error);
      setMessage("Couldn't reach the recipe server. Check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  const myRecipeSearch = (e) => {
    setMySearch(e.target.value);
  };

  // Returns undefined instead of crashing when a recipe has no data for this nutrient
  const getNutrient = (recipe, name) =>
    recipe.nutrition?.nutrients?.find((nutrient) => nutrient.name === name)
      ?.amount;

  const isFavorite = (recipe) =>
    favorites.some((favorite) => favorite.id === recipe.id);

  const toggleFavorite = (recipe) => {
    setFavorites((current) =>
      isFavorite(recipe)
        ? current.filter((favorite) => favorite.id !== recipe.id)
        : [...current, recipe]
    );
  };

  const finalSearch = (e) => {
    e.preventDefault();
    const word = mySearch.trim();
    if (word) {
      setShowFavorites(false);
      getRecipe(word);
    }
  };

  const recipesToShow = showFavorites ? favorites : myRecipe;

  return (
    <div className="App">
      <video autoPlay muted loop>
        <source src={video} type="video/mp4" />
      </video>

      <div className="container">
        <h1>Find a Recipe</h1>
      </div>

      <div className="container">
        <form className="search-form" onSubmit={finalSearch}>
          <input
            className="search"
            placeholder="Search for recipes..."
            onChange={myRecipeSearch}
            value={mySearch}
          />
          <button className="search-btn" disabled={loading}>
            <img src={img} alt="search" />
          </button>
        </form>

        <button
          className="favorites-toggle"
          onClick={() => setShowFavorites(!showFavorites)}
        >
          {showFavorites ? "← Back to search" : `❤️ My favorites (${favorites.length})`}
        </button>
      </div>

      {loading && (
        <div className="container">
          <p className="message loading">
            <img className="spinner" src={img} alt="" /> Searching for recipes…
          </p>
        </div>
      )}

      {!showFavorites && message && (
        <div className="container">
          <p className="message">{message}</p>
        </div>
      )}

      {showFavorites && favorites.length === 0 && (
        <div className="container">
          <p className="message">
            No favorites yet. Tap ♡ Save on a recipe to keep it here.
          </p>
        </div>
      )}

      {!loading &&
        recipesToShow.map((element) => (
          <MyRecipesComponents
            key={element.id}
            title={element.title}
            image={element.image}
            calories={getNutrient(element, "Calories")}
            protein={getNutrient(element, "Protein")}
            carbs={getNutrient(element, "Carbohydrates")}
            fat={getNutrient(element, "Fat")}
            ingredients={element.missedIngredients}
            readyInMinutes={element.readyInMinutes}
            servings={element.servings}
            sourceUrl={element.sourceUrl}
            isFavorite={isFavorite(element)}
            onToggleFavorite={() => toggleFavorite(element)}
          />
        ))}
    </div>
  );
}

export default App;
