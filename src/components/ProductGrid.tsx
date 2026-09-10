'use client';

import React from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '../types';
import { PackageSearch } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onResetFilters: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onSelectProduct,
  onResetFilters,
}) => {
  if (products.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
        <div className="w-16 h-16 bg-blue-50 text-[#0e4da4] rounded-full flex items-center justify-center mx-auto mb-4">
          <PackageSearch className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">
          Tooteid ei leitud (No products found)
        </h3>
        <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
          Sinu valitud filtritele või otsingule ei vasta ükski toode meie laos. Proovi valida mõni teine kategooria või tühjendada filtrid.
        </p>
        <button
          onClick={onResetFilters}
          className="bg-[#0e4da4] hover:bg-[#0a3a7d] text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition shadow-sm"
        >
          Tühjenda filtrid & vaata kõiki tooteid
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* 4-column Product Grid (1 col mobile -> 2 tablet -> 3 md -> 4 xl) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelectProduct={onSelectProduct}
          />
        ))}
      </div>
    </div>
  );
};
