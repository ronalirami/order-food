"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Navbar({ fontTitle }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItem } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-screen-xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">

        {/* Logo + Menu desktop */}
        <div className="flex items-center gap-8">
          <Link href="/">
            <h1 className="font-serif tracking-widest text-[#F4EAD0] text-base sm:text-lg font-semibold">
              RM. LamakBana
            </h1>
          </Link>

          <div className="hidden sm:flex items-center gap-8 text-sm font-light">
          <Link href="/menu" className="hover:text-[#F4EAD0] transition">
            Menu
          </Link>
          <Link href="/tentang" className="hover:text-[#F4EAD0] transition">
            Tentang
          </Link>
          <Link
            href="/order"
            className="relative hover:text-[#F4EAD0] transition text-amber-500 flex items-center gap-1"
          >
            <ShoppingCart className="w-4 h-4" />
            Order
            {totalItem > 0 && (
              <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center leading-none">
                {totalItem}
              </span>
            )}
          </Link>
          </div>
        </div>

        {/* Hamburger mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="sm:hidden flex flex-col items-center gap-0.5 p-2 bg-white/10 rounded-md hover:bg-white/20 transition"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          <span className="text-[10px] text-gray-300 leading-none">Menu</span>
        </button>
      </nav>

      {/* Dropdown mobile */}
      {isOpen && (
        <div className="sm:hidden bg-black/95 text-white px-6 pb-6 flex flex-col gap-4 text-sm">
          <Link
            href="/menu"
            onClick={() => setIsOpen(false)}
            className="hover:text-[#F4EAD0] transition"
          >
            Menu
          </Link>
          <Link
            href="/tentang"
            onClick={() => setIsOpen(false)}
            className="hover:text-[#F4EAD0] transition"
          >
            Tentang
          </Link>
          <Link
            href="/order"
            onClick={() => setIsOpen(false)}
            className="relative hover:text-[#F4EAD0] transition text-amber-500 flex items-center gap-1 w-fit"
          >
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
