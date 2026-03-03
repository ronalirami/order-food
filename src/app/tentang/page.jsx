"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import chefImg from "@/assets/images/hero-side2.jpg";

export default function TentangPage() {
  return (
    <section className="bg-black text-white">
      
      {/* ================= HERO SECTION ================= */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <Image
          src={chefImg}
          alt="Dapur dan tim Lamak Bana"
          fill
          priority
          className="object-cover brightness-50"
        />

        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-serif text-[#F4EAD0] mb-4 tracking-wide">
              Tentang Kami
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Membawa kehangatan Minangkabau ke Jepang dengan sentuhan elegan dan modern.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ================= FILOSOFI SECTION ================= */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-16 items-center"
        >
          <div>
            <h2 className="text-3xl font-serif text-[#F4EAD0] mb-6">
              Filosofi “Lamak Bana”
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Dalam bahasa Minang, <span className="italic">Lamak Bana</span> berarti teramat lezat.
              Filosofi ini menjadi dasar setiap hidangan yang kami sajikan —
              dari pemilihan bahan terbaik hingga proses memasak yang penuh ketelatenan.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Didirikan oleh perantau Minang di Jepang, restoran ini menjadi jembatan budaya —
              mempertemukan cita rasa Nusantara dengan kehalusan estetika Jepang.
              Kami percaya makanan bukan sekadar rasa, melainkan pengalaman dan cerita.
            </p>
          </div>

          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src={chefImg}
              alt="Interior restoran"
              fill
              className="object-cover"
            />
          </div>
        </motion.div>
      </div>

      {/* ================= HIGHLIGHT ================= */}
      <div className="bg-[#111] py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12 grid md:grid-cols-3 gap-8 text-center">
          {[
            {
              title: "🇯🇵 Berdiri di Jepang",
              desc: "Didirikan tahun 2024 di Kagawa, mengusung semangat perantauan dan kecintaan pada kuliner Nusantara.",
            },
            {
              title: "Rasa Autentik Minang",
              desc: "Resep asli Minangkabau dengan teknik memasak tradisional yang diwariskan turun-temurun.",
            },
            {
              title: "Harmoni Budaya",
              desc: "Menggabungkan kekayaan rasa Minang dengan estetika dan keramahan Jepang.",
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="bg-black p-8 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300"
            >
              <h3 className="text-[#F4EAD0] text-xl font-semibold mb-3">
                {card.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ================= CTA ================= */}
      <div className="py-24 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-serif text-[#F4EAD0] mb-6">
            Siap merasakan kelezatan sejati?
          </h2>

          <Link
            href="/order"
            className="inline-block bg-[#F4EAD0] text-black px-10 py-3 rounded-lg text-lg font-medium hover:bg-white transition duration-300"
          >
            Order Sekarang
          </Link>
        </motion.div>
      </div>
    </section>
  );
}