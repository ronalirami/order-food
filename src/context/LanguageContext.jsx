"use client";

import { createContext, useContext, useState } from "react";

export const translations = {
  id: {
    nav: {
      menu: "Menu",
      tentang: "Tentang",
      order: "Order",
    },
    home: {
      title: "NasiPadang",
      subtitle: "MARANTAU",
      cardMenu: "Menu",
      cardOrder: "Order",
      cardTentang: "Tentang",
    },
    menu: {
      title: "Daftar Menu",
      subtitle: "Pilihan hidangan terbaik dari dapur Minangkabau kami — autentik, lembut, dan penuh cita rasa.",
      tambah: "+ Tambah",
      kategori: {
        makanan: "🍛 Makanan",
        minuman: "🥤 Minuman",
        cemilan: "🍟 Cemilan",
      },
    },
    order: {
      title: "Order Sekarang",
      subtitle: "Pilih menu favorit Anda dan pesan langsung dari meja.",
      pesan: "Pesan",
      keranjang: "Keranjang",
      belumAda: "Belum ada pesanan.",
      total: "Total",
      konfirmasi: "Konfirmasi Pesanan",
      modalTitle: "Konfirmasi Pesanan",
      namaPemesan: "Nama pemesan",
      nomorMeja: "Nomor meja",
      konfirmasiKirim: "Konfirmasi & Kirim Pesanan",
      sukses: "Pesanan Diterima!",
      suksesMsg: "Terima kasih,",
      suksesMsg2: "Pesanan meja",
      suksesMsg3: "sedang diproses.",
    },
    tentang: {
      heroTitle: "Tentang Kami",
      heroSubtitle: "Membawa kehangatan Minangkabau ke Jepang dengan sentuhan elegan dan modern.",
      filosofiTitle: 'Filosofi "Lamak Bana"',
      filosofiP1: 'Dalam bahasa Minang, Lamak Bana berarti teramat lezat. Filosofi ini menjadi dasar setiap hidangan yang kami sajikan — dari pemilihan bahan terbaik hingga proses memasak yang penuh ketelatenan.',
      filosofiP2: "Didirikan oleh perantau Minang di Jepang, restoran ini menjadi jembatan budaya — mempertemukan cita rasa Nusantara dengan kehalusan estetika Jepang. Kami percaya makanan bukan sekadar rasa, melainkan pengalaman dan cerita.",
      h1: "🇯🇵 Berdiri di Jepang",
      h1desc: "Didirikan tahun 2024 di Kagawa, mengusung semangat perantauan dan kecintaan pada kuliner Nusantara.",
      h2: "🍛 Rasa Autentik Minang",
      h2desc: "Resep asli Minangkabau dengan teknik memasak tradisional yang diwariskan turun-temurun.",
      h3: "🤝 Harmoni Budaya",
      h3desc: "Menggabungkan kekayaan rasa Minang dengan estetika dan keramahan Jepang.",
      ctaTitle: "Siap merasakan kelezatan sejati?",
      ctaBtn: "Order Sekarang",
    },
    footer: {
      brand: "RM. Lamak Bana",
      brandDesc: "Restoran Padang autentik di Kagawa, Jepang. Membawa cita rasa Minangkabau dengan sentuhan elegan dan modern.",
      navTitle: "Navigasi",
      beranda: "Beranda",
      menu: "Menu",
      tentang: "Tentang Kami",
      order: "Order",
      kontakTitle: "Kontak",
      alamat: "📍 Kagawa, Jepang",
      jam: "🕐 Senin – Sabtu: 11.00 – 21.00",
      copyright: "Lamak Bana. Semua hak cipta dilindungi.",
    },
  },

  en: {
    nav: {
      menu: "Menu",
      tentang: "About",
      order: "Order",
    },
    home: {
      title: "NasiPadang",
      subtitle: "MARANTAU",
      cardMenu: "Menu",
      cardOrder: "Order",
      cardTentang: "About",
    },
    menu: {
      title: "Our Menu",
      subtitle: "The finest selection from our Minangkabau kitchen — authentic, tender, and full of flavor.",
      tambah: "+ Add",
      kategori: {
        makanan: "🍛 Food",
        minuman: "🥤 Drinks",
        cemilan: "🍟 Snacks",
      },
    },
    order: {
      title: "Order Now",
      subtitle: "Choose your favorite dish and order directly from your table.",
      pesan: "Order",
      keranjang: "Cart",
      belumAda: "No items yet.",
      total: "Total",
      konfirmasi: "Confirm Order",
      modalTitle: "Confirm Order",
      namaPemesan: "Your name",
      nomorMeja: "Table number",
      konfirmasiKirim: "Confirm & Send Order",
      sukses: "Order Received!",
      suksesMsg: "Thank you,",
      suksesMsg2: "Order for table",
      suksesMsg3: "is being processed.",
    },
    tentang: {
      heroTitle: "About Us",
      heroSubtitle: "Bringing the warmth of Minangkabau to Japan with an elegant and modern touch.",
      filosofiTitle: '"Lamak Bana" Philosophy',
      filosofiP1: 'In the Minang language, Lamak Bana means "truly delicious". This philosophy is the foundation of every dish we serve — from selecting the finest ingredients to a cooking process filled with dedication.',
      filosofiP2: "Founded by Minang people in Japan, this restaurant bridges two cultures — uniting the flavors of the Indonesian archipelago with the refined aesthetics of Japan. We believe food is more than taste; it is an experience and a story.",
      h1: "🇯🇵 Based in Japan",
      h1desc: "Founded in 2024 in Kagawa, driven by the spirit of diaspora and a love for Indonesian cuisine.",
      h2: "🍛 Authentic Minang Flavor",
      h2desc: "Original Minangkabau recipes with traditional cooking techniques passed down through generations.",
      h3: "🤝 Cultural Harmony",
      h3desc: "Blending the richness of Minang flavors with Japanese aesthetics and hospitality.",
      ctaTitle: "Ready to taste true deliciousness?",
      ctaBtn: "Order Now",
    },
    footer: {
      brand: "RM. Lamak Bana",
      brandDesc: "Authentic Padang restaurant in Kagawa, Japan. Bringing the flavors of Minangkabau with an elegant and modern touch.",
      navTitle: "Navigation",
      beranda: "Home",
      menu: "Menu",
      tentang: "About Us",
      order: "Order",
      kontakTitle: "Contact",
      alamat: "📍 Kagawa, Japan",
      jam: "🕐 Mon – Sat: 11:00 – 21:00",
      copyright: "Lamak Bana. All rights reserved.",
    },
  },

  ja: {
    nav: {
      menu: "メニュー",
      tentang: "私たちについて",
      order: "注文",
    },
    home: {
      title: "NasiPadang",
      subtitle: "MARANTAU",
      cardMenu: "メニュー",
      cardOrder: "注文",
      cardTentang: "私たちについて",
    },
    menu: {
      title: "メニュー一覧",
      subtitle: "ミナンカバウの厨房から最高の料理をお届けします — 本格的で、やわらかく、風味豊かです。",
      tambah: "+ 追加",
      kategori: {
        makanan: "🍛 料理",
        minuman: "🥤 ドリンク",
        cemilan: "🍟 スナック",
      },
    },
    order: {
      title: "今すぐ注文",
      subtitle: "お好みのメニューを選んで、テーブルから直接注文できます。",
      pesan: "注文する",
      keranjang: "カート",
      belumAda: "まだ注文がありません。",
      total: "合計",
      konfirmasi: "注文を確認する",
      modalTitle: "注文の確認",
      namaPemesan: "お名前",
      nomorMeja: "テーブル番号",
      konfirmasiKirim: "確認して注文を送る",
      sukses: "ご注文を承りました！",
      suksesMsg: "ありがとうございます、",
      suksesMsg2: "テーブル",
      suksesMsg3: "のご注文を処理中です。",
    },
    tentang: {
      heroTitle: "私たちについて",
      heroSubtitle: "エレガントでモダンなタッチでミナンカバウの温かさを日本にお届けします。",
      filosofiTitle: "「ラマク・バナ」の哲学",
      filosofiP1: "ミナン語で「ラマク・バナ」とは「とても美味しい」という意味です。この哲学が、最高の食材の選定から丁寧な調理まで、すべての料理の基盤となっています。",
      filosofiP2: "日本に住むミナン人によって設立されたこのレストランは、二つの文化をつなぐ橋です — インドネシアの風味と日本の洗練された美学を融合させています。食べ物はただの味覚ではなく、体験と物語であると私たちは信じています。",
      h1: "🇯🇵 日本で誕生",
      h1desc: "2024年に香川県で創業。出稼ぎの精神とインドネシア料理への愛を胸に。",
      h2: "🍛 本格ミナン料理",
      h2desc: "代々受け継がれてきた伝統的な調理技法による、本物のミナンカバウのレシピ。",
      h3: "🤝 文化の調和",
      h3desc: "ミナン料理の豊かさと日本の美学とおもてなしを融合させています。",
      ctaTitle: "本物の美味しさを体験しませんか？",
      ctaBtn: "今すぐ注文",
    },
    footer: {
      brand: "RM. ラマク・バナ",
      brandDesc: "香川県にある本格パダン料理レストラン。ミナンカバウの味をエレガントでモダンなタッチでお届けします。",
      navTitle: "ナビゲーション",
      beranda: "ホーム",
      menu: "メニュー",
      tentang: "私たちについて",
      order: "注文",
      kontakTitle: "お問い合わせ",
      alamat: "📍 香川県、日本",
      jam: "🕐 月〜土：11:00 〜 21:00",
      copyright: "ラマク・バナ。無断転載禁止。",
    },
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("id");

  const t = (path) => {
    const keys = path.split(".");
    let result = translations[lang];
    for (const key of keys) {
      result = result?.[key];
    }
    return result ?? path;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage harus digunakan di dalam LanguageProvider");
  return context;
}
