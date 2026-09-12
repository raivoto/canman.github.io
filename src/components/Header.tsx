import { ShoppingCart, Wrench, Search } from 'lucide-react';
import React from 'react';

type HeaderProps = {
  searchQuery?: string;
  setSearchQuery?: React.Dispatch<React.SetStateAction<string>>;
  onOpenServicesModal?: () => void;
  cartCount?: number;
  onCartOpen?: () => void;
  onServicesOpen?: () => void;
};

export const Header: React.FC<HeaderProps> = ({
  searchQuery = '',
  setSearchQuery,
  onOpenServicesModal,
  cartCount = 0,
  onCartOpen,
  onServicesOpen
}) => {
  const handleServices = onServicesOpen || onOpenServicesModal || (() => {});
  const handleCart = onCartOpen || (() => {});
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="text-2xl font-black tracking-tight text-[#0e4da4] leading-none whitespace-nowrap">CANMAN ARVUTID</div>
          <div className="hidden md:flex items-center gap-2 text- text-slate-500">
            <span>Lille 14-4 Tallinn 10614 Harjumaa</span><span className="w-1 h-1 bg-slate-300 rounded-full"></span><span className="text-green-600 font-semibold">E-R 10:00-18:00</span>
          </div>
        </div>
        {setSearchQuery && (
          <div className="flex-1 max-w-md relative hidden sm:flex">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Otsi arvutit..." className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e4da4] focus:border-[#0e4da4]" />
          </div>
        )}
        <div className="flex items-center gap-2">
          <button onClick={handleServices} className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-600 hover:text-[#0e4da4] hover:bg-slate-50 rounded-lg"><Wrench className="w-4 h-4" />Teenused</button>
          <button onClick={handleCart} className="relative p-2.5 bg-[#0e4da4] text-white rounded-lg hover:bg-[#0a3a7a] flex items-center gap-2"><ShoppingCart className="w-5 h-5" /><span className="hidden sm:inline text-sm font-bold">Ostukorv</span>{cartCount > 0 && <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text- font-bold rounded-full flex items-center justify-center">{cartCount}</span>}</button>
        </div>
      </div>
    </header>
  );
};
export default Header;
