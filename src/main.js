import './style.css';

const input = document.getElementById('product-input');
const button = document.getElementById('search-btn');
const resultsGrid = document.getElementById('results-grid');
const loading = document.getElementById('loading');

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
  loading.textContent = 'Ищем идеальные совпадения...';
  resultsGrid.innerHTML = '';
  resultsGrid.classList.remove('visible');

  try {
    // 1. Ищем по первому ингредиенту
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${query[0]}`);
    const data = await response.json();

    if (!data.meals) {
      showNoResults();
      return;
    }

    // 2. Берем больше кандидатов (15 вместо 3) для строгого отбора
    const mealShortList = data.meals.slice(0, 15);
    const detailPromises = mealShortList.map(meal => getMealDetails(meal.idMeal));
    const allMeals = await Promise.all(detailPromises);

    // 3. СТРОГАЯ ФИЛЬТРАЦИЯ
    const filteredMeals = allMeals
      .filter(m => m !== null)
      .map(meal => {
        const mealIngredients = [];
        for (let i = 1; i <= 20; i++) {
          const ing = meal[`strIngredient${i}`];
          if (ing && ing.trim()) mealIngredients.push(ing.toLowerCase());
        }

        // Считаем, сколько наших продуктов есть в рецепте
        const matchCount = query.filter(q => 
          mealIngredients.some(mi => mi.includes(q))
        ).length;

        // Считаем "лишние" ингредиенты (которых нет в нашем списке)
        // Исключаем воду, соль, сахар, масло - это обычно есть у всех
        const basicItems = ['water', 'salt', 'sugar', 'oil', 'pepper', 'butter'];
        const extraCount = mealIngredients.filter(mi => 
          !query.some(q => mi.includes(q)) && !basicItems.some(b => mi.includes(b))
        ).length;

        // Оценка: чем больше совпадений и меньше лишнего, тем лучше
        const score = (matchCount * 2) - extraCount;
        
        return { ...meal, score, matchCount, extraCount, mealIngredients };
      })
      // Оставляем только те, где есть хоть какое-то совпадение и не слишком много лишнего
      .filter(m => m.matchCount > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    if (filteredMeals.length === 0) {
      showNoResults();
    } else {
      renderRecipes(filteredMeals, query);
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
      <h3>Точных совпадений не найдено</h3>
      <p>Попробуйте другие сочетания (например: milk banana, egg bread). Помните, что поиск лучше работает на английском.</p>
    </div>
  `;
  resultsGrid.classList.add('visible');
}

function renderRecipes(meals, query) {
  resultsGrid.innerHTML = meals.map(meal => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ing = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ing && ing.trim()) ingredients.push({ name: ing, measure: measure });
    }

    const steps = meal.strInstructions
      .split(/\r?\n/)
      .filter(step => step.trim().length > 15)
      .slice(0, 3);

    return `
      <div class="recipe-card">
        <div class="recipe-header" style="background-image: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url('${meal.strMealThumb}')">
          <div class="recipe-tag">Точность: ${Math.max(0, 100 - meal.extraCount * 10)}%</div>
          <h3>${meal.strMeal}</h3>
        </div>
        <div class="recipe-content">
          <ul class="ingredients-list">
            ${ingredients.map(ing => {
              const isMatched = query.some(q => ing.name.toLowerCase().includes(q));
              return `<li class="${isMatched ? 'matched' : ''}">${ing.measure} ${ing.name}</li>`;
            }).join('')}
          </ul>
          <div class="steps-list">
            ${steps.map(step => `<div class="step-item">${step}</div>`).join('')}
          </div>
        </div>
      </div>
    `;
  }).join('');

  resultsGrid.classList.add('visible');
}

button.addEventListener('click', searchRecipes);
input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchRecipes();
});
