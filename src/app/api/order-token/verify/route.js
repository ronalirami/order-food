import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

/** GET ?t=TOKEN — balikan JSON untuk tamu tanpa rahasia server */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("t")?.trim();
  if (!token) {
    return NextResponse.json({ valid: false, reason: "missing_token" }, { status: 400 });
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ valid: false, reason: "server_config" }, { status: 500 });
  }

  const now = new Date().toISOString();
  const { data, error } = await supabaseAdmin
    .from("order_table_tokens")
    .select("id, nomor_meja, expires_at, revoked_at")
    .eq("secret", token)
    .maybeSingle();

  if (error) {
    console.error("verify order token:", error);
    return NextResponse.json({ valid: false, reason: "db_error" }, { status: 500 });
  }

  if (!data || data.revoked_at) {
    return NextResponse.json({ valid: false, reason: "invalid_or_revoked" }, { status: 401 });
  }
  if (data.expires_at < now) {
    return NextResponse.json({ valid: false, reason: "expired" }, { status: 401 });
  }

  return NextResponse.json({
    valid: true,
    nomor_meja: data.nomor_meja,
    expires_at: data.expires_at,
    token_row_id: data.id,
  });
}
