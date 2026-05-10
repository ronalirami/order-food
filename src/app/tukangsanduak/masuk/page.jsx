"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserAuth } from "@/lib/supabaseBrowserAuth";

function MasukForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errParam = searchParams.get("err");
  const nextPath = searchParams.get("next") ?? "/tukangsanduak";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [formMsg, setFormMsg] = useState("");

  const configBanner =
    errParam === "config" ? (
      <p className="text-amber-400/95 text-sm mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/25">
        Supabase belum dikonfigurasi di server (NEXT_PUBLIC_SUPABASE_URL / ANON_KEY).
      </p>
    ) : null;

  const forbiddenBanner =
    errParam === "forbidden" ? (
      <div className="text-red-400/95 text-sm mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/25 space-y-3">
        <p>
          Akun ini tidak ada di daftar kasir. Hubungi pemilik proyek untuk menambahkan email Anda di{" "}
          <code className="text-gray-400">KASIR_ADMIN_EMAILS</code> (atau kosongkan daftar agar semua akun terdaftar
          boleh masuk).
        </p>
        <button
          type="button"
          onClick={() => void signOutForbidden()}
          className="text-sm border border-red-400/40 px-3 py-1.5 rounded-lg text-red-300 hover:bg-red-500/10"
        >
          Keluar dari akun ini untuk login lain
        </button>
      </div>
    ) : null;

  async function signOutForbidden() {
    await fetch("/api/auth/signout", { method: "POST" });
    router.replace("/tukangsanduak/masuk");
    router.refresh();
  }

  async function onSubmit(e) {
    e.preventDefault();
    setFormMsg("");
    setBusy(true);
    try {
      const supabase = createSupabaseBrowserAuth();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        setFormMsg(error.message);
        return;
      }
      const safeNext = nextPath.startsWith("/") ? nextPath : "/tukangsanduak";
      router.replace(safeNext);
      router.refresh();
    } catch (ex) {
      setFormMsg(ex?.message ?? "Gagal masuk");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="min-h-screen bg-black text-white px-6 flex flex-col items-center justify-center pt-8 pb-16">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-serif text-[#F4EAD0] mb-2">Masuk kasir</h1>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          Gunakan akun yang dibuat di Supabase Dashboard → Authentication → Users. Sesi disimpan di cookie
          browser (httpOnly lewat Supabase), tidak perlu kode panjang manual.
        </p>
        {configBanner}
        {forbiddenBanner}
        <form onSubmit={onSubmit} className="space-y-4 bg-[#111] rounded-xl p-6 border border-gray-800">
          <div>
            <label htmlFor="kasir-email" className="block text-sm text-gray-400 mb-1">
              Email
            </label>
            <input
              id="kasir-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-black border border-gray-700 text-white focus:border-[#F4EAD0] focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="kasir-pass" className="block text-sm text-gray-400 mb-1">
              Sandi
            </label>
            <input
              id="kasir-pass"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-black border border-gray-700 text-white focus:border-[#F4EAD0] focus:outline-none"
            />
          </div>
          {formMsg ? <p className="text-red-400 text-sm">{formMsg}</p> : null}
          <button
            type="submit"
            disabled={busy}
            className="w-full py-3 rounded-lg bg-[#F4EAD0] text-black font-medium hover:bg-[#e8dbb8] transition disabled:opacity-50"
          >
            {busy ? "Memproses..." : "Masuk"}
          </button>
        </form>
        <p className="text-gray-600 text-xs mt-6">
          Tamu pengunjung tidak perlu akun ini — hanya untuk staf membuka Daftar pesanan & QR meja.
        </p>
        <Link href="/" className="inline-block mt-4 text-gray-500 hover:text-[#F4EAD0] text-sm">
          ← Kembali ke situs
        </Link>
      </div>
    </section>
  );
}

export default function KasirMasukPage() {
  return (
    <Suspense
      fallback={
        <section className="min-h-screen bg-black text-white px-6 flex items-center justify-center">
          <p className="text-gray-400">Memuat...</p>
        </section>
      }
    >
      <MasukForm />
    </Suspense>
  );
}
