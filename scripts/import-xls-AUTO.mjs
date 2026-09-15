// scripts/import-xls-AUTO.mjs - FINAL FIX v2 - lowercase + - and =
import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';

const IMPORT_DIR = 'data/import';
const PRODUCTS_OUT = 'src/data/products';
const toSlug = s => String(s||'').toLowerCase().replace(/["']/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

const normalize = row => {
  const o={};
  for(let k in row) o[k.toLowerCase().trim()] = row[k];
  return o;
};
const gv = (r,...ns) => {
  for(let n of ns){
    let v=r[n.toLowerCase()];
    if(v!==undefined && String(v).trim()!=='') return String(v).trim();
  }
  return '';
};

console.log('Loen XLS...');
let all=[], map=new Map(), delCats=new Set();

if(!fs.existsSync(IMPORT_DIR)){ console.log('No import dir'); process.exit(0); }

for(let f of fs.readdirSync(IMPORT_DIR).filter(f=>/\.xls/i.test(f))){
  const wb = xlsx.readFile(path.join(IMPORT_DIR,f));
  for(let sh of wb.SheetNames){
    const rows = xlsx.utils.sheet_to_json(wb.Sheets[sh],{defval:''});
    for(let raw of rows){
      const r=normalize(raw);
      let id=gv(r,'id');
      if(id==='-'){ console.log('SKIP -',gv(r,'sku','title')); continue; }
      if(id==='='){
        let cat=gv(r,'categories','category','kategooria');
        let img=gv(r,'image','pilt');
        if(cat){
          console.log('KUSTUTA CAT',cat);
          let sp=cat.split('>').map(s=>toSlug(s)).join('/');
          delCats.add(sp);
          delCats.add(cat);
          let fp=path.join(PRODUCTS_OUT,sp+'.json');
          if(fs.existsSync(fp)) fs.unlinkSync(fp);
        }
        if(img){
          let fp=path.join('public/images',img);
          if(fs.existsSync(fp)) fs.unlinkSync(fp);
        }
        continue;
      }
      let sku=gv(r,'sku','id'); if(!sku) continue;
      let cats=gv(r,'categories'); if(!cats) continue;
      let parts=cats.split('>').map(s=>s.trim()).filter(Boolean);
      let slugParts=parts.map(toSlug);
      let slugPath=slugParts.join('/');
      if(delCats.has(slugPath)) continue;
      all.push({id:sku, sku, title:gv(r,'title','name'), name:gv(r,'name','title'), brand:gv(r,'brand'), categories:cats, categorySlug:slugPath, image: gv(r,'image')? `/images/${gv(r,'image')}` : '', price: Number(gv(r,'regular price','price'))||0, stock:1});
      if(!map.has(slugPath)) map.set(slugPath,{name:parts[parts.length-1], path:parts, slugPath, count:0});
      map.get(slugPath).count++;
    }
  }
}

for(let [slugPath,info] of map){
  if(delCats.has(slugPath)) continue;
  let items=all.filter(p=>p.categorySlug===slugPath);
  if(items.length===0) continue;
  let out=path.join(PRODUCTS_OUT,slugPath+'.json');
  fs.mkdirSync(path.dirname(out),{recursive:true});
  fs.writeFileSync(out,JSON.stringify(items,null,2));
  console.log('->',slugPath+'.json',items.length);
}

let tree=Array.from(map.values()).filter(v=>!delCats.has(v.slugPath));
fs.writeFileSync('src/data/category-tree.json',JSON.stringify(tree,null,2));
fs.writeFileSync('src/data/categories.ts',`// AUTO ${all.length} toodet - genereeritud XLS-st\nexport const categories = ${JSON.stringify(tree,null,2)};\n`);

let imps=[], spreads=[];
for(let [sp] of map){
  if(delCats.has(sp)) continue;
  let vn='p_'+sp.replace(/[^a-z0-9]/g,'_');
  imps.push(`import ${vn} from './products/${sp}.json';`);
  spreads.push(`...${vn}`);
}
fs.writeFileSync('src/data/productCatalog.ts',`// AUTO ${all.length} toodet\n${imps.join('\n')}\n\nexport const allProducts = [\n ${spreads.join(',\n ')}\n] as any[];\n`);

console.log(`\n✅ Valmis! ${all.length} toodet, ${map.size} kategooriat`);
if(delCats.size>0) console.log('Kustutatud kategooriad:', [...delCats]);
