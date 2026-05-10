import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { rotateOrderTokenForMeja } from "@/lib/rotateOrderTokenServer";
import { requireKasirAuthResponse } from "@/lib/requireKasirAuth";

/**
 * POST { nomor_meja }
 * Membuat token baru untuk meja (revoke token aktif sebelumnya).
 */
export async function POST(request) {
  const gate = await requireKasirAuthResponse();
  if (!gate.ok) return gate.response;

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY belum dikonfigurasi" },
      { status: 500 },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body JSON tidak valid" }, { status: 400 });
  }

  const { nomor_meja } = body ?? {};

  const meja = typeof nomor_meja === "string" ? nomor_meja.trim() : "";
  if (!meja) {
    return NextResponse.json({ error: "nomor_meja wajib diisi" }, { status: 400 });
  }

  try {
    const rotated = await rotateOrderTokenForMeja(meja, request);
    return NextResponse.json({
      success: true,
      nomor_meja: rotated.nomor_meja,
      secret: rotated.secret,
      expires_at: rotated.expires_at,
      orderUrl: rotated.orderUrl,
    });
  } catch (err) {
    console.error("table-token:", err);
    return NextResponse.json(
      { error: err?.message ?? "Gagal membuat token" },
      { status: 500 },
    );
  }
}
