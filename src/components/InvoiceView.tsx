'use client';
import React from 'react';
import { Printer, CheckCircle, ArrowLeft, Mail } from 'lucide-react';
import { OrderDetails } from '../types';

interface InvoiceViewProps {
  order: OrderDetails;
  onClose: () => void;
}

export const InvoiceView: React.FC<InvoiceViewProps> = ({ order, onClose }) => {
  const handlePrint = () => {
    const content = document.getElementById('printable-invoice')?.innerHTML;
    if (!content) return;
    const win = window.open('', '', 'height=800,width=1000');
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Arve ${order.orderNumber}</title>
          <style>
            @page { size: A4; margin: 12mm; }
            body { font-family: Arial, sans-serif; font-size: 12px; color: #1e293b; background: white; }
            table { width: 100%; border-collapse: collapse; }
            th { background: #0e4da4; color: white; padding: 10px; text-align: left; font-size: 11px; }
            td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
            @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 print:!static print:!bg-white print:!p-0 print:!overflow-visible">
      <div className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl relative my-6 print:!shadow-none print:!rounded-none print:!m-0 print:!max-w-none print:!w-full">
        <div className="bg-[#0e4da4] text-white p-4 flex flex-col sm:flex-row justify-between items-center gap-3 print:hidden">
          <div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-sm">Tellimus #{order.orderNumber} esitatud õnnestunult!</span>
            </div>
            <div className="text-[11px] text-blue-100 flex items-center gap-1 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-yellow-300" />
              <span>Teavitus saadetud: <strong>{order.customer.email}</strong> ja <strong>canman.systems@gmail.com</strong></span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={handlePrint} className="bg-white/20 hover:bg-white/30 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition flex items-center space-x-1">
              <Printer className="w-4 h-4" />
              <span>Prindi / Salvesta PDF</span>
            </button>
            <button onClick={onClose} className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold px-3 py-1.5 rounded-lg text-xs transition flex items-center space-x-1">
              <ArrowLeft className="w-4 h-4" />
              <span>Tagasi e-poodi</span>
            </button>
          </div>
        </div>
        <div id="printable-invoice" className="p-8 text-slate-800 text-xs bg-white print:!p-0">
          <div className="flex justify-between items-start border-b-2 border-[#0e4da4] pb-6 mb-6">
            <div>
              <h1 className="text-3xl font-black text-[#0e4da4] tracking-tight mb-1">CANMAN<span className="text-red-500 font-bold text-base ml-1">OÜ</span></h1>
              <p className="text-slate-500 text-xs font-semibold">Arvutid, Lisaseadmed & IT Teenused Tallinnas</p>
              <div className="mt-3 space-y-0.5 text-slate-600 text-xs">
                <p>Reg. kood: 12489620 | KMKR: EE101684920</p>
                <p>Aadress: Lille 14, Tallinn 10614, Harjumaa</p>
                <p>Tel: +372 5652062 | E-post: canman.systems@gmail.com</p>
                <p className="font-semibold text-[#0e4da4]">Pank IBAN: EE55220022105652062 (Swedbank AS)</p>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-block bg-blue-50 border border-blue-200 px-4 py-2 rounded-lg mb-2">
                <div className="text-[10px] uppercase font-bold text-blue-800">{order.paymentMethod === 'arve'? 'ETTEMAKSUARVE (INVOICE)' : 'TELLIMUSE KINNITUS'}</div>
                <div className="text-lg font-black text-[#0e4da4]">#{order.orderNumber}</div>
              </div>
              <p className="text-slate-500">Kuupäev: <strong>{new Date(order.createdAt).toLocaleDateString('et-EE')}</strong></p>
              <p className="text-slate-500">Maksetähtaeg: <strong>{new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('et-EE')}</strong></p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <h3 className="font-bold text-[#0e4da4] uppercase text-[11px] mb-2 border-b border-slate-200 pb-1">OSTJA (CUSTOMER):</h3>
              <p className="font-bold text-sm text-slate-900">{order.customer.fullName}</p>
              {order.customer.companyName && <p className="font-semibold text-slate-700">{order.customer.companyName}</p>}
              <p className="text-slate-600 mt-1">E-post: {order.customer.email}</p>
              <p className="text-slate-600">Tel: {order.customer.phone}</p>
            </div>
            <div>
              <h3 className="font-bold text-[#0e4da4] uppercase text-[11px] mb-2 border-b border-slate-200 pb-1">TARNE JA MAKSE:</h3>
              <p className="text-slate-700">Tarneviis: <strong>{order.deliveryMethod === 'pakk'? 'Omniva / DPD Pakiautomaat' : 'Kätte saamine poest (Lille 14, Tallinn)'}</strong></p>
              {order.deliveryMethod === 'pakk' && <p className="text-slate-800 font-semibold mt-1">Pakiautomaat: {order.customer.address}</p>}
              <p className="text-slate-700 mt-1">Makseviis: <strong>{order.paymentMethod === 'arve'? 'Pangaülekanne (Arve)' : 'Sularaha / Kaart kohapeal'}</strong></p>
            </div>
          </div>
          <div className="mb-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0e4da4] text-white text-[11px] uppercase font-bold">
                  <th className="py-2.5 px-3">Toode</th>
                  <th className="py-2.5 px-3">Spec</th>
                  <th className="py-2.5 px-3 text-center">Kogus</th>
                  <th className="py-2.5 px-3 text-right">Ühiku hind</th>
                  <th className="py-2.5 px-3 text-right">Summa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {order.items.map(({ product, quantity }) => (
                  <tr key={product.id}>
                    <td className="py-3 px-3 font-bold text-slate-900">{product.title}<span className="block text-[10px] text-slate-500 font-normal">Seisukord: {product.condition}</span></td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-600">{product.shortSpec}</td>
                    <td className="py-3 px-3 text-center font-bold">{quantity}</td>
                    <td className="py-3 px-3 text-right">€{product.price.toFixed(2)}</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900">€{(product.price * quantity).toFixed(2)}</td>
                  </tr>
                ))}
                {order.deliveryFee > 0 && (
                  <tr>
                    <td colSpan={2} className="py-2.5 px-3 font-semibold text-slate-700">Paki saatmine (Omniva / DPD)</td>
                    <td className="py-2.5 px-3 text-center">1</td>
                    <td className="py-2.5 px-3 text-right">€{order.deliveryFee.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right font-bold">€{order.deliveryFee.toFixed(2)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end mb-8">
            <div className="w-64 space-y-1.5 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between text-slate-600"><span>Vahesumma käibemaksuta:</span><span>€{(order.total - order.tax).toFixed(2)}</span></div>
              <div className="flex justify-between text-slate-600"><span>Käibemaks 22% (KM):</span><span>€{order.tax.toFixed(2)}</span></div>
              <div className="flex justify-between text-slate-900 font-extrabold text-base pt-2 border-t border-slate-300"><span>KOKKU TASUDA:</span><span className="text-[#0e4da4]">€{order.total.toFixed(2)}</span></div>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900">
            <div className="font-bold text-blue-950 mb-1">Maksejuhis (Payment Instructions):</div>
            {order.paymentMethod === 'arve'? (
              <>
                <p>Palun tasuda arve summa <strong>€{order.total.toFixed(2)}</strong> Swedbank arvele <strong>EE55220022105652062</strong> (Canman OÜ).</p>
                <p className="mt-1">Selgitusse märkida arve number: <strong>#{order.orderNumber}</strong>. Kaup pannakse teele pärast laekumist.</p>
              </>
            ) : (
              <p>Olete valinud makse sularahas. Kaup ootab teid aadressil <strong>Lille 14, Tallinn 10614</strong> (E-R 10:00-18:00).</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
