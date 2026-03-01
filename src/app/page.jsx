import Image from "next/image";
import Link from "next/link";
import { Instagram, Facebook, Twitter, ArrowRight } from "lucide-react";

import heroMain from "@/assets/images/hero-main.png";
import heroSide1 from "@/assets/images/hero-side1.jpg";
import heroSide2 from "@/assets/images/hero-side2.jpg";
import heroSide3 from "@/assets/images/hero-side3.jpg";

export default function HomePage() {
  return (
    <section className="relative w-full h-screen flex overflow-hidden">
      {/* ================= LEFT MAIN HERO ================= */}
      <div className="relative flex-1 rounded-2xl overflow-hidden mr-2">
        <Image
          src={heroMain}
          alt="Menu utama"
          fill
          priority
          className="object-cover brightness-50"
        />

        {/* Overlay Text */}
        <div className="absolute inset-0 flex flex-col justify-end pb-16 px-16 z-10">
          <h1 className="text-6xl font-serif tracking-wide text-[#F4EAD0] mb-4">
            Nasi Padang <br /> MARANTAU
          </h1>
        </div>

        {/* Social Icons */}
        <div className="absolute bottom-6 right-6 flex gap-4 z-20">
          {[Instagram, Facebook, Twitter].map((Icon, i) => (
            <Link
              key={i}
              href="#"
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition"
            >
              <Icon size={20} className="text-white" />
            </Link>
          ))}
        </div>
      </div>

      {/* ================= RIGHT SIDE GRID ================= */}
      <div className="w-[25%] grid grid-rows-3 gap-2">
        {/* === CARD 1 (MENU) === */}
        <HeroCard
          image={heroSide1}
          label="Menu"
          link="/menu"
        />

        {/* === CARD 2 (RESERVASI) === */}
        <HeroCard
          image={heroSide2}
          label="Reservasi"
          link="/order"
        />

        {/* === CARD 3 (TENTANG) === */}
        <HeroCard
          image={heroSide3}
          label="Tentang"
          link="/tentang"
        />
      </div>
    </section>
  );
}

/* ================= REUSABLE HERO CARD ================= */
function HeroCard({ image, label, link }) {
  return (
    <div className="relative h-full overflow-hidden rounded-xl group">
      <Image
        src={image}
        alt={label}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

      {/* Curve Decoration */}
      <div className="absolute bottom-0 right-0 w-32 h-8 bg-black rounded-tl-[3rem]"></div>

      {/* Label & Button */}
      <div className="absolute bottom-2 right-2 flex items-center gap-2 z-10">
        <span className="text-sm tracking-wide font-light text-white">
          {label}
        </span>

        <Link
          href={link}
          className="w-8 h-6 flex items-center justify-center rounded-full border border-white text-white hover:bg-white hover:text-black transition"
        >
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}