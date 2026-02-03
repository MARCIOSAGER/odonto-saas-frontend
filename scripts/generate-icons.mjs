import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, '..', 'public', 'icons');

async function generateIcons() {
  // Read the SVG files
  const svg192 = readFileSync(join(iconsDir, 'icon-192x192.svg'));
  const svg512 = readFileSync(join(iconsDir, 'icon-512x512.svg'));

  // Generate 192x192 PNG
  await sharp(svg192)
    .resize(192, 192)
    .png()
    .toFile(join(iconsDir, 'icon-192x192.png'));
  console.log('Generated icon-192x192.png');

  // Generate 512x512 PNG
  await sharp(svg512)
    .resize(512, 512)
    .png()
    .toFile(join(iconsDir, 'icon-512x512.png'));
  console.log('Generated icon-512x512.png');

  console.log('All icons generated successfully!');
}

generateIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
