"use client";

import { useState } from "react";
import Link from "next/link";
import OrderUrlQr from "@/components/OrderUrlQr";

export default function AdminMejaTokenPage() {
  const [nomor_meja, setNomor_meja] = useState("");
  const [admin_secret, setAdmin_secret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/table-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nomor_meja, admin_secret }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal");
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setAdmin_secret("");
    }
  };

  return (
    <section className="min-h-screen bg-black text-white px-6 md:px-20" style={{ paddingTop: "8rem", paddingBottom: "4rem" }}>
      <div className="max-w-xl mx-auto">
        <Link href="/tukangsanduak" className="text-gray-500 hover:text-[#F4EAD0] text-sm mb-6 inline-block">
          ← Daftar pesanan
        </Link>
        <h1 className="text-3xl font-serif text-[#F4EAD0] mb-2">QR & token per meja</h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          Buat token baru untuk sebuah meja. Token lama langsung dibatalkan — QR/foto lawas tidak lagi bisa dipakai order.
          Masa hidup token mengikuti env <code className="text-gray-400">ORDER_TOKEN_TTL_HOURS</code> (default 4 jam).
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 bg-[#111] rounded-xl p-6 border border-gray-800">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Nomor meja</label>
            <input
              value={nomor_meja}
              onChange={(e) => setNomor_meja(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-black border border-gray-700 text-white focus:border-[#F4EAD0] focus:outline-none"
              placeholder="contoh: 5"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Kode akses pemutaran token</label>
            <input
              type="password"
              value={admin_secret}
              onChange={(e) => setAdmin_secret(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-black border border-gray-700 text-white focus:border-[#F4EAD0] focus:outline-none"
              placeholder="TABLE_TOKEN_ROTATE_SECRET dari .env.local"
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[#F4EAD0] text-black font-medium hover:bg-[#e8dbb8] transition disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Ganti token & dapatkan tautan QR"}
          </button>
        </form>

        {result && (
          <div className="mt-8 bg-[#0d0d0d] rounded-xl p-6 border border-gray-800 space-y-5">
            <p className="text-[#a8dc7a] text-sm font-medium">Token baru aktif sampai:</p>
            <p className="text-[#F4EAD0] text-sm">{new Date(result.expires_at).toLocaleString("id-ID")}</p>
            <p className="text-gray-400 text-xs">QR untuk meja {result.nomor_meja} — tempel di meja, atau cetak lewat tombol di kotak putih.</p>
            <OrderUrlQr url={result.orderUrl} label={`Meja ${result.nomor_meja}`} />
            <p className="text-gray-500 text-[10px]">Tautan (untuk mengganti generator lain):</p>
            <textarea
              readOnly
              className="w-full h-24 text-xs bg-black border border-gray-700 rounded-lg p-3 text-gray-300 font-mono"
              value={result.orderUrl}
            />
            <p className="text-gray-600 text-[10px]">Jangan share kode akses admin ke tamu.</p>
          </div>
        )}
      </div>
    </section>
  );
}
