import { useEffect, useState } from "react";
import "./App.css";
import video from "./assets/food.mp4";
import img from "./assets/fry.png";
import MyRecipesComponents from "./myRecipesComponents";

function App() {
  const MY_KEY = import.meta.env.VITE_SPOONACULAR_KEY;
  const [mySearch, setMySearch] = useState("");
  const [myRecipe, setMyRecipe] = useState([]);
  const [wordSubmitted, setWordSubmitted] = useState("lemon");

  useEffect(() => {
    const getRecipe = async () => {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?query=${wordSubmitted}&minCalories=0&fillIngredients=true&apiKey=${MY_KEY}`
      );

      if (!response.ok) {
        console.error("Request failed:", response.status);
        return;
      }

      const data = await response.json();
      console.log(data);
      setMyRecipe(data.results);
    };

    getRecipe();
  }, [wordSubmitted]);

  const myRecipeSearch = (e) => {
    setMySearch(e.target.value);
  };

  const finalSearch = (e) => {
    e.preventDefault();
    setWordSubmitted(mySearch);
  };

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
          <button className="search-btn">
            <img src={img} alt="search" />
          </button>
        </form>
      </div>

      {myRecipe.map((element) => (
        <MyRecipesComponents
          key={element.id}
          title={element.title}
          image={element.image}
          calories={element.nutrition.nutrients[0].amount}
          ingredients={element.missedIngredients}
        />
      ))}
    </div>
  );
}

export default App;
