import { arvutid } from './catalog/arvutid';
import { komponendid } from './catalog/komponendid';
import { printerid } from './catalog/printerid';

export const allProducts = [...arvutid, ...komponendid, ...printerid];
export const products = allProducts;
