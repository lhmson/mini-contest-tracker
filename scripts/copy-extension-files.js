import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create dist/icons directory if it doesn't exist
const iconsDist = path.join(__dirname, '../dist/icons');
if (!fs.existsSync(iconsDist)) {
  fs.mkdirSync(iconsDist, { recursive: true });
}

// Copy manifest.json
fs.copyFileSync(
  path.join(__dirname, '../manifest.json'),
  path.join(__dirname, '../dist/manifest.json')
);
console.log('Copied manifest.json to dist/');

// Copy icons
const iconsDir = path.join(__dirname, '../icons');
const iconFiles = fs.readdirSync(iconsDir).filter(file => file.endsWith('.png'));

iconFiles.forEach(file => {
  fs.copyFileSync(
    path.join(iconsDir, file),
    path.join(iconsDist, file)
  );
  console.log(`Copied ${file} to dist/icons/`);
}); 