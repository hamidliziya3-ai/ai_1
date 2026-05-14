import fs from 'fs';

const filePath = 'c:\\Users\\Elshan\\Desktop\\ai_1\\src\\data\\recipes.json';
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const detailedSteps = {
  soup: {
    en: [
      "Wash and chop all vegetables into bite-sized pieces.",
      "In a large pot, bring water or broth to a boil and add the main ingredients.",
      "Simmer on medium heat for 20-30 minutes until tender, then season to taste.",
      "Serve hot in bowls, optionally garnished with fresh herbs."
    ],
    ru: [
      "Тщательно промойте и нарежьте все ингредиенты кубиками среднего размера.",
      "Поместите овощи в кастрюлю, залейте водой или бульоном и доведите до кипения.",
      "Варите на медленном огне 20-30 минут до мягкости, добавьте специи по вкусу.",
      "Разлейте по тарелкам и подавайте горячим, можно украсить свежей зеленью."
    ]
  },
  salad: {
    en: [
      "Wash and dry the greens and other fresh ingredients thoroughly.",
      "Chop everything into small pieces or thin slices and place in a large bowl.",
      "Drizzle with your favorite dressing and toss gently to combine.",
      "Serve immediately while fresh and crisp."
    ],
    ru: [
      "Тщательно промойте и обсушите овощи, зелень и другие свежие компоненты.",
      "Нарежьте ингредиенты тонкими ломтиками или небольшими кусочками и сложите в салатницу.",
      "Добавьте любимую заправку и аккуратно перемешайте все составляющие.",
      "Подавайте сразу же, пока овощи остаются свежими и хрустящими."
    ]
  },
  pizza: {
    en: [
      "Preheat your oven to 220°C (425°F) and prepare the pizza base.",
      "Spread the sauce and arrange the toppings evenly over the dough.",
      "Bake for 12-15 minutes until the crust is golden and cheese is bubbly.",
      "Slice into wedges and enjoy your homemade pizza!"
    ],
    ru: [
      "Разогрейте духовку до 220 градусов и подготовьте основу для пиццы.",
      "Равномерно распределите соус и начинку по всей поверхности теста.",
      "Запекайте в духовке 12-15 минут до золотистой корочки и аппетитного расплавленного сыра.",
      "Нарежьте на порционные кусочки и подавайте к столу!"
    ]
  },
  sandwich: {
    en: [
      "Lightly toast the bread slices in a pan or toaster for extra crunch.",
      "Layer the ingredients neatly between the bread slices.",
      "Press down slightly and cut diagonally for a classic presentation.",
      "Serve as a perfect quick meal or snack."
    ],
    ru: [
      "Слегка поджарьте ломтики хлеба на сухой сковороде или в тостере до хруста.",
      "Аккуратно выложите все ингредиенты слоями между кусочками хлеба.",
      "Немного прижмите сэндвич и разрежьте его по диагонали для красивой подачи.",
      "Подавайте как идеальный быстрый перекус или легкий обед."
    ]
  },
  smoothie: {
    en: [
      "Peel and core the fruits and vegetables as needed.",
      "Place all ingredients into a blender along with a splash of liquid (water, milk, or juice).",
      "Blend on high speed until completely smooth and creamy.",
      "Pour into a tall glass and enjoy immediately."
    ],
    ru: [
      "Очистите фрукты и овощи от кожуры и семян, нарежьте крупными кусками.",
      "Поместите все компоненты в блендер, добавьте немного воды, молока или сока.",
      "Взбейте на высокой скорости до получения однородной густой консистенции.",
      "Перелейте в высокий стакан и наслаждайтесь полезным напитком."
    ]
  },
  generic: {
    en: [
      "Prepare your workspace and gather all the necessary ingredients.",
      "Chop or process the ingredients as required by the recipe type.",
      "Cook using a pan, pot, or oven until the dish is fully prepared and fragrant.",
      "Plat neatly and serve while the dish is at the perfect temperature."
    ],
    ru: [
      "Подготовьте рабочую поверхность и соберите все необходимые продукты.",
      "Нарежьте или обработайте ингредиенты в соответствии с типом блюда.",
      "Готовьте на сковороде, в кастрюле или духовке до полной готовности и появления аромата.",
      "Красиво оформите блюдо и подавайте к столу, пока оно горячее."
    ]
  }
};

let updatedCount = 0;

data.forEach(recipe => {
  // Check if steps are generic (like "Prepare the...", "Mix with...", "Cook and serve.")
  const isGeneric = recipe.steps && recipe.steps.length === 3 && recipe.steps[2].toLowerCase().includes("cook and serve");
  
  if (isGeneric) {
    const title = recipe.title.toLowerCase();
    let type = 'generic';
    
    if (title.includes('soup')) type = 'soup';
    else if (title.includes('salad')) type = 'salad';
    else if (title.includes('pizza')) type = 'pizza';
    else if (title.includes('sandwich')) type = 'sandwich';
    else if (title.includes('smoothie')) type = 'smoothie';
    
    recipe.steps = detailedSteps[type].en;
    recipe.steps_ru = detailedSteps[type].ru;
    updatedCount++;
  }
});

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log(`Updated ${updatedCount} recipes with detailed steps.`);
