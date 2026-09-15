
import fs from 'fs';
import path from 'path';
import pkg from 'xlsx';
const XLSX = pkg.default || pkg;

const IMPORT_DIRS = ['data/import', 'data', '.', 'public/data'];
const OUT_ROOT = 'src/data/products';
const CAT_FILE = 'src/data/categories.ts';
const TREE_JSON = 'src/data/category-tree.json';

function slugify(s){
  return s.toLowerCase()
    .replace(/[ä]/g,'a').replace(/[ö]/g,'o').replace(/[ü]/g,'u').replace(/[õ]/g,'o')
    .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}
function sanitizeFileName(name){
  return name.trim().replace(/\s+/g,'_').replace(/[^a-zA-Z0-9_\-\.]/g,'_');
}
function parseCategories(raw){
  if(!raw) return [];
  return String(raw).split('>').map(s=>s.trim()).filter(Boolean);
}

function findCategoriesField(row){
  for(const k of Object.keys(row)){
    if(k.toLowerCase().trim()==='categories') return row[k];
  }
  return '';
}

const tree = {}; // topSlug -> {name, slug, subMap}
const grouped = {}; // topSlug -> subSlug -> items

let totalRows=0;
for(const dir of IMPORT_DIRS){
  if(!fs.existsSync(dir)) continue;
  for(const file of fs.readdirSync(dir)){
    if(!file.toLowerCase().endsWith('.xls') && !file.toLowerCase().endsWith('.xlsx')) continue;
    if(file.startsWith('~$')) continue;
    const fp = path.join(dir,file);
    console.log('Loen', fp);
    const wb = XLSX.readFile(fp);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet,{defval:''});
    for(const r of rows){
      const rawCat = findCategoriesField(r);
      if(!rawCat) continue;
      const parts = parseCategories(rawCat);
      if(parts.length===0) continue;
      const top = parts[0];
      const sub = parts[1] || 'general';
      const sub2 = parts[2] || '';
      const topSlug = slugify(top);
      const subSlug = slugify(sub);
      
      if(!tree[topSlug]){
        tree[topSlug]={name: top, slug: topSlug, subMap: {}};
      }
      if(sub && !tree[topSlug].subMap[subSlug]){
        tree[topSlug].subMap[subSlug]={name: sub, slug: subSlug, sub2Map:{}, count:0};
      }
      if(sub2){
        const sub2Slug = slugify(sub2);
        if(!tree[topSlug].subMap[subSlug].sub2Map[sub2Slug]){
          tree[topSlug].subMap[subSlug].sub2Map[sub2Slug]={name: sub2, slug: sub2Slug, count:0};
        }
        tree[topSlug].subMap[subSlug].sub2Map[sub2Slug].count++;
      }
      if(tree[topSlug].subMap[subSlug]) tree[topSlug].subMap[subSlug].count++;

      if(!grouped[topSlug]) grouped[topSlug]={};
      const finalSubSlug = sub2 ? `${subSlug}--${slugify(sub2)}` : subSlug;
      // For laptops: we want to keep original sub name as final file, like laptop-14-used
      // But we store under subSlug
      if(!grouped[topSlug][subSlug]) grouped[topSlug][subSlug]=[];
      
      grouped[topSlug][subSlug].push({
        id: String(r.sku||r.id), sku: String(r.sku||r.id), 
        title: r.title, name: r.name,
        stock: r.stock, price: r['Regular price'], salePrice: r['Sale price'],
        categoryPath: parts,
        topCategory: top, subCategory: sub, sub2Category: sub2,
        brand: r.Brand, tags: r.Tags, color: r.Color,
        images: (r.image||'').split(',').map(s=>s.trim()).filter(Boolean).map(im=>`/images/${sanitizeFileName(im)}`),
        description: r.Description, shortDescription: r['Product short description'],
        specs: r.jutt
      });
      totalRows++;
    }
  }
}

// 1. Write product jsons
for(const [topSlug, subs] of Object.entries(grouped)){
  for(const [subSlug, items] of Object.entries(subs)){
    const dir = path.join(OUT_ROOT, topSlug);
    fs.mkdirSync(dir,{recursive:true});
    fs.writeFileSync(path.join(dir, `${subSlug}.json`), JSON.stringify(items,null,2));
    console.log(` -> ${topSlug}/${subSlug}.json (${items.length})`);
  }
}

// 2. Build final categoryTree structure
const finalTree = {};
for(const [topSlug, topObj] of Object.entries(tree)){
  const subs = Object.values(topObj.subMap).map(s=>{
    const deeper = Object.values(s.sub2Map);
    return {
      name: s.name,
      slug: s.slug,
      count: s.count,
      file: `${topSlug}/${s.slug}.json`,
      subcategories: deeper.length? deeper.map(d=>({name:d.name, slug:d.slug, count:d.count, file:`${topSlug}/${s.slug}--${d.slug}.json`})) : undefined
    };
  });
  finalTree[topSlug]={name: topObj.name, slug: topSlug, subcategories: subs};
}

fs.mkdirSync(path.dirname(TREE_JSON),{recursive:true});
fs.writeFileSync(TREE_JSON, JSON.stringify(finalTree,null,2));
console.log('Category tree ->', TREE_JSON);

// 3. Generate src/data/categories.ts AUTOMATICALY - NO MANUAL EDIT
function toId(slug){ return slug; }

let tsContent = `import { CategoryL1 } from '../types';

// AUTO-GENERATED from kaupade xls - DO NOT EDIT MANUALLY
// Generated at ${new Date().toISOString()}

export const CATEGORIES: CategoryL1[] = [
`;

for(const [topSlug, topObj] of Object.entries(finalTree)){
  tsContent+= `  {\n    id: '${topSlug}',\n    name: '${topObj.name.replace(/'/g,"\\'")}',\n`;
  if(topObj.subcategories && topObj.subcategories.length){
    tsContent+= `    subcategories: [\n`;
    for(const sub of topObj.subcategories){
      if(sub.subcategories){
        tsContent+= `      {\n        id: '${sub.slug}',\n        name: '${sub.name.replace(/'/g,"\\'")}',\n        subcategories: [\n`;
        for(const sub2 of sub.subcategories){
          tsContent+= `          { id: '${sub2.slug}', name: '${sub2.name.replace(/'/g,"\\'")}' },\n`;
        }
        tsContent+= `        ],\n      },\n`;
      } else {
        tsContent+= `      { id: '${sub.slug}', name: '${sub.name.replace(/'/g,"\\'")}' },\n`;
      }
    }
    tsContent+= `    ],\n`;
  }
  tsContent+= `  },\n`;
}
tsContent+= `];\n`;

fs.writeFileSync(CAT_FILE, tsContent);
console.log('Categories.ts AUTO ->', CAT_FILE);
console.log(`\\n✅ Valmis! ${totalRows} toodet, ${Object.keys(finalTree).length} pealkategooriat. Nüüd categories.ts tuleb XLS-st!`);
