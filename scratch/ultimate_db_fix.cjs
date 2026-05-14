const fs = require('fs');
const path = require('path');

// --- Dictionary from main.js ---
const ingredientMap = {
  'egg yolks': 'желтки', 'egg whites': 'белки', 'boiling water': 'кипяток', 'pinch of salt': 'щепотка соли',
  'to taste': 'по вкусу', 'as required': 'по необходимости', 'chopped parsley': 'рубленая петрушка',
  'cheddar cheese': 'сыр чеддер', 'parmesan cheese': 'сыр пармезан', 'olive oil': 'оливковое масло',
  'vegetable oil': 'растительное масло', 'black pepper': 'черный перец', 'sea salt': 'морская соль',
  'lemon juice': 'лимонный сок', 'lime juice': 'сок лайма', 'chicken breast': 'куриная грудка',
  'ground beef': 'говяжий фарш', 'red onion': 'красный лук', 'white onion': 'репчатый лук',
  'garlic cloves': 'зубчики чеснока', 'sour cream': 'сметана', 'soy sauce': 'соевый соус',
  'heavy cream': 'жирные сливки', 'all-purpose flour': 'мука', 'brown sugar': 'коричневый сахар',
  'baking powder': 'разрыхлитель', 'vanilla extract': 'ванилин', 'chopped': 'нарезанный',
  'diced': 'нарезанный кубиками', 'sliced': 'нарезанный ломтиками', 'minced': 'измельченный',
  'grated': 'тертый', 'melted': 'растопленный', 'dried': 'сушеный', 'fresh': 'свежий',
  'large': 'большой', 'small': 'маленький', 'medium': 'средний', 'teaspoon': 'ч.л.',
  'tablespoon': 'ст.л.', 'cup': 'стакан', 'clove': 'зубчик', 'pinch': 'щепотка',
  'gram': 'грамм', 'ounce': 'унция', 'pound': 'фунт', 'kg': 'кг', 'ml': 'мл',
  'liter': 'литр', 'piece': 'штук', 'slice': 'ломтик', 'cereal': 'хлопья',
  'lemon': 'лимон', 'egg': 'яйца', 'cheese': 'сыр', 'bacon': 'бекон', 'banana': 'банан',
  'milk': 'молоко', 'butter': 'масло', 'bread': 'хлеб', 'potato': 'картофель',
  'honey': 'мед', 'tomato': 'помидор', 'yogurt': 'йогурт', 'pasta': 'паста',
  'garlic': 'чеснок', 'chicken': 'курица', 'avocado': 'авокадо', 'rice': 'рис',
  'tortilla': 'тортилья', 'cucumber': 'огурец', 'sausage': 'сосиски', 'apple': 'яблоко',
  'tuna': 'тунец', 'shrimp': 'креветки', 'prawns': 'креветки', 'beef': 'говядина',
  'steak': 'стейк', 'salmon': 'лосось', 'fish': 'рыба', 'couscous': 'кускус',
  'hummus': 'хумус', 'carrot': 'морковь', 'ham': 'ветчина', 'noodles': 'лапша',
  'oats': 'овсянка', 'broccoli': 'брокколи', 'water': 'вода', 'salt': 'соль',
  'pepper': 'перец', 'sugar': 'сахар', 'basil': 'базилик', 'mozzarella': 'моцарелла',
  'oil': 'масло', 'peanut butter': 'арахисовое масло', 'broth': 'бульон',
  'orange': 'апельсин', 'vegetables': 'овощи', 'onions': 'лук', 'onion': 'лук',
  'clove': 'зубчик', 'cloves': 'зубчика', 'tsp': 'ч.л.', 'tbsp': 'ст.л.', 'lb': 'фунт', 'oz': 'унция'
};

const smartPhrases = [
  { en: /Preheat( the)? oven to/gi, ru: 'Разогрейте духовку до' },
  { en: /Heat( the)? oil in a( large| medium| small)? skillet/gi, ru: 'Нагрейте масло в сковороде' },
  { en: /Heat( the)? oil in a( large| medium| small)? frying pan/gi, ru: 'Нагрейте масло в сковороде' },
  { en: /Heat( the)? oil in a( large| medium| small)? pot/gi, ru: 'Нагрейте масло в кастрюле' },
  { en: /Season( well)? with salt and pepper/gi, ru: 'Приправьте солью и перцем' },
  { en: /In a( large| medium| small)? bowl/gi, ru: 'В миске' },
  { en: /In a( large| medium| small)? pot/gi, ru: 'В кастрюле' },
  { en: /Bring( the mixture)? to a boil/gi, ru: 'Доведите до кипения' },
  { en: /Bring to a simmer/gi, ru: 'Доведите до слабого кипения' },
  { en: /until golden brown/gi, ru: 'до золотистого цвета' },
  { en: /until tender/gi, ru: 'до мягкости' },
  { en: /until cooked through/gi, ru: 'до готовности' },
  { en: /Set( them)? aside/gi, ru: 'Отложите' },
  { en: /Serve( immediately)? with/gi, ru: 'Подавайте с' },
  { en: /Serve( immediately)? on/gi, ru: 'Подавайте на' },
  { en: /Meanwhile/gi, ru: 'Тем временем' },
  { en: /Drain and rinse/gi, ru: 'Слейте воду и промойте' },
  { en: /Over medium-high heat/gi, ru: 'На средне-сильном огне' },
  { en: /Over medium heat/gi, ru: 'На среднем огне' },
  { en: /Over high heat/gi, ru: 'На сильном огне' },
  { en: /Over low heat/gi, ru: 'На медленном огне' },
  { en: /Transfer( the)? (steaks|meat|mixture) to/gi, ru: 'Переложите в' },
  { en: /Mix( together)? until smooth/gi, ru: 'Перемешайте до однородности' },
  { en: /Stir in the/gi, ru: 'Добавьте, помешивая,' },
  { en: /Combine( the)?/gi, ru: 'Смешайте' },
  { en: /Place( the)?/gi, ru: 'Поместите' },
  { en: /Add( the)?/gi, ru: 'Добавьте' },
  { en: /Reduce( the)? heat/gi, ru: 'Убавьте огонь' },
  { en: /Remove from( the)? heat/gi, ru: 'Снимите с огня' },
  { en: /Sprinkle( with| the)?/gi, ru: 'Посыпьте' },
  { en: /Garnish with/gi, ru: 'Украсьте' },
  { en: /about (\d+) minutes/gi, ru: 'около $1 минут' },
  { en: /for (\d+) minutes/gi, ru: 'в течение $1 минут' }
];

function translateText(text, type = 'general') {
  if (!text) return text;
  let translated = text;

  if (type === 'title') {
    let lower = text.toLowerCase();
    Object.keys(ingredientMap).forEach(en => {
        const reg = new RegExp('\\b' + en + '\\b', 'gi');
        translated = translated.replace(reg, ingredientMap[en]);
    });
    return translated;
  }

  if (type === 'step') {
    smartPhrases.forEach(p => {
      translated = translated.replace(p.en, p.ru);
    });
    Object.keys(ingredientMap).forEach(ing => {
      const reg = new RegExp('\\b' + ing + '\\b', 'gi');
      translated = translated.replace(reg, ingredientMap[ing]);
    });
    return translated;
  }

  return text;
}

// --- Run ---
const dbPath = path.join(__dirname, '..', 'src', 'data', 'recipes.json');
const recipes = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

recipes.forEach(r => {
  // Only translate if not already "perfected" by our manual script
  if (!r.steps_ru || r.steps_ru[0].includes('Combine') || r.steps_ru[0].includes('Heat')) {
    r.title_ru = translateText(r.title, 'title');
    r.ingredients_ru = r.ingredients.map(ing => translateText(ing, 'ingredient'));
    r.steps_ru = r.steps.map(step => translateText(step, 'step'));
  }
});

fs.writeFileSync(dbPath, JSON.stringify(recipes, null, 2));
console.log('Massive translation completed for all recipes.');
