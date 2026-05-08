-- Token QR per meja (ganti/token baru lewat halaman admin + secret env)
-- Jalankan di Supabase SQL Editor setelah punya tabel orders

CREATE TABLE IF NOT EXISTS order_table_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nomor_meja TEXT NOT NULL,
  secret TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_table_tokens_secret_active
  ON order_table_tokens (secret)
  WHERE revoked_at IS NULL;

COMMENT ON TABLE order_table_tokens IS 'Token sekali pakai scan QR — rotate membuat foto QR lama tidak valid setelah revoked.';

-- Kolom pembayaran + jejak token (opsional untuk audit)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'belum_bayar';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_token_id UUID REFERENCES order_table_tokens(id) ON DELETE SET NULL;

-- Tidak ada RLS publik untuk order_table_tokens — hanya akses lewat Service Role dari API Anda
