import React, { useState, useMemo } from "react";
import Card from "../components/Card.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import Pill from "../components/Pill.jsx";
import Ledger from "../components/Ledger.jsx";
import { topics } from "../data/mockApi.js";

export default function TopicImportance({ activeAnalysis }) {
  const [filter, setFilter] = useState("All");

  const activeTopics = activeAnalysis?.topics || [];
  const hasNoActiveTopics = activeAnalysis && activeTopics.length === 0;
  const displayTopics = hasNoActiveTopics ? [] : (activeTopics.length > 0 ? activeTopics : topics);

  const sortedTopics = useMemo(() => {
    return [...displayTopics].sort((a, b) => (b.importance || 0) - (a.importance || 0));
  }, [displayTopics]);

  const filtered = filter === "All" ? sortedTopics : sortedTopics.filter((t) => t.priority === filter);

  if (hasNoActiveTopics) {
    return (
      <Card className="p-5 text-center py-12">
        <p className="text-slate-600/80 text-sm">No topics analyzed yet for this subject.</p>
        <p className="text-slate-600/80 text-xs mt-1">Please add topics manually or upload study materials in the 'Your Subject Analyzer' tab.</p>
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <SectionHeader
        title="Topic importance ranking"
        sub="Derived from frequency, weightage, and recency across uploaded papers — not a prediction of future questions"
        action={
          <div className="flex gap-1.5">
            {["All", "High", "Medium", "Low"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
                  filter === f
                    ? "bg-[#4F46E5] text-[#FDFBF7]"
                    : "bg-white/30 border border-[#1E293B]/10 text-slate-600/80 hover:text-[#1E293B]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        }
      />
      <div className="space-y-2">
        {filtered.map((t) => (
          <div
            key={t.id}
            className="rounded-xl border border-[#1E293B]/10 bg-white/30 p-4 hover:bg-white/65 hover:border-[#4F46E5]/30 transition duration-200"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium text-[#1E293B] tracking-[-0.02em]">{t.name}</p>
                  <Pill priority={t.priority} />
                </div>
                <p className="mt-1 text-xs font-mono text-slate-600/80">
                  Appeared {t.freq} times in last {t.totalExams || 6} exams · Avg weightage {t.avgMarks || parseInt(t.weightage)} marks · Last
                  seen {t.lastSeen}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <Ledger history={t.history} />
                <div className="w-20 text-right">
                  <p className="font-serif text-lg text-[#1E293B] tracking-[-0.02em]">{t.importance}</p>
                  <p className="text-[10px] uppercase tracking-wide text-slate-600/80">score</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
