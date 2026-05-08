import { Suspense } from "react";
import OrderPageClient from "./OrderPageClient";

function OrderFallback() {
  return (
    <section className="min-h-screen bg-black text-white flex items-center justify-center px-6" style={{ paddingTop: "6rem" }}>
      <p className="text-gray-400">Memuat...</p>
    </section>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={<OrderFallback />}>
      <OrderPageClient />
    </Suspense>
  );
}
