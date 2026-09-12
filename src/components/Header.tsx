import { ShoppingCart, Wrench } from 'lucide-react';
export const Header = ({ cartCount, onCartOpen, onServicesOpen }: { cartCount: number; onCartOpen: () => void; onServicesOpen: () => void }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="text-2xl font-black tracking-tight text-[#0e4da4] leading-none">CANMAN ARVUTID</div>
          <div className="hidden md:flex items-center gap-2 text- text-slate-500">
            <span>Lille 14-4 Tallinn 10614 Harjumaa</span><span className="w-1 h-1 bg-slate-300 rounded-full"></span><span className="text-green-600 font-semibold">E-R 10:00-18:00</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onServicesOpen} className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-600 hover:text-[#0e4da4] hover:bg-slate-50 rounded-lg"><Wrench className="w-4 h-4" />Teenused</button>
          <button onClick={onCartOpen} className="relative p-2.5 bg-[#0e4da4] text-white rounded-lg hover:bg-[#0a3a7a] flex items-center gap-2"><ShoppingCart className="w-5 h-5" /><span className="hidden sm:inline text-sm font-bold">Ostukorv</span>{cartCount > 0 && <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text- font-bold rounded-full flex items-center justify-center">{cartCount}</span>}</button>
        </div>
      </div>
    </header>
  );
};
