import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { rotateOrderTokenForMeja } from "@/lib/rotateOrderTokenServer";

/**
 * POST { admin_secret, nomor_meja }
 * - Tandai semua pesanan di meja itu sebagai lunas
 * - Putar token QR untuk meja (tamu berikutnya pakai QR baru)
 */
export async function POST(request) {
  const rotateSecret = process.env.TABLE_TOKEN_ROTATE_SECRET;
  if (!rotateSecret) {
    return NextResponse.json(
      { error: "TABLE_TOKEN_ROTATE_SECRET belum diset di .env.local" },
      { status: 500 }
    );
  }
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY belum dikonfigurasi" },
      { status: 500 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body JSON tidak valid" }, { status: 400 });
  }

  const { admin_secret, nomor_meja } = body ?? {};
  if (admin_secret !== rotateSecret) {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  }

  const meja = typeof nomor_meja === "string" ? nomor_meja.trim() : "";
  if (!meja) {
    return NextResponse.json({ error: "nomor_meja wajib diisi" }, { status: 400 });
  }

  try {
    const { error: payErr } = await supabaseAdmin
      .from("orders")
      .update({ payment_status: "lunas" })
      .eq("nomor_meja", meja);

    if (payErr) {
      console.error("update payment:", payErr);
      return NextResponse.json({ error: payErr.message }, { status: 500 });
    }

    const rotated = await rotateOrderTokenForMeja(meja, request);

    return NextResponse.json({
      success: true,
      nomor_meja: rotated.nomor_meja,
      expires_at: rotated.expires_at,
      orderUrl: rotated.orderUrl,
      message: "Semua pesanan di meja ditandai lunas dan QR meja diganti.",
    });
  } catch (err) {
    console.error("complete-table:", err);
    return NextResponse.json(
      { error: err?.message ?? "Gagal menyelesaikan meja" },
      { status: 500 }
    );
  }
}
