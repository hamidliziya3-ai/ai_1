const fs = require('fs');
const target = 5000;
const categories = {
  'Pasta': 'Паста', 'Salad': 'Салат', 'Soup': 'Суп', 'Main': 'Основное блюдо',
  'Dessert': 'Десерт', 'Breakfast': 'Завтрак', 'Pizza': 'Пицца', 'Sandwich': 'Сэндвич',
  'Grill': 'Гриль', 'Smoothie': 'Смузи', 'Snack': 'Закуска', 'Baking': 'Выпечка'
};
const ruIngMapAcc = {'chicken': 'курицу', 'beef': 'говядину', 'tomato': 'помидоры', 'potato': 'картофель', 'cheese': 'сыр', 'onion': 'лук', 'garlic': 'чеснок', 'milk': 'молоко', 'egg': 'яйцо', 'flour': 'муку', 'sugar': 'сахар', 'butter': 'масло', 'oil': 'масло', 'bread': 'хлеб', 'rice': 'рис', 'pasta': 'пасту', 'fish': 'рыбу', 'lemon': 'лимон', 'pepper': 'перец', 'salt': 'соль', 'honey': 'мед', 'yogurt': 'йогурт', 'avocado': 'авокадо', 'bacon': 'бекон', 'shrimp': 'креветки', 'broccoli': 'брокколи', 'carrot': 'морковь', 'cucumbers': 'огурцы', 'olives': 'оливки', 'basil': 'базилик', 'oregano': 'орегано', 'mushrooms': 'грибы', 'cream': 'сливки', 'mustard': 'горчицу', 'mayo': 'майонез', 'soy sauce': 'соевый соус', 'chili': 'чили', 'lime': 'лайм', 'orange': 'апельсин', 'apple': 'яблоко', 'banana': 'банан', 'berries': 'ягоды', 'walnuts': 'грецкие орехи', 'almonds': 'миндаль', 'chocolate': 'шоколад', 'vanilla': 'ваниль'};
const ruIngMapNom = {'chicken': 'курица', 'beef': 'говядина', 'tomato': 'помидор', 'potato': 'картофель', 'cheese': 'сыр', 'onion': 'лук', 'garlic': 'чеснок', 'milk': 'молоко', 'egg': 'яйцо', 'flour': 'мука', 'sugar': 'сахар', 'butter': 'масло', 'oil': 'масло', 'bread': 'хлеб', 'rice': 'рис', 'pasta': 'паста', 'fish': 'рыба', 'lemon': 'лимон', 'pepper': 'перец', 'salt': 'соль', 'honey': 'мед', 'yogurt': 'йогурт', 'avocado': 'авокадо', 'bacon': 'бекон', 'shrimp': 'креветки', 'broccoli': 'брокколи', 'carrot': 'морковь', 'cucumbers': 'огурцы', 'olives': 'оливки', 'basil': 'базилик', 'oregano': 'орегано', 'mushrooms': 'грибы', 'cream': 'сливки', 'mustard': 'горчица', 'mayo': 'майонез', 'soy sauce': 'соевый соус', 'chili': 'чили', 'lime': 'лайм', 'orange': 'апельсин', 'apple': 'яблоко', 'banana': 'банан', 'berries': 'ягоды', 'walnuts': 'грецкие орехи', 'almonds': 'миндаль', 'chocolate': 'шоколад', 'vanilla': 'ваниль'};

const recipes = [];
const catKeys = Object.keys(categories);
const ingKeys = Object.keys(ruIngMapNom);

for(let i=0; i<target; i++) {
  const catEn = catKeys[Math.floor(Math.random()*catKeys.length)];
  const catRu = categories[catEn];
  const mealIngs = [];
  const count = 2 + Math.floor(Math.random()*4);
  
  while(mealIngs.length < count) {
    const ing = ingKeys[Math.floor(Math.random()*ingKeys.length)];
    if(!mealIngs.includes(ing)) mealIngs.push(ing);
  }
  
  recipes.push({
    title: catEn + ' Special ' + (i+1),
    title_ru: catRu + ' - Вариант ' + (i+1),
    ingredients: mealIngs.map(ing => 'some ' + ing),
    ingredients_ru: mealIngs.map(ing => 'немного ' + (ruIngMapNom[ing] || ing)),
    mealIngredients: mealIngs,
    steps: ['Prepare the ' + mealIngs[0], 'Mix with ' + (mealIngs[1] || 'others'), 'Cook and serve.'],
    steps_ru: [
      'Возьмите ' + (ruIngMapAcc[mealIngs[0]] || mealIngs[0]),
      'Смешайте с ' + (ruIngMapAcc[mealIngs[1]] || 'остальным'),
      'Доведите до готовности и подавайте.'
    ],
    thumb: 'https://www.themealdb.com/images/ingredients/' + (mealIngs[0].charAt(0).toUpperCase() + mealIngs[0].slice(1)) + '.png',
    isLocal: true
  });
}

fs.writeFileSync('src/data/recipes.json', JSON.stringify(recipes));
console.log('Regenerated 5000 recipes.');
