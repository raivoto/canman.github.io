'use client';
import React, { useMemo, useState } from 'react';

const safeLower = (v: any) => String(v || '').toLowerCase();

export function CategorySidebar({ selectedL1, selectedL2, selectedL3, onSelectCategory, products }: any) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const grouped = useMemo(() => {
    const map = new Map<string, { count: number, subs: Map<string, { count: number, l3: Map<string, number> }> }>();
    (products || []).forEach((p: any) => {
      const rawL1 = String(p.categoryL1 || p.topCategory || p.category || 'Muu').trim();
      const rawL2 = String(p.categoryL2 || p.subCategory || '').trim();
      const rawL3 = p.categoryL3? String(p.categoryL3).trim() : '';

      let baseL1 = rawL1;
      let gen: string | null = null;

      if (rawL1.toLowerCase().includes('desktop kasutatud')) {
        baseL1 = 'Desktop kasutatud / used';
        if (rawL1.includes(',')) gen = rawL1.split(',')[1]?.trim() || null;
        if (!gen && rawL2 && /\d+-gen/i.test(rawL2)) gen = rawL2;
      }

      if (!rawL1) return;

      if (!map.has(baseL1)) map.set(baseL1, { count: 0, subs: new Map() });
      const entry = map.get(baseL1)!;
      entry.count++;

      const actualL2 = gen || rawL2;
      if (!actualL2) return;

      if (!entry.subs.has(actualL2)) entry.subs.set(actualL2, { count: 0, l3: new Map() });
      const subEntry = entry.subs.get(actualL2)!;
      subEntry.count++;
      if (rawL3) subEntry.l3.set(rawL3, (subEntry.l3.get(rawL3) || 0) + 1);
    });
    return map;
  }, [products]);

  return (
    <aside className="w-full lg:w- lg:flex-shrink-0 lg:sticky lg:top-20 self-start">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <h3 className="font-bold text- tracking-widest text-slate-800 uppercase mb-4">Kategooriad</h3>
        <div className="space-y-1">
          <button
            onClick={() => onSelectCategory(null, null, null)}
            className={`w-full text-left text- px-3 py-2.5 rounded-xl transition flex justify-between items-center ${!selectedL1? 'bg-[#0e4da4] text-white font-semibold' : 'hover:bg-slate-50 text-slate-700'}`}
          >
            <span>Kõik kategooriad</span><span className="text- opacity-70">{products?.length || 0}</span>
          </button>

          {Array.from(grouped.entries()).sort((a,b)=>a[0].localeCompare(b[0])).map(([base, data]) => {
            const isActive = safeLower(selectedL1) === safeLower(base);
            const isOpen = openGroups[base]?? isActive;

            return (
              <div key={base} className="pt-1">
                <button
                  onClick={() => {
                    setOpenGroups(prev => ({...prev, [base]:!prev[base]}));
                    onSelectCategory(base, null, null);
                  }}
                  className={`w-full text-left text- font-semibold px-3 py-2.5 rounded-xl flex justify-between items-center transition ${isActive? 'bg-blue-50 text-[#0e4da4]' : 'hover:bg-slate-50 text-slate-800'}`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`transition-transform text- ${isOpen? 'rotate-90' : ''}`}>›</span>
                    <span className="truncate">{base}</span>
                  </span>
                  <span className="text- bg-slate-100 px-2 py-0.5 rounded-full ml-2 flex-shrink-0">{data.count}</span>
                </button>

                {isOpen && (
                  <div className="ml-5 mt-1 space-y-0.5 border-l-2 border-slate-100 pl-3">
                    {Array.from(data.subs.entries()).sort((a,b)=>a[0].localeCompare(b[0])).map(([sub, subData]) => {
                      const isSubActive = isActive && safeLower(selectedL2) === safeLower(sub);
                      return (
                        <div key={sub}>
                          <button
                            onClick={() => onSelectCategory(base, sub, null)}
                            className={`w-full text-left text- px-2.5 py-1.5 rounded-lg flex justify-between items-center transition ${isSubActive? 'bg-slate-900 text-white font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                          >
                            <span className="truncate">{sub}</span>
                            <span className="text- opacity-60 ml-2">{subData.count}</span>
                          </button>
                          {isSubActive && subData.l3.size > 0 && (
                            <div className="ml-3 mt-0.5 space-y-0.5">
                              {Array.from(subData.l3.entries()).map(([l3, cnt]) => (
                                <button key={l3} onClick={() => onSelectCategory(base, sub, l3)} className={`w-full text-left text- px-2 py-1 rounded truncate ${safeLower(selectedL3)===safeLower(l3)?'bg-blue-50 text-[#0e4da4] font-bold':'text-slate-500 hover:bg-slate-50'}`}>{l3} ({cnt})</button>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </aside>
  );
}
