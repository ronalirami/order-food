"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Container from "@/components/Container";
import { getMenuById } from "@/data/menuData";
import { useLanguage } from "@/context/LanguageContext";
import {
  ORDER_TABLE_TOKEN_STORAGE_KEY,
  ORDER_TOKEN_CHANGED_EVENT,
} from "@/lib/orderSessionToken";

function notifyOrderTokenChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(ORDER_TOKEN_CHANGED_EVENT));
}

export default function NomorMenuClient() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawToken = searchParams.get("t")?.trim() ?? "";

  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const [gateLoading, setGateLoading] = useState(!!rawToken);
  const [gateOk, setGateOk] = useState(false);
  const [mejaTerikat, setMejaTerikat] = useState("");

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
      } else {
        try {
          sessionStorage.setItem(ORDER_TABLE_TOKEN_STORAGE_KEY, token);
        } catch {
          /* ignore */
        }
        notifyOrderTokenChanged();
        setGateOk(true);
        setMejaTerikat(data.nomor_meja ?? "");
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
    } finally {
      setGateLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!rawToken) {
      setGateLoading(false);
      setGateOk(false);
      setMejaTerikat("");
      return;
    }
    verifyToken(rawToken);
  }, [rawToken, verifyToken]);

  /** Tabs yang sudah ada token bisa buka lagi tanpa `?t=` di bookmark. */
  useEffect(() => {
    if (rawToken.trim()) return;
    try {
      const saved = sessionStorage.getItem(ORDER_TABLE_TOKEN_STORAGE_KEY)?.trim();
      if (saved) {
        router.replace(`/nomor-menu?t=${encodeURIComponent(saved)}`);
      }
    } catch {
      /* ignore */
    }
  }, [rawToken, router]);

  function submit(normalizedDigits) {
    const raw = normalizedDigits.trim();
    if (!raw) {
      setError(t("nomorMenu.invalid"));
      return;
    }
    const idNum = Number.parseInt(raw, 10);
    if (!Number.isInteger(idNum) || idNum < 1) {
      setError(t("nomorMenu.invalid"));
      return;
    }
    const item = getMenuById(idNum);
    if (!item) {
      setError(t("nomorMenu.invalid"));
      return;
    }
    setError("");
    router.push(`/menu/${idNum}`);
  }

  function handleSubmit(e) {
    e.preventDefault();
    submit(value.replace(/\s/g, ""));
  }

  if (rawToken && gateLoading) {
    return (
      <section className="min-h-screen bg-[#fdf6e8] flex items-center justify-center px-4">
        <p className="text-neutral-600 text-center">{t("order.qrChecking")}</p>
      </section>
    );
  }

  if (rawToken && !gateOk && !gateLoading) {
    return (
      <section className="min-h-screen bg-[#fdf6e8] px-6 flex flex-col items-center justify-center">
        <div className="max-w-md bg-white rounded-2xl shadow-lg border border-red-100 p-8 text-center space-y-3">
          <div className="text-5xl mb-2" aria-hidden="true">
            ⛔
          </div>
          <h1 className="text-xl font-semibold text-red-700">{t("order.qrInvalidTitle")}</h1>
          <p className="text-neutral-600 text-sm">{t("order.qrInvalidBody")}</p>
          <Link
            href="/menu"
            className="inline-block mt-4 text-[#3d2914] font-medium underline underline-offset-2"
          >
            {t("order.qrGateMenuLink")}
          </Link>
        </div>
      </section>
    );
  }

  const showMeja = rawToken.trim() !== "" && gateOk && mejaTerikat;

  return (
    <section className="min-h-screen bg-[#fdf6e8]">
      <div className="bg-[#3d2914] text-[#fdf6e8] py-10 px-4">
        <div className="max-w-md mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.2em] opacity-80 mb-1">RM. Lamak Bana</p>
          <h1 className="font-serif text-2xl md:text-3xl">{t("nomorMenu.title")}</h1>
          {showMeja ? (
            <p className="text-emerald-300/95 text-sm mt-3 font-medium">
              {t("order.tableLocked")}: #{mejaTerikat}
            </p>
          ) : null}
        </div>
      </div>

      <Container className="!pt-10 !pb-24">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-neutral-100 p-6 md:p-8 -mt-6 relative z-10">
            <p className="text-neutral-700 text-sm leading-relaxed mb-6 text-center">
              {t("nomorMenu.subtitle")}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="sr-only">{t("nomorMenu.title")}</span>
                <input
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="off"
                  placeholder={t("nomorMenu.placeholder")}
                  value={value}
                  onChange={(ev) => {
                    setError("");
                    setValue(ev.target.value.replace(/[^\d]/g, ""));
                  }}
                  className="w-full text-center text-xl md:text-2xl tracking-widest py-4 px-4 rounded-xl border-2 border-neutral-200 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
                />
              </label>

              {error ? (
                <p className="text-sm text-red-600 text-center" role="alert">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-[#d4302c] hover:bg-[#b82824] text-white font-semibold text-lg shadow-md transition active:scale-[0.98]"
              >
                {t("nomorMenu.submit")}
              </button>
            </form>

            <p className="text-xs text-neutral-500 mt-4 text-center">{t("nomorMenu.hint")}</p>
            <p className="text-xs text-neutral-400 mt-2 text-center">{t("nomorMenu.enterHint")}</p>
          </div>

          <p className="text-center mt-8">
            <Link
              href="/menu"
              className="text-sm text-[#3d2914] underline underline-offset-2 hover:opacity-80"
            >
              {t("menuDetail.lihatDaftar")}
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
}
