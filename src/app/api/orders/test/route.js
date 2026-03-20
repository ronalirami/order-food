import { supabase } from "@/lib/supabase";

export async function GET() {
  const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const hasClient = !!supabase;

  if (!supabase) {
    return Response.json({
      ok: false,
      error: "Supabase client tidak terinisialisasi",
      env: { hasUrl, hasKey },
    });
  }

  try {
    const { data, error } = await supabase.from("orders").select("id").limit(1);
    return Response.json({
      ok: true,
      error: error?.message || null,
      rowCount: data?.length ?? 0,
      env: { hasUrl, hasKey },
    });
  } catch (err) {
    return Response.json({
      ok: false,
      error: err.message,
      env: { hasUrl, hasKey },
    });
  }
}
