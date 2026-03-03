export default function HomePage() {
  return (
    <section className="relative w-full h-screen flex overflow-hidden">
      {/* === BACKGROUND VIDEO === */}
      <div className="relative flex-1 rounded-2xl overflow-hidden mr-2">
        <Image
          src={heroMain}
          alt="Menu utama"
          fill
          priority
          className="object-cover brightness-50"
        />  
      </div>
    </section>
  );