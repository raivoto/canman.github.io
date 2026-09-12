import fs from 'fs';
import path from 'path';
import pkg from 'xlsx';
const XLSX = pkg;

const OUT_ROOT = 'src/data/products';
const IMAGES_DIR = 'public/images';

function sanitizeFileName(name) {
  return name.trim().replace(/\s+/g, '_').replace(/__+/g, '_').replace(/[^a-zA-Z0-9_\-\.]/g, '_');
}
function parseImageCell(cell) {
  if (!cell) return [];
  return String(cell).trim().replace(/^["']+|["']+$/g,'').split(/[,;|\n]+/).map(s => sanitizeFileName(s.trim())).filter(Boolean);
}
function findImageValue(row) {
  const variants = ['image','images','pilt','pildid','foto','picture','img'];
  for (const k of Object.keys(row)) {
    const lk = k.toLowerCase().trim();
    for (const v of variants) if (lk===v || lk.includes(v)) {
      const val=row[k]; if (val && String(val).trim()) return String(val).trim();
    }
  }
  const keys=Object.keys(row);
  for (let i=keys.length-1;i>=Math.max(0,keys.length-3);i--) {
    const s=String(row[keys[i]]||'').trim();
    if (s && (s.includes('.jpg')||s.includes('.png')||s.includes('.webp')||s.includes('.avif')||s.includes('http'))) return s;
  }
  return '';
}
function getSku(row, idx, sheetName) { return String(row['sku']||row['SKU']||row['id']||`${sheetName}-${idx}`).trim(); }
function loadAllProducts() {
  const map = new Map(); const fileMap = new Map();
  if (!fs.existsSync(OUT_ROOT)) return {globalMap: map, fileMap};
  const categories = fs.readdirSync(OUT_ROOT, {withFileTypes:true}).filter(d=>d.isDirectory()).map(d=>d.name);
  for (const cat of categories) {
    const catDir = path.join(OUT_ROOT, cat);
    try {
      const files = fs.readdirSync(catDir).filter(f=>f.endsWith('.json'));
      for (const f of files) {
        const fp = path.join(catDir, f);
        try {
          const data = JSON.parse(fs.readFileSync(fp,'utf8'));
          const skuMap = new Map();
          for (const p of data) {
            const sku = String(p.sku||p.id).trim(); if (!sku) continue;
            map.set(sku, {filePath: fp, category: cat, product: p}); skuMap.set(sku, p);
          }
          fileMap.set(fp, skuMap);
        } catch {}
      }
    } catch {}
  }
  console.log(`📂 Olemas ${map.size} toodet`);
  return {globalMap: map, fileMap};
}
function convertFile(filePath, globalMap, fileMap) {
  console.log(`\n📥 ${path.basename(filePath)}`);
  const wb = XLSX.readFile(filePath);
  for (const sheetName of wb.SheetNames) {
    const sheet = wb.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false });
    if (!rows.length) continue;
    const safeName = sheetName.toLowerCase().replace(/[^a-z0-9äöüõ]+/g,'-').replace(/^-|-$/g,'');
    let added=0, moved=0;
    for (let idx=0; idx<rows.length; idx++) {
      const row = rows[idx]; const sku = getSku(row, idx, sheetName); if (!sku) continue;
      const rawImage = findImageValue(row);
      const images = parseImageCell(rawImage);
      if (rawImage.includes(' ')) console.log(`  🔧 "${rawImage}" -> "${images.join(',')}"`);
      const newTopCat = String(row['topCategory'] || row['category'] || row['Kategooria'] || sheetName).trim();
      const newSafeCat = newTopCat.toLowerCase().replace(/[^a-z0-9äöüõ]+/g,'-').replace(/^-|-$/g,'');
      const existingEntry = globalMap.get(sku);
      if (existingEntry && existingEntry.category !== newSafeCat) {
        const oldFileMap = fileMap.get(existingEntry.filePath);
        if (oldFileMap) { oldFileMap.delete(sku); moved++; console.log(`  📦 Liigutatud ${sku}: ${existingEntry.category} -> ${newSafeCat}`); }
      }
      const newProduct = {
        id: sku, sku: sku,
        title: String(row['title'] || row['name'] || '').trim(),
        name: String(row['name'] || row['title'] || '').trim(),
        stock: Number(row['stock'] || 1), price: Number(row['price'] || 0),
        salePrice: row['salePrice'] ? Number(row['salePrice']) : undefined,
        topCategory: newTopCat, subCategory: String(row['subCategory'] || 'general'),
        categoryPath: [newTopCat], brand: String(row['brand'] || '').trim(),
        image: images[0] || '', images: images, rawImages: images,
        description: String(row['description'] || ''), shortDescription: String(row['shortDescription'] || ''),
      };
      if (!newProduct.title) continue;
      const targetFile = path.join(OUT_ROOT, newSafeCat, `${newSafeCat}.json`);
      if (!fileMap.has(targetFile)) { fs.mkdirSync(path.join(OUT_ROOT, newSafeCat), {recursive:true}); fileMap.set(targetFile, new Map()); }
      const targetMap = fileMap.get(targetFile);
      if (!globalMap.has(sku)) added++;
      targetMap.set(sku, {...(globalMap.get(sku)?.product || {}), ...newProduct});
      globalMap.set(sku, {filePath: targetFile, category: newSafeCat, product: newProduct});
    }
    console.log(`  ${safeName}: +${added} uut, 📦 ${moved} liigutatud`);
  }
}
console.log('🔧 Fixin tühikud -> _ kaustas', IMAGES_DIR);
if (fs.existsSync(IMAGES_DIR)) {
  for (const f of fs.readdirSync(IMAGES_DIR)) {
    if (f.includes(' ')) {
      const newName = f.trim().replace(/\s+/g, '_').replace(/__+/g, '_');
      if (f !== newName) {
        const oldPath = path.join(IMAGES_DIR, f); const newPath = path.join(IMAGES_DIR, newName);
        if (!fs.existsSync(newPath)) { fs.renameSync(oldPath, newPath); console.log(`  📝 "${f}" -> "${newName}"`); }
      }
    }
  }
}
const {globalMap, fileMap} = loadAllProducts();
const dirs=['data','.','public/data']; let files=[];
for (const d of dirs) if (fs.existsSync(d)) { try { fs.readdirSync(d).filter(f=>f.toLowerCase().endsWith('.xls')||f.toLowerCase().endsWith('.xlsx')).forEach(f=>files.push(path.join(d,f))); } catch {} }
files=[...new Set(files)]; console.log('XLS:', files);
files.forEach(f=>convertFile(f, globalMap, fileMap));
console.log('\n💾 Salvestan...');
for (const [fp, skuMap] of fileMap.entries()) {
  const arr = Array.from(skuMap.values()); fs.mkdirSync(path.dirname(fp), {recursive:true});
  fs.writeFileSync(fp, JSON.stringify(arr, null, 2)); console.log(`  ${path.relative('.',fp)}: ${arr.length}`);
}
console.log('\n✅ Valmis! Tühik -> _ tehtud!');
