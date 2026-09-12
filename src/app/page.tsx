'use client';

import React, { useState, useMemo } from 'react';
import { Header } from '../components/Header';
import { CategorySidebar } from '../components/CategorySidebar';
import { FiltersBar } from '../components/FiltersBar';
import { ProductGrid } from '../components/ProductGrid';
import { ProductModal } from '../components/ProductModal';
import { CartDrawer } from '../components/CartDrawer';
import { CheckoutModal } from '../components/CheckoutModal';
import { InvoiceView } from '../components/InvoiceView';
import { ServicesModal } from '../components/ServicesModal';
import { Footer } from '../components/Footer';
import { PRODUCTS } from '../data/products';
import { Product, Condition, OrderDetails } from '../types';
import { Wrench, ShieldCheck, Truck, MapPin, ChevronRight } from 'lucide-react';

export default function Home() {
  // Navigation & Category filter state
  const [selectedL1, setSelectedL1] = useState<string | null>(null);
  const [selectedL2, setSelectedL2] = useState<string | null>(null);
  const [selectedL3, setSelectedL3] = useState<string | null>(null);

  // Search & Filter options state
  const [searchQuery, setSearchQuery] = useState('');
  const [conditionFilter, setConditionFilter] = useState<'all' | Condition>('all');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [sortBy, setSortBy] = useState('popular');

  // Active Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderDetails | null>(null);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  // Category selection handler
  const handleSelectCategory = (
    l1: string | null,
    l2: string | null,
    l3: string | null
  ) => {
    setSelectedL1(l1);
    setSelectedL2(l2);
    setSelectedL3(l3);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedL1(null);
    setSelectedL2(null);
    setSelectedL3(null);
    setSearchQuery('');
    setConditionFilter('all');
    setSelectedBrand('');
    setMinPrice(0);
    setMaxPrice(1000);
    setSortBy('popular');
  };

  // Extract available brands for the dropdown
  const availableBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    PRODUCTS.forEach((p) => brandsSet.add(p.brand));
    return Array.from(brandsSet).sort();
  }, []);

  // Filtered & Sorted products pipeline
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesBrand = p.brand.toLowerCase().includes(query);
        const matchesSpecs = p.shortSpec.toLowerCase().includes(query);
        const matchesCat = p.categoryL1.toLowerCase().includes(query) || p.categoryL2.toLowerCase().includes(query);
        if (!matchesTitle && !matchesBrand && !matchesSpecs && !matchesCat) {
          return false;
        }
      }

      // 2. Category Level 1
      if (selectedL1 && p.categoryL1.toLowerCase() !== selectedL1.toLowerCase()) {
        return false;
      }

      // 3. Category Level 2
      if (selectedL2 && p.categoryL2.toLowerCase() !== selectedL2.toLowerCase()) {
        return false;
      }

      // 4. Category Level 3
      if (selectedL3 && (!p.categoryL3 || p.categoryL3.toLowerCase() !== selectedL3.toLowerCase())) {
        return false;
      }

      // 5. Condition (Uus / Kasutatud)
      if (conditionFilter !== 'all' && p.condition !== conditionFilter) {
        return false;
      }

      // 6. Brand
      if (selectedBrand && p.brand !== selectedBrand) {
        return false;
      }

      // 7. Price range
      if (minPrice > 0 && p.price < minPrice) return false;
      if (maxPrice < 1000 && p.price > maxPrice) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name-asc') return a.title.localeCompare(b.title);
      if (sortBy === 'popular') return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      return 0;
    });
  }, [
    searchQuery,
    selectedL1,
    selectedL2,
    selectedL3,
    conditionFilter,
    selectedBrand,
    minPrice,
    maxPrice,
    sortBy,
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Header with Search and Contacts */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenServicesModal={() => setIsServicesOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {/* Top Breadcrumb & Hero Banner */}
        <div className="mb-6">
          <div className="flex items-center text-xs text-slate-500 space-x-1.5 mb-3 overflow-x-auto py-1">
            <span
              onClick={handleResetFilters}
              className="hover:text-[#0e4da4] cursor-pointer font-medium"
            >
              Avaleht (Home)
            </span>
            {selectedL1 && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span
                  onClick={() => handleSelectCategory(selectedL1, null, null)}
                  className="hover:text-[#0e4da4] cursor-pointer font-medium text-slate-700"
                >
                  {selectedL1}
                </span>
              </>
            )}
            {selectedL2 && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span
                  onClick={() => handleSelectCategory(selectedL1, selectedL2, null)}
                  className="hover:text-[#0e4da4] cursor-pointer font-medium text-slate-700"
                >
                  {selectedL2}
                </span>
              </>
            )}
            {selectedL3 && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span className="font-bold text-[#0e4da4]">{selectedL3}</span>
              </>
            )}
          </div>

          {/* Value Proposition Highlights Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gradient-to-r from-[#0e4da4] to-[#0c3a7a] text-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-yellow-300" />
              </div>
              <div>
                <h4 className="font-bold text-xs">Lille 14-4 Tallinn 10614 Harjumaa</h4>
                <p className="text-[11px] text-blue-100">Kaubale saab ise tasuta jÃ¤rele tulla</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5 text-yellow-300" />
              </div>
              <div>
                <h4 className="font-bold text-xs">Kiire Tarne 1-2 TööpÃ¤eva</h4>
                <p className="text-[11px] text-blue-100">Omniva & DPD pakiautomaadid (â‚¬4.90)</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <Wrench className="w-5 h-5 text-yellow-300" />
              </div>
              <div>
                <h4 className="font-bold text-xs">Arvutiremont & IT-Abi</h4>
                <p className="text-[11px] text-blue-100">Tel. +372 5652062 • Canman töökoda</p>
              </div>
            </div>
          </div>
        </div>

        {/* Catalog Layout: Left Category Sidebar (280px) + Right Product Grid (4 columns) */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Category Sidebar (fixed 280px on desktop) */}
          <CategorySidebar
            selectedL1={selectedL1}
            selectedL2={selectedL2}
            selectedL3={selectedL3}
            onSelectCategory={handleSelectCategory}
            products={PRODUCTS}
          />

          {/* Right Main Catalog Area */}
          <div className="flex-1 min-w-0">
            {/* Filters Bar */}
            <FiltersBar
              conditionFilter={conditionFilter}
              setConditionFilter={setConditionFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              minPrice={minPrice}
              maxPrice={maxPrice}
              setMinPrice={setMinPrice}
              setMaxPrice={setMaxPrice}
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
              availableBrands={availableBrands}
              totalResults={filteredProducts.length}
              onReset={handleResetFilters}
            />

            {/* Product Grid (4 columns) */}
            <ProductGrid
              products={filteredProducts}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onResetFilters={handleResetFilters}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer onOpenServicesModal={() => setIsServicesOpen(true)} />

      {/* Modals & Drawers */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <CartDrawer onOpenCheckout={() => setIsCheckoutOpen(true)} />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderCompleted={(order) => {
          setIsCheckoutOpen(false);
          setCompletedOrder(order);
        }}
      />

      {completedOrder && (
        <InvoiceView
          order={completedOrder}
          onClose={() => setCompletedOrder(null)}
        />
      )}

      <ServicesModal
        isOpen={isServicesOpen}
        onClose={() => setIsServicesOpen(false)}
      />
    </div>
  );
}

