import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const SRC_DIRS = ['public/images', 'public', 'data/images', 'images'];
const QUALITY = 80; // 80 = ideaalne veebi jaoks

async function convertFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!['.jpg','.jpeg','.png'].includes(ext)) return;
  
  const webpPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  
  if (fs.existsSync(webpPath)) {
    console.log(`⏭️  Juba olemas: ${path.basename(webpPath)}`);
    return;
  }
  
  try {
    const before = fs.statSync(filePath).size;
    await sharp(filePath)
      .webp({ quality: QUALITY })
      .toFile(webpPath);
    const after = fs.statSync(webpPath).size;
    const saved = Math.round((1 - after/before)*100);
    console.log(`✅ ${path.basename(filePath)} (${(before/1024).toFixed(0)}KB) -> ${path.basename(webpPath)} (${(after/1024).toFixed(0)}KB) -${saved}%`);
  } catch (e) {
    console.warn(`⚠️  ${filePath}: ${e.message}`);
  }
}

async function findImages(dir) {
  if (!fs.existsSync(dir)) return [];
  let files = [];
  try {
    const entries = fs.readdirSync(dir, {withFileTypes:true});
    for (const e of entries) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) {
        files.push(...await findImages(p));
      } else if (e.name.match(/\.(jpg|jpeg|png)$/i)) {
        files.push(p);
      }
    }
  } catch {}
  return files;
}

console.log('🔍 Otsin JPG/PNG faile...');
let all = [];
for (const d of SRC_DIRS) {
  all.push(...await findImages(d));
}
all = [...new Set(all)];

if (all.length === 0) {
  console.log('⚠️  Pilte ei leitud. Otsisin:', SRC_DIRS.join(', '));
  console.log('Pane pildid kausta public/images/');
} else {
  console.log(`Leidsin ${all.length} pilti, konverdin WEBP-ks (quality ${QUALITY})...\n`);
  for (const f of all) await convertFile(f);
  console.log('\n✅ Valmis! Nüüd muuda XLS-is image = .jpg -> .webp');
  console.log('Näide: Fujitsu-P700.jpg -> Fujitsu-P700.webp');
}
