export default function Container({ children, className = "" }) {
  return (
    <div
      className={`max-w-screen-xl mx-auto px-4 sm:px-6 md:px-12 lg:px-20 py-10 ${className}`}
    >
      {children}
    </div>
  );
}
