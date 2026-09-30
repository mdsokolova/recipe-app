// Shows "—" when the API didn't send a value, instead of "NaN" or crashing
const show = (value) => (value == null ? "—" : Math.round(value));

function MyRecipesComponents({
  title,
  image,
  calories,
  protein,
  carbs,
  fat,
  ingredients = [],
  readyInMinutes,
  servings,
  sourceUrl,
  isFavorite,
  onToggleFavorite,
}) {
  return (
    <div className="container recipe">
      <h2>{title}</h2>
      <button className="favorite-btn" onClick={onToggleFavorite}>
        {isFavorite ? "❤️ Saved" : "♡ Save"}
      </button>
      <img src={image} alt={title} />
      <p className="recipe-info">
        ⏱ {show(readyInMinutes)} min · 🍽 {show(servings)} servings
      </p>
      <ul className="ingredients">
        {ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient.original}</li>
        ))}
      </ul>
      <p>{show(calories)} calories</p>
      <p className="recipe-info">
        Protein {show(protein)}g · Carbs {show(carbs)}g · Fat {show(fat)}g
      </p>
      {sourceUrl && (
        <a
          className="recipe-link"
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          View full recipe
        </a>
      )}
    </div>
  );
}

export default MyRecipesComponents;
