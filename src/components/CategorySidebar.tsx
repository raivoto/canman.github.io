'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Folder, FolderOpen, Layers, Check } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { Product } from '../types';

interface CategorySidebarProps {
  selectedL1: string | null;
  selectedL2: string | null;
  selectedL3: string | null;
  onSelectCategory: (l1: string | null, l2: string | null, l3: string | null) => void;
  products: Product[];
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  selectedL1,
  selectedL2,
  selectedL3,
  onSelectCategory,
  products,
}) => {
  // Track open state for top-level categories
  const [openL1, setOpenL1] = useState<Record<string, boolean>>({
    'arvutid': true,
    'arvutid-kasutatud': true,
    'apple-arvutid': false,
    'lisaseadmed': false,
    'monitorid': false,
    'printerid': false,
    'arvutiosad': true,
    'toiteseadmed': false,
  });

  // Track open state for level-2 subcategories
  const [openL2, setOpenL2] = useState<Record<string, boolean>>({
    'desktop-pc': true,
    'notebooks': true,
    'protsessorid': true,
    'malu-desktop': true,
    'videokaardid': true,
  });

  const toggleL1 = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenL1((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleL2 = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenL2((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Helper to count products matching categories
  const getL1Count = (l1Name: string) => {
    return products.filter((p) => p.categoryL1.toLowerCase() === l1Name.toLowerCase()).length;
  };

  const getL2Count = (l1Name: string, l2Name: string) => {
    return products.filter(
      (p) =>
        p.categoryL1.toLowerCase() === l1Name.toLowerCase() &&
        p.categoryL2.toLowerCase() === l2Name.toLowerCase()
    ).length;
  };

  const getL3Count = (l1Name: string, l2Name: string, l3Name: string) => {
    return products.filter(
      (p) =>
        p.categoryL1.toLowerCase() === l1Name.toLowerCase() &&
        p.categoryL2.toLowerCase() === l2Name.toLowerCase() &&
        p.categoryL3 && p.categoryL3.toLowerCase() === l3Name.toLowerCase()
    ).length;
  };

  return (
    <aside className="w-full lg:w-[280px] flex-shrink-0 bg-white border border-slate-200 rounded-xl p-4 shadow-sm h-fit">
      {/* Category Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
        <div className="flex items-center space-x-2 text-[#0e4da4] font-bold text-sm tracking-wide uppercase">
          <Layers className="w-4 h-4" />
          <span>KATEGOORIAD</span>
        </div>
        {(selectedL1 || selectedL2 || selectedL3) && (
          <button
            onClick={() => onSelectCategory(null, null, null)}
            className="text-[11px] text-blue-600 hover:text-blue-800 hover:underline font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* All Products Option */}
      <button
        onClick={() => onSelectCategory(null, null, null)}
        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between mb-2 transition ${
          !selectedL1 && !selectedL2 && !selectedL3
            ? 'bg-[#0e4da4] text-white shadow-sm'
            : 'text-slate-700 hover:bg-slate-100'
        }`}
      >
        <span>Kõik tooted (All Products)</span>
        <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
          !selectedL1 && !selectedL2 && !selectedL3
            ? 'bg-blue-800 text-white'
            : 'bg-slate-200 text-slate-600'
        }`}>
          {products.length}
        </span>
      </button>

      {/* 3-Level Collapsible Tree */}
      <div className="space-y-1 text-xs">
        {CATEGORIES.map((catL1) => {
          const isL1Active = selectedL1 === catL1.name && !selectedL2 && !selectedL3;
          const isL1ParentActive = selectedL1 === catL1.name;
          const isOpen = openL1[catL1.id];
          const countL1 = getL1Count(catL1.name);

          return (
            <div key={catL1.id} className="border-b border-slate-100 last:border-b-0 pb-1">
              {/* Level 1 Item */}
              <div
                onClick={() => onSelectCategory(catL1.name, null, null)}
                className={`group flex items-center justify-between px-2.5 py-2 rounded-md cursor-pointer transition select-none ${
                  isL1Active
                    ? 'bg-[#0e4da4] text-white font-bold'
                    : isL1ParentActive
                    ? 'bg-blue-50 text-[#0e4da4] font-semibold'
                    : 'text-slate-800 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-2 flex-1 min-w-0 pr-1">
                  {isOpen ? (
                    <FolderOpen className={`w-3.5 h-3.5 flex-shrink-0 ${isL1Active ? 'text-white' : 'text-blue-600'}`} />
                  ) : (
                    <Folder className={`w-3.5 h-3.5 flex-shrink-0 ${isL1Active ? 'text-white' : 'text-slate-400'}`} />
                  )}
                  <span className="truncate">{catL1.name}</span>
                </div>

                <div className="flex items-center space-x-1">
                  {countL1 > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                        isL1Active
                          ? 'bg-blue-800 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {countL1}
                    </span>
                  )}
                  {catL1.subcategories && catL1.subcategories.length > 0 && (
                    <button
                      onClick={(e) => toggleL1(catL1.id, e)}
                      className={`p-1 hover:bg-black/10 rounded transition ${
                        isL1Active ? 'text-white' : 'text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      {isOpen ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Level 2 Subcategories Accordion */}
              {isOpen && catL1.subcategories && (
                <div className="ml-3 pl-2 border-l border-slate-200 mt-1 space-y-1">
                  {catL1.subcategories.map((catL2) => {
                    const isL2Active = selectedL1 === catL1.name && selectedL2 === catL2.name && !selectedL3;
                    const isL2ParentActive = selectedL1 === catL1.name && selectedL2 === catL2.name;
                    const isL2Open = openL2[catL2.id];
                    const countL2 = getL2Count(catL1.name, catL2.name);

                    return (
                      <div key={catL2.id}>
                        {/* Level 2 Item */}
                        <div
                          onClick={() => onSelectCategory(catL1.name, catL2.name, null)}
                          className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition select-none ${
                            isL2Active
                              ? 'bg-blue-600 text-white font-semibold'
                              : isL2ParentActive
                              ? 'bg-blue-100/70 text-[#0e4da4] font-medium'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span className="truncate">{catL2.name}</span>
                          <div className="flex items-center space-x-1">
                            {countL2 > 0 && (
                              <span
                                className={`text-[10px] px-1 rounded ${
                                  isL2Active
                                    ? 'bg-blue-800 text-white'
                                    : 'bg-slate-200/60 text-slate-600'
                                }`}
                              >
                                {countL2}
                              </span>
                            )}
                            {catL2.subcategories && catL2.subcategories.length > 0 && (
                              <button
                                onClick={(e) => toggleL2(catL2.id, e)}
                                className={`p-0.5 rounded ${
                                  isL2Active ? 'text-white' : 'text-slate-400 hover:text-slate-600'
                                }`}
                              >
                                {isL2Open ? (
                                  <ChevronDown className="w-3 h-3" />
                                ) : (
                                  <ChevronRight className="w-3 h-3" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Level 3 Subcategories Accordion */}
                        {isL2Open && catL2.subcategories && (
                          <div className="ml-3 pl-2 border-l border-slate-300 my-0.5 space-y-0.5">
                            {catL2.subcategories.map((catL3) => {
                              const isL3Active =
                                selectedL1 === catL1.name &&
                                selectedL2 === catL2.name &&
                                selectedL3 === catL3.name;
                              const countL3 = getL3Count(catL1.name, catL2.name, catL3.name);

                              return (
                                <div
                                  key={catL3.id}
                                  onClick={() => onSelectCategory(catL1.name, catL2.name, catL3.name)}
                                  className={`flex items-center justify-between px-2 py-1 rounded cursor-pointer text-[11px] transition select-none ${
                                    isL3Active
                                      ? 'bg-blue-700 text-white font-bold'
                                      : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                                  }`}
                                >
                                  <span className="truncate flex items-center">
                                    {isL3Active && <Check className="w-3 h-3 mr-1 text-yellow-300" />}
                                    {catL3.name}
                                  </span>
                                  {countL3 > 0 && (
                                    <span className="text-[9px] text-slate-400 ml-1">
                                      ({countL3})
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};
