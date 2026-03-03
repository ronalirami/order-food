import Image from "next/image";
import Link from "next/link";
import heroMain from "@/assets/images/hero-main.png";
import heroSide1 from "@/assets/images/hero-side1.jpg";
import heroSide2 from "@/assets/images/hero-side2.jpg";
import heroSide3 from "@/assets/images/hero-side3.jpg";
export default function HomePage() {
  return (
    <section className="w-full h-screen flex overflow-hidden ">
      {/* Left Hero */}
      <div className="relative flex-1 rounded-2xl overflow-hidden mr-2">
        <Image
          src={heroMain}
          alt="Hero"
          fill
          className="object-cover brightness-50"
        />
      </div>

      {/* Right Grid */}
      <div className="w-1/4 grid grid-rows-3 gap-2">
        <HeroCard image={heroSide1} link="/menu" label="Menu" />
        <HeroCard image={heroSide2} link="/order" label="Reservasi" />
        <HeroCard image={heroSide3} link="/tentang" label="Tentang" />
      </div>
    </section>
  );
}

function HeroCard({ image, link, label }) {
  return (
    <div className="relative rounded-xl overflow-hidden group">
      <Image
        src={image}
        alt="label"
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

      <div className="absolute bottom-4 right-4">
        <Link
          href={link}
          className="text-white border border-white px-3 py-1 rounded-full hover:bg-white hover:text-black transition"
        >
          {label}
        </Link>
      </div>

    </div>
  );
}
