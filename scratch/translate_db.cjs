const fs = require('fs');

const ingredientMap = {
  'chicken': 'курица', 'beef': 'говядина', 'pork': 'свинина', 'fish': 'рыба', 'salmon': 'лосось',
  'shrimp': 'креветки', 'prawns': 'креветки', 'lamb': 'ягнятина', 'bacon': 'бекон', 'ham': 'ветчина',
  'egg': 'яйцо', 'cheese': 'сыр', 'mozzarella': 'моцарелла', 'parmesan': 'пармезан', 'cheddar': 'чеддер',
  'milk': 'молоко', 'butter': 'масло', 'oil': 'масло', 'olive oil': 'оливковое масло',
  'flour': 'мука', 'sugar': 'сахар', 'salt': 'соль', 'pepper': 'перец', 'black pepper': 'черный перец',
  'garlic': 'чеснок', 'onion': 'лук', 'tomato': 'помидор', 'potato': 'картофель', 'carrot': 'морковь',
  'cucumber': 'огурец', 'cabbage': 'капуста', 'broccoli': 'брокколи', 'spinach': 'шпинат',
  'mushrooms': 'грибы', 'rice': 'рис', 'pasta': 'паста', 'noodles': 'лапша', 'bread': 'хлеб',
  'apple': 'яблоко', 'banana': 'банан', 'orange': 'апельсин', 'lemon': 'лимон', 'lime': 'лайм',
  'honey': 'мед', 'yogurt': 'йогурт', 'cream': 'сливки', 'soy sauce': 'соевый соус',
  'mustard': 'горчица', 'mayo': 'майонез', 'vinegar': 'уксус', 'water': 'вода', 'wine': 'вино',
  'parsley': 'петрушка', 'basil': 'базилик', 'oregano': 'орегано', 'thyme': 'тимьян', 'cilantro': 'кинза',
  'ginger': 'имбирь', 'cinnamon': 'корица', 'vanilla': 'ваниль', 'chocolate': 'шоколад',
  'walnuts': 'грецкие орехи', 'almonds': 'миндаль', 'cashews': 'кешью', 'peanuts': 'арахис'
};

const phraseMap = {
  'heat the': 'нагрейте', 'add the': 'добавьте', 'mix the': 'смешайте', 'serve with': 'подавайте с',
  'cook for': 'готовьте в течение', 'minutes': 'минут', 'until': 'до тех пор пока',
  'fry': 'обжарьте', 'boil': 'отварите', 'bake': 'запекайте', 'oven': 'духовке',
  'pan': 'сковороде', 'bowl': 'миске', 'pot': 'кастрюле', 'stir': 'перемешивайте',
  'salt and pepper': 'соль и перец', 'chopped': 'нарезанный', 'sliced': 'нарезанный ломтиками',
  'diced': 'нарезанный кубиками', 'minced': 'измельченный', 'grated': 'тертый',
  'melted': 'растопленный', 'large': 'большой', 'small': 'маленький', 'medium': 'средний'
};

function translateLine(text) {
  let translated = text.toLowerCase();
  Object.keys(ingredientMap).forEach(en => {
    const reg = new RegExp('\\b' + en + '\\b', 'gi');
    translated = translated.replace(reg, ingredientMap[en]);
  });
  Object.keys(phraseMap).forEach(en => {
    const reg = new RegExp('\\b' + en + '\\b', 'gi');
    translated = translated.replace(reg, phraseMap[en]);
  });
  // Capitalize first letter
  return translated.charAt(0).toUpperCase() + translated.slice(1);
}

const recipes = JSON.parse(fs.readFileSync('src/data/recipes.json', 'utf8'));

console.log('Translating', recipes.length, 'recipes...');

recipes.forEach(r => {
  r.title_ru = translateLine(r.title);
  r.ingredients_ru = r.ingredients.map(ing => translateLine(ing));
  r.steps_ru = r.steps.map(step => translateLine(step));
});

fs.writeFileSync('src/data/recipes.json', JSON.stringify(recipes, null, 2));
console.log('Done!');
