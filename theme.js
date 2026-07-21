// Design Tokens for ExamInsight Glassmorphism Design System (Cream Palette)
export const glassTheme = {
  // Base background: diagonal warm cream gradient (135deg)
  background: "bg-gradient-to-br from-[#FDFBF7] to-[#EAE5D8]",
  
  // Glass panels configurations (frosted cream glass)
  // medium (20px blur) for normal cards, sidebar, header
  panel: "bg-white/45 border border-[#1E293B]/10 backdrop-blur-[20px] rounded-2xl shadow-xl hover:border-[#4F46E5]/40 transition duration-200 ease-in-out",
  
  // light (8px blur) for smaller sub-panels/widgets
  panelLight: "bg-white/30 border border-[#1E293B]/06 backdrop-blur-[8px] rounded-xl shadow-md",
  
  // heavy (32px blur) for modals or dialog layers
  panelHeavy: "bg-white/35 border border-[#1E293B]/15 backdrop-blur-[32px] rounded-3xl shadow-2xl",
  
  // Accent colors (Royal Purple/Indigo #4F46E5 / Teal #0D9488)
  activeNav: "bg-[#4F46E5]/10 border border-[#4F46E5]/30 text-[#4F46E5]",
  activeTeal: "bg-[#0D9488]/10 border border-[#0D9488]/30 text-[#0D9488]",
  ctaButton: "bg-[#4F46E5] hover:bg-[#4F46E5]/90 text-[#FDFBF7] font-semibold transition duration-200 cursor-pointer shadow-lg shadow-[#4F46E5]/20 disabled:opacity-50",
  
  // Typography helpers (Deep Charcoal #1E293B / Slate Grey #64748B)
  textPrimary: "text-[#1E293B] tracking-[-0.02em]",
  textMuted: "text-slate-600/80",
  
  // Semantic highlights (Amber, Slate, Green, Red)
  badgeHigh: "bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B] font-semibold",
  badgeLow: "bg-[#64748B]/10 border border-[#64748B]/20 text-[#64748B] font-semibold",
  badgeSuccess: "bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] font-semibold",
  badgeError: "bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] font-semibold"
};
