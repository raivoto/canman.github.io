'use client';

import React from 'react';
import Image from 'next/image';
import { ShoppingCart, Eye, CheckCircle2, AlertTriangle, Clock, Shield } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
}) => {
  const { addToCart } = useCart();

  const renderStockBadge = () => {
    switch (product.stock) {
      case 'Laos':
        return (
          <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Laos ({product.stockCount} tk)</span>
          </span>
        );
      case 'Viimased eksemplarid':
        return (
          <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>Viimased ({product.stockCount} tk)</span>
          </span>
        );
      case 'Tellimisel':
      default:
        return (
          <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>Tellimisel (1-3 päeva)</span>
          </span>
        );
    }
  };

  return (
    <div className="group bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between relative hover:border-blue-300">
      {/* Top Image & Badges */}
      <div className="relative w-full pt-[75%] bg-slate-50 overflow-hidden cursor-pointer" onClick={() => onSelectProduct(product)}>
         <img
  src={`/canman.github.io${product.imageUrl || (product as any).images?.[0] || '/images/placeholder.jpg'}`}
  alt={product.title}
  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300"
/>
        />

        {/* Condition Badge (Uus vs Kasutatud) */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.condition === 'Uus' ? (
            <span className="bg-[#0e4da4] text-white font-bold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider shadow">
              UUS
            </span>
          ) : (
            <span className="bg-amber-600 text-white font-bold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider shadow flex items-center gap-1">
              <span>KASUTATUD</span>
              {product.grade && (
                <span className="bg-amber-800 text-amber-100 px-1 rounded text-[9px]">
                  GRADE {product.grade}
                </span>
              )}
            </span>
          )}
        </div>

        {/* Discount Badge if oldPrice exists */}
        {product.oldPrice && (
          <div className="absolute top-2 right-2 bg-red-600 text-white font-bold text-[10px] px-1.5 py-0.5 rounded shadow">
            -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
          </div>
        )}

        {/* Hover Quick View Trigger Overlay */}
        <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
          <span className="bg-white text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center space-x-1 hover:bg-slate-50">
            <Eye className="w-3.5 h-3.5 text-[#0e4da4]" />
            <span>Vaata detaile</span>
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category line */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1">
            <span className="uppercase tracking-wider font-semibold text-blue-700">{product.brand}</span>
            <span className="truncate max-w-[120px]">{product.categoryL2}</span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onSelectProduct(product)}
            className="text-sm font-bold text-slate-900 hover:text-[#0e4da4] transition cursor-pointer line-clamp-2 min-h-[40px] leading-snug"
          >
            {product.title}
          </h3>

          {/* Short Specs Tag (REQUIRED by prompt e.g. i5-4590 8GB 500GB W10P) */}
          <div className="mt-2 mb-3 bg-slate-100/90 text-slate-700 text-[11px] font-mono px-2 py-1 rounded border border-slate-200/80 truncate">
            <span className="font-semibold text-slate-800">{product.shortSpec}</span>
          </div>
        </div>

        {/* Stock, Price & Cart Footer */}
        <div className="pt-3 border-t border-slate-100">
          <div className="mb-2">
            {renderStockBadge()}
          </div>

          <div className="flex items-end justify-between gap-2">
            <div>
              {product.oldPrice && (
                <span className="text-xs text-slate-400 line-through block">
                  €{product.oldPrice.toFixed(2)}
                </span>
              )}
              <div className="text-lg font-extrabold text-[#0e4da4]">
                €{product.price.toFixed(2)}
                <span className="text-[10px] text-slate-400 font-normal ml-1">sis. KM</span>
              </div>
            </div>

            <button
              onClick={() => addToCart(product)}
              className="bg-[#0e4da4] hover:bg-[#0a3a7d] active:scale-95 text-white p-2.5 rounded-lg font-semibold text-xs transition shadow-sm flex items-center space-x-1"
              title="Lisa ostukorvi"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Lisa</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
