const fs = require('fs');

async function fetchAllRecipes() {
  console.log('Fetching categories...');
  const catsRes = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
  const cats = (await catsRes.json()).meals;
  
  const allIds = new Set();
  for (const cat of cats) {
    try {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat.strCategory}`);
      const data = await res.json();
      if (data && data.meals) data.meals.forEach(m => allIds.add(m.idMeal));
    } catch (e) { console.error(`Error fetching category ${cat.strCategory}:`, e); }
  }
  
  const idsArray = Array.from(allIds);
  console.log(`Found ${idsArray.size || idsArray.length} IDs. Fetching details...`);
  
  const fullRecipes = [];
  for (let i = 0; i < idsArray.length; i++) {
    try {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idsArray[i]}`);
      const data = await res.json();
      if (data && data.meals && data.meals[0]) {
        const m = data.meals[0];
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
          ingredients,
          mealIngredients: mealIngs,
          steps: m.strInstructions.split(/\r?\n/).filter(s => s.length > 5),
          thumb: m.strMealThumb,
          isLocal: true
        });
      }
      if (i % 20 === 0) console.log(`Progress: ${i}/${idsArray.length}`);
      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 50));
    } catch (e) { console.error(`Error fetching ID ${idsArray[i]}:`, e); }
  }
  
  fs.writeFileSync('src/data/recipes.json', JSON.stringify(fullRecipes, null, 2));
  console.log(`Done! Saved ${fullRecipes.length} verified recipes.`);
}

fetchAllRecipes();
