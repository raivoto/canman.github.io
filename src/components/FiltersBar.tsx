'use client';

import React from 'react';
import { SlidersHorizontal, RotateCcw, Tag } from 'lucide-react';
import { Condition } from '../types';

interface FiltersBarProps {
  conditionFilter: 'all' | Condition;
  setConditionFilter: (condition: 'all' | Condition) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  minPrice: number;
  maxPrice: number;
  setMinPrice: (val: number) => void;
  setMaxPrice: (val: number) => void;
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
  availableBrands: string[];
  totalResults: number;
  onReset: () => void;
}

export const FiltersBar: React.FC<FiltersBarProps> = ({
  conditionFilter,
  setConditionFilter,
  sortBy,
  setSortBy,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  selectedBrand,
  setSelectedBrand,
  availableBrands,
  totalResults,
  onReset,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-100">
        {/* Left: Filter Title & Count */}
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-4 h-4 text-[#0e4da4]" />
          <span className="font-bold text-sm text-slate-800 uppercase tracking-wide">
            Filtreeri ja Sorteeri
          </span>
          <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
            {totalResults} toodet
          </span>
        </div>

        {/* Right: Sort By Dropdown */}
        <div className="flex items-center space-x-2">
          <label htmlFor="sort-select" className="text-xs font-semibold text-slate-600">
            Sorteeri:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-800 text-xs font-medium rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-[#0e4da4] focus:outline-none"
          >
            <option value="popular">Populaarsemad (Popular)</option>
            <option value="price-asc">Hind: odavam enne (€ → €€)</option>
            <option value="price-desc">Hind: kallim enne (€€ → €)</option>
            <option value="name-asc">Nimi: A - Z</option>
          </select>
        </div>
      </div>

      {/* Filter Options Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3">
        {/* Condition Filter Toggle */}
        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">
            Seisukord (Condition):
          </label>
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 w-full">
            <button
              onClick={() => setConditionFilter('all')}
              className={`flex-1 py-1 px-2 text-xs font-semibold rounded-md transition ${
                conditionFilter === 'all'
                  ? 'bg-[#0e4da4] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kõik
            </button>
            <button
              onClick={() => setConditionFilter('Uus')}
              className={`flex-1 py-1 px-2 text-xs font-semibold rounded-md transition ${
                conditionFilter === 'Uus'
                  ? 'bg-[#0e4da4] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Uus
            </button>
            <button
              onClick={() => setConditionFilter('Kasutatud')}
              className={`flex-1 py-1 px-2 text-xs font-semibold rounded-md transition ${
                conditionFilter === 'Kasutatud'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kasutatud
            </button>
          </div>
        </div>

        {/* Brand Dropdown Filter */}
        <div>
          <label htmlFor="brand-select" className="text-xs font-semibold text-slate-600 block mb-1">
            Kaubamärk (Brand):
          </label>
          <select
            id="brand-select"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs font-medium rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-[#0e4da4] focus:outline-none"
          >
            <option value="">Kõik kaubamärgid</option>
            {availableBrands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range Inputs */}
        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">
            Hinnavahemik (€):
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              placeholder="Min €"
              value={minPrice || ''}
              onChange={(e) => setMinPrice(Number(e.target.value) || 0)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs px-2 py-1.5 rounded-lg focus:ring-1 focus:ring-[#0e4da4] focus:outline-none"
            />
            <span className="text-slate-400 text-xs">-</span>
            <input
              type="number"
              placeholder="Max €"
              value={maxPrice || ''}
              onChange={(e) => setMaxPrice(Number(e.target.value) || 1000)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs px-2 py-1.5 rounded-lg focus:ring-1 focus:ring-[#0e4da4] focus:outline-none"
            />
          </div>
        </div>

        {/* Reset Button */}
        <div className="flex items-end">
          <button
            onClick={onReset}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2 px-3 rounded-lg border border-slate-300 transition flex items-center justify-center space-x-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Tühjenda filtrid</span>
          </button>
        </div>
      </div>
    </div>
  );
};
