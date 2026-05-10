"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserAuth } from "@/lib/supabaseBrowserAuth";

export default function KasirSessionBar({ showMasukFallback = false }) {
  const router = useRouter();
  const [email, setEmail] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    createSupabaseBrowserAuth()
      .auth.getUser()
      .then(({ data: { user } }) => {
        setEmail(user?.email ?? null);
      })
      .finally(() => setLoaded(true));
  }, []);

  async function logout() {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/tukangsanduak/masuk");
    router.refresh();
  }

  if (!loaded) {
    return <div className="h-10 text-xs text-gray-600 mb-8">Memuat sesi...</div>;
  }

  return (
    <div className="flex flex-wrap items-center gap-3 justify-between text-sm mb-8 border border-gray-800 rounded-xl px-4 py-3 bg-[#0d0d0d]">
      <div className="text-gray-400 min-w-0">
        {email ? (
          <span className="truncate block">
            Staf: <strong className="text-[#F4EAD0]">{email}</strong>
          </span>
        ) : showMasukFallback ? (
          <Link href="/tukangsanduak/masuk" className="text-amber-400/90 underline">
            Masuk kasir
          </Link>
        ) : (
          <span className="text-gray-500">Tanpa sesi</span>
        )}
      </div>
      <button
        type="button"
        onClick={() => void logout()}
        className="shrink-0 border border-gray-600 px-3 py-1.5 rounded-lg text-gray-300 hover:border-red-400/55 hover:text-red-300 transition"
      >
        Keluar
      </button>
    </div>
  );
}
