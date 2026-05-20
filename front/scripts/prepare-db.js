const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, '..', 'sqlite.db');
const targetDir = path.join(__dirname, '..', 'assets');
const target = path.join(targetDir, 'sqlite.db');

if (!fs.existsSync(source)) {
  console.error('Не найден front/sqlite.db');
  process.exit(1);
}

fs.mkdirSync(targetDir, { recursive: true });
fs.copyFileSync(source, target);
console.log(`Скопировано: ${target}`);
