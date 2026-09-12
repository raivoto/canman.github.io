import fs from 'fs';
import path from 'path';
import pkg from 'xlsx';
const XLSX = pkg;

const POSSIBLE_DIRS = ['data', 'src/data', '.', 'public/data'];
const OUT_ROOT = 'src/data/products';

function parseImageCell(cell) {
  if (!cell) return [];
  let str = String(cell).trim().replace(/^["']+|["']+$/g, '');
  if (!str) return [];
  return str.split(/[,;|\n]+/).map(s=>s.trim()).filter(Boolean);
}

function findImageValue(row) {
  const variants = ['image','images','pilt','pildid','foto','picture','img'];
  for (const key of Object.keys(row)) {
    const lk = key.toLowerCase().trim();
    for (const v of variants) {
      if (lk === v || lk.includes(v)) {
        const val = row[key];
        if (val && String(val).trim()) return String(val).trim();
      }
    }
  }
  const keys = Object.keys(row);
  for (let i = keys.length-1; i >= Math.max(0, keys.length-3); i--) {
    const s = String(row[keys[i]]||'').trim();
    if (s && (s.includes('.jpg') || s.includes('.png') || s.includes('.jpeg') || s.includes('http') || s.includes('.webp'))) {
      return s;
    }
  }
  return '';
}

function findXlsFiles() {
  let files = [];
  for (const dir of POSSIBLE_DIRS) {
    if (!fs.existsSync(dir)) continue;
    try {
      const entries = fs.readdirSync(dir, {withFileTypes:true});
      for (const e of entries) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) {
          try {
            const sub = fs.readdirSync(p).filter(f=>f.toLowerCase().endsWith('.xls')||f.toLowerCase().endsWith('.xlsx')).map(f=>path.join(p,f));
            files.push(...sub);
          } catch {}
        } else if (e.name.toLowerCase().endsWith('.xls') || e.name.toLowerCase().endsWith('.xlsx')) {
          files.push(p);
        }
      }
    } catch {}
  }
  return [...new Set(files)];
}

function convertFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  Faili ei leitud (vahele jäetud): ${filePath}`);
    return;
  }
  try {
    console.log(`\n📥 ${path.basename(filePath)}`);
    const wb = XLSX.readFile(filePath);
    for (const sheetName of wb.SheetNames) {
      try {
        const sheet = wb.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false });
        if (!rows.length) {
          console.warn(`  ⚠️  ${sheetName} tühi`);
          continue;
        }
        console.log(`  📄 Sheet "${sheetName}": ${rows.length} rida | Veerud: ${Object.keys(rows[0]).join(' | ')}`);
        const testImg = findImageValue(rows[0]);
        if (testImg) console.log(`     ✅ Pildi veerg: ${testImg.substring(0,80)}`);
        else console.log(`     ❌ Pildi veergu ei leitud`);

        const products = rows.map((row, idx) => {
          const rawImage = findImageValue(row);
          const images = parseImageCell(rawImage);
          return {
            id: String(row['id'] || row['ID'] || row['sku'] || `${sheetName}-${idx}`),
            sku: String(row['sku'] || row['id'] || ''),
            title: String(row['title'] || row['name'] || row['Toode'] || ''),
            name: String(row['name'] || row['title'] || ''),
            stock: Number(row['stock'] || 1),
            price: Number(row['price'] || row['Hind'] || 0),
            salePrice: row['salePrice'] ? Number(row['salePrice']) : undefined,
            topCategory: String(row['topCategory'] || row['category'] || sheetName),
            subCategory: 'general',
            categoryPath: [String(row['topCategory'] || sheetName)],
            brand: String(row['brand'] || ''),
            image: images[0] || '',
            images: images,
            rawImages: images,
            description: String(row['description'] || ''),
            shortDescription: String(row['shortDescription'] || ''),
          };
        }).filter(p => p.title);

        const safeName = sheetName.toLowerCase().replace(/[^a-z0-9äöüõ]+/g,'-').replace(/^-|-$/g,'');
        const outDir = path.join(OUT_ROOT, safeName);
        fs.mkdirSync(outDir, {recursive:true});
        const outFile = path.join(outDir, `${safeName}.json`);
        fs.writeFileSync(outFile, JSON.stringify(products, null, 2));
        console.log(`     💾 ${outFile}: ${products.length} toodet, ${products.filter(p=>p.images.length>0).length} pildiga`);
      } catch (e) {
        console.warn(`  ⚠️  Sheet ${sheetName} viga: ${e.message}`);
      }
    }
  } catch (e) {
    console.warn(`⚠️  Fail ${filePath} viga (vahele jäetud): ${e.message}`);
  }
}

const xlsFiles = findXlsFiles();
console.log('Leitud XLS:', xlsFiles);
for (const f of xlsFiles) convertFile(f);
console.log('\n✅ Import valmis - kõik sama süsteemiga (image/images/pilt)!');
