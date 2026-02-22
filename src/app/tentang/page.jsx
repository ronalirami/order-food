"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import chefImg from "@/assets/images/hero-side2.jpg"; // ganti nanti dengan foto asli dapur/tim

export default function TentangPage() {
  return (
    <section className="min-h-screen bg-black text-white px-12 py-20 flex flex-col items-center">
      {/* === JUDUL HALAMAN === */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-serif text-[#F4EAD0] mb-3">TENTANG KAMI</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Kami membawa cita rasa Minangkabau ke Jepang dengan sentuhan modern —
          menghadirkan pengalaman makan yang hangat, autentik, dan elegan.
        </p>
      </motion.div>

      {/* === FOTO + FILOSOFI === */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="flex gap-12 max-lg:flex-col items-center mb-20"
      >
        <div className="relative w-1/2 h-[400px] rounded-2xl overflow-hidden max-lg:w-full">
          <Image
            src={chefImg}
            alt="Dapur dan tim Lamak Bana"
            fill
            className="object-cover brightness-90"
          />
        </div>

        <div className="w-1/2 max-lg:w-full">
          <h2 className="text-2xl font-semibold text-[#F4EAD0] mb-3">
            Filosofi “Lamak Bana”
          </h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Dalam bahasa Minang, “Lamak Bana” berarti *teramat lezat*.  
            Filosofi ini menggambarkan dedikasi kami dalam setiap proses —
            dari pemilihan bahan, cara memasak, hingga penyajian di meja Anda.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Didirikan oleh perantau Minang di Jepang, kami berkomitmen menjaga cita rasa asli 
            sekaligus menyesuaikannya dengan kehalusan budaya Jepang.  
            Kami percaya, makanan bukan hanya soal rasa, tapi juga tentang cerita, tradisi, dan kebersamaan.
          </p>
        </div>
      </motion.div>

      {/* === HIGHLIGHT CARD === */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3 }}
        viewport={{ once: true }}
        className="grid grid-cols-3 gap-6 text-center max-lg:grid-cols-1 w-full max-w-6xl"
      >
        {[
          {
            title: "🇯🇵 Berdiri di Jepang",
            desc: "Didirikan tahun 2024 di Kagawa, menggabungkan semangat perantauan dan kecintaan pada kuliner Nusantara.",
          },
          {
            title: "Rasa Autentik Minang",
            desc: "Semua resep berasal dari dapur tradisional Minangkabau — mempertahankan bumbu asli dan teknik memasak turun-temurun.",
          },
          {
            title: "Harmoni Budaya",
            desc: "Menghadirkan nuansa Minang yang berpadu dengan keramahan dan estetika Jepang.",
          },
        ].map((card, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03 }}
            className="bg-[#111] p-8 rounded-2xl hover:bg-[#1a1a1a] transition"
          >
            <h3 className="text-[#F4EAD0] text-xl font-semibold mb-2">
              {card.title}
            </h3>
            <p className="text-gray-400 text-sm">{card.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* === CTA === */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
        viewport={{ once: true }}
        className="mt-20 text-center"
      >
        <h2 className="text-2xl font-serif text-[#F4EAD0] mb-4">
          Siap merasakan kelezatan sejati?
        </h2>
        <Link
          href="/order"
          className="inline-block bg-[#F4EAD0] text-black px-8 py-3 rounded-lg text-lg font-medium hover:bg-white transition"
        >
          Order NOW
        </Link>
      </motion.div>
    </section>
  );
}
