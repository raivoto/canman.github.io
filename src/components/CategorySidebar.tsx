'use client';
import React, { useMemo, useState } from 'react';

const safeLower = (v: any) => String(v || '').toLowerCase();

// Gruepeerib "Desktop kasutatud / used, 2-gen" -> "Desktop kasutatud" + "2-gen"
function normalizeCategory(raw: string) {
  const s = String(raw || 'Muu').trim();
  if (!s) return { base: 'Muu', sub: null };
  
  // Desktop kasutatud / used, 2-gen
  const desktopMatch = s.match(/^(Desktop kasutatud.*?)(?:,\s*(\d+-gen))?$/i);
  if (desktopMatch) {
    const base = 'Desktop kasutatud / used';
    const sub = desktopMatch[2] ? `${desktopMatch[2]}` : null;
    // Kui on "Desktop kasutatud / used, 2-gen" - sub on 2-gen, base on Desktop kasutatud
    if (s.includes(',')) {
      const parts = s.split(',').map(p => p.trim());
      return { base: parts[0].includes('Desktop') ? 'Desktop kasutatud / used' : parts[0], sub: parts[1] || null };
    }
    return { base, sub };
  }
  
  // Laptops used etc - jäta nagu on
  return { base: s, sub: null };
}

export function CategorySidebar({ selectedL1, selectedL2, selectedL3, onSelectCategory, products }: any) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    'Desktop kasutatud / used': true,
    'Arvutid kasutatud': true
  });

  const grouped = useMemo(() => {
    const map = new Map<string, { count: number, subs: Map<string, { count: number, l3: Map<string, number> }> }>();
    
    (products || []).forEach((p: any) => {
      const rawL1 = String(p.categoryL1 || p.topCategory || p.category || 'Muu');
      const rawL2 = String(p.categoryL2 || p.subCategory || '').trim();
      const rawL3 = p.categoryL3 ? String(p.categoryL3).trim() : '';
      
      // Normaliseeri L1
      let baseL1 = rawL1;
      let gen = null;
      
      if (rawL1.toLowerCase().includes('desktop kasutatud')) {
        baseL1 = 'Desktop kasutatud / used';
        // Kui L1 sisaldab koma, siis teine osa on gen
        if (rawL1.includes(',')) {
          gen = rawL1.split(',')[1]?.trim() || null;
        }
        // Kui L2 on gen stiilis, kasuta seda
        if (!gen && rawL2 && rawL2.match(/\d+-gen/i)) {
          gen = rawL2;
        }
      }
      
      const actualL2 = gen || rawL2 || 'Üldine';
      
      if (!map.has(baseL1)) map.set(baseL1, { count: 0, subs: new Map() });
      const entry = map.get(baseL1)!;
      entry.count++;
      
      if (!entry.subs.has(actualL2)) entry.subs.set(actualL2, { count: 0, l3: new Map() });
      const subEntry = entry.subs.get(actualL2)!;
      subEntry.count++;
      
      if (rawL3) {
        subEntry.l3.set(rawL3, (subEntry.l3.get(rawL3) || 0) + 1);
      } else if (gen && rawL2 && !rawL2.match(/\d+-gen/i) && rawL2 !== 'Üldine') {
        // rawL2 on tegelik kategooria kui gen oli L1 sees
        subEntry.l3.set(rawL2, (subEntry.l3.get(rawL2) || 0) + 1);
      }
    });
    
    return map;
  }, [products]);

  const toggleGroup = (base: string) => {
    setOpenGroups(prev => ({ ...prev, [base]: !prev[base] }));
  };

  return (
    <aside className="w-full lg:w-[300px] flex-shrink-0">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <h3 className="font-bold text-[13px] tracking-widest text-slate-800 uppercase mb-4">Kategooriad</h3>
        <div className="space-y-1">
          <button 
            onClick={() => onSelectCategory(null, null, null)} 
            className={`w-full text-left text-[13px] px-3 py-2 rounded-xl transition ${!selectedL1 ? 'bg-[#0e4da4] text-white font-semibold' : 'hover:bg-slate-50 text-slate-700'}`}
          >
            Kõik kategooriad <span className="float-right opacity-60">{products?.length || 0}</span>
          </button>
          
          {Array.from(grouped.entries()).map(([base, data]) => {
            const isOpen = openGroups[base] ?? false;
            const isActive = safeLower(selectedL1) === safeLower(base);
            const hasSubs = data.subs.size > 0;
            const isDesktopGroup = base.toLowerCase().includes('desktop kasutatud');
            
            // Kui on Desktop grupp ja ainult gen alamkategooriad, näita kompaktselt
            if (isDesktopGroup) {
              return (
                <div key={base} className="pt-2">
                  <button 
                    onClick={() => {
                      toggleGroup(base);
                      onSelectCategory(base, null, null);
                    }} 
                    className={`w-full text-left text-[13px] font-semibold px-3 py-2 rounded-xl flex justify-between items-center transition ${isActive ? 'bg-blue-50 text-[#0e4da4]' : 'hover:bg-slate-50 text-slate-800'}`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`transform transition ${isOpen ? 'rotate-90' : ''}`}>›</span>
                      {base}
                    </span>
                    <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded-full">{data.count}</span>
                  </button>
                  
                  {isOpen && (
                    <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-slate-100 pl-3">
                      {Array.from(data.subs.entries()).sort((a,b) => a[0].localeCompare(b[0])).map(([sub, subData]) => {
                        const isSubActive = safeLower(selectedL2) === safeLower(sub);
                        return (
                          <div key={sub}>
                            <button 
                              onClick={() => onSelectCategory(base, sub, null)}
                              className={`w-full text-left text-[12px] px-2.5 py-1.5 rounded-lg flex justify-between transition ${isSubActive ? 'bg-slate-900 text-white font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                            >
                              <span>{sub}</span>
                              <span className="text-[10px] opacity-60">{subData.count}</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }
            
            return (
              <div key={base} className="pt-1">
                <button 
                  onClick={() => onSelectCategory(base, null, null)} 
                  className={`w-full text-left text-[13px] px-3 py-2 rounded-xl flex justify-between items-center transition ${isActive ? 'bg-blue-50 text-[#0e4da4] font-semibold' : 'hover:bg-slate-50 text-slate-700'}`}
                >
                  <span>{base}</span>
                  <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500">{data.count}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
