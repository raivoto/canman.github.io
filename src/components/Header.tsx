'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Wrench, Search, ShoppingBag, Laptop, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenServicesModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onOpenServicesModal,
}) => {
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-slate-200">
      {/* Top Banner - Services & Contact Info */}
      <div className="bg-[#0e4da4] text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          {/* Left Service Banner */}
          <div className="flex items-center space-x-2 text-blue-100 font-medium">
            <span className="bg-blue-800 text-yellow-300 font-bold px-2 py-0.5 rounded text-[11px] uppercase tracking-wider">
              IT Teenused
            </span>
            <span className="truncate">
              IT abi, väljakutsed, remont teenused Tallinnas
            </span>
            <button
              onClick={onOpenServicesModal}
              className="underline hover:text-white font-semibold transition ml-1 text-yellow-300"
            >
              Vaata hinnakirja &rarr;
            </button>
          </div>

          {/* Right Contact Details */}
          <div className="flex items-center space-x-4 text-slate-200">
            <a
              href="tel:+3725652062"
              className="flex items-center hover:text-white transition font-medium"
            >
              <Phone className="w-3.5 h-3.5 mr-1 text-blue-300" />
              Tel. +372 5652062
            </a>
            <span className="hidden sm:inline text-blue-400">|</span>
            <span className="hidden sm:flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1 text-blue-300" />
              Lille 14 Tallinn 10614
            </span>
            <span className="hidden md:inline text-blue-400">|</span>
            <a
              href="mailto:canman.systems@gmail.com"
              className="hidden md:flex items-center hover:text-white transition"
            >
              <Mail className="w-3.5 h-3.5 mr-1 text-blue-300" />
              canman.systems@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* Main Bar: Logo, Search & Cart */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2 group flex-shrink-0">
          <div className="w-10 h-10 bg-[#0e4da4] rounded-lg flex items-center justify-center text-white shadow-md group-hover:bg-[#0a3a7d] transition">
            <Laptop className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black tracking-tight text-[#0e4da4] leading-none flex items-center gap-1">
              CANMAN<span className="text-red-500 font-bold text-xs bg-red-50 px-1 py-0.5 rounded border border-red-200">EE</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium tracking-wide">
              Arvutid, Osad & IT Remont Tallinnas
            </p>
          </div>
        </Link>

        {/* Central Search Bar */}
        <div className="flex-1 max-w-xl mx-2 md:mx-6 relative">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search products (e.g. i5, Lenovo, DDR4, RTX 4060)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0e4da4] focus:border-transparent transition shadow-inner"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-slate-400 hover:text-slate-600 text-xs bg-slate-200 hover:bg-slate-300 rounded-full w-4 h-4 flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right Actions: Services Button & Shopping Cart Badge */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenServicesModal}
            className="hidden lg:flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-[#0e4da4] bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-lg transition"
          >
            <Wrench className="w-4 h-4 text-[#0e4da4]" />
            <span>IT Remont Tallinnas</span>
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center space-x-2 bg-[#0e4da4] hover:bg-[#0a3a7d] text-white px-4 py-2 rounded-lg font-semibold text-sm transition shadow-sm active:scale-95"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="hidden sm:inline">Ostukorv</span>
            {cartCount > 0 ? (
              <span className="bg-yellow-400 text-slate-900 font-extrabold text-xs px-2 py-0.5 rounded-full ml-1 animate-pulse">
                {cartCount}
              </span>
            ) : (
              <span className="text-blue-200 text-xs hidden sm:inline">(0)</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
