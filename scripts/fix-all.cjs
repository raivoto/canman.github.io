const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  content = content.replace(/([a-zA-Z0-9_$\.]+)\.toLowerCase\(\)/g, (m, obj) => {
    if (obj.includes('safeLower') || obj.includes('String(')) return m;
    return `String(${obj}||'').toLowerCase()`;
  });
  content = content.replace(/([a-zA-Z0-9_$\.\[\]]+)\.toFixed\(/g, (m, obj) => {
    if (obj.includes('Number(') || obj.includes('||')) return m;
    return `Number(${obj}||0).toFixed(`;
  });
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed:', filePath);
  }
}

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) walk(full);
    else if (full.endsWith('.tsx') || full.endsWith('.ts')) {
      if (full.includes('node_modules')) continue;
      fixFile(full);
    }
  }
}

walk('src');
console.log('Done fixing');
