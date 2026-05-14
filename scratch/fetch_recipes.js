import fs from 'fs';
// Using global fetch

async function fetchAllRecipes() {
  const letters = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');
  let allMeals = [];
  const seenIds = new Set();

  for (const letter of letters) {
    console.log(`Fetching letter: ${letter}`);
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
      const data = await response.json();
      if (data.meals) {
        for (const meal of data.meals) {
          if (!seenIds.has(meal.idMeal)) {
            allMeals.push(meal);
            seenIds.add(meal.idMeal);
          }
        }
      }
    } catch (e) {
      console.error(`Error fetching letter ${letter}:`, e);
    }
  }

  console.log(`Total real recipes found: ${allMeals.length}`);
  
  // Format them to match the project's structure
  const formattedRecipes = allMeals.map(meal => {
    const ingredients = [];
    const mealIngredients = [];
    for (let i = 1; i <= 20; i++) {
      const ing = meal[`strIngredient${i}`];
      const meas = meal[`strMeasure${i}`];
      if (ing && ing.trim()) {
        ingredients.push(`${meas ? meas.trim() + ' ' : ''}${ing.trim()}`);
        mealIngredients.push(ing.trim().toLowerCase());
      }
    }

    return {
      title: meal.strMeal,
      ingredients: ingredients,
      mealIngredients: mealIngredients,
      steps: meal.strInstructions ? meal.strInstructions.split('\r\n').filter(s => s.trim()) : [],
      thumb: meal.strMealThumb,
      isLocal: true, // Mark as local since we are saving it
      // We will need to translate these later or provide placeholders
      title_ru: meal.strMeal, // Placeholder
      ingredients_ru: ingredients, // Placeholder
      steps_ru: meal.strInstructions ? meal.strInstructions.split('\r\n').filter(s => s.trim()) : [] // Placeholder
    };
  });

  fs.writeFileSync('c:\\Users\\Elshan\\Desktop\\ai_1\\src\\data\\recipes_real.json', JSON.stringify(formattedRecipes, null, 2));
  console.log('Saved to recipes_real.json');
}

fetchAllRecipes();
