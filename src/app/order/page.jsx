"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { menuItems } from "@/data/menuData";
import { useCart } from "@/context/CartContext";

export default function OrderPage() {
  const { cart, addToCart, increaseQty, decreaseQty, removeFromCart, totalHarga, clearCart } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [namaPemesan, setNamaPemesan] = useState("");
  const [nomorMeja, setNomorMeja] = useState("");
  const [pesananDikirim, setPesananDikirim] = useState(false);

  const formatYen = (number) => new Intl.NumberFormat("ja-JP").format(number);

  const handleKonfirmasi = () => {
    if (!namaPemesan.trim() || !nomorMeja.trim()) return;
    setPesananDikirim(true);
    setTimeout(() => {
      clearCart();
      setShowModal(false);
      setPesananDikirim(false);
      setNamaPemesan("");
      setNomorMeja("");
    }, 2500);
  };

  return (
    <section className="min-h-screen bg-black text-white px-6 md:px-20" style={{ paddingTop: "8rem", paddingBottom: "4rem" }}>
      {/* JUDUL */}
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
        {/* DAFTAR MENU */}
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
                className="bg-[#F4EAD0] text-black px-4 py-2 rounded-lg hover:bg-white transition self-center"
              >
                Pesan
              </button>
            </motion.div>
          ))}
        </div>

        {/* KERANJANG */}
        <div className="w-full md:w-1/3 bg-[#111] p-6 rounded-2xl h-fit sticky top-16 shadow-lg">
          <h2 className="text-2xl font-serif text-[#F4EAD0] mb-4">
            Keranjang
          </h2>

          {cart.length === 0 ? (
            <p className="text-gray-400">Belum ada pesanan.</p>
          ) : (
            <div className="space-y-5">
              {cart.map((item) => (
                <div key={item.id} className="border-b border-gray-700 pb-4">
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

              {/* TOMBOL KONFIRMASI */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowModal(true)}
                className="w-full bg-[#F4EAD0] text-black py-3 rounded-lg mt-4 font-medium hover:bg-white transition"
              >
                Konfirmasi Pesanan
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* MODAL KONFIRMASI */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-[#111] rounded-2xl p-8 w-full max-w-md shadow-2xl"
            >
              {pesananDikirim ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6"
                >
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="text-2xl font-serif text-[#F4EAD0] mb-2">
                    Pesanan Diterima!
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Terima kasih, <span className="text-white">{namaPemesan}</span>.
                    Pesanan meja <span className="text-white">#{nomorMeja}</span> sedang diproses.
                  </p>
                </motion.div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-serif text-[#F4EAD0]">
                      Konfirmasi Pesanan
                    </h3>
                    <button
                      onClick={() => setShowModal(false)}
                      className="text-gray-500 hover:text-white transition text-xl"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Ringkasan pesanan */}
                  <div className="space-y-2 mb-6 max-h-48 overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-300">
                          {item.nama} <span className="text-gray-500">x{item.qty}</span>
                        </span>
                        <span className="text-[#F4EAD0]">
                          ¥{formatYen(item.harga * item.qty)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-700 pt-3 flex justify-between mb-6">
                    <span className="text-gray-400 text-sm">Total</span>
                    <span className="text-[#F4EAD0] font-semibold">
                      ¥{formatYen(totalHarga)}
                    </span>
                  </div>

                  {/* Input */}
                  <div className="space-y-3 mb-6">
                    <input
                      type="text"
                      placeholder="Nama pemesan"
                      value={namaPemesan}
                      onChange={(e) => setNamaPemesan(e.target.value)}
                      className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#F4EAD0] transition"
                    />
                    <input
                      type="text"
                      placeholder="Nomor meja"
                      value={nomorMeja}
                      onChange={(e) => setNomorMeja(e.target.value)}
                      className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#F4EAD0] transition"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleKonfirmasi}
                    disabled={!namaPemesan.trim() || !nomorMeja.trim()}
                    className="w-full bg-[#F4EAD0] text-black py-3 rounded-lg font-medium hover:bg-white transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Konfirmasi & Kirim Pesanan
                  </motion.button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
