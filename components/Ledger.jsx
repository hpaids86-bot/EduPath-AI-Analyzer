import React from "react";

export default function Ledger({ history }) {
  return (
    <div className="flex items-center gap-1">
      {history.map((h, i) => (
        <span
          key={i}
          className={`h-2 w-2 rounded-full ${h ? "bg-[#4F46E5] animate-pulse" : "bg-[#1E293B]/15"}`}
          title={h ? "Appeared" : "Not asked"}
        />
      ))}
    </div>
  );
}


