"use client";
import Image from "next/image";
import { motion } from "framer-motion";
// ✅ ① Import Container yang baru kamu buat
import Container from "@/components/Container";

export default function MenuPage() {
  // ✅ ② Data menu (boleh tetap sama seperti sebelumnya)
  const menuData = {
    makanan: [
      {
        nama: "Rendang Daging Sapi",
        deskripsi:
          "Dimasak perlahan dengan rempah-rempah khas Minang hingga empuk dan kaya rasa.",
        harga: "¥1200",
        gambar: "/images/heroside1.jpg",
      },
      {
        nama: "Ayam Pop",
        deskripsi:
          "Ayam khas Padang yang lembut dengan sambal merah segar dan gurih.",
        harga: "¥1000",
        gambar: "/images/ayam-pop.jpg",
      },
      {
        nama: "Gulai Tunjang",
        deskripsi:
          "Tulang sapi dengan daging lembut disajikan dengan kuah santan kental dan harum.",
        harga: "¥1300",
        gambar: "/images/gulai-tunjang.jpg",
      },
    ],
  };

  return (
    // ✅ ③ Tambahkan Container untuk membungkus seluruh isi halaman
    <section className="bg-black text-white">
      <Container>
        {/* === Judul Halaman === */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h1 className="title">Daftar Menu</h1> {/* gunakan class dari globals.css */}
          <p className="subtitle">
            Pilihan hidangan terbaik dari dapur Minangkabau kami — autentik,
            lembut, dan penuh cita rasa.
          </p>
        </motion.div>

        {/* === Kategori Menu === */}
        {Object.entries(menuData).map(([kategori, items], idx) => (
          <motion.div
            key={kategori}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: idx * 0.2 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            {/* Judul kategori */}
            <h2 className="text-3xl font-serif text-[#F4EAD0] border-b border-gray-700 pb-2 mb-8">
              {kategori.charAt(0).toUpperCase() + kategori.slice(1)}
            </h2>

            {/* Daftar menu */}
            {/* Daftar menu */}
<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
  {items.map((item, index) => (
    <motion.div
      key={index}
      whileHover={{ y: -5 }}
      className="bg-[#111] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300"
    >
      {/* Gambar */}
      <div className="relative w-full h-56 overflow-hidden">
        <Image
          src={item.gambar}
          alt={item.nama}
          fill
          className="object-cover hover:scale-105 transition duration-500"
        />
      </div>

      {/* Konten */}
      <div className="p-6 flex flex-col justify-between h-48">
        <div>
          <h3 className="text-xl font-semibold text-[#F4EAD0] mb-2">
            {item.nama}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-3">
            {item.deskripsi}
          </p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className="text-[#F4EAD0] font-bold text-lg">
            {item.harga}
          </span>

          <button className="bg-[#F4EAD0] text-black px-4 py-1 rounded-full text-sm font-semibold hover:bg-white transition">
            + Tambah
          </button>
        </div>
      </div>
    </motion.div>
  ))}
</div>

          </motion.div>
        ))}
      </Container> 
      {/* ✅ ④ Tutup Container di sini */}
    </section>
  );
}
