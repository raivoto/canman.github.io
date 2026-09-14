"use client"
import { useMemo } from 'react';

export function useFilteredProducts(products: any[], filters: any) {
  return useMemo(() => {
    if (!products) return [];
    let result = [...products];
    
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      result = result.filter((p: any) => 
        p.name?.toLowerCase().includes(s) || 
        p.sku?.toLowerCase().includes(s)
      );
    }
    return result;
  }, [products, filters]);
}
