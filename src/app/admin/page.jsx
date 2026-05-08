"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import OrderUrlQr from "@/components/OrderUrlQr";

const SESSION_KEY = "kasir_table_token_secret";

async function fetchOrders() {
  const { data, error } = await supabase
    ?.from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [kasirSecret, setKasirSecret] = useState("");
  const [actionKey, setActionKey] = useState(null);
  const [actionMsg, setActionMsg] = useState(null);

  useEffect(() => {
    try {
      const s = sessionStorage.getItem(SESSION_KEY);
      if (s) setKasirSecret(s);
    } catch {
      /* ignore */
    }
  }, []);

  const simpanKodeSesi = () => {
    try {
      sessionStorage.setItem(SESSION_KEY, kasirSecret);
      setActionMsg({ type: "ok", text: "Kode disimpan untuk sesi tab ini." });
      setTimeout(() => setActionMsg(null), 3000);
    } catch {
      setActionMsg({ type: "err", text: "Tidak bisa simpan (browser)." });
    }
  };

  const loadOrders = useCallback(async () => {
    if (!supabase) {
      setError("Supabase tidak dikonfigurasi");
      setLoading(false);
      return;
    }
    try {
      const data = await fetchOrders();
      setOrders(data);
      setError("");
    } catch (e) {
      setError(e?.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel("orders-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders" }, () => {
        fetchOrders().then(setOrders);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const selesaiMeja = async (nomorMeja, orderId) => {
    if (!kasirSecret.trim()) {
      setActionMsg({ type: "err", text: "Isi kode kasir di atas dulu (sama dengan TABLE_TOKEN_ROTATE_SECRET)." });
      return;
    }
    setActionKey(orderId);
    setActionMsg(null);
    try {
      const res = await fetch("/api/admin/complete-table", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nomor_meja: nomorMeja, admin_secret: kasirSecret.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal");
      setActionMsg({
        type: "ok",
        text: `Meja ${nomorMeja}: lunas & QR baru. Cetak QR di bawah untuk tamu berikutnya.`,
        url: data.orderUrl,
        nomor_meja: data.nomor_meja ?? nomorMeja,
      });
      await loadOrders();
    } catch (e) {
      setActionMsg({ type: "err", text: e?.message ?? "Gagal" });
    } finally {
      setActionKey(null);
    }
  };

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-serif text-[#F4EAD0]">Daftar Pesanan</h1>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link
              href="/admin/meja"
              className="text-amber-400/90 hover:text-amber-300 transition border border-amber-500/30 px-3 py-1.5 rounded-lg"
            >
              QR & token meja
            </Link>
            <Link href="/" className="text-gray-400 hover:text-[#F4EAD0] transition">
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>

        <div className="bg-[#0d0d0d] border border-gray-800 rounded-xl p-4 mb-8 space-y-3">
          <p className="text-gray-400 text-sm">
            Untuk <strong className="text-[#F4EAD0]">Bayar lunas & putar QR</strong>, isi kode yang sama dengan{" "}
            <code className="text-gray-500">TABLE_TOKEN_ROTATE_SECRET</code> di server. Simpan sekali per tab.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <input
              type="password"
              value={kasirSecret}
              onChange={(e) => setKasirSecret(e.target.value)}
              placeholder="Kode kasir"
              className="flex-1 bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-[#F4EAD0] outline-none"
              autoComplete="off"
            />
            <button
              type="button"
              onClick={simpanKodeSesi}
              className="text-sm border border-gray-600 px-3 py-2 rounded-lg hover:border-[#F4EAD0] transition shrink-0"
            >
              Simpan di browser
            </button>
          </div>
          {actionMsg && (
            <div
              className={`text-sm p-3 rounded-lg ${actionMsg.type === "ok" ? "bg-emerald-500/15 text-emerald-300" : "bg-red-500/15 text-red-300"}`}
            >
              <p>{actionMsg.text}</p>
              {actionMsg.type === "ok" && actionMsg.url && (
                <div className="mt-4 flex flex-col items-stretch gap-3">
                  <OrderUrlQr url={actionMsg.url} label={actionMsg.nomor_meja ? `Meja ${actionMsg.nomor_meja}` : "Scan untuk order"} />
                  <textarea
                    readOnly
                    className="w-full h-20 text-xs bg-black border border-gray-700 rounded p-2 font-mono text-gray-300"
                    value={actionMsg.url}
                    onFocus={(e) => e.target.select()}
                  />
                </div>
              )}
            </div>
          )}
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
              <div key={order.id} className="bg-[#111] rounded-xl p-6 border border-gray-800">
                <div className="flex justify-between items-start mb-4 gap-4 flex-wrap">
                  <div>
                    <p className="text-[#F4EAD0] font-semibold text-lg">{order.nama_pemesan}</p>
                    <p className="text-gray-500 text-sm">
                      Meja #{order.nomor_meja}
                      {order.payment_status && (
                        <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300">
                          {order.payment_status}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === "pending" ? "bg-amber-500/20 text-amber-400" : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {order.status}
                    </span>
                    <p className="text-gray-500 text-xs">{formatWaktu(order.created_at)}</p>
                    <button
                      type="button"
                      disabled={actionKey === order.id}
                      onClick={() => selesaiMeja(order.nomor_meja, order.id)}
                      className="text-xs bg-[#F4EAD0] text-black px-3 py-2 rounded-lg font-medium hover:bg-[#e8dbb8] disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {actionKey === order.id
                        ? "Memproses…"
                        : order.payment_status === "lunas"
                          ? "Putar QR baru (tamu berikutnya)"
                          : "Bayar lunas & putar QR meja"}
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-800 pt-4 space-y-2">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm text-gray-300">
                      <span>
                        {item.nama} × {item.qty}
                      </span>
                      <span className="text-[#F4EAD0]">¥{formatYen(item.harga * item.qty)}</span>
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

