export default function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-[#1E293B]/10 bg-white/45 backdrop-blur-[20px] shadow-xl transition-all duration-300 hover:border-[#4F46E5]/40 ${className}`}
    >
      {children}
    </div>
  );
}


