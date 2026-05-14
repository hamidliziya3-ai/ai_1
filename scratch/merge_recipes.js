import fs from 'fs';

const ingredientMap = {
  'egg yolks': 'яичные желтки', 'egg whites': 'яичные белки', 'boiling water': 'кипяток', 'pinch of salt': 'щепотка соли',
  'to taste': 'по вкусу', 'as required': 'по необходимости', 'chopped parsley': 'нарезанная петрушка',
  'cheddar cheese': 'сыр чеддер', 'parmesan cheese': 'сыр пармезан', 'olive oil': 'оливковое масло',
  'vegetable oil': 'растительное масло', 'black pepper': 'черный перец', 'sea salt': 'морская соль',
  'lemon juice': 'лимонный сок', 'lime juice': 'сок лайма', 'chicken breast': 'куриная грудка',
  'ground beef': 'говяжий фарш', 'red onion': 'красный лук', 'white onion': 'белый лук',
  'garlic cloves': 'зубчики чеснока', 'sour cream': 'сметана', 'soy sauce': 'соевый соус',
  'heavy cream': 'жирные сливки', 'all-purpose flour': 'мука', 'brown sugar': 'коричневый сахар',
  'baking powder': 'разрыхлитель', 'vanilla extract': 'ванильный экстракт', 'chopped': 'нарезанный',
  'diced': 'нарезанный кубиками', 'sliced': 'нарезанный ломтиками', 'minced': 'измельченный',
  'grated': 'тертый', 'melted': 'растопленный', 'dried': 'сушеный', 'fresh': 'свежий',
  'large': 'большой', 'small': 'маленький', 'medium': 'средний', 'teaspoon': 'ч.л.',
  'tablespoon': 'ст.л.', 'cup': 'стакан', 'clove': 'зубчик', 'pinch': 'щепотка',
  'gram': 'грамм', 'ounce': 'унция', 'pound': 'фунт', 'kg': 'кг', 'ml': 'мл',
  'liter': 'литр', 'piece': 'кусок', 'slice': 'ломтик', 'cereal': 'хлопья',
  'lemon': 'лимон', 'egg': 'яйцо', 'cheese': 'сыр', 'bacon': 'бекон', 'banana': 'банан',
  'milk': 'молоко', 'butter': 'масло', 'bread': 'хлеб', 'potato': 'картофель',
  'honey': 'мед', 'tomato': 'помидор', 'yogurt': 'йогурт', 'pasta': 'макароны',
  'garlic': 'чеснок', 'chicken': 'курица', 'avocado': 'авокадо', 'rice': 'рис',
  'tortilla': 'тортилья', 'cucumber': 'огурец', 'sausage': 'колбаса', 'apple': 'яблоко',
  'tuna': 'тунец', 'shrimp': 'креветка', 'prawns': 'креветки', 'beef': 'говядина',
  'steak': 'стейк', 'salmon': 'лосось', 'fish': 'рыба', 'couscous': 'кускус',
  'hummus': 'хумус', 'carrot': 'морковь', 'ham': 'ветчина', 'noodles': 'лапша',
  'oats': 'овес', 'broccoli': 'брокколи', 'water': 'вода', 'salt': 'соль',
  'pepper': 'перец', 'sugar': 'сахар', 'basil': 'базилик', 'mozzarella': 'моцарелла',
  'oil': 'масло', 'peanut butter': 'арахисовое масло', 'broth': 'бульон',
  'orange': 'апельсин', 'vegetables': 'овощи', 'onions': 'лук', 'onion': 'лук'
};

function translate(text) {
  if (!text) return text;
  let translated = text.toLowerCase();
  
  // Sort keys by length descending to match longest phrases first
  const keys = Object.keys(ingredientMap).sort((a, b) => b.length - a.length);
  
  keys.forEach(key => {
    const regex = new RegExp(`\\b${key}\\b`, 'gi');
    translated = translated.replace(regex, ingredientMap[key]);
  });
  
  // Capitalize first letter
  return translated.charAt(0).toUpperCase() + translated.slice(1);
}

const recipesReal = JSON.parse(fs.readFileSync('c:\\Users\\Elshan\\Desktop\\ai_1\\src\\data\\recipes_real.json', 'utf8'));

const localizedRecipes = recipesReal.map(recipe => {
  return {
    ...recipe,
    title_ru: translate(recipe.title),
    ingredients_ru: recipe.ingredients.map(i => translate(i)),
    steps_ru: recipe.steps.map(s => translate(s))
  };
});

// Load the 5000+ entries and keep them?
const oldData = JSON.parse(fs.readFileSync('c:\\Users\\Elshan\\Desktop\\ai_1\\src\\data\\recipes.json', 'utf8'));

// Find unique titles to avoid duplicates
const seenTitles = new Set(localizedRecipes.map(r => r.title.toLowerCase()));
const combined = [...localizedRecipes];

oldData.forEach(r => {
  if (!seenTitles.has(r.title.toLowerCase())) {
    combined.push(r);
    seenTitles.add(r.title.toLowerCase());
  }
});

fs.writeFileSync('c:\\Users\\Elshan\\Desktop\\ai_1\\src\\data\\recipes.json', JSON.stringify(combined, null, 2));
console.log(`Successfully merged. Total recipes: ${combined.length}`);
