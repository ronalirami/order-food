import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isEmailAuthorizedForKasirPanel } from "@/lib/kasirEmailAllowlist";

/** Path panel staf — bukan lagi `/admin`. */
const STAFF_PANEL_PREFIX = "/tukangsanduak";

function copyCookies(source, target) {
  source.cookies.getAll().forEach(({ name, value }) => {
    target.cookies.set(name, value);
  });
}

/**
 * Middleware: penyegaran cookie sesi Supabase + proteksi `/tukangsanduak/*` & `/api/admin/*`.
 *
 * Host allowlist: KASIR_ALLOWED_HOSTS (pisah koma). Kosong = semua host.
 * `/admin` → 404 JSON.
 */
export async function middleware(request) {
  const pathname = request.nextUrl.pathname;

  /* Path lama — satukan ke panel resmi */
  if (pathname === "/staffdapur" || pathname.startsWith("/staffdapur/")) {
    const u = request.nextUrl.clone();
    u.pathname = pathname.replace(/^\/staffdapur/, STAFF_PANEL_PREFIX);
    return NextResponse.redirect(u);
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const raw = process.env.KASIR_ALLOWED_HOSTS ?? "";
  const allowedHosts = raw
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);

  const guardedByStaffHost =
    pathname === STAFF_PANEL_PREFIX ||
    pathname.startsWith(`${STAFF_PANEL_PREFIX}/`) ||
    pathname.startsWith("/api/admin");

  if (allowedHosts.length > 0 && guardedByStaffHost) {
    const hostHeader = request.headers.get("host") ?? "";
    const host = hostHeader.split(":")[0]?.toLowerCase() ?? "";
    if (!host || !allowedHosts.includes(host)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
  }

  const urlEnv = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anonEnv = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  /** @type {import('@supabase/supabase-js').User | null} */
  let user = null;

  if (urlEnv && anonEnv) {
    const supabase = createServerClient(urlEnv, anonEnv, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    });

    const {
      data: { user: u },
    } = await supabase.auth.getUser();
    user = u ?? null;
  }

  const isMasukPage = pathname === `${STAFF_PANEL_PREFIX}/masuk`;

  const needsStaffPageAuth =
    pathname === STAFF_PANEL_PREFIX ||
    (pathname.startsWith(`${STAFF_PANEL_PREFIX}/`) && !isMasukPage);
  const needsStaffApiAuth = pathname.startsWith("/api/admin");

  const emailOk = !!(user?.email && isEmailAuthorizedForKasirPanel(user.email));

  if (isMasukPage && emailOk) {
    const redir = NextResponse.redirect(new URL(STAFF_PANEL_PREFIX, request.url));
    copyCookies(response, redir);
    return redir;
  }

  if (needsStaffPageAuth) {
    if (!urlEnv || !anonEnv) {
      const redir = NextResponse.redirect(
        new URL(`${STAFF_PANEL_PREFIX}/masuk?err=config`, request.url),
      );
      copyCookies(response, redir);
      return redir;
    }
    if (!user?.email) {
      const redirectUrl = new URL(`${STAFF_PANEL_PREFIX}/masuk`, request.url);
      redirectUrl.searchParams.set("next", pathname);
      const redir = NextResponse.redirect(redirectUrl);
      copyCookies(response, redir);
      return redir;
    }
    if (!emailOk) {
      const redir = NextResponse.redirect(
        new URL(`${STAFF_PANEL_PREFIX}/masuk?err=forbidden`, request.url),
      );
      copyCookies(response, redir);
      return redir;
    }
  }

  if (needsStaffApiAuth) {
    if (!urlEnv || !anonEnv) {
      const jr = NextResponse.json({ error: "Konfigurasi Supabase tidak lengkap" }, { status: 500 });
      copyCookies(response, jr);
      return jr;
    }
    if (!user?.email) {
      const jr = NextResponse.json({ error: "Belum masuk (sesi Supabase)" }, { status: 401 });
      copyCookies(response, jr);
      return jr;
    }
    if (!emailOk) {
      const jr = NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
      copyCookies(response, jr);
      return jr;
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/staffdapur",
    "/staffdapur/:path*",
    "/tukangsanduak",
    "/tukangsanduak/:path*",
    "/api/admin/:path*",
  ],
};
