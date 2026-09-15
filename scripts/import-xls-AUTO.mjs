
import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';

const IMPORT_DIR = 'data/import';
const PRODUCTS_OUT = 'src/data/products';
const PUBLIC_IMG = 'public/images';

// --- HELPERS ---
const toSlug = (s) => String(s||'').toLowerCase().trim()
  .replace(/"/g,'').replace(/'/g,'')
  .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

const normalizeRow = (row) => {
  // tee kõik võtmed väikseks
  const out = {};
  for (let k of Object.keys(row)) {
    out[k.toLowerCase().trim()] = row[k];
  }
  return out;
};

const getVal = (r, ...names) => {
  for (let n of names) {
    const v = r[n.toLowerCase()];
    if (v !== undefined && v !== null && String(v).trim() !== '') return String(v).trim();
  }
  return '';
};

// Kustuta kategooria fail
function deleteCategory(catPath) {
  // catPath näiteks "Laptops used > Laptop 14""
  const parts = catPath.split('>').map(s=>toSlug(s));
  const file = path.join(PRODUCTS_OUT, ...parts) + '.json';
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
    console.log(`  -> KUSTUTATUD kategooria: ${file}`);
  }
}
function deleteImage(imgName) {
  const p = path.join(PUBLIC_IMG, imgName);
  if (fs.existsSync(p)) {
    fs.unlinkSync(p);
    console.log(`  -> KUSTUTATUD pilt: ${p}`);
  }
}

// --- MAIN ---
let allProducts = [];
let categoriesMap = new Map(); // slug -> {name, path, count}
let toDeleteCategories = new Set();

const files = fs.readdirSync(IMPORT_DIR).filter(f=>/\.xls[x]?$/i.test(f));
console.log('Loen', files);

for (let file of files) {
  const wb = xlsx.readFile(path.join(IMPORT_DIR, file));
  for (let sheetName of wb.SheetNames) {
    const sheet = wb.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet, {defval: ''});
    console.log(`\n Fail ${file} / sheet ${sheetName}: ${rows.length} rida`);
    
    for (let raw of rows) {
      const r = normalizeRow(raw);
      const id = getVal(r, 'id');
      
      // 1) ID = "-" => kustuta toode, jäta vahele
      if (id === '-') {
        console.log(`  skip toode "-" ${getVal(r,'sku','title')}`);
        continue;
      }
      
      // 2) ID = "=" => kustuta kategooria või pilt
      if (id === '=') {
        const cat = getVal(r, 'categories', 'category', 'kategooria');
        const img = getVal(r, 'image', 'pilt', 'images');
        if (cat) {
          console.log(`  KÄSK = kustuta kategooria: ${cat}`);
          deleteCategory(cat);
          toDeleteCategories.add(cat);
        }
        if (img) {
          console.log(`  KÄSK = kustuta pilt: ${img}`);
          deleteImage(img);
        }
        continue;
      }
      
      // tavaline toode
      const sku = getVal(r, 'sku', 'id');
      if (!sku) continue;
      const categoriesRaw = getVal(r, 'categories');
      const title = getVal(r, 'title', 'name');
      const brand = getVal(r, 'brand');
      const image = getVal(r, 'image');
      
      if (!categoriesRaw) continue;
      
      // pane kirja kategooria
      const catParts = categoriesRaw.split('>').map(s=>s.trim()).filter(Boolean);
      const slugParts = catParts.map(toSlug);
      
      // salvesta toode
      allProducts.push({
        id: sku,
        sku,
        title,
        name: title,
        brand,
        categories: categoriesRaw,
        categorySlug: slugParts.join('/'),
        image: image ? `/images/${image}` : '',
        price: Number(getVal(r, 'regular price','price')) || 0,
        stock: Number(getVal(r,'stock')) || 1
      });
      
      const slugPath = slugParts.join('/');
      if (!categoriesMap.has(slugPath)) {
        categoriesMap.set(slugPath, { 
          name: catParts[catParts.length-1], 
          path: catParts,
          slugPath,
          count: 0 
        });
      }
      categoriesMap.get(slugPath).count++;
    }
  }
}

// --- KIRJUTA JSON-id kategooriate kaupa ---
for (let [slugPath, info] of categoriesMap) {
  if (toDeleteCategories.has(info.path.join(' > ')) || toDeleteCategories.has(slugPath)) {
    console.log(`Jäta vahele kustutatud ${slugPath}`);
    continue;
  }
  const items = allProducts.filter(p=>p.categorySlug===slugPath);
  if (items.length===0) {
    console.log(`Tühi kategooria ${slugPath} -> kustutan`);
    const file = path.join(PRODUCTS_OUT, slugPath) + '.json';
    if (fs.existsSync(file)) fs.unlinkSync(file);
    continue;
  }
  const outFile = path.join(PRODUCTS_OUT, slugPath) + '.json';
  fs.mkdirSync(path.dirname(outFile), {recursive:true});
  fs.writeFileSync(outFile, JSON.stringify(items, null, 2));
  console.log(` -> ${slugPath}.json (${items.length})`);
}

// --- category-tree.json ja categories.ts ---
const tree = {};
for (let [slugPath, info] of categoriesMap) {
  if (itemsCountCheck) {}
}
const treeJson = Array.from(categoriesMap.values()).filter(v=>!toDeleteCategories.has(v.path.join(' > ')));
fs.writeFileSync('src/data/category-tree.json', JSON.stringify(treeJson, null, 2));

const catsTs = `// AUTO ${allProducts.length} toodet
export const categories = ${JSON.stringify(treeJson, null, 2)};\n`;
fs.writeFileSync('src/data/categories.ts', catsTs);

// --- productCatalog.ts ---
let catalogImports = [];
let catalogSpread = [];
for (let [slugPath] of categoriesMap) {
  if (toDeleteCategories.has(slugPath)) continue;
  const varName = 'p_' + slugPath.replace(/[^a-z0-9]/g,'_');
  catalogImports.push(`import ${varName} from './products/${slugPath}.json';`);
  catalogSpread.push(`...${varName}`);
}
const catalogContent = `// AUTO - ära muuda käsitsi
${catalogImports.join('\n')}

export const allProducts = [
  ${catalogSpread.join(',\n  ')}
] as any[];
`;
fs.writeFileSync('src/data/productCatalog.ts', catalogContent);

console.log(`\n✅ Valmis! ${allProducts.length} toodet, ${categoriesMap.size} kategooriat`);
