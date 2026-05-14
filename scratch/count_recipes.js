import fs from 'fs';
const data = JSON.parse(fs.readFileSync('c:\\Users\\Elshan\\Desktop\\ai_1\\src\\data\\recipes.json', 'utf8'));
console.log('Total recipes:', data.length);
