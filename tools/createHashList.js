const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Вычисляет хеш-сумму файла (SHA256)
 * @param {string} filePath - Путь к файлу
 * @returns {Promise<string>} - Хеш-сумма в виде строки
 */
function getFileHash(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    
    stream.on('data', (data) => hash.update(data));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', (err) => reject(err));
  });
}

/**
 * Рекурсивно получает все файлы из директории
 * @param {string} dirPath - Путь к директории
 * @param {string[]} arrayOfFiles - Массив для накопления путей файлов
 * @returns {Promise<string[]>} - Массив путей к файлам
 */
async function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = await fs.promises.readdir(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = await fs.promises.stat(filePath);

    if (stat.isDirectory()) {
      arrayOfFiles = await getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  }

  return arrayOfFiles;
}

/**
 * Основная функция
 * @param {string} dirPath - Путь к директории для сканирования
 */
async function generateHashList(dirPath) {
  try {
    // Используем переданный путь или текущую директорию
    const targetDir = dirPath || process.cwd();
    
    // Проверяем, что путь существует и это директория
    const stat = await fs.promises.stat(targetDir);
    if (!stat.isDirectory()) {
      console.error(`Ошибка: "${targetDir}" не является директорией`);
      process.exit(1);
    }

    console.log(`Сканирование директории: ${targetDir}\n`);
    
    // Получаем все файлы рекурсивно
    const files = await getAllFiles(targetDir);
    
    // Вычисляем хеш-суммы для каждого файла
    const hashList = [];
    for (const file of files) {
      try {
        const hash = await getFileHash(file);
        const relativePath = path.relative(targetDir, file);
        hashList.push({ hash, fileName: relativePath });
      } catch (error) {
        console.error(`Ошибка при обработке файла ${file}:`, error.message);
      }
    }

    // Сортируем по имени файла для удобства
    hashList.sort((a, b) => a.fileName.localeCompare(b.fileName));

    // Выводим результат в формате "хеш-сумма - имя файла"
    console.log('Список хеш-сумм:');
    console.log('='.repeat(80));
    hashList.forEach(({ hash, fileName }) => {
      console.log(`${hash} - ${fileName}`);
    });
    
    console.log(`\nВсего файлов обработано: ${hashList.length}`);
  } catch (error) {
    console.error('Ошибка:', error.message);
    process.exit(1);
  }
}

// Запуск скрипта
const dirPath = process.argv[2];
generateHashList(dirPath);