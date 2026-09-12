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
      </div>
    </footer>
  );
};
export default Footer;
