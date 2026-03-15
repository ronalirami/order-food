"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItem } = useCart();
  const { lang, setLang, t } = useLanguage();

  const languages = [
    { code: "id", flag: "🇮🇩" },
    { code: "en", flag: "🇬🇧" },
    { code: "ja", flag: "🇯🇵" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-black/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      {/* NAV UTAMA */}
      <nav className="max-w-screen-xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">

        {/* LOGO + MENU DESKTOP */}
        <div className="flex items-center gap-8">
          <Link href="/">
            <h1
              className="font-serif tracking-widest font-semibold text-purple-300 px-3 py-1 rounded-md"
              style={{ border: "1px solid #d8b4fe", fontSize: "1rem" }}
            >
              RM. LamakBana
            </h1>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-light">
            <Link href="/menu" className="hover:text-[#F4EAD0] transition">
              {t("nav.menu")}
            </Link>
            <Link href="/tentang" className="hover:text-[#F4EAD0] transition">
              {t("nav.tentang")}
            </Link>
            <Link
              href="/order"
              className="relative flex items-center gap-1 text-amber-500 hover:text-amber-300 transition"
            >
              <ShoppingCart className="w-4 h-4" />
              {t("nav.order")}
              {totalItem > 0 && (
                <span
                  className="absolute bg-red-500 text-white rounded-full flex items-center justify-center font-bold"
                  style={{ fontSize: "9px", width: "16px", height: "16px", top: "-10px", right: "-12px" }}
                >
                  {totalItem}
                </span>
              )}
            </Link>

          </div>
        </div>

        {/* LANGUAGE SWITCHER DESKTOP */}
        <div className="hidden md:flex items-center gap-2">
          {languages.map(({ code, flag }) => (
            <button
              key={code}
              onClick={() => setLang(code)}
              title={code.toUpperCase()}
              className="text-base transition-all"
              style={{ opacity: lang === code ? 1 : 0.35, transform: lang === code ? "scale(1.2)" : "scale(1)" }}
            >
              {flag}
            </button>
          ))}
        </div>

        {/* HAMBURGER MOBILE */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col items-center rounded-md transition"
          style={{ gap: "2px", padding: "8px", border: "1px solid rgba(255,255,255,0.3)" }}
        >
          {isOpen
            ? <X className="w-5 h-5 text-white" />
            : <Menu className="w-5 h-5 text-white" />
          }
          <span className="text-white leading-none" style={{ fontSize: "9px" }}>
            {isOpen ? "Tutup" : "Menu"}
          </span>
        </button>
      </nav>

      {/* DROPDOWN MOBILE */}
      {isOpen && (
        <div
          className="md:hidden flex flex-col text-sm"
          style={{ background: "rgba(0,0,0,0.97)", padding: "0 1.5rem 1.5rem" }}
        >
          <Link
            href="/menu"
            onClick={() => setIsOpen(false)}
            className="py-3 border-b border-gray-800 hover:text-[#F4EAD0] transition"
          >
            {t("nav.menu")}
          </Link>
          <Link
            href="/tentang"
            onClick={() => setIsOpen(false)}
            className="py-3 border-b border-gray-800 hover:text-[#F4EAD0] transition"
          >
            {t("nav.tentang")}
          </Link>
          <Link
            href="/order"
            onClick={() => setIsOpen(false)}
            className="py-3 border-b border-gray-800 flex items-center gap-2 text-amber-500 hover:text-amber-300 transition"
          >
            <ShoppingCart className="w-4 h-4" />
            {t("nav.order")}
            {totalItem > 0 && (
              <span
                className="bg-red-500 text-white rounded-full flex items-center justify-center font-bold"
                style={{ fontSize: "9px", width: "16px", height: "16px" }}
              >
                {totalItem}
              </span>
            )}
          </Link>

          {/* Language Switcher Mobile */}
          <div className="py-3 flex items-center gap-3">
            {languages.map(({ code, flag }) => (
              <button
                key={code}
                onClick={() => { setLang(code); setIsOpen(false); }}
                className="text-lg transition-all"
                style={{ opacity: lang === code ? 1 : 0.35, transform: lang === code ? "scale(1.2)" : "scale(1)" }}
              >
                {flag}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
