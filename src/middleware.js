import { NextResponse } from "next/server";

/** Path panel staf — bukan lagi `/admin`. */
const STAFF_PANEL_PREFIX = "/tukangsanduak";

/**
 * Opsional — subdomain/host kasir: SET KASIR_ALLOWED_HOSTS untuk Production.
 * Kosongkan = semua host boleh (pakai *.vercel.app gratis).
 *
 * Tambahan: akses langsung `/admin` ditutup permanen — pakai `/tukangsanduak`.
 */
export function middleware(request) {
  const pathname = request.nextUrl.pathname;

  /* Path klasik diketahui banyak orang → kita balas 404 tanpa narasi panjang */
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const raw = process.env.KASIR_ALLOWED_HOSTS ?? "";
  const allowed = raw
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);

  if (allowed.length === 0) {
    return NextResponse.next();
  }

  const applies =
    pathname === STAFF_PANEL_PREFIX ||
    pathname.startsWith(`${STAFF_PANEL_PREFIX}/`) ||
    pathname.startsWith("/api/admin");

  if (!applies) {
    return NextResponse.next();
  }

  const hostHeader = request.headers.get("host") ?? "";
  const host = hostHeader.split(":")[0]?.toLowerCase() ?? "";

  if (host && allowed.includes(host)) {
    return NextResponse.next();
  }

  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/tukangsanduak",
    "/tukangsanduak/:path*",
    "/api/admin/:path*",
  ],
};
