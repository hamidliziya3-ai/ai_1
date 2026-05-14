const fs = require('fs');

async function fetchAllRecipes() {
  console.log('Fetching all categories...');
  const catsRes = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
  const cats = (await catsRes.json()).meals;
  
  const allIds = new Set();
  
  for (const cat of cats) {
    console.log(`Fetching IDs for category: ${cat.strCategory}`);
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat.strCategory}`);
    const meals = (await res.json()).meals;
    if (meals) meals.forEach(m => allIds.add(m.idMeal));
  }
  
  console.log(`Found ${allIds.size} unique meal IDs. Fetching details...`);
  
  const fullRecipes = [];
  const idsArray = Array.from(allIds);
  
  // Fetch in batches to avoid overwhelming the API
  for (let i = 0; i < idsArray.length; i += 10) {
    const batch = idsArray.slice(i, i + 10);
    const promises = batch.map(id => fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`).then(r => r.json()));
    const results = await Promise.all(promises);
    
    results.forEach(res => {
      if (res.meals && res.meals[0]) {
        const m = res.meals[0];
        const ingredients = [];
        const mealIngs = [];
        for (let j = 1; j <= 20; j++) {
          const ing = m[`strIngredient${j}`];
          const meas = m[`strMeasure${j}`];
          if (ing && ing.trim()) {
            ingredients.push(`${meas} ${ing}`.trim());
            mealIngs.push(ing.toLowerCase());
          }
        }
        
        fullRecipes.push({
          title: m.strMeal,
          ingredients: ingredients,
          mealIngredients: mealIngs,
          steps: m.strInstructions.split(/\r?\n/).filter(s => s.length > 5),
          thumb: m.strMealThumb,
          isLocal: true, // Treat as local for better display
          source: 'TheMealDB'
        });
      }
    });
    console.log(`Progress: ${fullRecipes.length}/${allIds.size}`);
  }
  
  fs.writeFileSync('src/data/recipes.json', JSON.stringify(fullRecipes, null, 2));
  console.log(`Done! Saved ${fullRecipes.length} verified recipes.`);
}

fetchAllRecipes().catch(console.error);
