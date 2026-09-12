import { arvutid } from './arvutid';
import { komponendid } from './komponendid';
import { printerid } from './printerid';

// --- Uued Excel tooted ---
import laptop14Used from '../products/laptops-used/laptop-14-used.json';
import laptop15Used from '../products/laptops-used/laptop-15-used.json';
import laptop16Used from '../products/laptops-used/laptop-16-used.json';
import laptop14New from '../products/laptops-new/laptop-14-new.json';
import laptop15New from '../products/laptops-new/laptop-15-new.json';

const toArray = (m: any) => Array.isArray(m)? m : m? [m] : [];

const excelProducts: any[] = [
 ...toArray(laptop14Used),
 ...toArray(laptop15Used),
 ...toArray(laptop16Used),
 ...toArray(laptop14New),
 ...toArray(laptop15New),
].filter(Boolean).map((p: any) => ({
 ...p,
  // kui pilti pole, pane placeholder
  images: p.images?.length? p.images : [p.imageUrl || '/images/placeholder.jpg'],
  imageUrl: p.imageUrl || p.images?.[0] || '/images/placeholder.jpg',
}));

export const allProducts: any[] = [...arvutid,...komponendid,...printerid,...excelProducts];
export const products: any[] = allProducts;
export const PRODUCTS: any[] = allProducts;
