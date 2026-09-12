import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

const IMPORT_DIR = 'data/import';
const OUT_BASE = 'src/data/products';
const MERGED_FILE = 'src/data/products.ts'; // avalehe jaoks!

function ensureDir(p){ fs.mkdirSync(p, {recursive:true}); }

function convertFile(filePath) {
  const wb = XLSX.readFile(filePath);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet);
  const fileName = path.basename(filePath, path.extname(filePath)).toLowerCase();

  // topCategory = failinimi ilma numbriteta, subCategory = Exceli C veerg või failinimi
  let products = rows.map((r,i) => ({
    sku: String(r.SKU || r.sku || r.Kood || `SKU-${i}`),
    title: String(r.Title || r.title || r.Nimetus || r.Toode || ''),
    brand: String(r.Brand || r.brand || r.Mark || ''),
    categoryL1: String(r.CategoryL1 || r.categoryL1 || r.Kategooria1 || fileName).trim(),
    categoryL2: String(r.CategoryL2 || r.categoryL2 || r.Kategooria2 || fileName).trim(),
    categoryL3: String(r.CategoryL3 || r.categoryL3 || r.Kategooria3 || ''),
    topCategory: fileName,
    subCategory: String(r.SubCategory || r.subCategory || r.Alamkategooria || fileName),
    price: Number(r.Price || r.price || r.Hind || 0),
    salePrice: r.SalePrice? Number(r.SalePrice) : undefined,
    finalPrice: Number(r.FinalPrice || r.finalPrice || r.Price || r.price || 0),
    stock: Number(r.Stock || r.stock || r.Ladu || 0),
    condition: 'used',
    shortSpec: String(r.ShortSpec || r.shortSpec || ''),
    description: String(r.Description || r.description || ''),
    shortDescription: String(r.ShortDescription || ''),
    images: [String(r.Image || r.image || `/images/${r.SKU || ''}.jpg`)].filter(Boolean),
    isPopular: false,
  })).filter(p=>p.title);

  // Grupeeri alamkategooria järgi
  const groups = {};
  for(const p of products){
    const sub = (p.subCategory || fileName).toLowerCase().replace(/\s+/g,'-');
    if(!groups[sub]) groups[sub]=[];
    groups[sub].push(p);
  }
  ensureDir(path.join(OUT_BASE, fileName));
  for(const [sub, list] of Object.entries(groups)){
    fs.writeFileSync(path.join(OUT_BASE, fileName, `${sub}.json`), JSON.stringify(list, null, 2));
  }
  return products;
}

let allProducts = [];
if(fs.existsSync(IMPORT_DIR)){
  for(const f of fs.readdirSync(IMPORT_DIR)){
    if(f.endsWith('.xlsx')||f.endsWith('.xls')){
      console.log('Import:', f);
      allProducts.push(...convertFile(path.join(IMPORT_DIR, f)));
    }
  }
}
// lisa ka olemasolevad JSON-id (desktop-used jne)
if(fs.existsSync(OUT_BASE)){
  for(const top of fs.readdirSync(OUT_BASE)){
    const topPath = path.join(OUT_BASE, top);
    if(!fs.statSync(topPath).isDirectory()) continue;
    for(const jf of fs.readdirSync(topPath)){
      if(!jf.endsWith('.json')) continue;
      try{ allProducts.push(...JSON.parse(fs.readFileSync(path.join(topPath, jf),'utf8'))); }catch{}
    }
  }
}
// eemalda duplikaadid SKU järgi
const map = new Map();
for(const p of allProducts){ if(!map.has(p.sku)) map.set(p.sku, p); }
allProducts = Array.from(map.values());

// Kirjuta avalehe jaoks src/data/products.ts
const tsContent = `// AUTO-GENERATED - ära muuda käsitsi
import { Product } from '../types';
export const PRODUCTS: Product[] = ${JSON.stringify(allProducts, null, 2)};
`;
fs.writeFileSync(MERGED_FILE, tsContent);
console.log('Wrote', MERGED_FILE, 'total', allProducts.length);
