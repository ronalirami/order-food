import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/** Supabase anon + cookie sesi pengguna — Route Handlers & Server Actions. */
export async function createSupabaseRouteAuthClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;

  const cookieStore = await cookies();

  return createServerClient(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          /* set cookie di Server Component bisa gagal tanpa konteks tertentu */
        }
      },
    },
  });
}
