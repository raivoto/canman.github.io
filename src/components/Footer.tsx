'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Wrench, Laptop, ShieldCheck, Clock } from 'lucide-react';

interface FooterProps {
  onOpenServicesModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenServicesModal }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-10 pb-6 mt-16 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Col 1: Store Intro */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#0e4da4] rounded-lg flex items-center justify-center text-white">
                <Laptop className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                CANMAN<span className="text-red-500 font-bold text-xs">EE</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Kvaliteetsed uued ja kasutatud sülearvutid, lauaarvutid, arvutiosad ja lisaseadmed. Professionaalne IT remont ja abi Tallinnas.
            </p>
            <div className="pt-2 text-[11px] text-slate-400 space-y-1">
              <p>Canman OÜ • Reg: 12489620</p>
              <p>KMKR: EE101684920</p>
            </div>
          </div>

          {/* Col 2: Required Contact Details */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs border-b border-slate-800 pb-1.5">
              Kontaktid & Asukoht
            </h4>
            <div className="space-y-2 text-slate-300">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Kauplus:</strong> Lille 14, Tallinn 10614 (Kristiine)
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a href="tel:+3725652062" className="hover:text-white transition">
                  <strong>Tel:</strong> +372 5652062
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a href="mailto:canman@canman.ee" className="hover:text-white transition">
                  <strong>E-post:</strong> canman@canman.ee
                </a>
              </div>
              <div className="flex items-center space-x-2 text-slate-400 text-[11px] pt-1">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>E-R 10:00 - 18:00 | L-P Kokkuleppel</span>
              </div>
            </div>
          </div>

          {/* Col 3: Services Summary */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs border-b border-slate-800 pb-1.5">
              IT Remont Tallinnas
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>• Arvutite diagnostika & puhastus</li>
              <li>• Windows & draiverite paigaldus</li>
              <li>• SSD ketta & mälude laiendus</li>
              <li>• Väljakutsed Tallinnas ja lähiümbruses</li>
            </ul>
            <button
              onClick={onOpenServicesModal}
              className="mt-2 inline-flex items-center space-x-1 text-xs font-semibold text-yellow-400 hover:text-yellow-300 underline"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Vaata IT-teenuste hinnakirja &rarr;</span>
            </button>
          </div>

          {/* Col 4: Payment & Shipping */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs border-b border-slate-800 pb-1.5">
              Makse & Tarne
            </h4>
            <div className="space-y-2 text-slate-400">
              <p>
                <strong>Makseviisid:</strong> Pangaülekanne (Arve), Sularahas või kaardiga kaupluses.
              </p>
              <p>
                <strong>Tarneviisid:</strong> Omniva & DPD pakiautomaadid (€4.90) või tasuta kättesaamine Lille 14.
              </p>
              <div className="pt-2 flex items-center space-x-2 text-slate-300 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Garantii uutele 24k / kasutatud 12k</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner Required Text */}
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center text-slate-500 text-[11px] gap-2">
          <div>
            IT abi, väljakutsed, remont teenused Tallinnas | Tel. 372 5652062 | Lille 14 Tallinn 10614 | canman@canman.ee
          </div>
          <div>
            © {new Date().getFullYear()} Canman.github.io. Kõik õigused kaitstud.
          </div>
        </div>
      </div>
    </footer>
  );
};
