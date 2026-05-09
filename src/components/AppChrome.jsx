"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const STAFF_PANEL_PREFIX = "/tukangsanduak";

function isStaffRoute(pathname) {
  if (!pathname) return false;
  return pathname === STAFF_PANEL_PREFIX || pathname.startsWith(`${STAFF_PANEL_PREFIX}/`);
}

/**
 * Navbar + Footer disembunyikan di /tukangsanduak agar staf tidak pindah ke situs tamu.
 */
export default function AppChrome({ children }) {
  const pathname = usePathname();
  const hidePublicChrome = isStaffRoute(pathname);

  return (
    <>
      {!hidePublicChrome && <Navbar />}
      <main className="flex-1">{children}</main>
      {!hidePublicChrome && <Footer />}
    </>
  );
}
