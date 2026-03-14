"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { menuItems } from "@/data/menuData";
import { useCart } from "@/context/CartContext";

export default function OrderPage() {
  const { cart, addToCart, increaseQty, decreaseQty, removeFromCart, totalHarga } = useCart();

  const formatYen = (number) => new Intl.NumberFormat("ja-JP").format(number);

  return (
    <section className="min-h-screen bg-black text-white px-6 md:px-20 py-16">
      {/* ========================= */}
      {/* JUDUL */}
      {/* ========================= */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-serif text-[#F4EAD0] mb-3">
          Order Sekarang
        </h1>
        <p className="text-gray-400">
          Pilih menu favorit Anda dan pesan langsung dari meja.
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-12">
        {/* ========================= */}
        {/* DAFTAR MENU */}
        {/* ========================= */}
        <div className="flex-1">
          {menuItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex gap-6 mb-10 border-b border-gray-800 pb-6"
            >
              <div className="relative w-32 h-24 rounded-lg overflow-hidden">
                <Image
                  src={item.gambar}
                  alt={item.nama}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-semibold text-[#F4EAD0]">
                  {item.nama}
                </h3>
                <p className="text-gray-400 text-sm">{item.deskripsi}</p>
                <p className="text-[#F4EAD0] mt-2 font-medium">
                  ¥{formatYen(item.harga)}
                </p>
              </div>

              <button
                onClick={() => addToCart(item)}
                className="bg-[#F4EAD0] text-black px-4 py-2 rounded-lg hover:bg-white transition"
              >
                Pesan
              </button>
            </motion.div>
          ))}
        </div>

        {/* ========================= */}
        {/* KERANJANG */}
        {/* ========================= */}
        <div className="w-full md:w-1/3 bg-[#111] p-6 rounded-2xl h-fit sticky top-16 shadow-lg">
          <h2 className="text-2xl font-serif text-[#F4EAD0] mb-4">
            Keranjang
          </h2>

          {cart.length === 0 ? (
            <p className="text-gray-400">Belum ada pesanan.</p>
          ) : (
            <div className="space-y-5">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="border-b border-gray-700 pb-4"
                >
                  <div className="flex justify-between">
                    <p className="font-medium">{item.nama}</p>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-600 text-sm"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => decreaseQty(item.id)}
                        className="px-2 bg-gray-700 rounded hover:bg-gray-600"
                      >
                        −
                      </button>

                      <span>{item.qty}</span>

                      <button
                        onClick={() => increaseQty(item.id)}
                        className="px-2 bg-gray-700 rounded hover:bg-gray-600"
                      >
                        +
                      </button>
                    </div>

                    <p className="text-[#F4EAD0]">
                      ¥{formatYen(item.harga * item.qty)}
                    </p>
                  </div>
                </div>
              ))}

              {/* TOTAL */}
              <div className="border-t border-gray-700 pt-4 flex justify-between">
                <span className="text-gray-400">Total</span>
                <span className="text-[#F4EAD0] font-semibold">
                  ¥{formatYen(totalHarga)}
                </span>
              </div>

              {/* BUTTON */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-[#F4EAD0] text-black py-3 rounded-lg mt-4 font-medium hover:bg-white transition"
              >
                Konfirmasi Pesanan
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}