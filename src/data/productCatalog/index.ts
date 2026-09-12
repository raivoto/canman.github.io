import { arvutid } from './arvutid';
import { komponendid } from './komponendid';
import { printerid } from './printerid';
import { autoProducts } from './autoProducts';

export const allProducts: any[] = [...arvutid, ...komponendid, ...printerid, ...autoProducts];
export const products: any[] = allProducts;
export const PRODUCTS: any[] = allProducts;
