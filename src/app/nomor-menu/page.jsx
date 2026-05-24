import { Suspense } from "react";
import NomorMenuClient from "./NomorMenuClient";

function Fallback() {
  return (
    <section className="min-h-screen bg-[#fdf6e8] flex items-center justify-center px-4">
      <p className="text-neutral-600">Memuat...</p>
    </section>
  );
}

export default function NomorMenuPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <NomorMenuClient />
    </Suspense>
  );
}
