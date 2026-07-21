import React, { useState, useMemo } from "react";
import { ShieldAlert, CheckCircle, Award, Sparkles, Clock, AlertTriangle } from "lucide-react";
import Card from "../components/Card.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import Pill from "../components/Pill.jsx";
import { topics } from "../data/mockApi.js";

export default function PassStrategy({ activeAnalysis }) {
  const activeTopics = activeAnalysis?.topics || [];
  const hasNoActiveTopics = activeAnalysis && activeTopics.length === 0;
  const displayTopics = hasNoActiveTopics ? [] : (activeTopics.length > 0 ? activeTopics : topics);

  const minimal = useMemo(() => {
    let highVal = displayTopics.filter(t => t.priority === "High");
    if (highVal.length < 4) {
      const medVal = displayTopics.filter(t => t.priority === "Medium");
      highVal = [...highVal, ...medVal];
    }
    return highVal.slice(0, 4);
  }, [displayTopics]);

  // Interactive widget states
  const [completedTopics, setCompletedTopics] = useState({});
  const [weeklyHours, setWeeklyHours] = useState(5);
  const [lastMockScore, setLastMockScore] = useState(45);

  const toggleTopic = (id) => {
    setCompletedTopics((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Calculations for study analyzer
  const analysis = useMemo(() => {
    let topicMarks = 0;
    let topicsCount = 0;

    // Sum up marks of completed topics
    minimal.forEach((t) => {
      if (completedTopics[t.id]) {
        topicMarks += parseInt(t.avgMarks) || parseInt(t.weightage) || 10;
        topicsCount += 1;
      }
    });

    const hoursContribution = Math.min(25, weeklyHours * 2.2);
    const mockContribution = lastMockScore * 0.35; // scales 30-90 to ~10.5-31.5 marks
    const projectedScore = Math.min(98, Math.round(topicMarks + hoursContribution + mockContribution));

    let passLevel = "Danger Zone";
    let color = "#EF4444";
    let description = "You are at high risk of not reaching the pass mark. You need to master more core topics.";

    if (projectedScore >= 75) {
      passLevel = "Excellent Margin";
      color = "#3B82F6";
      description = "Outstanding! You are on track not just to pass, but to score a top-tier grade. Keep doing what you are doing!";
    } else if (projectedScore >= 55) {
      passLevel = "Comfortable Pass";
      color = "#10B981";
      description = "Great job! You have safely cleared the passing threshold. Focus on practicing previous papers to cement your standing.";
    } else if (projectedScore >= 40) {
      passLevel = "Borderline Pass";
      color = "#F59E0B";
      description = "You are right on the edge of the passing line. One simple mistake could pull you down. Review one more medium-priority topic.";
    }

    // Custom personalized recommendations
    const tips = [];
    if (topicsCount === 0 && minimal.length > 0) {
      tips.push(`Master '${minimal[0].name}' first - it has a high weightage of ${minimal[0].avgMarks || parseInt(minimal[0].weightage)} marks.`);
    }
    if (weeklyHours < 6) {
      tips.push("Increase weekly study to at least 7-8 hours. Consistent daily slots build better retention.");
    }
    if (lastMockScore < 50) {
      tips.push("Your mock score is low. Analyze the questions you got wrong last time and keep an error log.");
    }
    if (topicsCount > 0 && topicsCount < minimal.length) {
      const missing = minimal.find((t) => !completedTopics[t.id]);
      if (missing) {
        tips.push(`Master the next high-yield topic: '${missing.name}' to secure another ${missing.avgMarks || parseInt(missing.weightage)} potential marks.`);
      }
    }
    if (tips.length === 0) {
      tips.push("Everything looks solid! Do a timed practice run of previous paper to build exam-day speed.");
    }

    return { projectedScore, passLevel, color, description, tips };
  }, [completedTopics, weeklyHours, lastMockScore, minimal]);

  if (hasNoActiveTopics) {
    return (
      <Card className="p-5 text-center py-12">
        <p className="text-slate-600/80 text-sm">No topics analyzed yet for this subject.</p>
        <p className="text-slate-600/80 text-xs mt-1">Please add topics manually or upload study materials in the 'Your Subject Analyzer' tab.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Alert */}
      <Card className="p-5 border border-[#E8B339]/30">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-[#E8B339]" />
          <div>
            <h3 className="font-serif text-base text-[#1E293B]">Minimum preparation roadmap</h3>
            <p className="mt-1 text-sm text-slate-600/80">
              Built for securing a passing score with limited time. Covers the topics with the strongest
              historical presence — together accounting for the highest potential of marks.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Study Inputs Panel */}
        <Card className="p-6 lg:col-span-3 space-y-6">
          <div>
            <h3 className="font-serif text-base text-[#1E293B] flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#4F46E5]" />
              Study & Preparation Tracker
            </h3>
            <p className="text-xs text-slate-600/80">Assess your recent study habits and covered syllabus</p>
          </div>

          {/* Mastered High Priority Topics checklist */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600/80">
              Core High-Priority Topics Mastered
            </label>
            <div className="space-y-2">
              {minimal.map((t) => {
                const isChecked = completedTopics[t.id];
                return (
                  <button
                    key={t.id}
                    onClick={() => toggleTopic(t.id)}
                    className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-left transition cursor-pointer ${
                      isChecked
                        ? "border-[#4F46E5]/30 bg-[#4F46E5]/5 text-[#1E293B]"
                        : "border-[#1E293B]/10 bg-white/30 text-slate-600/80 hover:bg-white/60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                          isChecked
                            ? "border-[#4F46E5] bg-[#4F46E5] text-white"
                            : "border-[#1E293B]/20 bg-transparent"
                        }`}
                      >
                        {isChecked && (
                          <svg
                            className="h-3 w-3 stroke-current stroke-2"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{t.name}</p>
                        <p className="text-xs opacity-75 font-mono">
                          {typeof t.unit === "number" ? `Unit ${t.unit}` : t.unit} · Worth approx {t.avgMarks || parseInt(t.weightage) || 10} Marks
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono">{isChecked ? "Mastered" : "Not yet"}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sliders */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-slate-600/80">Study hours/week</span>
                <span className="font-mono text-[#1E293B] font-medium">{weeklyHours} hrs</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(parseInt(e.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-[#1E293B]/10 accent-[#4F46E5]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-slate-600/80">Last Mock Score</span>
                <span className="font-mono text-[#1E293B] font-medium">{lastMockScore}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={lastMockScore}
                onChange={(e) => setLastMockScore(parseInt(e.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-[#1E293B]/10 accent-[#4F46E5]"
              />
            </div>
          </div>
        </Card>

        {/* Prediction & Suggestions Output Panel */}
        <Card className="p-6 lg:col-span-2 flex flex-col justify-between">
          <div className="space-y-5">
            <div>
              <h3 className="font-serif text-base text-[#1E293B] flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#E8B339]" />
                Pass Analyzer Results
              </h3>
              <p className="text-xs text-slate-600/80">AI-suggested prediction based on your data</p>
            </div>

            {/* Score & Status circle or block */}
            <div className="rounded-xl bg-white/30 border border-[#1E293B]/10 p-5 text-center">
              <p className="text-xs uppercase tracking-wider text-slate-600/80">Projected Mark Coverage</p>
              <h4 className="mt-2 font-serif text-5xl font-bold" style={{ color: analysis.color }}>
                {analysis.projectedScore}
                <span className="text-lg font-normal text-slate-600/80">/100</span>
              </h4>
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: `${analysis.color}15`, color: analysis.color }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: analysis.color }} />
                {analysis.passLevel}
              </div>
              <p className="mt-3 text-xs text-slate-600/80 leading-relaxed">
                {analysis.description}
              </p>
            </div>

            {/* Advice Bullet Points */}
            <div className="space-y-2.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600/80 flex items-center gap-1">
                <Award className="h-3.5 w-3.5 text-[#E8B339]" />
                Actionable Advice to Pass
              </p>
              <ul className="space-y-2">
                {analysis.tips.map((tip, idx) => (
                  <li key={idx} className="flex gap-2 text-xs text-[#1E293B] leading-relaxed">
                    <span className="text-[#4F46E5] font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 border-t border-[#1E293B]/10 pt-4">
            <p className="text-[10px] text-slate-600/80 leading-tight">
              *Calculated using weighted topic occurrences from past papers and recommended study hour targets.
            </p>
          </div>
        </Card>
      </div>

      {/* Recommended study sequence */}
      <Card className="p-5">
        <SectionHeader title="Recommended study sequence" sub="Ordered by importance score, highest first" />
        <div className="space-y-2 mt-4">
          {minimal.map((t, i) => (
            <div
              key={t.id}
              className="flex items-center gap-4 rounded-xl border border-[#1E293B]/10 bg-white/30 p-4 transition-all hover:bg-white/45"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E8B339]/10 font-mono text-xs text-[#E8B339]">
                {i + 1}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#1E293B]">{t.name}</p>
                <p className="text-xs font-mono text-slate-600/80 mt-0.5">
                  {t.unit} · Avg {t.avgMarks} marks · {t.freq}/{t.totalExams} exams
                </p>
              </div>
              <Pill priority={t.priority} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
