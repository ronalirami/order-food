"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import KasirSessionBar from "../KasirSessionBar";

const POLL_MS = 15_000;

async function fetchOrdersFromApi() {
  const res = await fetch("/api/admin/orders");
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) {
    window.location.href = "/tukangsanduak/masuk";
    throw new Error("Sesi habis — masuk lagi.");
  }
  if (!res.ok) throw new Error(data.error || `Gagal (${res.status})`);
  return Array.isArray(data) ? data : [];
}

function isLunas(order) {
  return String(order.payment_status ?? "").toLowerCase() === "lunas";
}

export default function RiwayatTransaksiPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (silent) => {
    if (!silent) setLoading(true);
    try {
      const data = await fetchOrdersFromApi();
      const riwayat = data.filter(isLunas).sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      setRows(riwayat);
      setError("");
    } catch (e) {
      setRows([]);
      setError(e?.message || "Gagal memuat data");
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(false);
  }, [load]);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      void load(true);
    }, POLL_MS);
    return () => window.clearInterval(id);
  }, [load]);

  const formatYen = (n) => new Intl.NumberFormat("ja-JP").format(n);
  const formatWaktu = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" });
  };

  return (
    <section className="min-h-screen bg-black text-white px-6 md:px-20 pt-8 pb-16">
      <div className="max-w-4xl mx-auto">
        <KasirSessionBar />

        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <Link href="/tukangsanduak" className="text-gray-500 hover:text-[#F4EAD0] text-sm mb-2 inline-block">
              ← Daftar pesanan (meja)
            </Link>
            <h1 className="text-3xl font-serif text-[#F4EAD0]">Riwayat transaksi</h1>
            <p className="text-gray-500 text-sm mt-2 leading-relaxed">
              Pesanan yang sudah <strong className="text-gray-400">lunas bayar</strong>; data dari basis yang sama
              seperti daftar utama.
            </p>
          </div>
          <Link
            href="/tukangsanduak/meja"
            className="text-sm text-amber-400/90 border border-amber-500/30 px-3 py-1.5 rounded-lg hover:border-amber-400 transition shrink-0"
          >
            QR & token meja
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-400">Memuat...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : rows.length === 0 ? (
          <p className="text-gray-400">Belum ada transaksi lunas.</p>
        ) : (
          <ul className="space-y-4">
            {rows.map((order) => (
              <li
                key={order.id}
                className="bg-[#111] rounded-xl p-5 border border-gray-800 text-sm"
              >
                <div className="flex flex-wrap justify-between gap-3 mb-3 border-b border-gray-800 pb-3">
                  <div>
                    <span className="text-[#F4EAD0] font-semibold">{order.nama_pemesan}</span>
                    <span className="text-gray-500 ml-2">Meja #{order.nomor_meja}</span>
                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                      {order.payment_status}
                    </span>
                  </div>
                  <div className="text-gray-500 text-xs">{formatWaktu(order.created_at)}</div>
                </div>
                <ul className="space-y-1 text-gray-300 mb-3">
                  {order.items?.map((item, i) => (
                    <li key={i} className="flex justify-between gap-4">
                      <span>
                        {item.nama} × {item.qty}
                      </span>
                      <span className="text-[#F4EAD0] tabular-nums">¥{formatYen(item.harga * item.qty)}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between font-semibold text-[#F4EAD0] pt-2 border-t border-gray-800">
                  <span>Total</span>
                  <span>¥{formatYen(order.total_harga)}</span>
                </div>
                {order.status && (
                  <p className="text-xs text-gray-600 mt-2">Status order: {order.status}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
