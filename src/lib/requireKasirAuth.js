import { NextResponse } from "next/server";
import { createSupabaseRouteAuthClient } from "@/lib/supabaseRouteAuth";
import { isEmailAuthorizedForKasirPanel } from "@/lib/kasirEmailAllowlist";

/**
 * Sesuikan panel kasir: harus ada sesi Supabase + email boleh (whitelist opsional).
 * @returns {Promise<
 *   | { ok: true; user: import('@supabase/supabase-js').User }
 *   | { ok: false; response: Response }
 * >}
 */
export async function requireKasirAuthResponse() {
  const supabase = await createSupabaseRouteAuthClient();
  if (!supabase) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Konfigurasi Supabase hilang (NEXT_PUBLIC_SUPABASE_URL / ANON_KEY)" },
        { status: 500 },
      ),
    };
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user?.email) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Belum masuk. Buka halaman Masuk kasir (/tukangsanduak/masuk)." },
        { status: 401 },
      ),
    };
  }

  if (!isEmailAuthorizedForKasirPanel(user.email)) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Akun ini tidak diizinkan mengakses panel kasir." },
        { status: 403 },
      ),
    };
  }

  return { ok: true, user };
}
