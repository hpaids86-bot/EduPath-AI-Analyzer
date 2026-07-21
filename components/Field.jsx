import React from "react";

export default function Field({ label, value, highlight }) {
  return (
    <div className="flex items-center justify-between border-b border-themeBorder pb-2.5">
      <span className="text-themeMuted text-xs">{label}</span>
      <span className={highlight ? "font-semibold text-themeAccent text-xs" : "text-themeText text-xs"}>{value}</span>
    </div>
  );
}


