import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireKasirAuthResponse } from "@/lib/requireKasirAuth";

/**
 * GET — daftar pesanan untuk panel kasir.
 * Akses: sesi Supabase Auth (middleware + pemeriksaan di route).
 */
export async function GET(_request) {
  const gate = await requireKasirAuthResponse();
  if (!gate.ok) return gate.response;

  if (!supabaseAdmin) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY belum dikonfigurasi" }, { status: 500 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data ?? []);
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
