import React from "react";

export default function SectionHeader({ title, sub, action }) {
  return (
    <div className="mb-4 flex items-start justify-between">
      <div>
        <h3 className="font-serif text-base text-[#1E293B] tracking-[-0.02em]">{title}</h3>
        {sub && <p className="mt-0.5 text-xs text-slate-600/80">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

