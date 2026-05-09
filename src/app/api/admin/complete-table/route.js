import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { shouldRotateOrderQrAfterPayment } from "@/lib/orderQrPolicy";
import { getStableOrderUrlForMeja, rotateOrderTokenForMeja } from "@/lib/rotateOrderTokenServer";

/**
 * POST { admin_secret, nomor_meja }
 * - Tandai semua pesanan di meja itu sebagai lunas
 * - Putar QR hanya jika NEXT_PUBLIC_ROTATE_ORDER_QR_AFTER_PAYMENT=true (default)
 */

export async function POST(request) {
  const rotateSecret = process.env.TABLE_TOKEN_ROTATE_SECRET;
  if (!rotateSecret) {
    return NextResponse.json(
      { error: "TABLE_TOKEN_ROTATE_SECRET belum diset di .env.local" },
      { status: 500 },
    );
  }
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

  const { admin_secret, nomor_meja } = body ?? {};
  if (admin_secret !== rotateSecret) {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  }

  const meja = typeof nomor_meja === "string" ? nomor_meja.trim() : "";
  if (!meja) {
    return NextResponse.json({ error: "nomor_meja wajib diisi" }, { status: 400 });
  }

  const doRotate = shouldRotateOrderQrAfterPayment();

  try {
    const { error: payErr } = await supabaseAdmin
      .from("orders")
      .update({ payment_status: "lunas", status: "completed" })
      .eq("nomor_meja", meja);

    if (payErr) {
      console.error("update payment:", payErr);
      return NextResponse.json({ error: payErr.message }, { status: 500 });
    }

    let urlInfo;
    let message;
    if (doRotate) {
      urlInfo = await rotateOrderTokenForMeja(meja, request);
      message = "Semua pesanan di meja ditandai lunas dan QR meja diganti.";
    } else {
      urlInfo = await getStableOrderUrlForMeja(meja, request);
      message = "Semua pesanan di meja ditandai lunas. QR meja tetap — tidak perlu ganti tempelan.";
    }

    return NextResponse.json({
      success: true,
      nomor_meja: urlInfo.nomor_meja,
      expires_at: urlInfo.expires_at,
      orderUrl: urlInfo.orderUrl,
      qr_rotated: doRotate,
      message,
    });
  } catch (err) {
    console.error("complete-table:", err);
    return NextResponse.json(
      { error: err?.message ?? "Gagal menyelesaikan meja" },
      { status: 500 },
    );
  }
}
