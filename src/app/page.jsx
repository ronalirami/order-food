import Image from "next/image";
import Link from "next/link";
import heroMain from "@/assets/images/hero-main.png";
import heroSide1 from "@/assets/images/hero-side1.jpg";
import heroSide2 from "@/assets/images/hero-side2.jpg";
import heroSide3 from "@/assets/images/hero-side3.jpg";

export default function HomePage() {
  return (
    <section className="w-full h-screen flex flex-row gap-2 overflow-hidden p-2">

      {/* HERO UTAMA */}
      <div className="relative flex-1 rounded-2xl overflow-hidden">
        <Image
          src={heroMain}
          alt="Menu Utama"
          fill
          priority
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 flex items-end px-6 md:px-16 pb-8 md:pb-16 z-10">
          <h1 className="text-3xl md:text-6xl font-serif text-[#F4EAD0] drop-shadow-lg">
            Lamak Bana <br /> Restoran Padang
          </h1>
        </div>
      </div>

      {/* GRID 3 KARTU */}
      <div className="flex flex-col gap-2 w-1/3 md:w-1/4">
        <HeroCard image={heroSide1} link="/menu" label="Menu" />
        <HeroCard image={heroSide2} link="/order" label="Order" />
        <HeroCard image={heroSide3} link="/tentang" label="Tentang" />
      </div>

    </section>
  );
}

function HeroCard({ image, link, label }) {
  return (
    <div className="relative flex-1 rounded-xl overflow-hidden group">
      <Image
        src={image}
        alt={label}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-3 right-3">
        <Link
          href={link}
          className="text-white border border-white px-3 py-1 rounded-full text-xs md:text-sm hover:bg-white hover:text-black transition backdrop-blur-sm"
        >
          {label}
        </Link>
      </div>
    </div>
  );
}
