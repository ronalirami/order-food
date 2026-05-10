import { NextResponse } from "next/server";
import { createSupabaseRouteAuthClient } from "@/lib/supabaseRouteAuth";

export async function POST() {
  const supabase = await createSupabaseRouteAuthClient();
  if (!supabase) {
    return NextResponse.json({ error: "Konfigurasi Supabase tidak lengkap" }, { status: 500 });
  }
  await supabase.auth.signOut();
  return NextResponse.json({ ok: true });
}
