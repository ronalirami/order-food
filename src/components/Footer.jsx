"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#0a0a0a] border-t border-gray-800 text-white mt-auto">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-10 md:py-12">

        {/* DESKTOP: 3 kolom */}
        <div className="hidden md:grid md:grid-cols-3 gap-10 mb-10">

          <div>
            <h2 className="font-serif text-[#F4EAD0] text-xl tracking-widest font-semibold mb-3">
              {t("footer.brand")}
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t("footer.brandDesc")}
            </p>
          </div>

          <div>
            <h3 className="text-[#F4EAD0] font-semibold mb-4 text-sm uppercase tracking-widest">
              {t("footer.navTitle")}
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-[#F4EAD0] transition">{t("footer.beranda")}</Link></li>
              <li><Link href="/menu" className="hover:text-[#F4EAD0] transition">{t("footer.menu")}</Link></li>
              <li><Link href="/tentang" className="hover:text-[#F4EAD0] transition">{t("footer.tentang")}</Link></li>
              <li><Link href="/order" className="hover:text-[#F4EAD0] transition">{t("footer.order")}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[#F4EAD0] font-semibold mb-4 text-sm uppercase tracking-widest">
              {t("footer.kontakTitle")}
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>{t("footer.alamat")}</li>
              <li>{t("footer.jam")}</li>
              <li>
                📧{" "}
                <a href="mailto:info@lamakbana.jp" className="hover:text-[#F4EAD0] transition">
                  info@lamakbana.jp
                </a>
              </li>
              <li>
                📸{" "}
                <a href="https://instagram.com/lamakbana" target="_blank" rel="noopener noreferrer" className="hover:text-[#F4EAD0] transition">
                  @lamakbana
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* MOBILE: compact */}
        <div className="md:hidden mb-8 flex flex-col items-center text-center gap-5">
          <h2 className="font-serif text-[#F4EAD0] text-lg tracking-widest font-semibold">
            {t("footer.brand")}
          </h2>
          <div className="flex items-center gap-5 text-sm text-gray-400">
            <Link href="/" className="hover:text-[#F4EAD0] transition">{t("footer.beranda")}</Link>
            <Link href="/menu" className="hover:text-[#F4EAD0] transition">{t("footer.menu")}</Link>
            <Link href="/tentang" className="hover:text-[#F4EAD0] transition">{t("footer.tentang")}</Link>
            <Link href="/order" className="hover:text-[#F4EAD0] transition">{t("footer.order")}</Link>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>{t("footer.alamat")}</span>
            <span>{t("footer.jam")}</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} {t("footer.copyright")}
        </div>
      </div>
    </footer>
  );
}
