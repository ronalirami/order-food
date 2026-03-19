# Lamak Bana — Restoran Padang

Website pemesanan makanan untuk restoran Padang di Kagawa, Jepang.

## Tech Stack

- Next.js 15 (App Router)
- React 19
- Tailwind CSS v4
- Framer Motion
- Supabase (database)

## Setup

### 1. Install dependency

```bash
npm install
```

### 2. Setup Supabase

1. Buat akun di [supabase.com](https://supabase.com)
2. Buat project baru
3. Di **SQL Editor**, jalankan isi file `supabase-schema.sql`
4. Di **Project Settings → API**, copy **Project URL** dan **anon public** key

### 3. Konfigurasi environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` dan isi:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

### 4. Jalankan development server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## Halaman

| URL | Keterangan |
|-----|------------|
| `/` | Beranda |
| `/menu` | Daftar menu (makanan, minuman, cemilan) |
| `/order` | Pemesanan + keranjang |
| `/tentang` | Tentang restoran |
| `/admin` | Daftar pesanan masuk (untuk pemilik) |

## Fitur

- Multi-language (Indonesia, English, 日本語)
- Keranjang belanja global
- Konfirmasi pesanan → tersimpan di Supabase
- Halaman admin untuk melihat pesanan
