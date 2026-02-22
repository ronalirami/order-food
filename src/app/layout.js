import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
  title: "Lamak Bana - Restoran Padang",
  description: "Sistem reservasi online sederhana",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      {/* Poppins untuk seluruh body */}
      <body className={`${poppins.className} min-h-screen flex flex-col bg-black text-white`}>
        {/* Kirim font Lora ke Navbar untuk logo */}
        <Navbar fontTitle={lora.className} />
        <main className="flex-1">{children}</main>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
