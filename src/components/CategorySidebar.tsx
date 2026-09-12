'use client';
import React, { useMemo } from 'react';

const safeLower = (v: any) => String(v || '').toLowerCase();

export function CategorySidebar({ selectedL1, selectedL2, selectedL3, onSelectCategory, products }: any) {
  const categories = useMemo(() => {
    const map = new Map<string, Map<string, Set<string>>>();
    (products || []).forEach((p: any) => {
      const l1 = String(p.categoryL1 || p.topCategory || p.category || 'Muu');
      const l2 = String(p.categoryL2 || p.subCategory || 'general');
      const l3 = p.categoryL3 ? String(p.categoryL3) : null;
      if (!map.has(l1)) map.set(l1, new Map());
      if (!map.get(l1)!.has(l2)) map.get(l1)!.set(l2, new Set());
      if (l3) map.get(l1)!.get(l2)!.add(l3);
    });
    return map;
  }, [products]);

  return (
    <aside className="w-full lg:w-[280px] flex-shrink-0 bg-white rounded-xl p-4 shadow-sm h-fit">
      <h3 className="font-bold text-sm mb-3">Kategooriad</h3>
      <div className="space-y-2">
        <button onClick={() => onSelectCategory(null, null, null)} className={`w-full text-left text-sm px-2 py-1 rounded ${!selectedL1 ? 'bg-blue-50 text-[#0e4da4] font-bold' : 'hover:bg-slate-50'}`}>Kõik kategooriad</button>
        {Array.from(categories.entries()).map(([l1, l2map]) => (
          <div key={l1} className="space-y-1">
            <button onClick={() => onSelectCategory(l1, null, null)} className={`w-full text-left text-sm font-medium px-2 py-1 rounded flex justify-between ${safeLower(selectedL1) === safeLower(l1) ? 'bg-blue-50 text-[#0e4da4]' : 'hover:bg-slate-50'}`}>
              <span>{l1}</span><span className="text-xs text-slate-400">{Array.from(l2map.values()).reduce((a, b) => a + b.size + 1, 0)}</span>
            </button>
            {safeLower(selectedL1) === safeLower(l1) && (
              <div className="ml-3 space-y-1 border-l pl-2">
                {Array.from(l2map.entries()).map(([l2, l3set]) => (
                  <div key={l2}>
                    <button onClick={() => onSelectCategory(l1, l2, null)} className={`w-full text-left text-xs px-2 py-1 rounded ${safeLower(selectedL2) === safeLower(l2) ? 'bg-slate-100 font-bold' : 'hover:bg-slate-50'}`}>{l2}</button>
                    {safeLower(selectedL2) === safeLower(l2) && Array.from(l3set).map((l3) => (
                      <button key={l3} onClick={() => onSelectCategory(l1, l2, l3)} className={`w-full text-left text-[11px] ml-3 px-2 py-0.5 rounded ${safeLower(selectedL3) === safeLower(l3) ? 'bg-blue-50 text-[#0e4da4] font-bold' : 'hover:bg-slate-50 text-slate-500'}`}>{l3}</button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
