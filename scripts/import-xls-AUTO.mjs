// scripts/import-xls-AUTO.mjs - FINAL v4.1 - fix slugPath bug
import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';

const IMPORT_DIR = 'data/import';
const PRODUCTS_OUT = 'src/data/products';
const toSlug = s => String(s||'').toLowerCase().replace(/["']/g,'').replace(/[^a-z0-9öäüõ]+/gi,'-').replace(/^-|-$/g,'').replace(/--+/g,'-');
const normalize = row => { const o={}; for(let k in row) o[k.toLowerCase().trim()] = row[k]; return o; };
const gv = (r,...ns) => { for(let n of ns){ let v=r[n.toLowerCase()]; if(v!==undefined && String(v).trim()!=='') return String(v).trim(); } return ''; };

console.log('Loen XLS...');
let all=[], topMap=new Map(), delCats=new Set();

for(let f of fs.readdirSync(IMPORT_DIR).filter(f=>/\.xls/i.test(f))){
  const wb = xlsx.readFile(path.join(IMPORT_DIR,f));
  for(let sh of wb.SheetNames){
    const rows = xlsx.utils.sheet_to_json(wb.Sheets[sh],{defval:''});
    console.log(` ${f}/${sh}: ${rows.length}`);
    for(let raw of rows){
      const r=normalize(raw);
      let id=gv(r,'id');
      if(id==='-') continue;
      if(id==='='){
        let cat=gv(r,'categories','category','kategooria');
        let img=gv(r,'image','pilt');
        if(cat){
          let sp=cat.replace(/"/g,'').split('>').map(s=>toSlug(s.trim())).join('/');
          delCats.add(sp);
          let fp=path.join(PRODUCTS_OUT,sp+'.json');
          if(fs.existsSync(fp)) fs.unlinkSync(fp);
          console.log('  KUSTUTA',cat);
        }
        if(img){
          let fp=path.join('public/images',img);
          if(fs.existsSync(fp)) fs.unlinkSync(fp);
        }
        continue;
      }
      let sku=gv(r,'sku','id'); if(!sku) continue;
      let cats=gv(r,'categories'); if(!cats) continue;
      cats=cats.replace(/"/g,'').trim();
      let parts=cats.split('>').map(s=>s.trim()).filter(Boolean);
      if(parts.length===0) continue;
      let slugParts=parts.map(toSlug);
      let slugPath=slugParts.join('/');
      if(delCats.has(slugPath)) continue;
      let title=gv(r,'title','name')||sku;
      let L1=parts[0]||'Muu';
      let L2=parts[1]||'Üldine';
      let L3=parts[2]||'';
      let imgName=gv(r,'image');
      let price=Number(gv(r,'regular price','sale price','price'))||0;
      all.push({
        id:sku, sku, title, name:title, slug:toSlug(title)+'-'+toSlug(sku),
        brand:gv(r,'brand'), price, regularPrice:price,
        category:L1, categories:cats, categorySlug:slugPath,
        categoryL1:L1, topCategory:L1, categoryL2:L2, subCategory:L2, categoryL3:L3||undefined,
        image: imgName? `/images/${imgName}` : '/images/placeholder.webp',
        images: imgName? [`/images/${imgName}`] : [],
        stock:1, condition: cats.toLowerCase().includes('used')? 'used':'new'
      });
      let topSlug=slugParts[0];
      if(!topMap.has(topSlug)) topMap.set(topSlug,{name:parts[0], slug:topSlug, subcategories:new Map()});
      if(slugParts.length>1){
        let subSlug=slugParts[slugParts.length-1];
        let subMap=topMap.get(topSlug).subcategories;
        if(!subMap.has(subSlug)) subMap.set(subSlug,{name:parts[parts.length-1], slug:subSlug, count:0, file:`${slugPath}.json`, slugPath:slugPath});
        subMap.get(subSlug).count++;
      }
    }
  }
}
for(let [topSlug, top] of topMap){
  for(let [subSlug, sub] of top.subcategories){
    let items=all.filter(p=>p.categorySlug===sub.slugPath);
    if(items.length===0) continue;
    let out=path.join(PRODUCTS_OUT,sub.slugPath+'.json');
    fs.mkdirSync(path.dirname(out),{recursive:true});
    fs.writeFileSync(out,JSON.stringify(items,null,2));
    sub.count=items.length;
    console.log(' ->',sub.slugPath,items.length);
  }
}
let treeObj={};
for(let [topSlug, top] of topMap){
  let subs=Array.from(top.subcategories.values()).filter(s=>!delCats.has(s.slugPath)&&s.count>0);
  treeObj[topSlug]={name:top.name, slug:topSlug, subcategories: subs.map(s=>({name:s.name, slug:s.slug, count:s.count, file:s.file, slugPath:s.slugPath}))};
}
fs.writeFileSync('src/data/category-tree.json',JSON.stringify(treeObj,null,2));

let imps=[], spreads=[];
for(let topSlug in treeObj){
  for(let sub of treeObj[topSlug].subcategories){
    let sp = sub.slugPath || sub.file.replace('.json','');
    let vn='p_'+sp.replace(/[^a-z0-9]/g,'_');
    imps.push(`import ${vn} from './products/${sp}.json';`);
    spreads.push(`...${vn}`);
  }
}
fs.writeFileSync('src/data/productCatalog.ts',`// AUTO ${all.length}\n${imps.join('\n')}\n\nexport const allProducts = [\n ${spreads.join(',\n ')}\n] as any[];\n`);
console.log(`\n✅ VALMIS! ${all.length} toodet, ${Object.keys(treeObj).length} kategooriat`);
