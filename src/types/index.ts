export type Condition = 'Uus' | 'Kasutatud'; // New vs Used / Refurbished

export type StockStatus = 'Laos' | 'Viimased eksemplarid' | 'Tellimisel';

export interface Product {
  id: string;
  title: string;
  categoryL1: string; // e.g. 'Arvutid'
  categoryL2: string; // e.g. 'Desktop PC'
  categoryL3?: string; // e.g. 'Gaming'
  price: number; // EUR
  oldPrice?: number;
  condition: Condition;
  grade?: 'A' | 'A-' | 'B'; // For used products
  stock: StockStatus;
  stockCount: number;
  specs: {
    cpu?: string;
    ram?: string;
    storage?: string;
    gpu?: string;
    screen?: string;
    os?: string;
    warranty?: string;
    [key: string]: string | undefined;
  };
  shortSpec: string; // e.g. "i5-4590 8GB 500GB W10P"
  description: string;
  imageUrl: string;
  brand: string;
  isPopular?: boolean;
}

export interface CategoryL3 {
  id: string;
  name: string;
}

export interface CategoryL2 {
  id: string;
  name: string;
  subcategories?: CategoryL3[];
}

export interface CategoryL1 {
  id: string;
  name: string;
  subcategories: CategoryL2[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type PaymentMethod = 'arve' | 'sularahas';
export type DeliveryMethod = 'pakk' | 'pood';

export interface CustomerInfo {
  fullName: string;
  companyName?: string;
  regCode?: string;
  vatNumber?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes?: string;
}

export interface OrderDetails {
  orderNumber: string;
  createdAt: string;
  customer: CustomerInfo;
  items: CartItem[];
  paymentMethod: PaymentMethod;
  deliveryMethod: DeliveryMethod;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
}
