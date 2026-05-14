const fs = require('fs');

const perfectRu = [
  {
    title: "Борщ классический",
    title_ru: "Борщ классический",
    ingredients_ru: ["Говядина - 500г", "Капуста - 300г", "Свекла - 2 шт", "Картофель - 3 шт", "Морковь - 1 шт", "Лук - 1 шт", "Томатная паста - 2 ст.л."],
    mealIngredients: ["beef", "cabbage", "beet", "potato", "carrot", "onion"],
    steps_ru: ["Сварите бульон из говядины.", "Добавьте нарезанный картофель и капусту.", "Сделайте зажарку из лука, моркови и свеклы.", "Соедините всё и варите до готовности."],
    thumb: "https://www.themealdb.com/images/media/meals/st1l7t1587233854.jpg",
    isLocal: true
  },
  {
    title: "Пельмени домашние",
    title_ru: "Пельмени домашние",
    ingredients_ru: ["Мука - 500г", "Яйцо - 2 шт", "Фарш мясной - 500г", "Лук - 1 шт", "Вода - 200мл"],
    mealIngredients: ["flour", "egg", "meat", "onion", "water"],
    steps_ru: ["Замесите тесто из муки, яиц и воды.", "Приготовьте фарш с луком.", "Слепите пельмени и отварите в подсоленной воде."],
    thumb: "https://www.themealdb.com/images/media/meals/uvuyps1503062097.jpg",
    isLocal: true
  },
  {
    title: "Салат Оливье",
    title_ru: "Салат Оливье",
    ingredients_ru: ["Колбаса вареная - 300г", "Картофель - 3 шт", "Морковь - 2 шт", "Яйцо - 4 шт", "Огурцы соленые - 3 шт", "Горошек - 1 банка", "Майонез - 200г"],
    mealIngredients: ["sausage", "potato", "carrot", "egg", "cucumber", "peas", "mayo"],
    steps_ru: ["Отварите овощи и яйца.", "Нарежьте всё кубиками.", "Заправьте майонезом и перемешайте."],
    thumb: "https://www.themealdb.com/images/media/meals/vvpprx1487325699.jpg",
    isLocal: true
  },
  {
    title: "Блины на молоке",
    title_ru: "Блины на молоке",
    ingredients_ru: ["Молоко - 500мл", "Яйцо - 3 шт", "Мука - 250г", "Сахар - 2 ст.л.", "Масло растительное - 3 ст.л."],
    mealIngredients: ["milk", "egg", "flour", "sugar", "oil"],
    steps_ru: ["Смешайте яйца с сахаром и молоком.", "Постепенно всыпьте муку, перемешивая без комочков.", "Выпекайте блины на разогретой сковороде."],
    thumb: "https://www.themealdb.com/images/media/meals/1543774639.jpg",
    isLocal: true
  },
  {
    title: "Котлеты по-домашнему",
    title_ru: "Котлеты по-домашнему",
    ingredients_ru: ["Фарш - 600г", "Хлеб белый - 2 ломтика", "Молоко - 100мл", "Лук - 1 шт", "Чеснок - 2 зубчика"],
    mealIngredients: ["meat", "bread", "milk", "onion", "garlic"],
    steps_ru: ["Замочите хлеб в молоке.", "Смешайте фарш с луком, чесноком и хлебом.", "Сформируйте котлеты и обжарьте до золотистой корочки."],
    thumb: "https://www.themealdb.com/images/media/meals/1529444113.jpg",
    isLocal: true
  },
  {
    title: "Плов с говядиной",
    title_ru: "Плов с говядиной",
    ingredients_ru: ["Рис - 500г", "Говядина - 500г", "Морковь - 500г", "Лук - 2 шт", "Чеснок - 1 головка", "Масло - 150мл"],
    mealIngredients: ["rice", "beef", "carrot", "onion", "garlic", "oil"],
    steps_ru: ["Обжарьте мясо с луком и морковью.", "Добавьте рис и воду.", "Варите под крышкой до впитывания воды."],
    thumb: "https://www.themealdb.com/images/media/meals/uvuyps1503062097.jpg",
    isLocal: true
  }
];

fs.writeFileSync('src/data/recipes.json', JSON.stringify(perfectRu, null, 2));
console.log('Reset database to perfect Russian recipes.');
