"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setOrders(data);
        else setError(data.error || "Gagal memuat data");
      })
      .catch(() => setError("Gagal memuat data"))
      .finally(() => setLoading(false));
  }, []);

  const formatYen = (n) => new Intl.NumberFormat("ja-JP").format(n);
  const formatWaktu = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString("id-ID", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  return (
    <section className="min-h-screen bg-black text-white px-6 md:px-20" style={{ paddingTop: "8rem", paddingBottom: "4rem" }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-serif text-[#F4EAD0]">Daftar Pesanan</h1>
          <Link
            href="/"
            className="text-gray-400 hover:text-[#F4EAD0] transition text-sm"
          >
            ← Kembali ke Beranda
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-400">Memuat...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-400">Belum ada pesanan.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-[#111] rounded-xl p-6 border border-gray-800"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[#F4EAD0] font-semibold text-lg">
                      {order.nama_pemesan}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Meja #{order.nomor_meja}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === "pending"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {order.status}
                    </span>
                    <p className="text-gray-500 text-xs mt-2">
                      {formatWaktu(order.created_at)}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-800 pt-4 space-y-2">
                  {order.items?.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between text-sm text-gray-300"
                    >
                      <span>
                        {item.nama} × {item.qty}
                      </span>
                      <span className="text-[#F4EAD0]">
                        ¥{formatYen(item.harga * item.qty)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-800 pt-4 mt-4 flex justify-between font-semibold text-[#F4EAD0]">
                  <span>Total</span>
                  <span>¥{formatYen(order.total_harga)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
