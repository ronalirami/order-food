"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import Container from "@/components/Container";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { getOrderHref } from "@/lib/orderSessionToken";

export default function MenuDetailClient({ item }) {
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);

  const formatYen = (n) => new Intl.NumberFormat("ja-JP").format(n);
  const katLabel = t(`menu.kategori.${item.kategori}`);

  function inc() {
    setQty((q) => Math.min(99, q + 1));
  }
  function dec() {
    setQty((q) => Math.max(1, q - 1));
  }

  function handleOrder() {
    addToCart(item, qty);
    router.push(getOrderHref());
  }

  return (
    <section className="bg-black text-white min-h-screen">
      <Container className="!pt-24 md:!pt-32 pb-32">
        <div className="max-w-lg mx-auto">
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-[#111]">
            <Image
              src={item.gambar}
              alt={item.nama}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 512px"
            />
          </div>

          <p className="text-amber-500/90 text-xs font-medium tracking-wide mb-2">
            {katLabel}
          </p>
          <h1 className="text-2xl md:text-3xl font-serif text-[#F4EAD0] mb-2">
            {item.nama}
          </h1>
          <p className="text-neutral-400 text-sm mb-4">
            {t("menuDetail.labelNomor")}:{" "}
            <span className="text-[#F4EAD0] font-semibold">{item.id}</span>
          </p>
          <p className="text-neutral-300 text-sm leading-relaxed mb-8">
            {item.deskripsi}
          </p>

          <p className="text-2xl font-bold text-[#F4EAD0] mb-6">
            ¥{formatYen(item.harga)}
          </p>

          <div className="flex items-center gap-6 mb-8">
            <span className="text-sm text-neutral-400">{t("menuDetail.qty")}</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={dec}
                aria-label={t("menuDetail.kurang")}
                className="w-11 h-11 rounded-full bg-[#1a1a1a] border border-neutral-700 flex items-center justify-center text-[#F4EAD0] hover:bg-neutral-800 transition"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="text-xl font-semibold w-12 text-center tabular-nums">
                {qty}
              </span>
              <button
                type="button"
                onClick={inc}
                aria-label={t("menuDetail.tambah")}
                className="w-11 h-11 rounded-full bg-[#1a1a1a] border border-neutral-700 flex items-center justify-center text-[#F4EAD0] hover:bg-neutral-800 transition"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleOrder}
              className="w-full py-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-center transition shadow-lg shadow-amber-900/30"
            >
              {t("menuDetail.order")}
            </button>
            <Link
              href="/menu"
              className="block w-full py-3 rounded-xl border border-neutral-600 text-center text-sm text-neutral-300 hover:bg-white/5 transition"
            >
              {t("menuDetail.lihatDaftar")}
            </Link>
            <Link
              href="/nomor-menu"
              className="block text-center text-sm text-amber-400/90 hover:text-amber-300 py-2"
            >
              {t("menuDetail.ketikNomorLagi")}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
