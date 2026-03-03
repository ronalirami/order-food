import Image from "next/image";
import Link from "next/link";
import heroMain from "@/assets/images/hero-main.png";
import heroSide1 from "@/assets/images/hero-side-1.jpg";
import heroSide2 from "@/assets/images/hero-side-2.jpg";
import heroSide3 from "@/assets/images/hero-side-3.jpg";
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

function HeroCard({ image }) {
  return (
    <div className="relative">
      <Image
        src={image}
        alt="Hero"
        fill
        className="object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

    </div>
  );
}
