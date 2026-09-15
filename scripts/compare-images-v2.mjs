#!/usr/bin/env node
// compare-images-v2 - parandatud parser
import fs from 'fs';

const file = 'src/data/productCatalog.ts';
if (!fs.existsSync(file)) {
  console.error('Ei leia', file);
  process.exit(1);
}
const txt = fs.readFileSync(file, 'utf8');

const byCat = {};
const oneImage = [];
const noImage = [];
let total = 0;

// iga toode = leidke title, categoryL1, categoryL2, images ühes bloki sees
// productCatalog on massiiv, tooted eraldatud },{ aga sees on nested {}
// Teeme lihtsamalt: otsime kõik images arrayd ja nende lähedalt kategooria

const productRegex = /title:\s*["'`]([^"'`]+)["'`][\s\S]*?categoryL1:\s*["'`]([^"'`]+)["'`][\s\S]*?categoryL2:\s*["'`]([^"'`]*?)["'`][\s\S]*?images:\s*\[([\s\S]*?)\]/g;
let m;
let found = 0;
while ((m = productRegex.exec(txt)) !== null) {
  found++;
  const title = m[1];
  const cat1 = m[2];
  const cat2 = m[3] || '';
  const imagesRaw = m[4];
  const imgs = [...imagesRaw.matchAll(/["'`]([^"'`]+)["'`]/g)].map(x=>x[1]).filter(s=>s.startsWith('http') || s.startsWith('/') || s.includes('.jpg') || s.includes('.png'));
  total++;
  const key = `${cat1}${cat2 ? ' > '+cat2 : ''}`;
  if (!byCat[key]) byCat[key] = { count:0, totalImages:0, one:0, zero:0, max:0, min:999, examples:[] };
  byCat[key].count++;
  byCat[key].totalImages += imgs.length;
  byCat[key].max = Math.max(byCat[key].max, imgs.length);
  byCat[key].min = Math.min(byCat[key].min, imgs.length);
  if (imgs.length===1) { byCat[key].one++; oneImage.push({title, cat1, cat2, img: imgs[0]}); }
  if (imgs.length===0) { byCat[key].zero++; noImage.push({title, cat1, cat2}); }
  if (byCat[key].examples.length<3) byCat[key].examples.push({title, imgs: imgs.length});
}

if (found===0) {
  // fallback v2 - otsi lihtsalt images
  console.log('Esimene regex ei leidnud, proovin fallback...');
  const imgRegex = /images:\s*\[([\s\S]*?)\]/g;
  let n=0;
  while ((m = imgRegex.exec(txt))!==null) {
    n++;
    const imagesRaw = m[1];
    const imgs = [...imagesRaw.matchAll(/["'`]([^"'`]+)["'`]/g)].map(x=>x[1]).filter(Boolean);
    // otsi 1000 märki tagasi kategooria
    const before = txt.slice(Math.max(0,m.index-1500), m.index);
    const cat1 = (before.match(/categoryL1:\s*["'`]([^"'`]+)["'`]/g) || []).pop();
    const cat1v = cat1 ? cat1.match(/["'`]([^"'`]+)["'`]/)[1] : 'Muu';
    const cat2 = (before.match(/categoryL2:\s*["'`]([^"'`]+)["'`]/g) || []).pop();
    const cat2v = cat2 ? cat2.match(/["'`]([^"'`]+)["'`]/)[1] : '';
    const titleMatch = before.match(/title:\s*["'`]([^"'`]+)["'`]/g);
    const title = titleMatch ? titleMatch[titleMatch.length-1].match(/["'`]([^"'`]+)["'`]/)[1] : `Toode ${n}`;
    total++;
    const key = `${cat1v}${cat2v ? ' > '+cat2v : ''}`;
    if (!byCat[key]) byCat[key] = { count:0, totalImages:0, one:0, zero:0, max:0, min:999, examples:[] };
    byCat[key].count++;
    byCat[key].totalImages += imgs.length;
    byCat[key].max = Math.max(byCat[key].max, imgs.length);
    byCat[key].min = Math.min(byCat[key].min, imgs.length);
    if (imgs.length===1) { byCat[key].one++; oneImage.push({title, cat1:cat1v, cat2:cat2v, img: imgs[0]}); }
    if (imgs.length===0) { byCat[key].zero++; }
  }
}

console.log(`\n=== PILDI VÕRDLUS V2 ===`);
console.log(`Tooteid kokku: ${total}, leitud mustreid: ${found}\n`);
console.log('Kategooria | Tooteid | Keskm | Min | Max | 1 pildiga | 0 pildiga');
console.log('--------------------------------------------------------------------------------');
for (const [cat,s] of Object.entries(byCat).sort((a,b)=>b[1].count-a[1].count)) {
  const avg = (s.totalImages/s.count).toFixed(1);
  console.log(`${cat} | ${s.count} | ${avg} | ${s.min} | ${s.max} | ${s.one} | ${s.zero}`);
}

console.log('\n--- NÄITED: 1 pildiga tooted (esimesed 30) ---');
oneImage.slice(0,30).forEach(p=> console.log(`- [${p.cat1}${p.cat2?' > '+p.cat2:''}] ${p.title}`));

console.log('\n--- SOOVITUS ---');
if (byCat['Laptops used'] || Object.keys(byCat).some(k=>k.toLowerCase().includes('laptops used'))) {
  console.log('Laptops used kategooria leitud - vaata kas XLSis on image2,image3 tühjad');
}
if (byCat['Desktop kasutatud / used'] || Object.keys(byCat).some(k=>k.toLowerCase().includes('desktop'))) {
  console.log('Desktop kasutatud leitud - sama teema');
}

fs.writeFileSync('pildi-raport-v2.json', JSON.stringify({total, byCat, oneImage: oneImage.slice(0,100)}, null, 2));
console.log('\nSalvestatud pildi-raport-v2.json');
