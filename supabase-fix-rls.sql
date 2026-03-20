-- Perbaiki RLS agar pelanggan bisa order (INSERT)
-- Jalankan di Supabase Dashboard → SQL Editor
-- https://supabase.com/dashboard → pilih project → SQL Editor

-- Pastikan policy INSERT untuk anon ada (pelanggan order tanpa login)
DROP POLICY IF EXISTS "Allow insert orders" ON orders;
CREATE POLICY "Allow insert orders" ON orders
  FOR INSERT TO anon
  WITH CHECK (true);

-- Catatan: Jika sudah pakai supabase-admin.sql, policy SELECT hanya untuk admin.
-- INSERT tetap harus allow anon agar pelanggan bisa order.
