import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request) {
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase belum dikonfigurasi. Buat file .env.local" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { nama_pemesan, nomor_meja, items, total_harga } = body;

    if (!nama_pemesan || !nomor_meja || !items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: "Data tidak lengkap: nama_pemesan, nomor_meja, items wajib" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          nama_pemesan: nama_pemesan.trim(),
          nomor_meja: nomor_meja.trim(),
          items,
          total_harga: total_harga ?? 0,
          status: "pending",
        },
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
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase belum dikonfigurasi" },
      { status: 500 }
    );
  }

  try {
    const { data, error } = await supabase
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
