"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { menuItems } from "@/data/menuData";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";

export default function OrderPageClient() {
  const searchParams = useSearchParams();
  const rawToken = searchParams.get("t")?.trim() ?? "";

  const { cart, addToCart, increaseQty, decreaseQty, removeFromCart, totalHarga, clearCart } = useCart();
  const { t } = useLanguage();

  const [gateLoading, setGateLoading] = useState(!!rawToken);
  const [gateOk, setGateOk] = useState(false);
  const [mejaTerikat, setMejaTerikat] = useState("");
  const [tokenRowId, setTokenRowId] = useState(null);
  const [orderingSecret, setOrderingSecret] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [namaPemesan, setNamaPemesan] = useState("");
  const [pesananDikirim, setPesananDikirim] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const verifyToken = useCallback(async (token) => {
    setGateLoading(true);
    try {
      const res = await fetch(`/api/order-token/verify?t=${encodeURIComponent(token)}`);
      const data = await res.json();
      if (!res.ok || !data.valid) {
        setGateOk(false);
        setMejaTerikat("");
        setTokenRowId(null);
        setOrderingSecret("");
      } else {
        setGateOk(true);
        setMejaTerikat(data.nomor_meja ?? "");
        setTokenRowId(data.token_row_id ?? null);
        setOrderingSecret(token);
      }
    } catch {
      setGateOk(false);
      setMejaTerikat("");
      setTokenRowId(null);
      setOrderingSecret("");
    } finally {
      setGateLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!rawToken) {
      setGateOk(false);
      setGateLoading(false);
      setMejaTerikat("");
      setTokenRowId(null);
      setOrderingSecret("");
      return;
    }
    verifyToken(rawToken);
  }, [rawToken, verifyToken]);

  const handleKonfirmasi = async () => {
    if (!namaPemesan.trim() || !mejaTerikat.trim() || !orderingSecret) return;
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama_pemesan: namaPemesan.trim(),
          nomor_meja: mejaTerikat.trim(),
          items: cart.map((item) => ({
            nama: item.nama,
            qty: item.qty,
            harga: item.harga,
          })),
          total_harga: totalHarga,
          ordering_token: orderingSecret,
          order_token_row_id: tokenRowId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal mengirim pesanan");
      }

      setPesananDikirim(true);
      setTimeout(() => {
        clearCart();
        setShowModal(false);
        setPesananDikirim(false);
        setNamaPemesan("");
      }, 2800);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatYen = (number) => new Intl.NumberFormat("ja-JP").format(number);

  if (!rawToken && !gateLoading) {
    return (
      <section className="min-h-screen bg-black text-white px-6 md:px-20 flex flex-col items-center justify-center" style={{ paddingTop: "6rem", paddingBottom: "4rem" }}>
        <div className="max-w-md text-center space-y-4">
          <div className="text-5xl mb-2" aria-hidden>📱</div>
          <h1 className="text-3xl font-serif text-[#F4EAD0]">{t("order.qrGateTitle")}</h1>
          <p className="text-gray-400 leading-relaxed">{t("order.qrGateBody")}</p>
          <Link href="/menu" className="inline-block mt-6 text-[#F4EAD0] border border-[#F4EAD0] px-5 py-2 rounded-lg hover:bg-[#F4EAD0]/10 transition">
            {t("order.qrGateMenuLink")}
          </Link>
        </div>
      </section>
    );
  }

  if (gateLoading) {
    return (
      <section className="min-h-screen bg-black text-white flex items-center justify-center" style={{ paddingTop: "6rem" }}>
        <p className="text-gray-400">{t("order.qrChecking")}</p>
      </section>
    );
  }

  if (rawToken && !gateOk) {
    return (
      <section className="min-h-screen bg-black text-white px-6 md:px-20 flex flex-col items-center justify-center" style={{ paddingTop: "6rem", paddingBottom: "4rem" }}>
        <div className="max-w-md text-center space-y-4">
          <div className="text-5xl mb-2" aria-hidden>⛔</div>
          <h1 className="text-2xl font-serif text-red-400">{t("order.qrInvalidTitle")}</h1>
          <p className="text-gray-400">{t("order.qrInvalidBody")}</p>
          <Link href="/menu" className="inline-block mt-4 text-[#F4EAD0] underline">
            {t("order.qrGateMenuLink")}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-black text-white px-6 md:px-20" style={{ paddingTop: "8rem", paddingBottom: "4rem" }}>
      <motion.div initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center mb-8">
        <h1 className="text-5xl font-serif text-[#F4EAD0] mb-3">{t("order.title")}</h1>
        <p className="text-gray-400">{t("order.subtitle")}</p>
        <p className="text-[#a8dc7a]/90 text-sm mt-3 font-medium">
          {t("order.tableLocked")}
          {": "}
          <span className="text-[#F4EAD0]">#{mejaTerikat}</span>
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-12">
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
                <Image src={item.gambar} alt={item.nama} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-[#F4EAD0]">{item.nama}</h3>
                <p className="text-gray-400 text-sm">{item.deskripsi}</p>
                <p className="text-[#F4EAD0] mt-2 font-medium">¥{formatYen(item.harga)}</p>
              </div>
              <button type="button" onClick={() => addToCart(item)} className="bg-[#F4EAD0] text-black px-4 py-2 rounded-lg hover:bg-white transition self-center">
                {t("order.pesan")}
              </button>
            </motion.div>
          ))}
        </div>

        <div className="w-full md:w-1/3 bg-[#111] p-6 rounded-2xl h-fit sticky top-16 shadow-lg">
          <h2 className="text-2xl font-serif text-[#F4EAD0] mb-4">{t("order.keranjang")}</h2>

          {cart.length === 0 ? (
            <p className="text-gray-400">{t("order.belumAda")}</p>
          ) : (
            <div className="space-y-5">
              {cart.map((item) => (
                <div key={item.id} className="border-b border-gray-700 pb-4">
                  <div className="flex justify-between">
                    <p className="font-medium">{item.nama}</p>
                    <button type="button" onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 text-sm">
                      ✕
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => decreaseQty(item.id)} className="px-2 bg-gray-700 rounded hover:bg-gray-600">
                        −
                      </button>
                      <span>{item.qty}</span>
                      <button type="button" onClick={() => increaseQty(item.id)} className="px-2 bg-gray-700 rounded hover:bg-gray-600">
                        +
                      </button>
                    </div>
                    <p className="text-[#F4EAD0]">¥{formatYen(item.harga * item.qty)}</p>
                  </div>
                </div>
              ))}

              <div className="border-t border-gray-700 pt-4 flex justify-between">
                <span className="text-gray-400">{t("order.total")}</span>
                <span className="text-[#F4EAD0] font-semibold">¥{formatYen(totalHarga)}</span>
              </div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowModal(true)}
                className="w-full bg-[#F4EAD0] text-black py-3 rounded-lg mt-4 font-medium hover:bg-white transition"
              >
                {t("order.konfirmasi")}
              </motion.button>
            </div>
          )}
        </div>
      </div>

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
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="text-2xl font-serif text-[#F4EAD0] mb-2">{t("order.sukses")}</h3>
                  <p className="text-gray-400 text-sm">
                    {t("order.suksesMsg")} <span className="text-white">{namaPemesan}</span>. {t("order.suksesMsg2")}{" "}
                    <span className="text-white">#{mejaTerikat}</span> {t("order.suksesMsg3")}
                  </p>
                  <p className="text-gray-500 text-xs mt-4">{t("order.bayarKasir")}</p>
                </motion.div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-serif text-[#F4EAD0]">{t("order.modalTitle")}</h3>
                    <button type="button" onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white transition text-xl">
                      ✕
                    </button>
                  </div>

                  <div className="space-y-2 mb-6 max-h-48 overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-300">
                          {item.nama} <span className="text-gray-500">x{item.qty}</span>
                        </span>
                        <span className="text-[#F4EAD0]">¥{formatYen(item.harga * item.qty)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-700 pt-3 flex justify-between mb-4">
                    <span className="text-gray-400 text-sm">{t("order.total")}</span>
                    <span className="text-[#F4EAD0] font-semibold">¥{formatYen(totalHarga)}</span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <input
                      type="text"
                      placeholder={t("order.namaPemesan")}
                      value={namaPemesan}
                      onChange={(e) => setNamaPemesan(e.target.value)}
                      className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#F4EAD0] transition"
                    />
                    <div className="bg-black border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-400">
                      {t("order.nomorMeja")}: <span className="text-[#F4EAD0]">{mejaTerikat}</span>
                    </div>
                  </div>

                  {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
                  <motion.button
                    type="button"
                    whileHover={{ scale: isLoading ? 1 : 1.03 }}
                    whileTap={{ scale: isLoading ? 1 : 0.97 }}
                    onClick={handleKonfirmasi}
                    disabled={!namaPemesan.trim() || isLoading}
                    className="w-full bg-[#F4EAD0] text-black py-3 rounded-lg font-medium hover:bg-white transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isLoading ? t("order.mengirim") : t("order.konfirmasiKirim")}
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
