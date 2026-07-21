import React from "react";
import Card from "./Card.jsx";

export default function StatCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-600/80">{label}</p>
          <p className="mt-1.5 font-serif text-2xl text-[#1E293B] tracking-[-0.02em]">{value}</p>
          <p className="mt-1 text-xs text-slate-600/80 font-mono">{sub}</p>
        </div>
        <div className="rounded-lg p-2" style={{ backgroundColor: `${accent}1A` }}>
          <Icon className="h-4 w-4" style={{ color: accent }} />
        </div>
      </div>
    </Card>
  );
}

