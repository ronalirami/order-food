-- Jalankan SQL ini di Supabase Dashboard → SQL Editor
-- https://supabase.com/dashboard → pilih project → SQL Editor → New query

CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_pemesan TEXT NOT NULL,
  nomor_meja TEXT NOT NULL,
  items JSONB NOT NULL,
  total_harga INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Izinkan insert & select untuk anon (tanpa login)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow select orders" ON orders
  FOR SELECT USING (true);
