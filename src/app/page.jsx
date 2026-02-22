import Image from "next/image";
import Link from "next/link";
import { Instagram, Facebook, Twitter } from "lucide-react";
import { ArrowRight } from "lucide-react";
import heroMain from "@/assets/images/hero-main.png";
import heroSide1 from "@/assets/images/hero-side1.jpg";
import heroSide2 from "@/assets/images/hero-side2.jpg";
import heroSide3 from "@/assets/images/hero-side3.jpg";

export default function HomePage(){
  return (
    <section className="relative w-full h-screen flex overflow-hidden">
      <div className="relative flex-1 rounded-2xl overflow-hidden mr-2">
        <Image
        src={heroMain}
        alt="Menu utama"
        fill
        priority
        className="object-cover brightness-30"
        />
        
        <div className="absolute inset-0 flex flex-col justify-end pb-16 px-16 text-white z-10">
          <h1 className="text-6xl font-serif tracking-wide text-[#F4EAD0] mb-4">
            NasiPadang <br /> MARANTAU
          </h1>
        </div>

        <div className="absolute bottom-6 right-6 flex gap-4 text-white z-20">
          <Link href="#" className="p-2 bg-white/10 hover: bg-white/20 rounded-full transition"
          aria-label="Instagram"
          >
            <Instagram size={20} />
          </Link>
          <Link href="#" className="p-2 bg-white/10 hover: bg-white/20 rounded-full transition"
          aria-label="Facebook"
          >
            <Facebook size={20} />
          </Link>
          <Link href="#" className="p-2 bg-white/10 hover: bg-white/20 rounded-full transition"
          aria-label="Twitter"
          >
            <Twitter size={20} />
          </Link>
          </div>    
      </div>
      {/* === Kolom kanan (3 gambar kecil) === */}
      <div className="w-[25%] grid grid-rows-3 gap-2">
        {/* Hero side 1 */}
        <div className="relative h-full overflow-hidden rounded-xl">
          <Image
          src={heroSide1}
          alt="Menu pilihan"
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolut inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

          {/* Lengkungan kedalam kanan bawah */}
          <div className="absolute bottom-0 right-0 w-26 h-8 bg-black rounded-tl-[3rem]"></div>

          {/* Tombol MENU */}
          <div className="absolute bottom-1 right-2 flex items-center gap-2 text-white z-10">
            <div 
            className="text-sm tracking-wide font-light"
            >
              Menu
            </div>
            <Link href="/menu"
            className="w-8 h-6 flex items-center justify-center rounded-full border border-white hover:bg-white hover:text-black transition">
              <ArrowRight size={15}/> 
            </Link>
          </div>
        </div>

        {/* Heroside2  */}
        <div className="relative h-full overflow-hidden rounded-xl">
          <Image
          src={heroSide2}
          alt="Tentang reservasi"
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        {/* Lengkungan kedalam */}
        <div className="absolute bottom-0 right-0 w-32 h-8 bg-black rounded-tl-[3rem]"></div>

        {/* Tombol reservasi */}
          <div className="absolute bottom-0 right-2 flex items-center gap-2 text-white z-10">
          <div className="text-sm tracking-wide font-light">
            Reservasi
          </div>

          {/* tombol arrow/panah */}
          <Link href="/order"
           className="w-8 h-6 flex items-center justify-center rounded-full border border-white hover:bg-white hover:text-black transition">
            <ArrowRight size={15}/>
          </Link>
        </div>
        </div>

        {/* Heroside3 */}
        {/* Gambar */}
        <div className="relative h-full overflow-hidden rounded-xl">
          <Image
          src={heroSide3}
          alt="Interior restoran"
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

          {/* LEngkungan */}
          <div className="absolute bottom-0 right-0 w-32 h-8 bg-black rounded-tl-[3rem]"></div>

          {/* Tulisan tentang */}
          <div className="absolute bottom-1 right-2 flex items-center gap-2 text-white z-10">
            <div className="text-sm tracking-wide font-light">
              Tentang
            </div>
              {/* tombol arrow */}
          <Link href="/tentang"
          className="w-8 h-6 flex items-center justify-center rounded-full border border-white hover:bg-white hover:text-black transition">
            <ArrowRight size={15}/>
          </Link>
          </div>

        
        </div>
      </div>
    </section>
  )
}
