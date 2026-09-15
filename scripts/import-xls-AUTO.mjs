// scripts/import-xls-AUTO.mjs - PARANDATUD - loeb kõik pildi veerud
import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';

const xlsFiles = fs.readdirSync('.').filter(f=>f.endsWith('.xls') || f.endsWith('.xlsx'))
 .concat(fs.readdirSync('public').filter(f=>f.endsWith('.xls')||f.endsWith('.xlsx')).map(f=>'public/'+f));

const file = xlsFiles[0] || 'tooted.xlsx';
console.log('Loen:', file);

const wb = xlsx.readFile(file);
const sheet = wb.Sheets[wb.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(sheet);

const products = rows.map(row => {
  // leia kõik veerud mis on pildid
  const images = [];
  for (const key of Object.keys(row)) {
    const lk = key.toLowerCase();
    if (lk.includes('pilt') || lk.includes('image') || lk.includes('jpg') || lk.includes('foto') || lk.includes('picture')) {
      const val = String(row[key]||'').trim();
      if (val) {
        // võib olla mitu linki ühes veerus komaga eraldatud
        val.split(/[,;\n]+/).forEach(v=>{
          const vv = v.trim();
          if (vv && (vv.startsWith('http') || vv.includes('.jpg') || vv.includes('.png'))) images.push(vv);
        });
      }
    }
  }
  return {
    title: row['Nimetus'] || row['Title'] || row['Toode'] || '',
    categoryL1: row['Kategooria'] || row['Category'] || row['KATEGOORIA'] || '',
    categoryL2: row['Alamkategooria'] || row['Subcategory'] || '',
    price: row['Hind'] || row['Price'] || 0,
    images: [...new Set(images)] // unikaalsed
  };
}).filter(p=>p.title);

console.log(`Kokku ${products.length} toodet`);
const byCat = {};
products.forEach(p=>{
  const k = p.categoryL1 || 'Muu';
  if (!byCat[k]) byCat[k] = {count:0, one:0, multi:0};
  byCat[k].count++;
  if (p.images.length<=1) byCat[k].one++; else byCat[k].multi++;
});
console.log('Kategooriad:', byCat);

// Kirjuta kataloog
const out = `export const allProducts = ${JSON.stringify(products, null, 2)};\n`;
fs.writeFileSync('src/data/productCatalog.ts', out);
console.log('Salvestatud src/data/productCatalog.ts - nüüd on kõigil mitu pilti!');
