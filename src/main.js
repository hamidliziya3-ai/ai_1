import './style.css';

// DOM Elements
const input = document.getElementById('product-input');
const button = document.getElementById('search-btn');
const resultsGrid = document.getElementById('results-grid');
const loading = document.getElementById('loading');

const translations = {
  ru: {
    title: 'QuickBites',
    subtitle: 'Введите 3-4 продукта — получите 3 идеальных блюда',
    placeholder: 'Например: яйца, сыр, бекон...',
    searchBtn: 'Найти блюда',
    loading: 'Поиск по базе рецептов...',
    noResultsTitle: 'Ничего не найдено',
    noResultsText: 'Попробуйте ввести другие ингредиенты.',
    perfectMatches: 'Идеальные совпадения:',
    otherMatches: 'Можно приготовить, если добавить:',
    fromBase: 'Из базы',
    fromWeb: 'Из сети'
  },
  en: {
    title: 'QuickBites',
    subtitle: 'Enter 3-4 ingredients — get 3 perfect dishes',
    placeholder: 'Example: eggs, cheese, bacon...',
    searchBtn: 'Find Recipes',
    loading: 'Searching recipe database...',
    noResultsTitle: 'Nothing found',
    noResultsText: 'Try entering different ingredients.',
    perfectMatches: 'Perfect matches:',
    otherMatches: 'You can cook these if you add:',
    fromBase: 'Local',
    fromWeb: 'Web'
  }
};

const ruToEnMap = {
  'яйца': 'egg', 'яйцо': 'egg', 'сыр': 'cheese', 'бекон': 'bacon', 'банан': 'banana',
  'молоко': 'milk', 'масло': 'butter', 'хлеб': 'bread', 'картофель': 'potato',
  'картошка': 'potato', 'мед': 'honey', 'мёд': 'honey', 'помидор': 'tomato',
  'томат': 'tomato', 'йогурт': 'yogurt', 'паста': 'pasta', 'макароны': 'pasta',
  'чеснок': 'garlic', 'курица': 'chicken', 'куриная грудка': 'chicken',
  'авокадо': 'avocado', 'рис': 'rice', 'тортилья': 'tortilla', 'огурец': 'cucumber',
  'колбаса': 'sausage', 'яблоко': 'apple', 'тунец': 'tuna', 'майонез': 'mayo',
  'хлопья': 'cereal', 'лимон': 'lemon', 'креветки': 'shrimp', 'говядина': 'beef',
  'стейк': 'steak', 'лосось': 'salmon', 'рыба': 'fish', 'кускус': 'couscous',
  'хумус': 'hummus', 'морковь': 'carrot', 'ветчина': 'ham', 'лапша': 'noodles',
  'овес': 'oats', 'брокколи': 'broccoli', 'вода': 'water', 'соль': 'salt',
  'перец': 'pepper', 'сахар': 'sugar', 'базилик': 'basil', 'моцарелла': 'mozzarella',
  'арахисовое масло': 'peanut butter', 'бульон': 'broth',
  'апельсин': 'orange', 'овощи': 'vegetables', 'лук': 'onion'
};

let currentLang = localStorage.getItem('lang') || 'ru';
let localDatabase = [];
let lastResults = null;
let lastQuery = null;

function updateLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);

  const t = translations[lang];
  const glowText = document.querySelector('.glow-text');
  const subtitle = document.querySelector('.subtitle');
  
  if (glowText) glowText.textContent = t.title;
  if (subtitle) subtitle.textContent = t.subtitle;
  if (input) input.placeholder = t.placeholder;
  if (button) button.textContent = t.searchBtn;

  document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(`lang-${lang}`);
  if (activeBtn) activeBtn.classList.add('active');

  document.documentElement.lang = lang;
  document.title = lang === 'ru' ? 'QuickBites — Быстрые рецепты' : 'QuickBites — Fast Recipes';

  if (lastResults) {
    renderRecipes(lastResults, lastQuery);
  }
}

async function loadDatabase() {
  try {
    const response = await fetch(`/src/data/recipes.json?v=${Date.now()}`);
    localDatabase = await response.json();
    console.log('Database loaded:', localDatabase.length, 'recipes');
    const status = document.getElementById('db-status');
    if (status) status.textContent = currentLang === 'ru' ? `База данных: ${localDatabase.length} рецептов` : `Database: ${localDatabase.length} recipes`;
  } catch (e) {
    console.error('Failed to load database:', e);
  }
}

async function searchRecipes() {
  if (!input || !input.value) return;
  const userInput = input.value.toLowerCase().trim();
  if (!userInput) return;

  let query = userInput.split(/[,\s]+/).map(i => i.trim()).filter(i => i.length >= 2);
  if (query.length === 0) return;

  // Translate to EN for matching against mealIngredients
  let searchTerms = query;
  if (currentLang === 'ru') {
    searchTerms = query.map(q => ruToEnMap[q] || q);
  }

  lastQuery = searchTerms;

  const t = translations[currentLang];
  if (loading) {
    loading.classList.remove('hidden');
    loading.textContent = t.loading;
  }
  if (resultsGrid) {
    resultsGrid.innerHTML = '';
    resultsGrid.classList.remove('visible');
  }

  // Pure local search
  const matches = localDatabase.map(recipe => {
    if (!recipe.mealIngredients) return null;
    
    const matchedIngredients = searchTerms.filter(term => 
      recipe.mealIngredients.some(mi => mi.toLowerCase().includes(term.toLowerCase()))
    );
    
    const extraIngredients = recipe.mealIngredients.filter(mi => 
      !searchTerms.some(term => mi.toLowerCase().includes(term.toLowerCase()))
    );

    return {
      ...recipe,
      matchCount: matchedIngredients.length,
      extraIngredients: extraIngredients,
      isPerfect: extraIngredients.length === 0
    };
  }).filter(r => r && r.matchCount > 0);

  // Sort: perfect matches first, then by match count
  matches.sort((a, b) => {
    if (a.isPerfect !== b.isPerfect) return b.isPerfect - a.isPerfect;
    if (a.extraIngredients.length !== b.extraIngredients.length) return a.extraIngredients.length - b.extraIngredients.length;
    return b.matchCount - a.matchCount;
  });

  lastResults = matches.slice(0, 20);

  setTimeout(() => {
    if (loading) loading.classList.add('hidden');
    if (lastResults.length === 0) {
      showNoResults();
    } else {
      renderRecipes(lastResults, searchTerms);
    }
  }, 300);
}

function showNoResults() {
  const t = translations[currentLang];
  resultsGrid.innerHTML = `
    <div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 2rem;">
      <h3>${t.noResultsTitle}</h3>
      <p>${t.noResultsText}</p>
    </div>
  `;
  resultsGrid.classList.add('visible');
}

function renderRecipes(recipes, query) {
  const t = translations[currentLang];
  const perfect = recipes.filter(r => r.isPerfect);
  const others = recipes.filter(r => !r.isPerfect);

  let html = '';
  if (perfect.length > 0) {
    html += `<div class="match-info success" style="grid-column: 1/-1;">${t.perfectMatches}</div>`;
    html += perfect.map(r => renderCard(r, query)).join('');
  }
  if (others.length > 0) {
    html += `<div class="match-info warning" style="grid-column: 1/-1;">${t.otherMatches}</div>`;
    html += others.map(r => renderCard(r, query)).join('');
  }

  resultsGrid.innerHTML = html;
  resultsGrid.classList.add('visible');
}

function renderCard(recipe, query) {
  const isRu = currentLang === 'ru';
  const title = isRu ? (recipe.title_ru || recipe.title) : recipe.title;
  const ingredients = isRu ? (recipe.ingredients_ru || recipe.ingredients) : recipe.ingredients;
  const steps = isRu ? (recipe.steps_ru || recipe.steps) : recipe.steps;
  const t = translations[currentLang];

  return `
    <div class="recipe-card ${recipe.isPerfect ? 'perfect-match' : 'soft-match'}">
      <div class="recipe-header" style="background-image: linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.7)), url('${recipe.thumb || ''}')">
        <div class="recipe-tag">${t.fromBase}</div>
        <h3>${title}</h3>
      </div>
      <div class="recipe-content">
        <ul class="ingredients-list">
          ${ingredients.map((ing, idx) => {
            const mi = (recipe.mealIngredients && recipe.mealIngredients[idx]) || '';
            const isMatched = query.some(q => mi.toLowerCase().includes(q.toLowerCase()));
            return `<li class="${isMatched ? 'matched' : 'extra'}">${ing}</li>`;
          }).join('')}
        </ul>
        <div class="steps-list">
          ${steps.slice(0, 4).map(step => `<div class="step-item">${step}</div>`).join('')}
        </div>
      </div>
    </div>
  `;
}

// Event Listeners
document.getElementById('lang-ru').addEventListener('click', () => updateLanguage('ru'));
document.getElementById('lang-en').addEventListener('click', () => updateLanguage('en'));

button.addEventListener('click', searchRecipes);
input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchRecipes();
});

// Init
updateLanguage(currentLang);
loadDatabase();
