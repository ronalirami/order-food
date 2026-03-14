"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Navbar({ fontTitle }) {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItem } = useCart();

  return (
    <header className="fixed top-6 left-4 z-50 w-xs px-6">
      {/* === Blok navbar utama === */}
      <nav
        className="
      bg-black/90 text-white flex items-center justify-between
      gap-6 px-6 py-3 rounded-xl shadow-lg backdrop-blur-md
    "
      >
        {/* === Kiri: logo dan hamburger === */}
        <div className="flex items-center gap-4">
          {/* Tombol hamburger (hanya di HP) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="sm:hidden p-2 bg-white/10 rounded-md hover:bg-white/20 transition"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo */}
          <Link href="/"><h1 className="font-serif tracking-widest text-[#F4EAD0] text-base sm:text-lg font-semibold">
            RM.LamakBana
          </h1>
          </Link>
        </div>

        {/* === Menu utama (hanya desktop) === */}
        <div className="hidden sm:flex items-center gap-6 text-sm font-light">
          <Link href="/menu" className="hover:text-[#F4EAD0] transition">
            Menu
          </Link>
          <Link href="/tentang" className="hover:text-[#F4EAD0] transition">
            Tentang
          </Link>
          <Link href="/order" className="relative hover:text-[#F4EAD0] transition text-amber-500 flex items-center gap-1">
            <ShoppingCart className="w-4 h-4" />
            Order
            {totalItem > 0 && (
              <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center leading-none">
                {totalItem}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* === Dropdown mobile === */}
      {isOpen && (
        <div className="sm:hidden mt-3 bg-black/95 text-white rounded-lg shadow-md p-4 flex flex-col items-center gap-4 animate-fade-in-down">
          <Link href="/menu" className="hover:text-[#F4EAD0] transition">
            Menu
          </Link>
          <Link href="/tentang" className="hover:text-[#F4EAD0] transition">
            Tentang
          </Link>
          <Link href="/order" className="relative hover:text-[#F4EAD0] transition flex items-center gap-1">
            <ShoppingCart className="w-4 h-4" />
            Order
            {totalItem > 0 && (
              <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center leading-none">
                {totalItem}
              </span>
            )}
          </Link>
        </div>
      )}
    </header>
  );
}
