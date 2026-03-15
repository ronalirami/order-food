import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-gray-800 text-white mt-auto">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-10 md:py-12">

        {/* DESKTOP: 3 kolom | MOBILE: tersembunyi, pakai versi compact */}
        <div className="hidden md:grid md:grid-cols-3 gap-10 mb-10">

          {/* Kolom 1: Brand */}
          <div>
            <h2 className="font-serif text-[#F4EAD0] text-xl tracking-widest font-semibold mb-3">
              RM. Lamak Bana
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Restoran Padang autentik di Kagawa, Jepang. Membawa cita rasa
              Minangkabau dengan sentuhan elegan dan modern.
            </p>
          </div>

          {/* Kolom 2: Navigasi */}
          <div>
            <h3 className="text-[#F4EAD0] font-semibold mb-4 text-sm uppercase tracking-widest">
              Navigasi
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-[#F4EAD0] transition">Beranda</Link></li>
              <li><Link href="/menu" className="hover:text-[#F4EAD0] transition">Menu</Link></li>
              <li><Link href="/tentang" className="hover:text-[#F4EAD0] transition">Tentang Kami</Link></li>
              <li><Link href="/order" className="hover:text-[#F4EAD0] transition">Order</Link></li>
            </ul>
          </div>

          {/* Kolom 3: Kontak */}
          <div>
            <h3 className="text-[#F4EAD0] font-semibold mb-4 text-sm uppercase tracking-widest">
              Kontak
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>📍 Kagawa, Jepang</li>
              <li>🕐 Senin – Sabtu: 11.00 – 21.00</li>
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

          {/* Brand */}
          <h2 className="font-serif text-[#F4EAD0] text-lg tracking-widest font-semibold">
            RM. Lamak Bana
          </h2>

          {/* Nav horizontal */}
          <div className="flex items-center gap-5 text-sm text-gray-400">
            <Link href="/" className="hover:text-[#F4EAD0] transition">Beranda</Link>
            <Link href="/menu" className="hover:text-[#F4EAD0] transition">Menu</Link>
            <Link href="/tentang" className="hover:text-[#F4EAD0] transition">Tentang</Link>
            <Link href="/order" className="hover:text-[#F4EAD0] transition">Order</Link>
          </div>

          {/* Info kontak ringkas */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>📍 Kagawa, Jepang</span>
            <span>🕐 11.00 – 21.00</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} Lamak Bana. Semua hak cipta dilindungi.
        </div>
      </div>
    </footer>
  );
}
