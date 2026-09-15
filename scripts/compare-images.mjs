#!/usr/bin/env node
// compare-images.mjs - võrdleb pilte kategooriate lõikes
import fs from 'fs';
import path from 'path';

const catalogPaths = [
  'src/data/productCatalog.ts',
  'src/data/productCatalog.js',
  'src/data/products.ts',
  'data/productCatalog.json',
  'public/catalog.json'
];

let products = [];
let loadedFrom = '';

// proovi leida kataloog
for (const p of catalogPaths) {
  if (fs.existsSync(p)) {
    const content = fs.readFileSync(p, 'utf8');
    try {
      if (p.endsWith('.json')) {
        products = JSON.parse(content);
      } else {
        // otsi allProducts array TS failist regexiga
        const match = content.match(/allProducts\s*=\s*\[([\s\S]*?)\]\s*as\s*const|export const allProducts[\s\S]*?=\s*\[([\s\S]*?)\];/);
        // fallback: evali lihtsalt - otsi pilte otse
        const imgRegex = /["']images["']\s*:\s*\[([^\]]*)\]/g;
        const titleRegex = /["']title["']\s*:\s*["']([^"']+)["']/g;
        // kui ei saa parsida, proovime importida dünaamiliselt
        console.log(`Leidsin ${p} aga proovin importida...`);
      }
      loadedFrom = p;
      break;
    } catch (e) {}
  }
}

// Dünaamiline import kui ts/js
if (products.length === 0) {
  try {
    const mod = await import(path.resolve('src/data/productCatalog.ts').replace('.ts','.js'));
    // kui on ts, proovi js buildi
  } catch {}
  // Otsi kõik jsonid mis võivad olla kataloog
  const allJsons = [];
  function findJson(dir) {
    if (!fs.existsSync(dir)) return;
    for (const f of fs.readdirSync(dir)) {
      const fp = path.join(dir, f);
      if (fs.statSync(fp).isDirectory()) findJson(fp);
      else if (fp.endsWith('.json') && fp.includes('catalog')) allJsons.push(fp);
    }
  }
  findJson('src');
  findJson('public');
  console.log('Otsin katalooge:', allJsons);
}

if (products.length === 0) {
  // Loe otse productCatalog.ts toorelt ja parsi käsitsi
  const tsPath = 'src/data/productCatalog.ts';
  if (fs.existsSync(tsPath)) {
    const txt = fs.readFileSync(tsPath, 'utf8');
    // tükelda toodeteks - iga { ... } mis sisaldab images
    const productBlocks = txt.split(/}\s*,\s*{/);
    products = productBlocks.map(block => {
      const title = (block.match(/title:\s*["'`]([^"'`]+)["'`]/) || [])[1] || 'N/A';
      const cat1 = (block.match(/categoryL1:\s*["'`]([^"'`]+)["'`]/) || block.match(/topCategory:\s*["'`]([^"'`]+)["'`]/) || [])[1] || 'Muu';
      const cat2 = (block.match(/categoryL2:\s*["'`]([^"'`]+)["'`]/) || [])[1] || '';
      const imagesMatch = block.match(/images:\s*\[([\s\S]*?)\]/);
      let images = [];
      if (imagesMatch) {
        const imgs = imagesMatch[1].match(/["'`]([^"'`]+)["'`]/g);
        if (imgs) images = imgs.map(s => s.replace(/["'`]/g,''));
      }
      return { title, categoryL1: cat1, categoryL2: cat2, images };
    }).filter(p=>p.title!=='N/A');
    loadedFrom = tsPath + ' (parsed manually)';
  }
}

console.log(`\n=== PILDI VÕRDLUS ===`);
console.log(`Laetud: ${loadedFrom}`);
console.log(`Tooteid kokku: ${products.length}\n`);

const byCat = {};
const oneImage = [];
const noImage = [];
const imageMap = new Map(); // pilt -> tooted

products.forEach(p => {
  const key = `${p.categoryL1 || 'Muu'}${p.categoryL2 ? ' > '+p.categoryL2 : ''}`;
  if (!byCat[key]) byCat[key] = { count:0, totalImages:0, one:0, zero:0, max:0, min:999 };
  byCat[key].count++;
  const imgCount = (p.images||[]).length;
  byCat[key].totalImages += imgCount;
  byCat[key].max = Math.max(byCat[key].max, imgCount);
  byCat[key].min = Math.min(byCat[key].min, imgCount);
  if (imgCount===1) { byCat[key].one++; oneImage.push(p); }
  if (imgCount===0) { byCat[key].zero++; noImage.push(p); }
  (p.images||[]).forEach(img => {
    if (!imageMap.has(img)) imageMap.set(img, []);
    imageMap.get(img).push(p.title);
  });
});

console.log('KATEGOORIATE KAUPA:');
console.log('Kategooria | Tooteid | Keskm pilte | Min | Max | 1 pildiga | 0 pildiga');
console.log('--------------------------------------------------------------------------------');
Object.entries(byCat).sort((a,b)=>b[1].count-a[1].count).forEach(([cat, s])=>{
  const avg = (s.totalImages/s.count).toFixed(1);
  console.log(`${cat} | ${s.count} | ${avg} | ${s.min} | ${s.max} | ${s.one} | ${s.zero}`);
});

console.log('\n--- TOOTED AINULT 1 PILDIGA (probleemsed Laptops used / Desktop used) ---');
oneImage.slice(0,50).forEach(p=>{
  console.log(`- [${p.categoryL1} > ${p.categoryL2}] ${p.title} -> ${(p.images||[])[0]}`);
});
if (oneImage.length>50) console.log(`... ja veel ${oneImage.length-50}`);

console.log('\n--- DUPLIKAAT PILDID (sama pilt mitmel tootel) ---');
let dups = 0;
for (const [img, titles] of imageMap.entries()) {
  if (titles.length>1) {
    dups++;
    if (dups<=20) console.log(`${img} -> ${titles.length} tootel: ${titles.slice(0,3).join(', ')}`);
  }
}
if (dups===0) console.log('Duplikaate ei leitud');
else console.log(`Kokku duplikaat pilte: ${dups}`);

console.log('\n--- SOOVITUS ---');
console.log('Kui Desktop used / Laptops used on ainult 1 pilt, siis XLS failis on tühjad image2, image3 veerud.');
console.log('Vercel import-xls-AUTO.mjs loeb ainult esimese pildi. Lisa XLSi veergudesse image_2, image_3 lingid või pane public/images kausta lisapildid sama nimega nagu _1, _2');

// Salvesta raport
fs.writeFileSync('pildi-raport.json', JSON.stringify({ byCat, oneImageCount: oneImage.length, noImageCount: noImage.length, duplicateCount: dups, oneImage: oneImage.slice(0,100) }, null, 2));
console.log('\nRaport salvestatud: pildi-raport.json');
