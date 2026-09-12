import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

const IMPORT_DIR = 'data/import';
const OUT_DIR = 'src/data/products';

function slugify(s){
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').trim() || 'general';
}

if (!fs.existsSync(IMPORT_DIR)) {
  console.log('Kaust puudub:', IMPORT_DIR);
  process.exit(0);
}

const files = fs.readdirSync(IMPORT_DIR).filter(f => /\.xlsx?$/.test(f));
if (files.length === 0) {
  console.log('XLS faile pole kaustas', IMPORT_DIR);
  process.exit(0);
}

for (const file of files) {
  const fullPath = path.join(IMPORT_DIR, file);
  console.log(`\n=== Import: ${file} (${new Date().toISOString()}) ===`);

  const wb = XLSX.readFile(fullPath);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet);

  const grouped = {}; // topSlug -> subSlug -> products[]

  for (const r of rows) {
    if (!r.sku &&!r.title &&!r.Categories) continue;

    const cats = (r.Categories || 'Määramata').split('>').map(s => s.trim()).filter(Boolean);
    const top = cats[0] || 'muu';
    const sub = cats[1] || 'general';

    const topSlug = slugify(top);
    const subSlug = slugify(sub);

    if (!grouped[topSlug]) grouped[topSlug] = {};
    if (!grouped[topSlug][subSlug]) grouped[topSlug][subSlug] = [];

    grouped[topSlug][subSlug].push({
      id: String(r.sku || r.id || ''),
      sku: String(r.sku || ''),
      title: r.title || r.name || '',
      name: r.name || r.title || '',
      stock: parseInt(r.stock) || 1,
      price: parseFloat(r['Regular price']) || null,
      salePrice: parseFloat(r['Sale price']) || null,
      finalPrice: parseFloat(r['Sale price']) || parseFloat(r['Regular price']) || null,
      topCategory: top,
      subCategory: sub,
      categoryPath: cats,
      brand: r.Brand || '',
      tags: r.Tags || '',
      color: r.Color || '',
      images: (r.image || '').split(',').map(s => s.trim()).filter(Boolean).map(im => `/images/${im}`),
      rawImages: (r.image || '').split(',').map(s => s.trim()).filter(Boolean),
      description: r.Description || '',
      shortDescription: r['Product short description'] || '',
      specs: r.jutt || ''
    });
  }

  for (const [topSlug, subs] of Object.entries(grouped)) {
    for (const [subSlug, items] of Object.entries(subs)) {
      const dir = path.join(OUT_DIR, topSlug);
      fs.mkdirSync(dir, { recursive: true });
      const outPath = path.join(dir, `${subSlug}.json`);

      // Merge - ära kirjuta üle kui toode juba olemas
      let existing = [];
      if (fs.existsSync(outPath)) {
        try { existing = JSON.parse(fs.readFileSync(outPath, 'utf8')); } catch {}
      }
      const merged = [...existing];
      for (const it of items) {
        if (!merged.find(m => m.sku === it.sku)) merged.push(it);
        else {
          const idx = merged.findIndex(m => m.sku === it.sku);
          merged[idx] = it; // uuenda kui sama sku
        }
      }

      fs.writeFileSync(outPath, JSON.stringify(merged, null, 2), 'utf8');
      console.log(` -> ${topSlug}/${subSlug}.json (${merged.length} toodet)`);
    }
  }
}

console.log('\nImport valmis!');
