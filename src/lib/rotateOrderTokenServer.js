import { supabaseAdmin } from "@/lib/supabase";
import { generateTableOrderSecret, getOrderTokenExpiryDate } from "@/lib/orderTableToken";

/**
 * Revoke token aktif untuk meja + buat token baru. Hanya dipanggil dari Route Handler (server).
 */
export async function rotateOrderTokenForMeja(nomor_meja, request) {
  const meja = typeof nomor_meja === "string" ? nomor_meja.trim() : "";
  if (!meja || !supabaseAdmin) {
    throw new Error(!meja ? "nomor_meja kosong" : "Supabase admin tidak tersedia");
  }

  const ttlHours = Number(process.env.ORDER_TOKEN_TTL_HOURS) || 4;
  const expiresAt = getOrderTokenExpiryDate(ttlHours);
  const secret = generateTableOrderSecret();

  const { error: revokeErr } = await supabaseAdmin
    .from("order_table_tokens")
    .update({ revoked_at: new Date().toISOString() })
    .eq("nomor_meja", meja)
    .is("revoked_at", null);

  if (revokeErr) throw new Error(revokeErr.message);

  const { data: inserted, error: insertErr } = await supabaseAdmin
    .from("order_table_tokens")
    .insert([
      {
        nomor_meja: meja,
        secret,
        expires_at: expiresAt.toISOString(),
      },
    ])
    .select("id, nomor_meja, secret, expires_at, created_at")
    .single();

  if (insertErr || !inserted) throw new Error(insertErr?.message ?? "Gagal membuat token");

  const base =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    `${request.headers.get("x-forwarded-proto") || "http"}://${request.headers.get("host") || "localhost:3000"}`;
  const orderUrl = `${base}/order?t=${encodeURIComponent(inserted.secret)}`;

  return {
    nomor_meja: inserted.nomor_meja,
    secret: inserted.secret,
    expires_at: inserted.expires_at,
    orderUrl,
  };
}

/**
 * Tanpa rotate — pakai secret aktif satu meja untuk URL QR (tamu tidak perlu ganti cetakan).
 */
export async function getStableOrderUrlForMeja(nomor_meja, request) {
  const meja = typeof nomor_meja === "string" ? nomor_meja.trim() : "";
  if (!meja || !supabaseAdmin) {
    throw new Error(!meja ? "nomor_meja kosong" : "Supabase admin tidak tersedia");
  }

  const { data, error } = await supabaseAdmin
    .from("order_table_tokens")
    .select("secret, expires_at")
    .eq("nomor_meja", meja)
    .is("revoked_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data?.secret) {
    throw new Error(error?.message ?? "Belum ada token aktif untuk meja ini — buat QR di halaman Token meja.");
  }

  const base =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    `${request.headers.get("x-forwarded-proto") || "http"}://${request.headers.get("host") || "localhost:3000"}`;

  return {
    nomor_meja: meja,
    secret: data.secret,
    expires_at: data.expires_at,
    orderUrl: `${base}/order?t=${encodeURIComponent(data.secret)}`,
  };
}
