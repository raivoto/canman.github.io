import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0a1931] text-slate-300 py-10 mt-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-[#0e4da4] rounded-lg flex items-center justify-center text-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
            </div>
            <div className="text-xl font-black tracking-tight text-white leading-none">
              CANMAN ARVUTID
            </div>
          </div>
          <p className="text-slate-400 text-[13px] leading-relaxed">
            Kvaliteetsed uued ja kasutatud sülearvutid, lauaarvutid, arvutiosad ja lisaseadmed. Professionaalne IT remont ja abi Tallinnas.
          </p>
          <div className="mt-4 text-[12px] text-slate-400 space-y-1">
            <p>Canman Systems OÜ Reg: 12147369</p>
            <p>KMKR: EE101478366</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-white mb-3 text-sm">Kontakt</h4>
          <div className="space-y-2 text-[13px] text-slate-400">
            <p><strong className="text-slate-200">Aadress:</strong> Lille 14-4 Tallinn 10614 Harjumaa</p>
            <p>IT abi, väljakutsed, remont teenused Tallinnas | Tel. 372 5652062 | Lille 14-4 Tallinn 10614 Harjumaa | canman.systems@gmail.com</p>
            <p className="mt-3"><strong className="text-slate-200">Makseviisid:</strong> Pangaülekanne (Arve), Sularahas või kaardiga kohapeal.</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-white mb-3 text-sm">Lahtiolekuajad</h4>
          <div className="space-y-1 text-[13px] text-slate-400">
            <p>E-R 10:00 - 18:00</p>
            <p>L 10:00 - 15:00 (kokkuleppel)</p>
            <p>P Suletud</p>
            <p className="mt-3 text-yellow-400 font-semibold">Lille 14-4 Tallinn 10614 Harjumaa - Kohapeal laos olemas!</p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-slate-800 text-[11px] text-slate-500 text-center">
        © {new Date().getFullYear()} Canman Systems OÜ - Kõik õigused kaitstud | Lille 14-4 Tallinn 10614 Harjumaa
      </div>
    </footer>
  );
};
