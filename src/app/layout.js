import "./globals.css";
import AppChrome from "@/components/AppChrome";
import Providers from "@/components/Providers";
import { Lora, Poppins } from "next/font/google";

// Import dua font
const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
});

export const metadata = {
  title: "Lamak Bana - Restoran Padang di Kagawa, Jepang",
  description:
    "Nikmati cita rasa autentik Minangkabau di Kagawa, Jepang. Pesan rendang, ayam pop, gulai, dan hidangan Padang pilihan langsung dari meja Anda.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      {/* Poppins untuk seluruh body */}
      <body className={`${poppins.className} min-h-screen flex flex-col bg-black text-white`}>
        <Providers>
          <AppChrome>{children}</AppChrome>
        </Providers>
      </body>
    </html>
  );
}
