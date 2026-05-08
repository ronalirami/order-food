"use client";

import QRCode from "react-qr-code";

/**
 * QR untuk URL order (meja). Latar putih agar mudah dicetak/scan.
 */
export default function OrderUrlQr({ url, label }) {
  if (!url) return null;

  return (
    <div className="rounded-xl bg-white p-5 text-black flex flex-col items-center gap-3 max-w-sm">
      <QRCode value={url} size={200} level="M" />
      {label ? (
        <p className="text-sm font-medium text-center text-gray-900">{label}</p>
      ) : null}
      <p className="text-[10px] text-gray-500 text-center leading-relaxed">
        Cetak: tombol di bawah atau Ctrl+P / Cmd+P — atur skala agar QR tidak pecah.
      </p>
      <button
        type="button"
        onClick={() => window.print()}
        className="noprint w-full py-2 rounded-lg bg-black text-white text-sm hover:bg-gray-800 transition"
      >
        Cetak QR ini
      </button>
    </div>
  );
}
