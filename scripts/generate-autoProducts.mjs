import fs from 'fs';
import path from 'path';

const PRODUCTS_ROOT = 'src/data/products';
const OUT_FILE = 'src/data/productCatalog/autoProducts.ts';

function parseImageColumn(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map(s=>String(s).trim()).filter(Boolean);
  const str = String(raw).trim();
  if (!str) return [];
  return str.split(/[,;|\n]+/).map(s=>s.trim()).filter(Boolean);
}

function findImages(p) {
  const vals = [p.image, p.imageUrl, p.images, p.rawImages, p.photo, p.picture, p.Pilt];
  for (const v of vals) {
    const arr = parseImageColumn(v);
    if (arr.length) return arr;
  }
  return [];
}

function getAllJsons(dir) {
  let out = [];
  if(!fs.existsSync(dir)) {
    console.warn(`⚠️  Kausta ei leitud (vahele jäetud): ${dir}`);
    return out;
  }
  try {
    for(const e of fs.readdirSync(dir, {withFileTypes:true})) {
      const p = path.join(dir, e.name);
      if(e.isDirectory()) {
        out.push(...getAllJsons(p));
      } else if(e.name.endsWith('.json')) {
        out.push(p);
      }
    }
  } catch(e) {
    console.warn(`⚠️  Kausta lugemine ebaõnnestus ${dir}: ${e.message}`);
  }
  return out;
}

function placeholder(title, cat) {
  const t = encodeURIComponent((title||'Desktop').substring(0,22));
  const c = (cat||'').toLowerCase();
  let bg = '3B82F6';
  if (c.includes('3-gen')) bg = '1E40AF';
  else if (c.includes('monitor')) bg = '8B5CF6';
  else if (c.includes('laptop')) bg = '10B981';
  return `https://via.placeholder.co/400x300/${bg}/FFFFFF?text=${t}`;
}

const files = getAllJsons(PRODUCTS_ROOT);
if (files.length === 0) {
  console.warn(`⚠️  JSON tooteid ei leitud kaustast ${PRODUCTS_ROOT} - teen tühja kataloogi`);
}

let all = [];
for(const f of files) {
  try {
    const j = JSON.parse(fs.readFileSync(f,'utf8'));
    const arr = Array.isArray(j)? j : [j];
    all.push(...arr);
  } catch(e){
    console.warn(`⚠️  Fail vigane (vahele jäetud): ${f} - ${e.message}`);
  }
}

all = all.map(p => {
  const imgs = findImages(p);
  const has = imgs.length > 0;
  const cat = p.topCategory || p.categoryL1 || (p.categoryPath && p.categoryPath[0]) || '';
  const thumb = has ? imgs[0] : placeholder(p.title || p.name, cat);
  const finalImgs = has ? imgs : [thumb];
  
  return {
    ...p,
    price: Number(p.price || p.finalPrice || p.salePrice || 0),
    salePrice: p.salePrice != null ? Number(p.salePrice) : undefined,
    finalPrice: p.finalPrice != null ? Number(p.finalPrice) : undefined,
    image: thumb,
    imageUrl: thumb,
    thumbnail: thumb,
    gridImage: thumb,
    images: finalImgs,
    gallery: finalImgs,
    isPlaceholder: !has,
  };
});

const content = `// AUTO-GENERATED ${new Date().toISOString()} - ${files.length} failist, ${all.length} toodet
export const autoProducts: any[] = ${JSON.stringify(all, null, 2)};
`;

try {
  fs.mkdirSync(path.dirname(OUT_FILE), {recursive:true});
  fs.writeFileSync(OUT_FILE, content);
  console.log(`✅ ${OUT_FILE} -> ${all.length} toodet, ${all.filter(x=>x.isPlaceholder).length} placeholderiga`);
} catch(e) {
  console.warn(`⚠️  Väljundfaili kirjutamine ebaõnnestus (vahele jäetud): ${e.message}`);
}
console.log('✅ generate-autoProducts valmis');
