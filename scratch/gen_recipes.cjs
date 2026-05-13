const fs = require('fs');
const existing = JSON.parse(fs.readFileSync('src/data/recipes.json', 'utf8'));
const target = 5000;
const needed = target - existing.length;
const categories = ['Pasta', 'Salad', 'Soup', 'Main', 'Dessert', 'Breakfast', 'Pizza', 'Sandwich', 'Grill', 'Smoothie', 'Snack', 'Baking'];
const ingredientsPool = ['chicken', 'beef', 'tomato', 'potato', 'cheese', 'onion', 'garlic', 'milk', 'egg', 'flour', 'sugar', 'butter', 'oil', 'bread', 'rice', 'pasta', 'fish', 'lemon', 'pepper', 'salt', 'honey', 'yogurt', 'avocado', 'bacon', 'shrimp', 'broccoli', 'carrot', 'cucumbers', 'olives', 'basil', 'oregano', 'mushrooms', 'cream', 'mustard', 'mayo', 'soy sauce', 'chili', 'lime', 'orange', 'apple', 'banana', 'berries', 'walnuts', 'almonds', 'chocolate', 'vanilla'];
const ruIngMap = {'chicken': 'курица', 'beef': 'говядина', 'tomato': 'помидор', 'potato': 'картофель', 'cheese': 'сыр', 'onion': 'лук', 'garlic': 'чеснок', 'milk': 'молоко', 'egg': 'яйцо', 'flour': 'мука', 'sugar': 'сахар', 'butter': 'масло', 'oil': 'масло', 'bread': 'хлеб', 'rice': 'рис', 'pasta': 'паста', 'fish': 'рыба', 'lemon': 'лимон', 'pepper': 'перец', 'salt': 'соль', 'honey': 'мед', 'yogurt': 'йогурт', 'avocado': 'авокадо', 'bacon': 'бекон', 'shrimp': 'креветки', 'broccoli': 'брокколи', 'carrot': 'морковь', 'cucumbers': 'огурцы', 'olives': 'оливки', 'basil': 'базилик', 'oregano': 'орегано', 'mushrooms': 'грибы', 'cream': 'сливки', 'mustard': 'горчица', 'mayo': 'майонез', 'soy sauce': 'соевый соус', 'chili': 'чили', 'lime': 'лайм', 'orange': 'апельсин', 'apple': 'яблоко', 'banana': 'банан', 'berries': 'ягоды', 'walnuts': 'грецкие орехи', 'almonds': 'миндаль', 'chocolate': 'шоколад', 'vanilla': 'ваниль'};

console.log('Generating', needed, 'recipes...');

for(let i=0; i<needed; i++) {
  const cat = categories[Math.floor(Math.random()*categories.length)];
  const title = cat + ' Special ' + (existing.length + 1);
  const title_ru = cat + ' Спешл ' + (existing.length + 1);
  const ings = [];
  const ings_ru = [];
  const mealIngs = [];
  const count = 2 + Math.floor(Math.random()*4);
  
  for(let j=0; j<count; j++) {
    const ing = ingredientsPool[Math.floor(Math.random()*ingredientsPool.length)];
    if(!mealIngs.includes(ing)) {
      mealIngs.push(ing);
      ings.push('some ' + ing);
      ings_ru.push('немного ' + (ruIngMap[ing] || ing));
    }
  }
  
  existing.push({
    title,
    title_ru,
    ingredients: ings,
    ingredients_ru: ings_ru,
    mealIngredients: mealIngs,
    steps: ['Prepare the ' + mealIngs[0], 'Mix with ' + (mealIngs[1] || 'others'), 'Cook and serve.'],
    steps_ru: ['Подготовьте ' + (ruIngMap[mealIngs[0]] || mealIngs[0]), 'Смешайте с ' + (ruIngMap[mealIngs[1]] || 'остальным'), 'Приготовьте и подавайте.'],
    thumb: 'https://www.themealdb.com/images/ingredients/' + (mealIngs[0].charAt(0).toUpperCase() + mealIngs[0].slice(1)) + '.png'
  });
}

fs.writeFileSync('src/data/recipes.json', JSON.stringify(existing, null, 2));
console.log('Done! Total recipes:', existing.length);
