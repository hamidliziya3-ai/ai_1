import './style.css';

const input = document.getElementById('product-input');
const button = document.getElementById('search-btn');
const resultsGrid = document.getElementById('results-grid');
const loading = document.getElementById('loading');

// --- Translation Logic ---
const translations = {
  ru: {
    title: 'QuickBites',
    subtitle: 'Введите 3-4 продукта — получите 3 идеальных блюда',
    placeholder: 'Например: яйца, сыр, бекон...',
    searchBtn: 'Найти блюда',
    loading: 'Масштабный поиск по всем базам...',
    noResultsTitle: 'Ничего не найдено даже в расширенной базе',
    noResultsText: 'Попробуйте ввести более простые ингредиенты.',
    perfectMatches: 'Идеальные совпадения (без лишних продуктов):',
    otherMatches: 'Эти блюда можно приготовить, если добавить ингредиенты:',
    fromBase: 'Из базы',
    fromWeb: 'Из сети'
  },
  en: {
    title: 'QuickBites',
    subtitle: 'Enter 3-4 ingredients — get 3 perfect dishes',
    placeholder: 'Example: eggs, cheese, bacon...',
    searchBtn: 'Find Recipes',
    loading: 'Searching across all databases...',
    noResultsTitle: 'Nothing found even in the extended database',
    noResultsText: 'Try entering simpler ingredients.',
    perfectMatches: 'Perfect matches (no extra ingredients):',
    otherMatches: 'These dishes can be made if you add ingredients:',
    fromBase: 'From Database',
    fromWeb: 'From Web'
  }
};

const ingredientMap = {
  // RU -> EN (for search)
  'яйца': 'egg', 'яйцо': 'egg', 'сыр': 'cheese', 'бекон': 'bacon', 'банан': 'banana',
  'молоко': 'milk', 'масло': 'butter', 'хлеб': 'bread', 'картофель': 'potato',
  'картошка': 'potato', 'мед': 'honey', 'мёд': 'honey', 'помидор': 'tomato',
  'томат': 'tomato', 'йогурт': 'yogurt', 'паста': 'pasta', 'макароны': 'pasta',
  'чеснок': 'garlic', 'курица': 'chicken', 'куриная грудка': 'chicken',
  'авокадо': 'avocado', 'рис': 'rice', 'тортилья': 'tortilla', 'огурец': 'cucumber',
  'сосиски': 'sausage', 'яблоко': 'apple', 'тунец': 'tuna', 'майонез': 'mayo',
  'хлопья': 'cereal', 'лимон': 'lemon', 'креветки': 'shrimp', 'говядина': 'beef',
  'стейк': 'steak', 'лосось': 'salmon', 'рыба': 'fish', 'кускус': 'couscous',
  'хумус': 'hummus', 'морковь': 'carrot', 'ветчина': 'ham', 'лапша': 'noodles',
  'овсянка': 'oats', 'брокколи': 'broccoli', 'соевый соус': 'soy sauce',
  'вода': 'water', 'соль': 'salt', 'перец': 'pepper', 'сахар': 'sugar',
  'базилик': 'basil', 'моцарелла': 'mozzarella', 'оливковое масло': 'oil',
  'растительное масло': 'oil', 'арахисовое масло': 'peanut butter',
  'овсяные хлопья': 'oats', 'бульон': 'broth', 'апельсин': 'orange', 'овощи': 'vegetables',

  // EN -> RU (for display)
  'egg': 'яйца', 'cheese': 'сыр', 'bacon': 'бекон', 'banana': 'банан', 'milk': 'молоко',
  'butter': 'масло', 'bread': 'хлеб', 'potato': 'картофель', 'honey': 'мед',
  'tomato': 'помидор', 'yogurt': 'йогурт', 'pasta': 'паста', 'garlic': 'чеснок',
  'chicken': 'курица', 'avocado': 'авокадо', 'rice': 'рис', 'tortilla': 'тортилья',
  'cucumber': 'огурец', 'sausage': 'сосиски', 'apple': 'яблоко', 'tuna': 'тунец',
  'mayo': 'майонез', 'mayonnaise': 'майонез', 'cereal': 'хлопья', 'lemon': 'лимон',
  'shrimp': 'креветки', 'prawns': 'креветки', 'beef': 'говядина', 'steak': 'стейк',
  'salmon': 'лосось', 'fish': 'рыба', 'couscous': 'кускус', 'hummus': 'хумус',
  'carrot': 'морковь', 'ham': 'ветчина', 'noodles': 'лапша', 'oats': 'овсянка',
  'broccoli': 'брокколи', 'soy sauce': 'соевый соус', 'water': 'вода', 'salt': 'соль',
  'pepper': 'перец', 'sugar': 'сахар', 'basil': 'базилик', 'mozzarella': 'моцарелла',
  'oil': 'масло', 'peanut butter': 'арахисовое масло', 'broth': 'бульон',
  'orange': 'апельсин', 'vegetables': 'овощи', 'onions': 'лук', 'onion': 'лук',
  'garlic cloves': 'зубчика чеснока', 'clove': 'зубчик', 'cloves': 'зубчика',
  'cup': 'стакан', 'tsp': 'ч.л.', 'tbsp': 'ст.л.', 'slice': 'ломтик', 'gram': 'г',
  'g': 'г', 'ml': 'мл'
};

const recipeTitles = {
  "Banana Milkshake": "Банановый коктейль",
  "Scrambled Eggs": "Яичница-болтунья",
  "Cheese Toast": "Гренки с сыром",
  "Boiled Potatoes": "Отварной картофель",
  "Banana with Honey": "Банан с мёдом",
  "Caprese Salad": "Салат Капрезе",
  "Greek Yogurt with Fruit": "Греческий йогурт с фруктами",
  "Pasta with Garlic and Oil": "Паста с чесноком и маслом",
  "Peanut Butter Banana": "Банан с арахисовым маслом",
  "Simple Omelette": "Простой омлет",
  "Mashed Potatoes": "Картофельное пюре",
  "Chicken with Soy Sauce": "Курица в соевом соусе",
  "Avocado Toast": "Тост с авокадо",
  "Egg and Rice": "Рис с яйцом",
  "Quesadilla": "Кесадилья",
  "Honey Yogurt": "Медовый йогурт",
  "Tomato and Cucumber Salad": "Салат из помидоров и огурцов",
  "Fried Sausage": "Жареные сосиски",
  "Baked Apple": "Печёное яблоко",
  "Potato Pancakes": "Драники",
  "Tuna Salad": "Салат с тунцом",
  "Cereal with Milk": "Хлопья с молоком",
  "Cheese Omelette": "Омлет с сыром",
  "Honey Lemon Tea": "Чай с мёдом и лимоном",
  "Garlic Butter Shrimp": "Креветки в чесночном масле",
  "Beef Steak": "Говяжий стейк",
  "Baked Salmon": "Запечённый лосось",
  "Couscous with Veggies": "Кускус с овощами",
  "Hummus and Carrot": "Хумус с морковью",
  "Ham and Cheese Roll": "Рулет из ветчины и сыра",
  "Stir-fry Noodles": "Жареная лапша",
  "Banana Oatmeal": "Овсянка с бананом",
  "Tomato Soup": "Томатный суп",
  "Fried Rice": "Жареный рис",
  "Fruit Salad": "Фруктовый салат",
  "Egg Salad": "Яичный салат",
  "Grilled Chicken": "Курица на гриле",
  "Broccoli with Butter": "Брокколи с маслом",
  "Shrimp Cocktail": "Коктейль из креветок",
  "Baked Fish": "Запечённая рыба",
  "Rice with Soy Sauce": "Рис с соевым соусом",
  "Banana Pancakes": "Банановые оладьи",
  "Cucumber with Yogurt": "Огурцы с йогуртом",
  "Chicken Soup": "Куриный суп",
  "Beef Stew": "Тушеная говядина"
};

const instructionPhrases = {
  "Blend": "Смешайте в блендере",
  "until smooth": "до однородности",
  "Whisk": "Взбейте",
  "Cook in": "Готовьте в",
  "pan": "сковороде",
  "Put": "Положите",
  "Toast until melted": "Поджарьте до расплавления",
  "Boil": "Отварите",
  "in salted water": "в соленой воде",
  "for": "в течение",
  "mins": "минут",
  "Slice": "Нарежьте",
  "Drizzle with": "Полейте",
  "Layer with": "Выложите слоями с",
  "Mix": "Смешайте",
  "chopped": "нарезанный",
  "Sauté": "Обжарьте",
  "Mix together": "Смешайте вместе",
  "Spread": "Намажьте",
  "Mash": "Разомните",
  "Add": "Добавьте",
  "and glaze": "и глазируйте",
  "Serve over warm rice": "Подавайте с теплым рисом",
  "Fold and fry until crisp": "Сложите и обжарьте до хрустящей корочки",
  "Stir": "Размешайте",
  "into": "в",
  "Chop and mix": "Нарежьте и смешайте",
  "Core": "Удалите сердцевину",
  "Fill with": "Наполните",
  "Bake until soft": "Запекайте до мягкости",
  "Grate": "Натрите",
  "small patties": "небольшими оладьями",
  "Drain": "Слейте жидкость",
  "Pour": "Налейте",
  "over": "поверх",
  "Beat": "Взбейте",
  "Sprinkle": "Посыпьте",
  "Season": "Приправьте",
  "Sear in hot pan": "Обжарьте на горячей сковороде",
  "mins per side": "минут с каждой стороны",
  "Bake at": "Запекайте при",
  "Steam": "Приготовьте на пару",
  "Toss with": "Перемешайте с",
  "Simmer": "Тушите",
  "Heat until boiling": "Нагрейте до кипения",
  "Grill until cooked through": "Жарьте на гриле до готовности"
};

function translateText(text, type = 'general') {
  if (currentLang === 'en' || !text) return text;

  if (type === 'title') {
    return recipeTitles[text] || text;
  }

  if (type === 'ingredient') {
    let translated = text.toLowerCase();
    // Try matching whole phrase
    if (ingredientMap[translated]) return ingredientMap[translated];

    // Split and try matching words (for complex ingredients)
    const words = translated.split(' ');
    const translatedWords = words.map(w => ingredientMap[w] || w);
    return translatedWords.join(' ');
  }

  if (type === 'step') {
    let translated = text;
    // Simple replacement of known phrases
    Object.keys(instructionPhrases).forEach(phrase => {
      const reg = new RegExp(phrase, 'gi');
      translated = translated.replace(reg, instructionPhrases[phrase]);
    });
    return translated;
  }

  return text;
}

let currentLang = localStorage.getItem('lang') || 'ru';

function updateLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);

  // Update UI texts
  const t = translations[lang];
  document.querySelector('.glow-text').textContent = t.title;
  document.querySelector('.subtitle').textContent = t.subtitle;
  input.placeholder = t.placeholder;
  button.textContent = t.searchBtn;

  // Update button active state
  document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`lang-${lang}`).classList.add('active');

  // Update HTML lang attribute
  document.documentElement.lang = lang;
  document.title = lang === 'ru' ? 'QuickBites — Быстрые рецепты' : 'QuickBites — Fast Recipes';


}

// Initialize language switcher
document.getElementById('lang-ru').addEventListener('click', () => updateLanguage('ru'));
document.getElementById('lang-en').addEventListener('click', () => updateLanguage('en'));

// Set initial language
updateLanguage(currentLang);

// --- End Translation Logic ---

let localDatabase = [];

// Загружаем нашу расширенную базу данных
async function loadDatabase() {
  try {
    const response = await fetch('/src/data/recipes.json');
    if (!response.ok) throw new Error('Network response was not ok');
    localDatabase = await response.json();
    console.log('Database loaded:', localDatabase.length, 'recipes');
  } catch (e) {
    console.error('Failed to load local database:', e);
    // Fallback if local fetch fails (could be environment specific)
    localDatabase = [];
  }
}

loadDatabase();

async function getMealDetails(id) {
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await response.json();
    return data.meals[0];
  } catch (error) {
    return null;
  }
}

let lastResults = null;
let lastQuery = null;

async function searchRecipes() {
  if (!input || !input.value) return;
  const userInput = input.value.toLowerCase().trim();
  if (!userInput) return;

  // Translate RU ingredients to EN if needed
  let query = userInput.split(/[,\s]+/).map(i => i.trim()).filter(i => i.length >= 2);

  if (query.length === 0) return;

  if (currentLang === 'ru') {
    query = query.map(q => ingredientMap[q] || q);
  }

  lastQuery = query;

  const t = translations[currentLang] || translations.ru;
  if (loading) {
    loading.classList.remove('hidden');
    loading.textContent = t.loading;
  }
  if (resultsGrid) {
    resultsGrid.innerHTML = '';
    resultsGrid.classList.remove('visible');
  }

  try {
    // 1. ПОИСК В НАШЕЙ РАСШИРЕННОЙ БАЗЕ
    const localMatches = (localDatabase || []).map(recipe => {
      if (!recipe || !recipe.mealIngredients) return null;
      const extraIngredients = recipe.mealIngredients.filter(mi =>
        !query.some(q => mi.toLowerCase().includes(q.toLowerCase()))
      );
      const matchCount = query.filter(q =>
        recipe.mealIngredients.some(mi => mi.toLowerCase().includes(q.toLowerCase()))
      ).length;
      return { ...recipe, extraIngredients, matchCount, isLocal: true };
    }).filter(r => r !== null && r.matchCount > 0);

    // 2. АГРЕССИВНЫЙ ПОИСК В ГЛОБАЛЬНОЙ СЕТИ
    const apiPromises = query.slice(0, 3).map(q =>
      fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${q}`).then(r => r.json()).catch(() => ({ meals: null }))
    );
    const apiResults = await Promise.all(apiPromises);

    const allMealIds = new Set();
    apiResults.forEach(res => {
      if (res && res.meals) res.meals.forEach(m => allMealIds.add(m.idMeal));
    });

    const idsToFetch = Array.from(allMealIds).slice(0, 40);
    const detailPromises = idsToFetch.map(id => getMealDetails(id));
    const apiMeals = await Promise.all(detailPromises);

    const processedApiMeals = apiMeals
      .filter(m => m !== null)
      .map(meal => {
        const mealIngredients = [];
        for (let i = 1; i <= 20; i++) {
          const ing = meal[`strIngredient${i}`];
          if (ing && ing.trim()) mealIngredients.push(ing.toLowerCase());
        }
        const extraIngredients = mealIngredients.filter(mi =>
          !query.some(q => mi.includes(q))
        );
        const matchCount = query.filter(q =>
          mealIngredients.some(mi => mi.includes(q))
        ).length;
        return { ...meal, extraIngredients, mealIngredients, matchCount, isLocal: false };
      })
      .filter(m => m.matchCount > 0);

    // 3. ОБЪЕДИНЕНИЕ И СОРТИРОВКА
    const allResults = [...localMatches, ...processedApiMeals]
      .sort((a, b) => {
        if (a.extraIngredients.length !== b.extraIngredients.length) {
          return a.extraIngredients.length - b.extraIngredients.length;
        }
        return b.matchCount - a.matchCount;
      })
      .slice(0, 15);

    lastResults = allResults;

    if (allResults.length === 0) {
      showNoResults();
    } else {
      renderRecipes(allResults, query);
    }
  } catch (error) {
    console.error('Search error:', error);
    showNoResults();
  } finally {
    if (loading) loading.classList.add('hidden');
  }
}

function showNoResults() {
  const t = translations[currentLang];
  resultsGrid.innerHTML = `
    <div class="no-results">
      <h3>${t.noResultsTitle}</h3>
      <p>${t.noResultsText}</p>
    </div>
  `;
  resultsGrid.classList.add('visible');
}

function renderRecipes(meals, query) {
  const t = translations[currentLang];
  const perfect = meals.filter(m => m.extraIngredients.length === 0);
  const others = meals.filter(m => m.extraIngredients.length > 0);

  let html = '';

  if (perfect.length > 0) {
    html += `<div class="match-info success">${t.perfectMatches}</div>`;
    html += perfect.map(m => renderCard(m, query, true)).join('');
  }

  if (others.length > 0) {
    html += `<div class="match-info warning">${t.otherMatches}</div>`;
    html += others.map(m => renderCard(m, query, false)).join('');
  }

  resultsGrid.innerHTML = html;
  resultsGrid.classList.add('visible');
}

function renderCard(meal, query, isPerfect) {
  const ingredients = meal.isLocal
    ? meal.ingredients.map(i => ({ name: i, measure: '' }))
    : [];

  if (!meal.isLocal) {
    for (let i = 1; i <= 20; i++) {
      const ing = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ing && ing.trim()) ingredients.push({ name: ing, measure: measure });
    }
  }

  const steps = meal.isLocal
    ? meal.steps
    : meal.strInstructions.split(/\r?\n/).filter(s => s.length > 20).slice(0, 3);

  const image = meal.isLocal ? meal.thumb : meal.strMealThumb;

  // Use built-in translations if available, otherwise fallback to dictionary
  let title = meal.isLocal ? meal.title : meal.strMeal;
  if (currentLang === 'ru' && meal.title_ru) title = meal.title_ru;
  else if (currentLang === 'ru') title = translateText(title, 'title');

  let displayIngredients = ingredients;
  if (currentLang === 'ru' && meal.ingredients_ru) {
    displayIngredients = meal.ingredients_ru.map(ing => ({ name: ing, measure: '' }));
  }

  let displaySteps = steps;
  if (currentLang === 'ru' && meal.steps_ru) {
    displaySteps = meal.steps_ru;
  }

  const t = translations[currentLang];

  return `
    <div class="recipe-card ${isPerfect ? 'perfect-match' : 'soft-match'}">
      <div class="recipe-header" style="background-image: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url('${image || ''}')">
        <div class="recipe-tag">${meal.isLocal ? t.fromBase : t.fromWeb}</div>
        <h3>${title || ''}</h3>
      </div>
      <div class="recipe-content">
        <ul class="ingredients-list">
          ${displayIngredients.map((ing, idx) => {
    if (!ing) return '';
    const name = (meal.ingredients_ru && currentLang === 'ru') ? (meal.mealIngredients ? meal.mealIngredients[idx] || '' : '') : (ing.name || '').toLowerCase();
    const isMatched = query.some(q => name.includes(q.toLowerCase()));

    let displayName = ing.name || '';
    let displayMeasure = ing.measure || '';

    if (currentLang === 'ru' && !meal.ingredients_ru) {
      displayName = translateText(displayName, 'ingredient');
      displayMeasure = translateText(displayMeasure, 'ingredient');
    }

    return `<li class="${isMatched ? 'matched' : 'extra'}">${displayMeasure} ${displayName}</li>`;
  }).join('')}
        </ul>
        <div class="steps-list">
          ${(displaySteps || []).map(step => `<div class="step-item">${currentLang === 'ru' && !meal.steps_ru ? translateText(step, 'step') : step}</div>`).join('')}
        </div>
      </div>
    </div>
  `;
}

button.addEventListener('click', searchRecipes);
input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchRecipes();
});
