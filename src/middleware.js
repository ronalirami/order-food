import { NextResponse } from "next/server";

/**
 * Opsi B — subdomain kasir: batasi /admin dan /api/admin hanya ke host yang Anda daftarkan.
 * Set KASIR_ALLOWED_HOSTS di Vercel Production, mis: kasir.restoranku.com
 * Kosongkan di local / preview jika belum punya subdomain (semua host boleh).
 */
export function middleware(request) {
  const raw = process.env.KASIR_ALLOWED_HOSTS ?? "";
  const allowed = raw
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);

  if (allowed.length === 0) {
    return NextResponse.next();
  }

  const hostHeader = request.headers.get("host") ?? "";
  const host = hostHeader.split(":")[0]?.toLowerCase() ?? "";
  if (!host || allowed.includes(host)) {
    return NextResponse.next();
  }

  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
