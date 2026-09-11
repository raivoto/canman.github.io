import { arvutid } from './arvutid';
import { komponendid } from './komponendid';
import { printerid } from './printerid';
export const allProducts: any[] = [...arvutid, ...komponendid, ...printerid];
export const products: any[] = allProducts;
export const PRODUCTS: any[] = allProducts;
