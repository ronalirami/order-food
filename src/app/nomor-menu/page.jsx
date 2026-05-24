"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Container from "@/components/Container";
import { getMenuById } from "@/data/menuData";
import { useLanguage } from "@/context/LanguageContext";

export default function NomorMenuPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

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

  return (
    <section className="min-h-screen bg-[#fdf6e8]">
      {/* header strip — mirip pola Joyfull */}
      <div className="bg-[#3d2914] text-[#fdf6e8] py-10 px-4">
        <div className="max-w-md mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.2em] opacity-80 mb-1">
            RM. Lamak Bana
          </p>
          <h1 className="font-serif text-2xl md:text-3xl">{t("nomorMenu.title")}</h1>
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

            <p className="text-xs text-neutral-500 mt-4 text-center">
              {t("nomorMenu.hint")}
            </p>
            <p className="text-xs text-neutral-400 mt-2 text-center">
              {t("nomorMenu.enterHint")}
            </p>
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
