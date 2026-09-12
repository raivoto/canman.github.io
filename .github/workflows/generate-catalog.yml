import fs from 'fs';
import path from 'path';

const PRODUCTS_ROOT = 'src/data/products';
const OUT_FILE = 'src/data/productCatalog/autoProducts.ts';

function getAllJsons(dir) {
  let out = [];
  if(!fs.existsSync(dir)) return out;
  for(const e of fs.readdirSync(dir, {withFileTypes:true})) {
    const p = path.join(dir, e.name);
    if(e.isDirectory()) out.push(...getAllJsons(p));
    else if(e.name.endsWith('.json')) out.push(p);
  }
  return out;
}

const files = getAllJsons(PRODUCTS_ROOT);
let all = [];
for(const f of files) {
  try {
    const j = JSON.parse(fs.readFileSync(f,'utf8'));
    const arr = Array.isArray(j)? j : [j];
    all.push(...arr);
  } catch(e){ console.log('skip',f,e.message)}
}

// Fix images - kui pilti pole, pane placeholder
all = all.map(p=>({
 ...p,
  images: p.images?.length? p.images : [p.imageUrl || '/images/placeholder.jpg'],
  imageUrl: p.imageUrl || p.images?.[0] || '/images/placeholder.jpg'
}));

const content = `// AUTO-GENERATED - ära muuda käsitsi! Genereeritud ${new Date().toISOString()}
// ${files.length} failist, ${all.length} toodet
export const autoProducts: any[] = ${JSON.stringify(all, null, 2)};
`;

fs.mkdirSync(path.dirname(OUT_FILE), {recursive:true});
fs.writeFileSync(OUT_FILE, content);
console.log(`Genereeritud ${OUT_FILE} -> ${all.length} toodet ${files.length} failist`);
