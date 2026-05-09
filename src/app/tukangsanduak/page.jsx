"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Link from "next/link";
import OrderUrlQr from "@/components/OrderUrlQr";
import { createKasirBeep } from "@/lib/kasirBeep";

const SESSION_KEY = "kasir_table_token_secret";
/** Penyegaran daftar pesanan saat tab aktif (detik). */
const LIVE_POLL_MS = 10_000;

async function fetchOrdersFromApi(adminSecret) {
  const res = await fetch("/api/admin/orders", {
    headers: { "x-admin-secret": adminSecret.trim() },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Gagal (${res.status})`);
  return Array.isArray(data) ? data : [];
}

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [kasirSecret, setKasirSecret] = useState("");
  const [needsKasirSecret, setNeedsKasirSecret] = useState(false);
  const [actionKey, setActionKey] = useState(null);
  const [actionMsg, setActionMsg] = useState(null);
  const [glowById, setGlowById] = useState({});

  const prevIdsRef = useRef(null);
  const beep = useMemo(() => createKasirBeep(), []);

  useEffect(() => {
    try {
      const s = sessionStorage.getItem(SESSION_KEY);
      if (s) setKasirSecret(s);
    } catch {
      /* ignore */
    }
  }, []);

  const applyGlowForNewOrders = useCallback((newcomerIds) => {
    if (newcomerIds.length === 0) return;
    setGlowById((prev) => {
      const next = { ...prev };
      for (const id of newcomerIds) {
        next[id] = true;
      }
      return next;
    });
    window.setTimeout(() => {
      setGlowById((prev) => {
        const next = { ...prev };
        for (const id of newcomerIds) delete next[id];
        return next;
      });
    }, 45000);
  }, []);

  const fetchAndApplyOrders = useCallback(
    async (silent) => {
      const secret =
        kasirSecret.trim() ||
        (typeof window !== "undefined" ? sessionStorage.getItem(SESSION_KEY) ?? "" : "");
      if (!secret.trim()) {
        setNeedsKasirSecret(true);
        setOrders([]);
        setError("");
        prevIdsRef.current = null;
        setLoading(false);
        return;
      }
      setNeedsKasirSecret(false);
      if (!silent) setLoading(true);
      try {
        const data = await fetchOrdersFromApi(secret.trim());
        const idSet = new Set(data.map((o) => String(o.id)));

        if (prevIdsRef.current !== null) {
          const newcomers = data.filter((o) => !prevIdsRef.current.has(String(o.id)));
          if (newcomers.length > 0) {
            applyGlowForNewOrders(newcomers.map((o) => o.id));
            void beep.play();
          }
        }
        prevIdsRef.current = idSet;

        setOrders(data);
        setError("");
      } catch (e) {
        setOrders([]);
        setError(e?.message || "Gagal memuat data");
        /* Pertahankan prevIdsRef agar penyegaran berikut tidak menganggap semua baru */
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [kasirSecret, beep, applyGlowForNewOrders],
  );

  useEffect(() => {
    fetchAndApplyOrders(false);
  }, [fetchAndApplyOrders]);

  /* Live polling: hanya saat tab terlihat + kode tersedia */
  useEffect(() => {
    if (needsKasirSecret) return;
    const secret =
      kasirSecret.trim() ||
      (typeof window !== "undefined" ? sessionStorage.getItem(SESSION_KEY)?.trim() ?? "" : "");
    if (!secret) return;

    const id = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      void fetchAndApplyOrders(true);
    }, LIVE_POLL_MS);

    const onFocus = () => {
      void fetchAndApplyOrders(true);
    };
    window.addEventListener("focus", onFocus);

    return () => {
      window.clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, [needsKasirSecret, kasirSecret, fetchAndApplyOrders]);

  const simpanKodeSesi = async () => {
    try {
      beep.unlockFromUserGesture();
      sessionStorage.setItem(SESSION_KEY, kasirSecret);
      setActionMsg({ type: "ok", text: "Kode disimpan untuk sesi tab ini." });
      setTimeout(() => setActionMsg(null), 3000);
      await fetchAndApplyOrders(true);
    } catch {
      setActionMsg({ type: "err", text: "Tidak bisa simpan (browser)." });
    }
  };

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
      await fetchAndApplyOrders(true);
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

  const liveActive =
    !needsKasirSecret &&
    !error &&
    !!(kasirSecret.trim() ||
      (typeof window !== "undefined" ? sessionStorage.getItem(SESSION_KEY)?.trim() ?? "" : ""));

  return (
    <section className="min-h-screen bg-black text-white px-6 md:px-20" style={{ paddingTop: "8rem", paddingBottom: "4rem" }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-serif text-[#F4EAD0]">Daftar Pesanan</h1>
            {liveActive && (
              <p className="text-xs text-emerald-400/90 flex items-center gap-2 flex-wrap">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" aria-hidden />
                Live — penyegaran otomatis tiap ±{Math.round(LIVE_POLL_MS / 1000)} s (tab aktif). Bunyi hidup setelah &quot;Simpan di browser&quot;.
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link
              href="/tukangsanduak/meja"
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
          needsKasirSecret ? (
            <p className="text-gray-400">
              Ketik kode yang sama dengan <code className="text-gray-500">TABLE_TOKEN_ROTATE_SECRET</code> di{" "}
              <code className="text-gray-500">.env.local</code>, lalu ketuk{" "}
              <strong className="text-[#F4EAD0]">Simpan di browser</strong> — tanpa itu daftar tidak dimuat dari
              database.
            </p>
          ) : (
            <p className="text-gray-400">Belum ada pesanan.</p>
          )
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className={`bg-[#111] rounded-xl p-6 border transition-shadow duration-500 ${
                  glowById[order.id] ? "border-amber-400/70 shadow-[0_0_24px_rgba(251,191,36,0.2)] ring-1 ring-amber-500/40" : "border-gray-800"
                }`}
              >
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
                      {glowById[order.id] && (
                        <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-amber-500/25 text-amber-300 animate-pulse">
                          Baru
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
