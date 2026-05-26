"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Minus, Plus, Trash2, X } from "lucide-react";
import {
  ORDER_TABLE_TOKEN_STORAGE_KEY,
  ORDER_TOKEN_CHANGED_EVENT,
} from "@/lib/orderSessionToken";
import {
  OPEN_ORDER_MOBILE_CART_EVENT,
} from "@/lib/orderMobileCartUi";
import { menuItems } from "@/data/menuData";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";

function notifyOrderTokenChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(ORDER_TOKEN_CHANGED_EVENT));
}

/** Isi kartu keranjang + total + tombol konfirmasi — dipakai sidebar desktop & bottom sheet mobile. */
function OrderCartPanelContent({
  t,
  formatYen,
  cart,
  totalHarga,
  increaseQty,
  decreaseQty,
  removeFromCart,
  onKonfirmasi,
}) {
  return (
    <>
      <h2 className="text-2xl font-serif text-[#F4EAD0] mb-4">{t("order.keranjang")}</h2>

      {cart.length === 0 ? (
        <p className="text-gray-400 text-sm">{t("order.belumAda")}</p>
      ) : (
        <div className="space-y-3">
          {cart.map((item) => (
            <article
              key={item.id}
              className="rounded-xl bg-gradient-to-br from-zinc-900/90 to-neutral-950/90 border border-zinc-800/90 p-4 shadow-inner shadow-black/20"
            >
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-[#F4EAD0] text-[15px] leading-snug pr-1">{item.nama}</h3>
                  <p className="mt-2 text-[11px] tracking-wide text-zinc-500">
                    {t("order.satuan")} ¥{formatYen(item.harga)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  className="flex shrink-0 items-center gap-1.5 rounded-lg border border-red-500/25 bg-red-950/55 px-2.5 py-2 text-xs font-medium text-red-200 hover:bg-red-900/65 hover:border-red-400/40 active:scale-[0.97] transition"
                  aria-label={t("order.hapusItemAria")}
                >
                  <Trash2 className="size-3.5 stroke-[2.25]" aria-hidden />
                  <span>{t("order.hapusItem")}</span>
                </button>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div
                  className="inline-flex items-center rounded-full bg-black/50 border border-zinc-700/90 p-0.5 shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => decreaseQty(item.id)}
                    className="flex size-9 items-center justify-center rounded-full text-zinc-300 hover:bg-zinc-800 hover:text-[#F4EAD0] transition"
                    aria-label={t("order.kurangiQty")}
                  >
                    <Minus className="size-4" strokeWidth={2.25} />
                  </button>
                  <span className="min-w-[2rem] px-2 text-center text-sm font-semibold tabular-nums text-[#F4EAD0]">
                    {item.qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => increaseQty(item.id)}
                    className="flex size-9 items-center justify-center rounded-full text-zinc-300 hover:bg-zinc-800 hover:text-[#F4EAD0] transition"
                    aria-label={t("order.tambahQty")}
                  >
                    <Plus className="size-4" strokeWidth={2.25} />
                  </button>
                </div>
                <p className="text-base font-semibold tracking-tight text-amber-100/95 tabular-nums">
                  ¥{formatYen(item.harga * item.qty)}
                </p>
              </div>
            </article>
          ))}

          <div className="mt-6 flex justify-between rounded-lg border border-zinc-700/70 bg-black/35 px-4 py-3">
            <span className="text-sm font-medium text-zinc-400">{t("order.total")}</span>
            <span className="font-serif text-lg font-semibold text-[#F4EAD0] tabular-nums">
              ¥{formatYen(totalHarga)}
            </span>
          </div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onKonfirmasi}
            className="mt-5 w-full rounded-xl bg-gradient-to-r from-[#e8dcb8] via-[#F4EAD0] to-[#e8dcb8] py-3.5 text-[15px] font-semibold text-black shadow-lg shadow-black/30 ring-1 ring-white/20 hover:brightness-105 transition"
          >
            {t("order.konfirmasi")}
          </motion.button>
        </div>
      )}
    </>
  );
}

export default function OrderPageClient() {
  const router = useRouter();
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

  const [mobileCartOpen, setMobileCartOpen] = useState(false);

  const verifyToken = useCallback(async (token) => {
    setGateLoading(true);
    try {
      const res = await fetch(`/api/order-token/verify?t=${encodeURIComponent(token)}`);
      const data = await res.json();
      if (!res.ok || !data.valid) {
        try {
          sessionStorage.removeItem(ORDER_TABLE_TOKEN_STORAGE_KEY);
        } catch {
          /* ignore */
        }
        notifyOrderTokenChanged();
        setGateOk(false);
        setMejaTerikat("");
        setTokenRowId(null);
        setOrderingSecret("");
      } else {
        try {
          sessionStorage.setItem(ORDER_TABLE_TOKEN_STORAGE_KEY, token);
        } catch {
          /* ignore */
        }
        notifyOrderTokenChanged();
        setGateOk(true);
        setMejaTerikat(data.nomor_meja ?? "");
        setTokenRowId(data.token_row_id ?? null);
        setOrderingSecret(token);
      }
    } catch {
      try {
        sessionStorage.removeItem(ORDER_TABLE_TOKEN_STORAGE_KEY);
      } catch {
        /* ignore */
      }
      notifyOrderTokenChanged();
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

  /** Navbar (mobile): buka drawer keranjang dari ikon trolley. */
  useEffect(() => {
    if (!rawToken || !gateOk) return;
    const open = () => setMobileCartOpen(true);
    window.addEventListener(OPEN_ORDER_MOBILE_CART_EVENT, open);
    return () => window.removeEventListener(OPEN_ORDER_MOBILE_CART_EVENT, open);
  }, [rawToken, gateOk]);

  useEffect(() => {
    if (!mobileCartOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileCartOpen]);

  /** Buka /order dari bookmark tanpa ?t — pakai token tab ini jika ada. */
  useEffect(() => {
    if (rawToken.trim()) return;
    try {
      const saved = sessionStorage.getItem(ORDER_TABLE_TOKEN_STORAGE_KEY)?.trim();
      if (saved) {
        router.replace(`/order?t=${encodeURIComponent(saved)}`);
      }
    } catch {
      /* ignore */
    }
  }, [rawToken, router]);

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
        setMobileCartOpen(false);
      }, 2800);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  function openKonfirmasiFromCart() {
    setMobileCartOpen(false);
    setShowModal(true);
  }

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
              <div className="relative w-32 h-24 rounded-lg overflow-hidden shrink-0">
                <Image src={item.gambar} alt={item.nama} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold text-[#F4EAD0]">{item.nama}</h3>
                <p className="text-gray-400 text-sm">{item.deskripsi}</p>
                <p className="text-[#F4EAD0] mt-2 font-medium">¥{formatYen(item.harga)}</p>
              </div>
              <button type="button" onClick={() => addToCart(item)} className="bg-[#F4EAD0] text-black px-4 py-2 rounded-lg hover:bg-white transition self-center shrink-0">
                {t("order.pesan")}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Desktop: panel keranjang di samping */}
        <div className="hidden md:block w-full md:w-1/3 bg-[#111] p-6 rounded-2xl h-fit md:sticky md:top-16 shadow-lg">
          <OrderCartPanelContent
            t={t}
            formatYen={formatYen}
            cart={cart}
            totalHarga={totalHarga}
            increaseQty={increaseQty}
            decreaseQty={decreaseQty}
            removeFromCart={removeFromCart}
            onKonfirmasi={openKonfirmasiFromCart}
          />
        </div>
      </div>

      {/* Mobile: bottom sheet keranjang (ikon di navbar membuka ini) */}
      <AnimatePresence>
        {mobileCartOpen ? (
          <motion.div
            key="mobile-cart-sheet"
            className="fixed inset-0 z-[60] md:hidden flex flex-col justify-end"
            role="presentation"
          >
            <motion.button
              type="button"
              aria-label="Tutup"
              className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileCartOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-cart-heading"
              className="relative z-10 bg-[#111] rounded-t-2xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden pb-6 max-[480px]:pb-8"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="shrink-0 flex justify-between items-center px-6 pt-4 pb-3 border-b border-zinc-800/80">
                <h2 id="mobile-cart-heading" className="text-xl font-serif text-[#F4EAD0]">
                  {t("order.keranjang")}
                </h2>
                <button
                  type="button"
                  onClick={() => setMobileCartOpen(false)}
                  className="flex size-10 items-center justify-center rounded-full text-zinc-400 hover:bg-white/10 hover:text-white transition"
                  aria-label={t("order.tutup")}
                >
                  <X className="size-5 stroke-[2.5]" aria-hidden />
                </button>
              </div>
              <div className="overflow-y-auto flex-1 p-6 min-h-0">
                {/* Judul utama sudah di header sheets; sisanya sama dengan sidebar */}
                <div className="[&>h2]:hidden">
                  <OrderCartPanelContent
                    t={t}
                    formatYen={formatYen}
                    cart={cart}
                    totalHarga={totalHarga}
                    increaseQty={increaseQty}
                    decreaseQty={decreaseQty}
                    removeFromCart={removeFromCart}
                    onKonfirmasi={openKonfirmasiFromCart}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-[#111] rounded-2xl p-8 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
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
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex size-10 items-center justify-center rounded-full text-zinc-500 hover:bg-white/10 hover:text-white transition"
                      aria-label={t("order.tutup")}
                    >
                      <X className="size-5 stroke-[2.5]" aria-hidden />
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
