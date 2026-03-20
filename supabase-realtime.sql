-- Aktifkan Realtime untuk tabel orders
-- Supabase Dashboard → SQL Editor → New query → paste → Run
-- https://supabase.com/dashboard → pilih project → SQL Editor

-- Tambahkan tabel orders ke publication Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
