import { arvutid } from './arvutid';
import { komponendid } from './komponendid';
import { printerid } from './printerid';

// proovime laadida autoProducts kui olemas
let autoProducts: any[] = [];
try {
 // @ts-ignore
  const mod = require('./autoProducts');
  autoProducts = mod.autoProducts || [];
} catch {}

export const allProducts: any[] = [...arvutid,...komponendid,...printerid,...autoProducts];
export const products: any[] = allProducts;
export const PRODUCTS: any[] = allProducts;
