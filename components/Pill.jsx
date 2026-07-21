import React from "react";

const priorityColor = {
  High: { text: "text-[#F59E0B]", bg: "bg-[#F59E0B]/10", ring: "ring-[#F59E0B]/30", dot: "bg-[#F59E0B]" },
  Medium: { text: "text-[#4F46E5]", bg: "bg-[#4F46E5]/10", ring: "ring-[#4F46E5]/30", dot: "bg-[#4F46E5]" },
  Low: { text: "text-[#64748B]", bg: "bg-[#64748B]/10", ring: "ring-[#64748B]/30", dot: "bg-[#64748B]" },
};

export default function Pill({ priority }) {
  const c = priorityColor[priority] || priorityColor.Low;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${c.bg} ${c.text} ${c.ring}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {priority}
    </span>
  );
}

