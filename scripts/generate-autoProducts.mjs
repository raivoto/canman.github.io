 
import fs from 'fs';
import path from 'path';

const PRODUCTS_ROOT = 'src/data/products';
const OUT_FILE = 'src/data/productCatalog/autoProducts.ts';

// Grupi placeholderid - pane /public/images/ kausta need pildid
const GROUP_PLACEHOLDERS = {
  'desktop': '/images/placeholder-desktop.jpg',
  'laptop': '/images/placeholder-laptop.jpg',
  'monitor': '/images/placeholder-monitor.jpg',
  'arvutid': '/images/placeholder-desktop.jpg',
  'mäl': '/images/placeholder-ram.jpg',
  'ram': '/images/placeholder-ram.jpg',
  'dimm': '/images/placeholder-ram.jpg',
  'combo': '/images/placeholder-combo.jpg',
  'protsessor': '/images/placeholder-cpu.jpg',
  'default': '/images/placeholder.jpg'
};

function getGroupPlaceholder(categoryL1, categoryL2, categoryL3) {
  const all = `${categoryL1 || ''} ${categoryL2 || ''} ${categoryL3 || ''}`.toLowerCase();
  for (const key of Object.keys(GROUP_PLACEHOLDERS)) {
    if (all.includes(key)) return GROUP_PLACEHOLDERS[key];
  }
  return GROUP_PLACEHOLDERS.default;
}

function parseImageColumn(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter(Boolean).map(s => String(s).trim());
  
  let str = String(raw).trim();
  if (!str) return [];
  
  // WP stiilis: "img1.jpg, img2.jpg, img3.jpg" või "img1.jpg|img2.jpg" või reavahetus
  // Toetame: , ; | \n 
  const parts = str.split(/[,;|\n]+/).map(s => s.trim()).filter(Boolean);
  
  // Kui on ainult 1 ja see sisaldab tühikuid mitte koma - ära spliti
  if (parts.length === 1 && str.includes(' ') && !str.includes('http')) {
    // Võib olla 1 failinimi tühikuga? Jäta nagu on
    return [str];
  }
  
  return parts;
}

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

all = all.map(p => {
  // 1. Loe image veerg - seal võib olla 5 pilti
  const rawImage = p.image || p.imageUrl || p.images || '';
  const parsedImages = parseImageColumn(rawImage);
  
  // 2. Kui images array juba olemas, ühenda
  let allImages = [...parsedImages];
  if (Array.isArray(p.images) && p.images.length) {
    // Lisa need mis pole juba sees
    for (const img of p.images) {
      const s = String(img).trim();
      if (s && !allImages.includes(s)) allImages.push(s);
    }
  }
  
  // 3. Grupi placeholder kui pilti pole
  const placeholder = getGroupPlaceholder(p.categoryL1, p.categoryL2, p.categoryL3);
  const finalImages = allImages.length ? allImages : [placeholder];
  
  // 4. Esimene pilt = Grid thumb (väiksem vaade)
  const thumb = finalImages[0];
  const gridThumb = thumb; // hiljem saad teha /thumbs/ versiooni kui tahad
  
  return {
    ...p,
    // Hinnad kindlasti numbrid - ei crashi toFixed
    price: Number(p.price || p.finalPrice || p.salePrice || 0),
    salePrice: p.salePrice != null ? Number(p.salePrice) : undefined,
    finalPrice: p.finalPrice != null ? Number(p.finalPrice) : undefined,
    
    // WP stiilis pildid
    image: thumb, // grid view esimene
    imageUrl: thumb,
    thumbnail: gridThumb, // grid thumb
    gridImage: gridThumb,
    images: finalImages, // kõik 5 pilti detailvaates
    gallery: finalImages, // WP gallery
    
    // Info kas placeholder
    isPlaceholder: finalImages[0] === placeholder,
    placeholderType: allImages.length ? null : placeholder
  };
});

const content = `// AUTO-GENERATED WP-STYLE - ${new Date().toISOString()}
// ${files.length} failist, ${all.length} toodet
// image veerg = 5 pilti, esimene = grid thumb, kui puudub -> grupi placeholder

export const autoProducts: any[] = ${JSON.stringify(all, null, 2)};
`;

fs.mkdirSync(path.dirname(OUT_FILE), {recursive:true});
fs.writeFileSync(OUT_FILE, content);
console.log(`✅ Genereeritud ${OUT_FILE}`);
console.log(`📦 ${all.length} toodet ${files.length} failist`);
console.log(`🖼️  Näited:`);
all.slice(0,3).forEach(x => {
  console.log(`- ${x.title || x.name}: ${x.images.length} pilti, thumb=${x.thumbnail}, placeholder=${x.isPlaceholder}`);
});
