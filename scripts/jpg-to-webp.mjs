import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dirs = ['public/images', 'public', 'images'];
let total = 0;
let saved = 0;

for (const dir of dirs) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => 
    f.toLowerCase().endsWith('.jpg') || 
    f.toLowerCase().endsWith('.jpeg') || 
    f.toLowerCase().endsWith('.png')
  );

  for (const file of files) {
    const input = path.join(dir, file);
    const output = input.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    
    if (fs.existsSync(output)) continue; // juba tehtud

    try {
      const before = fs.statSync(input).size;
      await sharp(input)
        .webp({ quality: 80 }) // 80 on parim kvaliteet/suurus
        .toFile(output);
      const after = fs.statSync(output).size;
      total++;
      saved += (before - after);
      console.log(`✓ ${file} ${(before/1024).toFixed(0)}KB -> ${(after/1020).toFixed(0)}KB webp (${Math.round((1-after/before)*100)}% väiksem)`);
    } catch (e) {
      console.log(`X ${file}: ${e.message}`);
    }
  }
}

console.log(`\nValmis! ${total} pilti tehtud webp-ks, sääst ${ (saved/1024/1024).toFixed(1)}MB`);

// Uuenda ka productCatalog.ts et kasutaks webp
const catalogPath = 'src/data/productCatalog.ts';
if (fs.existsSync(catalogPath)) {
  let content = fs.readFileSync(catalogPath, 'utf8');
  const origLen = content.length;
  // asenda .jpg/.png -> .webp kui webp fail eksisteerib
  content = content.replace(/(["'`])([^"'`]*\.(jpg|jpeg|png))\1/gi, (match, q, url) => {
    const webpUrl = url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    const localPath = 'public' + (webpUrl.startsWith('/') ? webpUrl : '/' + webpUrl);
    if (fs.existsSync(localPath) || fs.existsSync(webpUrl)) {
      return `${q}${webpUrl}${q}`;
    }
    return match;
  });
  if (content.length !== origLen) {
    fs.writeFileSync(catalogPath, content);
    console.log('Uuendasin productCatalog.ts -> webp lingid');
  }
}