import React from 'react';

type FooterProps = {
  onOpenServicesModal?: () => void;
  onServicesOpen?: () => void;
};

export const Footer: React.FC<FooterProps> = ({ onOpenServicesModal, onServicesOpen }) => {
  const handleServices = onServicesOpen || onOpenServicesModal;
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-xl font-black tracking-tight text-[#4d8eff] mb-3">CANMAN ARVUTID</div>
            <div className="text-sm space-y-1 text-slate-400">
              <div>Canman OÜ</div>
              <div>Reg nr: 12147369</div>
              <div>Lille 14-4 Tallinn 10614 Harjumaa</div>
              <div className="text-slate-500">Tegeleb arvutite müügi ja hooldusega alates 2011 aastast.</div>
            </div>
          </div>
<<<<<<< HEAD
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
=======
          <div>
            <div className="font-semibold text-white mb-3">Kontakt</div>
            <div className="text-sm space-y-1">
              <div>E-R 10:00-18:00</div>
              <div>Lille 14-4, Tallinn</div>
              <div>Tel: +372 5xxx xxxx</div>
            </div>
          </div>
          <div>
            <div className="font-semibold text-white mb-3">Teenused</div>
            <div className="text-sm space-y-2">
              <button onClick={handleServices} className="block text-left hover:text-white">Arvutite hooldus ja remont</button>
              <button onClick={handleServices} className="block text-left hover:text-white">Vara varundus ja andmete taastamine</button>
              <div className="text-slate-500 text-xs pt-2">© {new Date().getFullYear()} Canman OÜ. Kõik õigused kaitstud.</div>
            </div>
          </div>
        </div>
>>>>>>> 078128bb208fbfa3cd5cadb8db3e03996d889e21
      </div>
    </footer>
  );
};
<<<<<<< HEAD
=======
export default Footer;
>>>>>>> 078128bb208fbfa3cd5cadb8db3e03996d889e21
