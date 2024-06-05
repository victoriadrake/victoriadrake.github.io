import { generate } from 'critical';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicDir = path.join(__dirname, '..', 'public'); // Adjust the path

function getHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      fileList = getHtmlFiles(filePath, fileList);
    } else if (filePath.endsWith('.html')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

async function generateCriticalCSS(file) {
  try {
    await generate({
      base: publicDir,
      src: file.replace(publicDir + path.sep, ''),
      css: ['public/css/style.css'],
      inline: true,
      dimensions: [
        {
          height: 800,
          width: 1280,
        },
        {
          height: 900,
          width: 1200,
        },
      ],
    });
    console.log(`Critical CSS inlined for ${file}`);
  } catch (err) {
    console.error(`Error generating critical CSS for ${file}:`, err);
  }
}

(async function() {
  const htmlFiles = getHtmlFiles(publicDir);
  for (const file of htmlFiles) {
    await generateCriticalCSS(file);
  }
})();
