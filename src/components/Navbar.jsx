"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // ✅ ikon hamburger dan close

export default function Navbar({ fontTitle }) {
  const [isOpen, setIsOpen] = useState(false); // ✅ kontrol buka/tutup menu

  return (
   <header className="fixed top-6 left-2 z-50 w-auto px-6">
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
        {/* Ikon hamburger */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Logo */}
      <h1 className="font-serif tracking-widest text-[#F4EAD0] text-base sm:text-lg font-semibold">
        RM.LamakBana
      </h1>
    </div>

    {/* === Menu utama (hanya desktop) === */}
    <div className="hidden sm:flex items-center gap-8 text-sm font-light">
      <Link href="/menu" className="hover:text-[#F4EAD0] transition">Menu</Link>
      <Link href="/tentang" className="hover:text-[#F4EAD0] transition">Tentang</Link>
      <Link href="/order" className="hover:text-[#F4EAD0] transition">Order</Link>
    </div>
  </nav>

  {/* === Dropdown mobile === */}
  {isOpen && (
    <div className="sm:hidden mt-3 bg-black/95 text-white rounded-lg shadow-md p-4 flex flex-col items-center gap-4 animate-fade-in-down">
      <Link href="/menu" className="hover:text-[#F4EAD0] transition">Menu</Link>
      <Link href="/tentang" className="hover:text-[#F4EAD0] transition">Tentang</Link>
      <Link href="/order" className="hover:text-[#F4EAD0] transition">Order</Link>
    </div>
  )}
</header>

  );
}
