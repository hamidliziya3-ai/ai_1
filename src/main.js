import './style.css';

const input = document.getElementById('product-input');
const button = document.getElementById('search-btn');
const resultsGrid = document.getElementById('results-grid');
const loading = document.getElementById('loading');

let localDatabase = [];

// Загружаем нашу расширенную базу данных
async function loadDatabase() {
  try {
    const response = await fetch('/src/data/recipes.json');
    localDatabase = await response.json();
    console.log('Database loaded:', localDatabase.length, 'recipes');
  } catch (e) {
    console.error('Failed to load local database');
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

async function searchRecipes() {
  const userInput = input.value.toLowerCase();
  const query = userInput.split(/[,\s]+/).map(i => i.trim()).filter(i => i.length > 2);
  
  if (query.length === 0) return;

  loading.classList.remove('hidden');
  loading.textContent = 'Масштабный поиск по всем базам...';
  resultsGrid.innerHTML = '';
  resultsGrid.classList.remove('visible');

  try {
    // 1. ПОИСК В НАШЕЙ РАСШИРЕННОЙ БАЗЕ
    const localMatches = localDatabase.map(recipe => {
      const extraIngredients = recipe.mealIngredients.filter(mi => 
        !query.some(q => mi.includes(q))
      );
      const matchCount = query.filter(q => 
        recipe.mealIngredients.some(mi => mi.includes(q))
      ).length;
      return { ...recipe, extraIngredients, matchCount, isLocal: true };
    }).filter(r => r.matchCount > 0);

    // 2. АГРЕССИВНЫЙ ПОИСК В ГЛОБАЛЬНОЙ СЕТИ
    // Ищем сразу по всем ключевым словам
    const apiPromises = query.slice(0, 5).map(q => 
      fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${q}`).then(r => r.json())
    );
    const apiResults = await Promise.all(apiPromises);
    
    const allMealIds = new Set();
    apiResults.forEach(res => {
      if (res.meals) res.meals.forEach(m => allMealIds.add(m.idMeal));
    });

    const idsToFetch = Array.from(allMealIds).slice(0, 60); // Увеличили до 60 для максимального выбора
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

    // 3. ОБЪЕДИНЕНИЕ И СОРТИРОВКА (Сначала идеальные, потом остальные)
    const allResults = [...localMatches, ...processedApiMeals]
      .sort((a, b) => {
        // Приоритет 1: Количество лишних продуктов (чем меньше, тем лучше)
        if (a.extraIngredients.length !== b.extraIngredients.length) {
          return a.extraIngredients.length - b.extraIngredients.length;
        }
        // Приоритет 2: Количество совпавших продуктов (чем больше, тем лучше)
        return b.matchCount - a.matchCount;
      })
      .slice(0, 12); // Показываем больше карточек (до 12)

    if (allResults.length === 0) {
      showNoResults();
    } else {
      renderRecipes(allResults, query);
    }
  } catch (error) {
    showNoResults();
  } finally {
    loading.classList.add('hidden');
  }
}

function showNoResults() {
  resultsGrid.innerHTML = `
    <div class="no-results">
      <h3>Ничего не найдено даже в расширенной базе</h3>
      <p>Попробуйте ввести более простые ингредиенты.</p>
    </div>
  `;
  resultsGrid.classList.add('visible');
}

function renderRecipes(meals, query) {
  const perfect = meals.filter(m => m.extraIngredients.length === 0);
  const others = meals.filter(m => m.extraIngredients.length > 0);

  let html = '';
  
  if (perfect.length > 0) {
    html += '<div class="match-info success">Идеальные совпадения (без лишних продуктов):</div>';
    html += perfect.map(m => renderCard(m, query, true)).join('');
  }
  
  if (others.length > 0) {
    html += '<div class="match-info warning">Эти блюда можно приготовить, если добавить ингредиенты:</div>';
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
  const title = meal.isLocal ? meal.title : meal.strMeal;

  return `
    <div class="recipe-card ${isPerfect ? 'perfect-match' : 'soft-match'}">
      <div class="recipe-header" style="background-image: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url('${image}')">
        <div class="recipe-tag">${meal.isLocal ? 'Из базы' : 'Из сети'}</div>
        <h3>${title}</h3>
      </div>
      <div class="recipe-content">
        <ul class="ingredients-list">
          ${ingredients.map(ing => {
            const name = ing.name.toLowerCase();
            const isMatched = query.some(q => name.includes(q));
            return `<li class="${isMatched ? 'matched' : 'extra'}">${ing.measure} ${ing.name}</li>`;
          }).join('')}
        </ul>
        <div class="steps-list">
          ${steps.map(step => `<div class="step-item">${step}</div>`).join('')}
        </div>
      </div>
    </div>
  `;
}

button.addEventListener('click', searchRecipes);
input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchRecipes();
});
