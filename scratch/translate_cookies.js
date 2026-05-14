import fs from 'fs';

const filePath = 'c:\\Users\\Elshan\\Desktop\\ai_1\\src\\data\\recipes.json';
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const index = data.findIndex(r => r.title === 'Peanut Butter Cookies');

if (index !== -1) {
  data[index].title_ru = 'Печенье с арахисовым маслом';
  data[index].ingredients_ru = [
    '1 стакан арахисового масла',
    '1/2 стакана сахара',
    '1 крупное яйцо'
  ];
  data[index].steps_ru = [
    'Разогрейте духовку до 180°C.',
    'В большой миске тщательно смешайте арахисовое масло, сахар и яйцо до однородности.',
    'Сформируйте из теста небольшие шарики и выложите их на противень для запекания.',
    'Для украшения и равномерного пропекания слегка прижмите каждый шарик вилкой крест-накрест.',
    'Выпекайте 8–10 минут, пока края печенья не станут золотисто-коричневыми.',
    'Достаньте из духовки и дайте полностью остыть на противне.',
    'Приятного аппетита!'
  ];
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log('Successfully translated Peanut Butter Cookies.');
} else {
  console.log('Recipe not found.');
}
