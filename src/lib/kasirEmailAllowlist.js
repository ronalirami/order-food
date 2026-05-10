/**
 * Batas akses panel kasir (Supabase Auth).
 * Jika KASIR_ADMIN_EMAILS kosong: SEMUA pengguna yang berhasil masuk boleh mengakses.
 * Produksi — isi whitelist email staf Anda (pisahkan koma).
 */
export function parsedKasirAdminEmails() {
  return String(process.env.KASIR_ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isEmailAuthorizedForKasirPanel(email) {
  if (!email) return false;
  const allowed = parsedKasirAdminEmails();
  if (allowed.length === 0) return true;
  return allowed.includes(String(email).trim().toLowerCase());
}
