import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import Card from "../components/Card.jsx";
import SectionHeader from "../components/SectionHeader.jsx";

export default function Roadmaps() {
  const exams = ["JEE", "NEET", "UPSC", "TNPSC", "SSC", "Banking", "CAT", "GATE"];
  const [selected, setSelected] = useState("JEE");

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="p-4 lg:col-span-1">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-600/80">Select exam</p>
        <div className="space-y-1">
          {exams.map((e) => (
            <button
              key={e}
              onClick={() => setSelected(e)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold transition cursor-pointer ${
                selected === e
                  ? "bg-[#4F46E5]/10 text-[#4F46E5] ring-1 ring-[#4F46E5]/30"
                  : "text-slate-600/80 hover:bg-white/20 hover:text-[#1E293B]"
              }`}
            >
              {e}
              <ChevronRight className="h-3.5 w-3.5 text-slate-600/80" />
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-5 lg:col-span-2">
        <SectionHeader
          title={`${selected} Roadmap`}
          sub="Eligibility, timeline & strategy — general guidance, not exam-specific question prediction"
        />
        <div className="space-y-4 mt-4">
          <RoadmapRow label="Eligibility" value="12th grade (PCM) for JEE Main; age limits per latest notification" />
          <RoadmapRow label="Timeline" value="Applications ~Nov, Session 1 ~Jan, Session 2 ~Apr" />
          <RoadmapRow label="Study strategy" value="NCERT fundamentals → topic-wise practice → full-length mocks → error log review" />
          <RoadmapRow label="Milestones" value="Concept completion → 50% mock accuracy → 75% mock accuracy → mock at target percentile" />
        </div>
      </Card>
    </div>
  );
}

function RoadmapRow({ label, value }) {
  return (
    <div className="rounded-xl border border-[#1E293B]/10 bg-white/30 p-4 transition-all hover:bg-white/45">
      <p className="text-xs font-bold uppercase tracking-wide text-[#4F46E5]">{label}</p>
      <p className="mt-1.5 text-sm text-[#1E293B] leading-relaxed">{value}</p>
    </div>
  );
}
