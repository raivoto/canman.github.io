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
  return '';
}
function getSku(row, idx, sheetName) {
  return String(row['sku']||row['SKU']||row['kood']||row['title']||row['name']||`${sheetName}-${idx}`).trim();
}
function getId(row) {
  const raw = row['id'] ?? row['ID'] ?? row['Id'] ?? '';
  return String(raw).trim();
}

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
  return {globalMap: map, fileMap};
}

function deleteProductAndImages(sku, globalMap, fileMap) {
  const entry = globalMap.get(sku);
  if (!entry) { console.log(`  ⚠️ Kustutamiseks ei leitud SKU ${sku}`); return; }
  // kustuta pildid
  const imgs = entry.product.images || [entry.product.image];
  for (const img of imgs) {
    if (!img) continue;
    const imgPath = path.join(IMAGES_DIR, path.basename(img));
    if (fs.existsSync(imgPath)) {
      fs.unlinkSync(imgPath);
      console.log(`  🗑️ Kustutatud pilt: ${imgPath}`);
    }
  }
  // kustuta jsonist
  const fm = fileMap.get(entry.filePath);
  if (fm) fm.delete(sku);
  globalMap.delete(sku);
  console.log(`  🗑️ Kustutatud kaup SKU ${sku} failist ${path.relative('.', entry.filePath)}`);
}

function convertFile(filePath, globalMap, fileMap) {
  console.log(`\n📥 ${path.basename(filePath)}`);
  const wb = XLSX.readFile(filePath);
  for (const sheetName of wb.SheetNames) {
    const sheet = wb.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false });
    if (!rows.length) continue;
    for (let idx=0; idx<rows.length; idx++) {
      const row = rows[idx];
      const rawId = getId(row);
      const sku = getSku(row, idx, sheetName);
      if (!sku && rawId !== '_' && rawId !== '-') continue;

      // ERINEVAD ID REEGLID
      if (rawId === '_') {
        // KUSTUTA - SKU on sku veerus
        const targetSku = String(row['sku']||row['SKU']||sku).trim();
        deleteProductAndImages(targetSku, globalMap, fileMap);
        continue;
      }
      if (rawId === '-') {
        // PEIDA - ära näita
        console.log(`  🙈 Peidetud (ID=-): ${sku} - ${row['title']||''}`);
        // kustuta olemasolevast kui oli avalik
        if (globalMap.has(sku)) {
          const entry = globalMap.get(sku);
          const fm = fileMap.get(entry.filePath);
          if (fm) fm.delete(sku);
          globalMap.delete(sku);
        }
        continue;
      }

      const rawImage = findImageValue(row);
      const images = parseImageCell(rawImage);
      const newTopCat = String(row['topCategory'] || row['category'] || sheetName).trim();
      const newSafeCat = newTopCat.toLowerCase().replace(/[^a-z0-9äöüõ]+/g,'-').replace(/^-|-$/g,'');
      
      // KATEGOORIA LIIKUMINE
      const existingEntry = globalMap.get(sku);
      if (existingEntry && existingEntry.category !== newSafeCat && rawId !== '5') {
        const oldFileMap = fileMap.get(existingEntry.filePath);
        if (oldFileMap) { oldFileMap.delete(sku); console.log(`  📦 Liigutatud ${sku}: ${existingEntry.category} -> ${newSafeCat}`); }
      }

      const isFavorite = rawId === '5';
      const newProduct = {
        id: sku, sku: sku,
        title: String(row['title'] || row['name'] || '').trim(),
        name: String(row['name'] || row['title'] || '').trim(),
        stock: Number(row['stock'] || 1), price: Number(row['price'] || 0),
        salePrice: row['salePrice'] ? Number(row['salePrice']) : undefined,
        topCategory: isFavorite ? 'favorites' : newTopCat,
        subCategory: String(row['subCategory'] || 'general'),
        categoryPath: isFavorite ? ['favorites', newTopCat] : [newTopCat],
        brand: String(row['brand'] || '').trim(),
        image: images[0] || '', images: images, rawImages: images,
        description: String(row['description'] || ''), shortDescription: String(row['shortDescription'] || ''),
        isFavorite: isFavorite,
        featured: isFavorite,
        hidden: false,
      };
      if (!newProduct.title) continue;

      const targetCat = isFavorite ? 'favorites' : newSafeCat;
      const targetFile = path.join(OUT_ROOT, targetCat, `${targetCat}.json`);
      if (!fileMap.has(targetFile)) { fs.mkdirSync(path.join(OUT_ROOT, targetCat), {recursive:true}); fileMap.set(targetFile, new Map()); }
      const targetMap = fileMap.get(targetFile);
      targetMap.set(sku, {...(globalMap.get(sku)?.product || {}), ...newProduct});
      globalMap.set(sku, {filePath: targetFile, category: targetCat, product: newProduct});
      
      if (isFavorite) console.log(`  ⭐ Lemmik (ID=5) esilehele: ${sku} ${newProduct.title}`);
    }
  }
}

// 1. Fix tühikud -> _
if (fs.existsSync(IMAGES_DIR)) {
  for (const f of fs.readdirSync(IMAGES_DIR)) {
    if (f.includes(' ')) {
      const newName = sanitizeFileName(f);
      if (f !== newName) {
        const oldPath = path.join(IMAGES_DIR, f); const newPath = path.join(IMAGES_DIR, newName);
        if (!fs.existsSync(newPath)) fs.renameSync(oldPath, newPath);
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
console.log('\n✅ Valmis! - = peidetud, _ = kustutatud, 5 = favorites!');
