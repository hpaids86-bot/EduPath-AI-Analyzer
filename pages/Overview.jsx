import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";

import { Clock, Flame, ListChecks, TrendingUp, Sparkles, ChevronRight } from "lucide-react";

import Card from "../components/Card.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import StatCard from "../components/StatCard.jsx";
import { topics, trendData, weeklyPlan, radarData } from "../data/mockApi.js";
import { UNIT_NAMES } from "../data/analyzer.js";

export default function Overview({ config, activeAnalysis }) {
  const { subject = "Database Management Systems", durationWeeks = 5 } = config || {};
  const days = durationWeeks * 7;

  const activeTopics = activeAnalysis?.topics || [];
  const displayTopics = activeTopics.length > 0 ? activeTopics : topics;
  const highCount = displayTopics.filter((t) => t.priority === "High").length;

  const easyMediumCount = useMemo(() => {
    return displayTopics.filter(t => t.difficulty === "Easy" || t.difficulty === "Medium").length;
  }, [displayTopics]);

  const coverageVal = useMemo(() => {
    if (displayTopics.length === 0) return "0%";
    return `${Math.round((easyMediumCount / displayTopics.length) * 100)}%`;
  }, [displayTopics, easyMediumCount]);

  const displayRadarData = useMemo(() => {
    if (activeTopics.length > 0) {
      const unitMap = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      activeTopics.forEach(t => {
        const uNum = t.unit;
        const w = parseInt(t.weightage) || 0;
        if (unitMap[uNum] !== undefined) {
          unitMap[uNum] += w;
        }
      });
      return Object.keys(unitMap).map(k => ({
        unit: `Unit ${k}`,
        weightage: unitMap[k]
      }));
    }
    return radarData;
  }, [activeTopics]);

  const displayWeeklyPlan = useMemo(() => {
    if (activeTopics.length > 0) {
      const unitMap = { 1: [], 2: [], 3: [], 4: [], 5: [] };
      activeTopics.forEach(t => {
        const uNum = t.unit;
        if (unitMap[uNum] !== undefined) {
          unitMap[uNum].push(t);
        }
      });
      const planList = [];
      let index = 1;
      [1, 2, 3, 4, 5].forEach(uNum => {
        const uTopics = unitMap[uNum];
        if (uTopics.length > 0) {
          const uName = UNIT_NAMES[subject]?.[uNum] || `Unit ${uNum}`;
          const w = uTopics.reduce((acc, t) => acc + (parseInt(t.weightage) || 0), 0);
          planList.push({
            week: `Week ${index++}`,
            focus: `Unit ${uNum} — ${uName}`,
            hours: Math.max(4, Math.round(w * 0.5)),
            status: uNum === 1 ? "active" : "upcoming"
          });
        }
      });
      if (planList.length > 0) {
        return planList;
      }
    }
    return weeklyPlan;
  }, [activeTopics, subject]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Clock} label="Exam countdown" value={`${days} days`} sub={`${subject}`} accent="var(--accent-primary)" />
        <StatCard icon={Flame} label="High priority topics" value={highCount} sub={`out of ${displayTopics.length} tracked`} accent="var(--accent-secondary)" />
        <StatCard icon={ListChecks} label="Revision coverage" value={coverageVal} sub={`${easyMediumCount} of ${displayTopics.length} topics revised`} accent="#10B981" />
        <StatCard icon={TrendingUp} label="Avg. score trend" value="74%" sub="last mock, +4 pts" accent="var(--accent-primary)" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-4 sm:p-5 lg:col-span-2">
          <SectionHeader title="Performance trend" sub="Self-reported mock scores over last 5 exam cycles" />
          <div className="w-full overflow-hidden">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="exam" stroke="var(--text-secondary)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={10} tickLine={false} axisLine={false} domain={[50, 90]} />
                <Tooltip contentStyle={{ background: "var(--bg-sidebar)", border: "1px solid var(--border-color)", borderRadius: 10, fontSize: 11, color: "var(--text-primary)" }} />
                <Line type="monotone" dataKey="marks" stroke="var(--accent-primary)" strokeWidth={2.5} dot={{ fill: "var(--accent-primary)", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 sm:p-5">
          <SectionHeader title="Unit weightage" sub="Share of total marks, last 6 papers" />
          <div className="w-full overflow-hidden flex justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={displayRadarData}>
                <PolarGrid stroke="var(--border-color)" />
                <PolarAngleAxis dataKey="unit" stroke="var(--text-secondary)" fontSize={9} />
                <Radar dataKey="weightage" stroke="var(--accent-secondary)" fill="var(--accent-secondary)" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-4 sm:p-5">
        <SectionHeader title="This week's focus" sub="Auto-generated from your study planner" />
        <div className="space-y-2">
          {displayWeeklyPlan.filter((w) => w.status === "active").map((w) => (
            <div
              key={w.week}
              className="flex items-center justify-between rounded-xl bg-[#4F46E5]/10 border border-[#1E293B]/10 p-4"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-[#4F46E5]" />
                <div>
                  <p className="text-sm font-medium text-[#1E293B] tracking-[-0.02em]">{w.focus}</p>
                  <p className="text-xs text-slate-600/80 font-mono">{w.hours} hrs planned this week</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-600/80" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
