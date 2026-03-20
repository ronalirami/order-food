-- JALANKAN INI JIKA ORDER TIDAK MASUK KE DATABASE
-- Supabase Dashboard → SQL Editor → New query → paste → Run

-- Hapus tabel lama (data akan hilang)
DROP TABLE IF EXISTS orders;

-- Buat ulang dengan struktur lengkap
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_pemesan TEXT NOT NULL,
  nomor_meja TEXT NOT NULL,
  items JSONB NOT NULL,
  total_harga INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow select orders" ON orders
  FOR SELECT USING (true);
