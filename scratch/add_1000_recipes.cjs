const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/recipes.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const categories = {
  'Pasta': 'Паста', 'Salad': 'Салат', 'Soup': 'Суп', 'Main': 'Основное блюдо',
  'Dessert': 'Десерт', 'Breakfast': 'Завтрак', 'Pizza': 'Пицца', 'Sandwich': 'Сэндвич',
  'Grill': 'Гриль', 'Smoothie': 'Смузи', 'Snack': 'Закуска', 'Baking': 'Выпечка',
  'Stew': 'Рагу', 'Roast': 'Жаркое', 'Cake': 'Пирог', 'Drink': 'Напиток'
};

const ruIngMapNom = { 'chicken': 'курица', 'beef': 'говядина', 'tomato': 'помидоры', 'potato': 'картофель', 'cheese': 'сыр', 'onion': 'лук', 'garlic': 'чеснок', 'milk': 'молоко', 'egg': 'яйцо', 'flour': 'мука', 'sugar': 'сахар', 'butter': 'масло', 'oil': 'масло', 'bread': 'хлеб', 'rice': 'рис', 'pasta': 'паста', 'fish': 'рыба', 'lemon': 'лимон', 'pepper': 'перец', 'salt': 'соль', 'honey': 'мед', 'yogurt': 'йогурт', 'avocado': 'авокадо', 'bacon': 'бекон', 'shrimp': 'креветки', 'broccoli': 'брокколи', 'carrot': 'морковь', 'cucumbers': 'огурцы', 'olives': 'оливки', 'basil': 'базилик', 'oregano': 'орегано', 'mushrooms': 'грибы', 'cream': 'сливки', 'mustard': 'горчица', 'mayo': 'майонез', 'soy sauce': 'соевый соус', 'chili': 'чили', 'lime': 'лайм', 'orange': 'апельсин', 'apple': 'яблоко', 'banana': 'банан', 'berries': 'ягоды', 'walnuts': 'грецкие орехи', 'almonds': 'миндаль', 'chocolate': 'шоколад', 'vanilla': 'ваниль', 'spinach': 'шпинат', 'corn': 'кукуруза', 'beans': 'фасоль', 'peas': 'горошек', 'turkey': 'индейка', 'pork': 'свинина' };

const ruIngMapInstr = { 'chicken': 'курицей', 'beef': 'говядиной', 'tomato': 'помидорами', 'potato': 'картофелем', 'cheese': 'сыром', 'onion': 'луком', 'garlic': 'чесноком', 'milk': 'молоком', 'egg': 'яйцом', 'flour': 'мукой', 'sugar': 'сахаром', 'butter': 'маслом', 'oil': 'маслом', 'bread': 'хлебом', 'rice': 'рисом', 'pasta': 'пастой', 'fish': 'рыбой', 'lemon': 'лимоном', 'pepper': 'перцем', 'salt': 'солью', 'honey': 'медом', 'yogurt': 'йогуртом', 'avocado': 'авокадо', 'bacon': 'беконом', 'shrimp': 'креветками', 'broccoli': 'брокколи', 'carrot': 'морковью', 'cucumbers': 'огурцами', 'olives': 'оливками', 'basil': 'базиликом', 'oregano': 'орегано', 'mushrooms': 'грибами', 'cream': 'сливками', 'mustard': 'горчицей', 'mayo': 'майонезом', 'soy sauce': 'соевым соусом', 'chili': 'чили', 'lime': 'лаймом', 'orange': 'апельсином', 'apple': 'яблоком', 'banana': 'бананом', 'berries': 'ягодами', 'walnuts': 'грецкими орехами', 'almonds': 'миндалем', 'chocolate': 'шоколадом', 'vanilla': 'ванилью', 'spinach': 'шпинатом', 'corn': 'кукурузой', 'beans': 'фасолью', 'peas': 'горошком', 'turkey': 'индейкой', 'pork': 'свининой' };

const detailedSteps = {
  soup: {
    en: ["Wash and chop all vegetables into bite-sized pieces.", "In a large pot, bring water or broth to a boil and add the main ingredients.", "Simmer on medium heat for 20-30 minutes until tender, then season to taste.", "Serve hot in bowls, optionally garnished with fresh herbs."],
    ru: ["Тщательно промойте и нарежьте все ингредиенты кубиками среднего размера.", "Поместите овощи в кастрюлю, залейте водой или бульоном и доведите до кипения.", "Варите на медленном огне 20-30 минут до мягкости, добавьте специи по вкусу.", "Разлейте по тарелкам и подавайте горячим, можно украсить свежей зеленью."]
  },
  salad: {
    en: ["Wash and dry the greens and other fresh ingredients thoroughly.", "Chop everything into small pieces or thin slices and place in a large bowl.", "Drizzle with your favorite dressing and toss gently to combine.", "Serve immediately while fresh and crisp."],
    ru: ["Тщательно промойте и обсушите овощи, зелень и другие свежие компоненты.", "Нарежьте ингредиенты тонкими ломтиками или небольшими кусочками и сложите в салатницу.", "Добавьте любимую заправку и аккуратно перемешайте все составляющие.", "Подавайте сразу же, пока овощи остаются свежими и хрустящими."]
  },
  pizza: {
    en: ["Preheat your oven to 220°C (425°F) and prepare the pizza base.", "Spread the sauce and arrange the toppings evenly over the dough.", "Bake for 12-15 minutes until the crust is golden and cheese is bubbly.", "Slice into wedges and enjoy your homemade pizza!"],
    ru: ["Разогрейте духовку до 220 градусов и подготовьте основу для пиццы.", "Равномерно распределите соус и начинку по всей поверхности теста.", "Запекайте в духовке 12-15 минут до золотистой корочки и аппетитного расплавленного сыра.", "Нарежьте на порционные кусочки и подавайте к столу!"]
  },
  sandwich: {
    en: ["Lightly toast the bread slices in a pan or toaster for extra crunch.", "Layer the ingredients neatly between the bread slices.", "Press down slightly and cut diagonally for a classic presentation.", "Serve as a perfect quick meal or snack."],
    ru: ["Слегка поджарьте ломтики хлеба на сухой сковороде или в тостере до хруста.", "Аккуратно выложите все ингредиенты слоями между кусочками хлеба.", "Немного прижмите сэндвич и разрежьте его по диагонали для красивой подачи.", "Подавайте как идеальный быстрый перекус или легкий обед."]
  },
  smoothie: {
    en: ["Peel and core the fruits and vegetables as needed.", "Place all ingredients into a blender along with a splash of liquid (water, milk, or juice).", "Blend on high speed until completely smooth and creamy.", "Pour into a tall glass and enjoy immediately."],
    ru: ["Очистите фрукты и овощи от кожуры и семян, нарежьте крупными кусками.", "Поместите все компоненты в блендер, добавьте немного воды, молока или сока.", "Взбейте на высокой скорости до получения однородной густой консистенции.", "Перелейте в высокий стакан и наслаждайтесь полезным напитком."]
  },
  generic: {
    en: ["Prepare your workspace and gather all the necessary ingredients.", "Chop or process the ingredients as required by the recipe type.", "Cook using a pan, pot, or oven until the dish is fully prepared and fragrant.", "Plate neatly and serve while the dish is at the perfect temperature."],
    ru: ["Подготовьте рабочую поверхность и соберите все необходимые продукты.", "Нарежьте или обработайте ингредиенты в соответствии с типом блюда.", "Готовьте на сковороде, в кастрюле или духовке до полной готовности и появления аромата.", "Красиво оформите блюдо и подавайте к столу, пока оно горячее."]
  }
};

const seenTitles = new Set(data.map(r => r.title.toLowerCase()));
const newRecipes = [];
const countToAdd = 1000;

const catKeys = Object.keys(categories);
const ingKeys = Object.keys(ruIngMapNom);

while (newRecipes.length < countToAdd) {
  const catEn = catKeys[Math.floor(Math.random() * catKeys.length)];
  const catRu = categories[catEn];

  const mealIngs = [];
  const ingCount = 2 + Math.floor(Math.random() * 4);
  while (mealIngs.length < ingCount) {
    const ing = ingKeys[Math.floor(Math.random() * ingKeys.length)];
    if (!mealIngs.includes(ing)) mealIngs.push(ing);
  }

  const mainIng = mealIngs[0];
  const secondIng = mealIngs[1];

  // Try different title patterns
  const patterns = [
    { en: `${catEn} with ${mainIng} and ${secondIng}`, ru: `${catRu} с ${ruIngMapInstr[mainIng] || mainIng} и ${ruIngMapInstr[secondIng] || secondIng}` },
    { en: `Healthy ${mainIng} ${catEn}`, ru: `Полезный ${catRu} с ${ruIngMapInstr[mainIng] || mainIng}` },
    { en: `Spicy ${mainIng} and ${secondIng} ${catEn}`, ru: `Острый ${catRu} с ${ruIngMapInstr[mainIng] || mainIng} и ${ruIngMapInstr[secondIng] || secondIng}` },
    { en: `Homemade ${catEn} with ${mainIng}`, ru: `Домашний ${catRu} с ${ruIngMapInstr[mainIng] || mainIng}` }
  ];

  const pattern = patterns[Math.floor(Math.random() * patterns.length)];
  const titleEn = pattern.en;
  const titleRu = pattern.ru;

  if (seenTitles.has(titleEn.toLowerCase())) continue;

  let type = 'generic';
  const lowerTitle = titleEn.toLowerCase();
  if (lowerTitle.includes('soup')) type = 'soup';
  else if (lowerTitle.includes('salad')) type = 'salad';
  else if (lowerTitle.includes('pizza')) type = 'pizza';
  else if (lowerTitle.includes('sandwich')) type = 'sandwich';
  else if (lowerTitle.includes('smoothie')) type = 'smoothie';

  newRecipes.push({
    title: titleEn,
    title_ru: titleRu,
    ingredients: mealIngs.map(ing => 'some ' + ing),
    ingredients_ru: mealIngs.map(ing => 'немного ' + (ruIngMapNom[ing] || ing)),
    mealIngredients: mealIngs,
    steps: detailedSteps[type].en,
    steps_ru: detailedSteps[type].ru,
    thumb: 'https://www.themealdb.com/images/ingredients/' + (mainIng.charAt(0).toUpperCase() + mainIng.slice(1)) + '.png',
    isLocal: true
  });

  seenTitles.add(titleEn.toLowerCase());
}

const combined = [...data, ...newRecipes];
fs.writeFileSync(filePath, JSON.stringify(combined, null, 2));

console.log(`Successfully added 1000 recipes. Total recipes: ${combined.length}`);
