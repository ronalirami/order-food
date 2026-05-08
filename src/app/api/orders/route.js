import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

async function validateOrderingToken(secret, nomor_meja_claim, tokenRowIdClaim) {
  if (!supabaseAdmin) return { ok: false, reason: "no_db" };
  if (!secret || typeof secret !== "string") return { ok: false, reason: "missing_token" };
  const now = new Date().toISOString();

  const { data, error } = await supabaseAdmin
    .from("order_table_tokens")
    .select("id, nomor_meja, expires_at, revoked_at")
    .eq("secret", secret.trim())
    .maybeSingle();
  if (error || !data) return { ok: false, reason: "invalid" };
  if (data.revoked_at) return { ok: false, reason: "revoked" };
  if (data.expires_at < now) return { ok: false, reason: "expired" };

  const meja = String(data.nomor_meja ?? "").trim();
  const claimMeja = String(nomor_meja_claim ?? "").trim();
  if (meja !== claimMeja) return { ok: false, reason: "meja_mismatch" };

  if (tokenRowIdClaim && String(data.id) !== String(tokenRowIdClaim)) {
    return { ok: false, reason: "id_mismatch" };
  }

  return { ok: true, nomor_meja: meja, token_row_id: data.id };
}

export async function POST(request) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase belum dikonfigurasi. Tambah SUPABASE_SERVICE_ROLE_KEY di .env.local" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { nama_pemesan, nomor_meja, items, total_harga, ordering_token, order_token_row_id } = body;

    if (!nama_pemesan || !nomor_meja || !items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: "Data tidak lengkap: nama_pemesan, nomor_meja, items wajib" },
        { status: 400 }
      );
    }

    const tokenCheck = await validateOrderingToken(ordering_token, nomor_meja, order_token_row_id);
    if (!tokenCheck.ok) {
      return NextResponse.json(
        { error: "Token meja tidak valid atau sudah kadaluarsa — scan QR terbaru di meja Anda." },
        { status: 403 }
      );
    }

    const insertRow = {
      nama_pemesan: nama_pemesan.trim(),
      nomor_meja: tokenCheck.nomor_meja,
      items,
      total_harga: total_harga ?? 0,
      status: "pending",
      payment_status: "belum_bayar",
      order_token_id: tokenCheck.token_row_id,
    };

    const { data, error } = await supabaseAdmin
      .from("orders")
      .insert([
        insertRow,
      ])
      .select("id")
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function GET() {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase belum dikonfigurasi" },
      { status: 500 }
    );
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
