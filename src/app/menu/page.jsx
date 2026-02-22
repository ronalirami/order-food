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
            <div className="flex flex-col gap-8">
              {items.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className="flex flex-col sm:flex-row items-center gap-6 border-b border-gray-800 pb-6"
                >
                  <div className="relative w-full sm:w-28 h-40 sm:h-24 rounded-lg overflow-hidden">
                    <Image
                      src={item.gambar}
                      alt={item.nama}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-xl font-semibold text-[#F4EAD0]">
                      {item.nama}
                    </h3>
                    <p className="text-gray-400 text-sm">{item.deskripsi}</p>
                  </div>
                  <div className="text-[#F4EAD0] text-lg font-medium">
                    {item.harga}
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
