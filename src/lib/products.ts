import fs from 'fs';
import path from 'path';

export type Product = {
  sku: string;
  title: string;
  name: string;
  price: number|null;
  salePrice: number|null;
  finalPrice: number|null;
  brand: string;
  images: string[];
  description: string;
};

export function getAllCategories() {
  const base = path.join(process.cwd(), 'src/data/products');
  if (!fs.existsSync(base)) return [];
  return fs.readdirSync(base).filter(f => fs.statSync(path.join(base,f)).isDirectory());
}

export function getSubcategories(top: string) {
  const dir = path.join(process.cwd(), `src/data/products/${top}`);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f=>f.endsWith('.json')).map(f=>f.replace('.json',''));
}

export function getProducts(top: string, sub: string) {
  const p = path.join(process.cwd(), `src/data/products/${top}/${sub}.json`);
  if (!fs.existsSync(p)) return [];
  return JSON.parse(fs.readFileSync(p,'utf8'));
}

export function getAllProducts() {
  const all: any[] = [];
  for (const top of getAllCategories()) {
    for (const sub of getSubcategories(top)) {
      all.push(...getProducts(top, sub));
    }
  }
  return all;
}
