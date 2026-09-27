function MyRecipesComponents({ title, image, calories, ingredients }) {
  return (
    <div className="container recipe">
      <h2>{title}</h2>
      <img src={image} alt={title} />
      <ul className="ingredients">
        {ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient.original}</li>
        ))}
      </ul>
      <p>{Math.round(calories)} calories</p>
    </div>
  );
}

export default MyRecipesComponents;
