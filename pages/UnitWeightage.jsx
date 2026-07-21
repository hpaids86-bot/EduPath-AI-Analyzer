import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import Card from "../components/Card.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import { units } from "../data/mockApi.js";
import { UNIT_NAMES } from "../data/analyzer.js";

export default function UnitWeightage({ config, activeAnalysis }) {
  const { subject = "Database Management Systems" } = config || {};

  const activeTopics = activeAnalysis?.topics || [];
  const hasNoActiveTopics = activeAnalysis && activeTopics.length === 0;
  const subjectName = activeAnalysis?.subject || subject;

  const displayUnits = useMemo(() => {
    if (activeTopics.length > 0) {
      const unitMap = { 1: [], 2: [], 3: [], 4: [], 5: [] };
      activeTopics.forEach(t => {
        const uNum = t.unit;
        if (unitMap[uNum] !== undefined) {
          unitMap[uNum].push(t);
        }
      });
      return [1, 2, 3, 4, 5].map(uNum => {
        const uTopics = unitMap[uNum];
        const name = UNIT_NAMES[subjectName]?.[uNum] || `Unit ${uNum}`;
        const weightage = uTopics.reduce((acc, t) => acc + (parseInt(t.weightage) || 0), 0);
        return {
          unit: `Unit ${uNum}`,
          name,
          weightage,
          topics: uTopics.length
        };
      });
    }
    return units;
  }, [activeTopics, subjectName]);

  const maxWeightage = useMemo(() => {
    const maxVal = Math.max(...displayUnits.map(u => u.weightage));
    return maxVal > 0 ? maxVal : 26;
  }, [displayUnits]);

  if (hasNoActiveTopics) {
    return (
      <Card className="p-5 text-center py-12">
        <p className="text-slate-600/80 text-sm">No topics analyzed yet for this subject.</p>
        <p className="text-slate-600/80 text-xs mt-1">Please add topics manually or upload study materials in the 'Your Subject Analyzer' tab.</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card className="p-5">
        <SectionHeader title="Marks distribution by unit" sub={`${subjectName} · last 6 papers`} />
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={displayUnits} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="rgba(30, 41, 59, 0.08)" vertical={false} />
            <XAxis dataKey="unit" stroke="rgba(71, 85, 105, 0.8)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="rgba(71, 85, 105, 0.8)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: "rgba(253, 251, 247, 0.95)",
                border: "1px solid rgba(30, 41, 59, 0.15)",
                borderRadius: 10,
                fontSize: 12,
                color: "#1E293B",
                backdropFilter: "blur(8px)"
              }}
            />
            <Bar dataKey="weightage" radius={[6, 6, 0, 0]} fill="#0D9488" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-5">
        <SectionHeader title="Unit-wise heatmap" sub="Darker = higher historical weightage" />
        <div className="space-y-3">
          {displayUnits.map((u) => (
            <div key={u.unit} className="flex items-center gap-3">
              <div className="w-32 shrink-0">
                <p className="text-sm text-[#1E293B] tracking-[-0.02em]">{u.unit}</p>
                <p className="text-[11px] text-slate-600/80">{u.name}</p>
              </div>
              <div className="h-3 flex-1 rounded-full bg-[#1E293B]/10">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-[#0D9488] to-[#115E59]"
                  style={{ width: `${(u.weightage / maxWeightage) * 100}%` }}
                />
              </div>
              <span className="w-10 shrink-0 text-right font-mono text-sm text-[#1E293B] tracking-[-0.02em]">
                {u.weightage}%
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
