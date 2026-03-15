"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import chefImg from "@/assets/images/hero-side2.jpg";
import filosofiImg from "@/assets/images/hero-side3.jpg";
import { useLanguage } from "@/context/LanguageContext";

export default function TentangPage() {
  const { t } = useLanguage();

  return (
    <section className="bg-black text-white">

      {/* HERO SECTION */}
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
              {t("tentang.heroTitle")}
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              {t("tentang.heroSubtitle")}
            </p>
          </motion.div>
        </div>
      </div>

      {/* FILOSOFI SECTION */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-10 md:gap-16 items-center"
        >
          {/* Teks */}
          <div>
            <h2 className="text-2xl md:text-3xl font-serif text-[#F4EAD0] mb-6">
              {t("tentang.filosofiTitle")}
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              {t("tentang.filosofiP1")}
            </p>
            <p className="text-gray-400 leading-relaxed">
              {t("tentang.filosofiP2")}
            </p>
          </div>

          {/* Gambar berbeda dari hero */}
          <div
            className="relative rounded-2xl overflow-hidden shadow-xl"
            style={{ height: "280px" }}
          >
            <Image
              src={filosofiImg}
              alt="Suasana restoran Lamak Bana"
              fill
              className="object-cover"
            />
          </div>
        </motion.div>
      </div>

      {/* HIGHLIGHT CARDS */}
      <div className="bg-[#111] py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-8 text-center">
          {[
            { title: t("tentang.h1"), desc: t("tentang.h1desc") },
            { title: t("tentang.h2"), desc: t("tentang.h2desc") },
            { title: t("tentang.h3"), desc: t("tentang.h3desc") },
          ].map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className={`bg-black p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 ${
                i === 2 ? "col-span-2 md:col-span-1" : ""
              }`}
            >
              <h3 className="text-[#F4EAD0] text-base md:text-xl font-semibold mb-3">
                {card.title}
              </h3>
              <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center px-6" style={{ paddingTop: "6rem", paddingBottom: "10rem" }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-serif text-[#F4EAD0] mb-6">
            {t("tentang.ctaTitle")}
          </h2>
          <Link
            href="/order"
            className="inline-block bg-[#F4EAD0] text-black px-10 py-3 rounded-lg text-lg font-medium hover:bg-white transition duration-300"
          >
            {t("tentang.ctaBtn")}
          </Link>
        </motion.div>
      </div>

    </section>
  );
}
