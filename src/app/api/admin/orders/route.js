import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * GET — daftar pesanan untuk panel kasir.
 * Header wajib: x-admin-secret sama dengan TABLE_TOKEN_ROTATE_SECRET (service role di server).
 */
export async function GET(request) {
  const rotateSecret = process.env.TABLE_TOKEN_ROTATE_SECRET;
  const sent = request.headers.get("x-admin-secret") ?? "";

  if (!rotateSecret) {
    return NextResponse.json({ error: "TABLE_TOKEN_ROTATE_SECRET belum diset di server" }, { status: 500 });
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY belum dikonfigurasi" }, { status: 500 });
  }
  if (sent !== rotateSecret) {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
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
