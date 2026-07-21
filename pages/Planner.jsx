import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  CheckCircle,
  Circle,
  Sliders,
  Calendar,
  Award,
  Activity,
  Sparkles,
  Clock,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  ThumbsUp,
  Zap,
} from "lucide-react";
import Card from "../components/Card.jsx";
import SectionHeader from "../components/SectionHeader.jsx";

import { SUBJECT_TOPICS, UNIT_NAMES } from "../data/analyzer.js";

// Dynamically construct SUBJECT_DATA based on the shared SUBJECT_TOPICS database
const SUBJECT_DATA = {};
Object.entries(SUBJECT_TOPICS).forEach(([subj, topics]) => {
  const unitsMap = {};
  topics.forEach((t) => {
    if (!unitsMap[t.unit]) {
      unitsMap[t.unit] = { weightage: 0, priority: "Low" };
    }
    unitsMap[t.unit].weightage += parseInt(t.weightage) || 0;
    if (t.priority === "High") {
      unitsMap[t.unit].priority = "High";
    } else if (t.priority === "Medium" && unitsMap[t.unit].priority !== "High") {
      unitsMap[t.unit].priority = "Medium";
    }
  });

  SUBJECT_DATA[subj] = Object.entries(unitsMap).map(([unitNum, data]) => {
    const unitName = (UNIT_NAMES[subj] && UNIT_NAMES[subj][unitNum]) || `Unit ${unitNum} Syllabus`;
    return {
      name: `Unit ${unitNum}: ${unitName}`,
      weightage: data.weightage || 15,
      priority: data.priority,
    };
  });
});

const SUBJECTS = Object.keys(SUBJECT_DATA);
const STRATEGIES = ["High Score Strategy", "Balanced Revision", "Pass-Focused Strategy"];

export default function Planner({ config, setConfig, activeAnalysis }) {
  // Destructure config properties with fallbacks
  const {
    subject = "Database Management Systems",
    durationWeeks = 5,
    weeklyHours = 10,
    targetMarks = 80,
    strategyMode = "High Score Strategy",
  } = config;

  // Track finished/checked weeks locally
  const [completedWeeks, setCompletedWeeks] = useState({});

  // Reset checked weeks when plan parameters or subject changes to ensure validity
  const handleParamChange = (updater) => {
    updater();
    setCompletedWeeks({});
  };

  const setSubject = (val) => handleParamChange(() => setConfig({ ...config, subject: val }));
  const setDurationWeeks = (val) => handleParamChange(() => setConfig({ ...config, durationWeeks: val }));
  const setWeeklyHours = (val) => handleParamChange(() => setConfig({ ...config, weeklyHours: val }));
  const setTargetMarks = (val) => handleParamChange(() => setConfig({ ...config, targetMarks: val }));
  const setStrategyMode = (val) => handleParamChange(() => setConfig({ ...config, strategyMode: val }));

  // weeksCount directly maps to preparation duration in weeks
  const weeksCount = durationWeeks;

  // Calculate projected exam date based on baseDate + weeksCount
  const examDate = useMemo(() => {
    const baseDate = new Date("2026-06-19");
    const targetDate = new Date(baseDate.getTime() + weeksCount * 7 * 24 * 60 * 60 * 1000);
    return targetDate.toISOString().split("T")[0];
  }, [weeksCount]);

  // Generate dynamic weekly plan and details
  const { plan, totalHoursNeeded, totalWeightage } = useMemo(() => {
    let allUnits = [];
    if (activeAnalysis && activeAnalysis.topics && activeAnalysis.topics.length > 0) {
      const unitMap = { 1: [], 2: [], 3: [], 4: [], 5: [] };
      activeAnalysis.topics.forEach(t => {
        const uNum = t.unit;
        if (unitMap[uNum] !== undefined) {
          unitMap[uNum].push(t);
        }
      });
      allUnits = [1, 2, 3, 4, 5].map(uNum => {
        const uTopics = unitMap[uNum];
        const uName = UNIT_NAMES[activeAnalysis.subject]?.[uNum] || `Unit ${uNum}`;
        const uWeightage = uTopics.reduce((acc, t) => acc + (parseInt(t.weightage) || 0), 0);
        
        const hasHigh = uTopics.some(t => t.priority === "High");
        const hasMedium = uTopics.some(t => t.priority === "Medium");
        const uPriority = hasHigh ? "High" : hasMedium ? "Medium" : "Low";
        
        const topicNames = uTopics.map(t => t.name).join(", ");
        return {
          name: `Unit ${uNum}: ${uName}`,
          weightage: uWeightage,
          priority: uPriority,
          topicsCount: uTopics.length,
          topicsList: topicNames
        };
      }).filter(u => u.topicsCount > 0);
    } else {
      allUnits = SUBJECT_DATA[subject] || SUBJECT_DATA["Database Management Systems"];
    }

    if (allUnits.length === 0) {
      return { plan: [], totalHoursNeeded: 0, totalWeightage: 0 };
    }
    
    // Filter units based on strategy mode
    let unitsToStudy = [];
    if (strategyMode === "Pass-Focused Strategy") {
      unitsToStudy = allUnits.filter((u) => u.priority === "High");
    } else if (strategyMode === "Balanced Revision") {
      unitsToStudy = allUnits.filter((u) => u.priority === "High" || u.priority === "Medium");
    } else {
      unitsToStudy = [...allUnits];
    }

    const syllabusWeight = unitsToStudy.reduce((acc, u) => acc + u.weightage, 0);

    // Calculate base study hours per unit scaled by target marks
    const getHoursForUnit = (u) => {
      const scale = targetMarks / 100;
      if (u.priority === "High") return Math.round(16 * scale);
      if (u.priority === "Medium") return Math.round(11 * scale);
      return Math.round(7 * scale);
    };

    const unitDetails = unitsToStudy.map((u) => ({
      ...u,
      neededHours: getHoursForUnit(u),
    }));

    const hoursNeeded = unitDetails.reduce((acc, u) => acc + u.neededHours, 0);

    // Distribute units across weeksCount
    const dynamicPlan = [];
    if (weeksCount <= 0) return { plan: [], totalHoursNeeded: 0, totalWeightage: 0 };

    let studyWeeksCount = weeksCount;
    let revisionWeeksCount = 0;

    if (weeksCount >= 7) {
      revisionWeeksCount = 2;
      studyWeeksCount = weeksCount - 2;
    } else if (weeksCount >= 4) {
      revisionWeeksCount = 1;
      studyWeeksCount = weeksCount - 1;
    }

    const weeklyAllocation = Array.from({ length: studyWeeksCount }, () => []);
    unitDetails.forEach((unit, idx) => {
      const targetWeek = idx % studyWeeksCount;
      weeklyAllocation[targetWeek].push(unit);
    });

    for (let i = 0; i < studyWeeksCount; i++) {
      const weekNum = i + 1;
      const allocated = weeklyAllocation[i];
      if (allocated.length === 0) {
        dynamicPlan.push({
          week: `Week ${weekNum}`,
          focus: "Consolidation & Practice Problems",
          hours: Math.max(3, Math.round(hoursNeeded / weeksCount)),
          details: "Review previous concepts and practice active recall queries.",
          type: "study",
        });
      } else {
        const focusText = allocated.map((u) => u.name.split(":")[0]).join(" & ");
        const detailsText = allocated.map((u) => u.topicsList || u.name.split(":")[1] || u.name).join(", ");
        const weekHours = allocated.reduce((acc, u) => acc + u.neededHours, 0);
        dynamicPlan.push({
          week: `Week ${weekNum}`,
          focus: `${focusText} Study`,
          hours: Math.max(4, weekHours),
          details: `Master concepts: ${detailsText}.`,
          type: "study",
        });
      }
    }

    for (let i = 0; i < revisionWeeksCount; i++) {
      const weekNum = studyWeeksCount + i + 1;
      if (i === 0 && revisionWeeksCount === 2) {
        dynamicPlan.push({
          week: `Week ${weekNum}`,
          focus: "Question Bank & Error Log Practice",
          hours: Math.max(4, Math.round((weeklyHours + (hoursNeeded / weeksCount)) / 2)),
          details: "Attempt subject-wise mock banks. Rework questions answered incorrectly.",
          type: "revision",
        });
      } else {
        dynamicPlan.push({
          week: `Week ${weekNum}`,
          focus: "Full-Length Mocks & Performance Fine-Tuning",
          hours: Math.max(4, weeklyHours),
          details: "Take 2 timed full-length practice tests. Memorize final reference formulas.",
          type: "mock",
        });
      }
    }

    return { plan: dynamicPlan, totalHoursNeeded: hoursNeeded, totalWeightage: syllabusWeight };
  }, [activeAnalysis, subject, weeklyHours, targetMarks, strategyMode, weeksCount]);

  // Feasibility & Performance Analytics
  const feasibility = useMemo(() => {
    const totalAvailableHours = weeklyHours * weeksCount;
    const ratio = totalAvailableHours / Math.max(1, totalHoursNeeded);
    
    // Core coverage limits warning
    let coverageWarning = null;
    if (strategyMode === "Pass-Focused Strategy" && targetMarks > 55) {
      coverageWarning = `Pass Strategy covers only ${totalWeightage}% of marks. A target of ${targetMarks} is unsafe.`;
    } else if (strategyMode === "Balanced Revision" && targetMarks > 80) {
      coverageWarning = `Balanced Revision covers only ${totalWeightage}% of marks. An 80+ target requires full syllabus coverage.`;
    }

    let rating = "Challenging";
    let color = "#F59E0B"; // Amber
    let description = "This study pace is tight. You need to focus strictly on highest yield ideas without waste.";

    if (ratio >= 1.05) {
      rating = "Highly Feasible";
      color = "#10B981"; // Green
      description = "Your weekly hours are more than sufficient. You are in a great position to achieve your target!";
    } else if (ratio < 0.75) {
      rating = "High Risk / Under-prepared";
      color = "#EF4444"; // Red
      description = "Critical: Study hours are far below the size of the required curriculum. Score deficit highly likely.";
    }

    const successProb = Math.min(
      98,
      Math.max(
        10,
        Math.round(ratio * 85 - (coverageWarning ? 20 : 0) - (100 - targetMarks) * 0.05)
      )
    );

    return {
      ratio,
      rating,
      color,
      description,
      successProb,
      coverageWarning,
      totalAvailableHours,
    };
  }, [weeklyHours, weeksCount, totalHoursNeeded, strategyMode, targetMarks, totalWeightage]);

  // AI dynamic insights based on inputs
  const aiInsights = useMemo(() => {
    let easyTopics = "";
    let subjectTips = [];
    
    if (subject === "Database Management Systems") {
      easyTopics = "Unit 1 (ER Modeling) & Unit 5 (Storage/Indexing)";
      subjectTips = [
        "Practice drawing ER diagrams and translating them to relational tables. It accounts for 18% of weightage and is highly visual.",
        "For SQL queries, write them down on paper. Trace relational joins step-by-step to lock down easy marks.",
        "Unit 2 (Normalization) averages 24 marks. Master the candidate key closure calculation systematically."
      ];
    } else if (subject === "Computer Networks") {
      easyTopics = "Unit 4 (Application protocols: DNS, HTTP, DHCP)";
      subjectTips = [
        "Focus on IP Addressing arithmetic (CIDR prefixes and subnet hosts). It is mathematical and highly objective.",
        "Draw and trace the TCP connection 3-Way Handshake states on a timing diagram.",
        "Differentiate clearly between Distance Vector and Link State Routing protocols through comparative tables."
      ];
    } else if (subject === "Operating Systems") {
      easyTopics = "Unit 4 (Disk scheduling & File systems) & Unit 5 (Virtualization)";
      subjectTips = [
        "Master CPU Scheduling (SJF, RR, Priority) Gantt charts. They are mechanical and hold high scoring potential.",
        "For Deadlocks, practice the Banker's safety check allocation matrices.",
        "Create tabular trace sheets for virtual memory page replacement algorithms (FIFO, LRU)."
      ];
    } else { // Algorithms
      easyTopics = "Unit 1 (Asymptotic notations) & Unit 5 (NP-Completeness theory)";
      subjectTips = [
        "Practice the Master Method for solving recurrence relations. It is highly structured and saves study time.",
        "Draw dynamic programming tables (e.g. 0/1 Knapsack, LCS) to trace the grid cell calculations.",
        "Compare average and worst-case complexities for Sorting Algorithms (Quick, Merge, Heap) on a summary sheet."
      ];
    }

    let durationText = "";
    let paceMode = "";
    let durationTips = [];

    if (weeksCount >= 9) {
      durationText = `With a generous duration of ${weeksCount} weeks, you have ample time to space out your study topics.`;
      paceMode = "Comprehensive Concept Mastery";
      durationTips = [
        `Dedicate weeks 1-${Math.ceil(weeksCount * 0.6)} to building standard core concepts.`,
        "Utilize spaced-repetition flashcards for definitions, commands, and short proofs.",
        "Complete 3 full-length timed mock exams in the final fortnight and keep an error log."
      ];
    } else if (weeksCount >= 4) {
      durationText = `A standard duration of ${weeksCount} weeks is appropriate for balanced revision and problem drilling.`;
      paceMode = "Targeted High-Yield Coverage";
      durationTips = [
        "Focus only on High and Medium-priority units. Skip Low-priority units if time gets compressed.",
        "Simulate one past year question paper every weekend under strict test conditions.",
        "Immediately correct mock errors and write down summaries of the concepts you missed."
      ];
    } else {
      durationText = `A condensed duration of ${weeksCount} weeks restricts your plan to an intense core sprint.`;
      paceMode = "Aggressive Cramming & Past Paper Sprint";
      durationTips = [
        "Cover only High-Priority units. Do not spend time reading textbook theory.",
        "Reverse-engineer concepts by solving past questions. Learn definitions directly from answers.",
        "Increase daily study hours to provide a safety margin for key topics."
      ];
    }

    let scoreInsight = "";
    if (targetMarks <= 60) {
      scoreInsight = `Aiming for ${targetMarks} marks is highly achievable; focus purely on the main core concepts.`;
    } else if (targetMarks <= 80) {
      scoreInsight = `Your target of ${targetMarks} marks requires consistent coverage but gives some leeway on complex edge-case proofs.`;
    } else {
      scoreInsight = `A top-tier target of ${targetMarks}+ marks leaves no room for gaps. You must cover the entire syllabus and master complex problems.`;
    }

    return {
      whatIsEasy: {
        title: `${durationText} ${scoreInsight}`,
        details: [
          `In ${subject}, ${easyTopics} will be your easiest mark accumulators.`,
          `Your strategy is set to "${strategyMode.split(" ")[0]}", which prioritizes corresponding sections automatically.`,
          weeklyHours >= 15 
            ? `Your high weekly commitment of ${weeklyHours} hours provides a strong buffer against study backlog.`
            : `Your target score maps cleanly to high-ROI syllabus sections.`
        ]
      },
      howToPrepare: {
        title: `Pace: ${paceMode}`,
        details: [
          ...durationTips,
          ...subjectTips
        ]
      }
    };
  }, [subject, weeksCount, weeklyHours, targetMarks, strategyMode]);

  // Roadmap Stages (stepper calculation mapped dynamically to weeksCount)
  const roadmapStages = useMemo(() => {
    const stages = [];
    if (weeksCount <= 0) return [];

    const fEnd = Math.max(1, Math.ceil(weeksCount * 0.4));
    const sEnd = Math.max(fEnd + 1, Math.ceil(weeksCount * 0.75));

    // Stage 1: Foundation
    const stage1Weeks = Array.from({ length: fEnd }, (_, i) => `Week ${i + 1}`);
    const stage1Complete = stage1Weeks.every((w) => completedWeeks[w]);
    const stage1Progress = stage1Weeks.some((w) => completedWeeks[w]);

    stages.push({
      title: "Stage 1: Core Foundation",
      weeksText: `Weeks 1–${fEnd}`,
      desc: "Develop base concepts for highest-weightage topics. Focus on theory worksheets.",
      targetScore: "Est. Baseline: 45 Marks",
      status: stage1Complete ? "Completed" : stage1Progress ? "In Progress" : "Scheduled",
      statusColor: stage1Complete ? "#10B981" : stage1Progress ? "#4F46E5" : "#64748B",
    });

    // Stage 2: Performance Scaling
    if (weeksCount > 2) {
      const stage2Weeks = Array.from({ length: sEnd - fEnd }, (_, i) => `Week ${fEnd + i + 1}`);
      const stage2Complete = stage2Weeks.every((w) => completedWeeks[w]);
      const stage2Progress = stage2Weeks.some((w) => completedWeeks[w]);

      stages.push({
        title: "Stage 2: Performance Scaling",
        weeksText: `Weeks ${fEnd + 1}–${sEnd}`,
        desc: "Solve chapter-end practice exercises. Target medium-importance topics.",
        targetScore: `Est. Coverage: ${Math.round(targetMarks * 0.7)} Marks`,
        status: stage2Complete ? "Completed" : stage2Progress ? "In Progress" : "Scheduled",
        statusColor: stage2Complete ? "#10B981" : stage2Progress ? "#4F46E5" : "#64748B",
      });
    }

    // Stage 3: Mock Validation & Polish
    const lastWeeksCount = weeksCount - sEnd;
    if (lastWeeksCount > 0) {
      const stage3Weeks = Array.from({ length: lastWeeksCount }, (_, i) => `Week ${sEnd + i + 1}`);
      const stage3Complete = stage3Weeks.every((w) => completedWeeks[w]);
      const stage3Progress = stage3Weeks.some((w) => completedWeeks[w]);

      stages.push({
        title: "Stage 3: Mock Arena & Polish",
        weeksText: `Weeks ${sEnd + 1}–${weeksCount}`,
        desc: "Solve full-length papers under strict exam timer conditions. Document common errors.",
        targetScore: `Target Goal: ${targetMarks} Marks`,
        status: stage3Complete ? "Completed" : stage3Progress ? "In Progress" : "Scheduled",
        statusColor: stage3Complete ? "#10B981" : stage3Progress ? "#4F46E5" : "#64748B",
      });
    } else {
      // Small timeframe fallback
      stages.push({
        title: "Stage 2/3: Quick Sprint & Mocks",
        weeksText: `Week ${weeksCount}`,
        desc: "High-yield topics revision. Review core cheat sheets & solve 1 final mock.",
        targetScore: `Target Goal: ${targetMarks} Marks`,
        status: completedWeeks[`Week ${weeksCount}`] ? "Completed" : "Scheduled",
        statusColor: completedWeeks[`Week ${weeksCount}`] ? "#10B981" : "#64748B",
      });
    }

    return stages;
  }, [weeksCount, completedWeeks, targetMarks]);

  // Chart projection calculation
  const chartData = useMemo(() => {
    const data = [];
    const baseline = 30; // starting baseline marks for a student
    const step = (targetMarks - baseline) / weeksCount;

    for (let i = 0; i <= weeksCount; i++) {
      const label = i === 0 ? "Base" : `W${i}`;
      const req = Math.round(baseline + i * step);

      // Projection: falls short if weekly hours are too low
      const ratio = (weeklyHours * weeksCount) / Math.max(1, totalHoursNeeded);
      const projFinal = baseline + (targetMarks - baseline) * Math.min(1.15, ratio);
      const projStep = (projFinal - baseline) / weeksCount;
      const proj = Math.min(100, Math.round(baseline + i * projStep));

      data.push({
        name: label,
        "Required Score": req,
        "Projected Score": proj,
      });
    }
    return data;
  }, [weeksCount, targetMarks, weeklyHours, totalHoursNeeded]);

  // Auto-Fix Functions for Performance Management
  const optimizeHours = () => {
    handleParamChange(() => {
      const requiredWeeklyHours = Math.ceil(totalHoursNeeded / weeksCount);
      setConfig({
        ...config,
        weeklyHours: Math.min(30, Math.max(2, requiredWeeklyHours))
      });
    });
  };

  const optimizeTarget = () => {
    handleParamChange(() => {
      const availableCapacity = weeklyHours * weeksCount;
      const scaleFactor = availableCapacity / Math.max(1, totalHoursNeeded);
      const calculatedMarks = Math.round(30 + (targetMarks - 30) * scaleFactor);
      setConfig({
        ...config,
        targetMarks: Math.min(100, Math.max(30, calculatedMarks))
      });
    });
  };

  const toggleWeek = (weekName) => {
    setCompletedWeeks((prev) => ({
      ...prev,
      [weekName]: !prev[weekName],
    }));
  };

  const completedCount = Object.values(completedWeeks).filter(Boolean).length;
  const overallProgressPercent = Math.round((completedCount / weeksCount) * 100) || 0;

  const displaySubjects = useMemo(() => {
    if (subject && !SUBJECTS.includes(subject)) {
      return [subject, ...SUBJECTS];
    }
    return SUBJECTS;
  }, [subject]);

  return (
    <div className="space-y-6">
      {/* Dynamic Header Info */}
      <Card className="p-4 sm:p-5 border-themeBorder bg-gradient-to-r from-themeCard via-white/[0.02] to-transparent">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-themeAccent" />
              <h2 className="font-serif text-lg text-themeText">{subject} Planner</h2>
            </div>
            <p className="text-xs text-themeMuted mt-0.5">
              Current Cycle: {weeksCount} Weeks until Exam · Timeline starts June 19, 2026
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white/30 border border-themeBorder rounded-xl px-4 py-2 text-right">
            <div>
              <p className="text-[10px] text-slate-600/80 uppercase tracking-wider">Overall Progress</p>
              <p className="text-sm font-semibold text-[#4F46E5] font-mono">
                {completedCount} / {weeksCount} Weeks ({overallProgressPercent}%)
              </p>
            </div>
            <div className="h-9 w-9 rounded-full bg-[#4F46E5]/10 flex items-center justify-center text-xs font-mono font-bold text-[#4F46E5]">
              {overallProgressPercent}%
            </div>
          </div>
        </div>
      </Card>

      {/* Main Grid: Inputs, Planner, Roadmaps */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Plan Config & Performance Analysis (4/12 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Configuration Inputs */}
          <Card className="p-4 sm:p-5">
            <SectionHeader title="Study Configuration" sub="Customize parameters in real time" />
            <div className="space-y-4 mt-2">
              {/* Subject */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600/80 flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-[#4F46E5]" /> Subject
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-white/40 text-[#1E293B] border border-[#1E293B]/10 rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#4F46E5] cursor-pointer"
                >
                  {displaySubjects.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preparation Duration (Weeks) - Replaced manual Date Picker */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600/80 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#4F46E5]" /> Preparation Duration
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    max="24"
                    value={durationWeeks}
                    onChange={(e) => setSidebarCollapsed && setDurationWeeks(Math.min(24, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-16 bg-white/40 text-[#1E293B] border border-[#1E293B]/10 rounded-xl p-2 text-xs focus:outline-none focus:border-[#4F46E5] font-mono text-center cursor-pointer"
                  />
                  <input
                    type="range"
                    min="1"
                    max="24"
                    value={durationWeeks}
                    onChange={(e) => setDurationWeeks(parseInt(e.target.value) || 1)}
                    className="flex-1 h-1.5 cursor-pointer appearance-none rounded-lg bg-[#1E293B]/10 accent-[#4F46E5] self-center"
                  />
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-600/80">
                  <Calendar className="h-3.5 w-3.5 text-[#4F46E5]" />
                  <span>Projected Exam Date:</span>
                  <span className="text-[#4F46E5] font-mono font-medium">{examDate}</span>
                </div>
              </div>

              {/* Strategy Mode Button Group */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600/80 flex items-center gap-1.5">
                  <Sliders className="h-3.5 w-3.5 text-[#4F46E5]" /> Strategy Mode
                </label>
                <div className="grid grid-cols-3 gap-1 bg-white/40 p-1 rounded-xl border border-[#1E293B]/10">
                  {STRATEGIES.map((mode) => {
                    const active = strategyMode === mode;
                    return (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setStrategyMode(mode)}
                        className={`text-[9px] font-semibold py-2 rounded-lg transition-all cursor-pointer ${
                          active
                            ? "bg-[#4F46E5] text-[#FDFBF7] shadow-md shadow-[#4F46E5]/10"
                            : "text-[#9CA3AF]/70 hover:text-[#1E293B] hover:bg-white/20"
                        }`}
                      >
                        {mode.split(" ")[0]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-600/80">
                    <span>Study Hrs/Wk</span>
                    <span className="text-[#4F46E5] font-mono">{weeklyHours}h</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="30"
                    value={weeklyHours}
                    onChange={(e) => setWeeklyHours(parseInt(e.target.value))}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-[#1E293B]/10 accent-[#4F46E5]"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-600/80">
                    <span>Target Marks</span>
                    <span className="text-[#4F46E5] font-mono">{targetMarks}/100</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={targetMarks}
                    onChange={(e) => setTargetMarks(parseInt(e.target.value))}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-[#1E293B]/10 accent-[#4F46E5]"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Performance & Feasibility Analyzer */}
          <Card className="p-4 sm:p-5 space-y-4">
            <div>
              <SectionHeader title="Performance Analytics" sub="Assess risk, coverage, and success chance" />
            </div>

            {/* Feasibility Metric Display */}
            <div className="rounded-xl border border-[#1E293B]/10 bg-white/30 p-4 text-center">
              <p className="text-[10px] uppercase tracking-wider text-slate-600/80 font-semibold">Feasibility Status</p>
              <h4 className="text-lg font-bold font-serif mt-1 animate-pulse" style={{ color: feasibility.color }}>
                {feasibility.rating}
              </h4>
              <div className="mt-3 flex items-center justify-around">
                <div>
                  <p className="text-[10px] text-slate-600/80">Total Needed</p>
                  <p className="text-xs font-semibold text-[#1E293B] font-mono">{totalHoursNeeded} hrs</p>
                </div>
                <div className="h-6 w-px bg-[#1E293B]/10" />
                <div>
                  <p className="text-[10px] text-slate-600/80">Total Available</p>
                  <p className="text-xs font-semibold text-[#1E293B] font-mono">{feasibility.totalAvailableHours} hrs</p>
                </div>
                <div className="h-6 w-px bg-[#1E293B]/10" />
                <div>
                  <p className="text-[10px] text-slate-600/80">Success Rate</p>
                  <p className="text-xs font-semibold text-[#4F46E5] font-mono">{feasibility.successProb}%</p>
                </div>
              </div>
            </div>

            {/* Gap warnings */}
            {feasibility.coverageWarning && (
              <div className="flex items-start gap-2.5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20 p-3 text-xs text-[#EF4444]">
                <AlertTriangle className="h-4 w-4 shrink-0 text-[#EF4444] mt-0.5" />
                <p className="leading-normal">{feasibility.coverageWarning}</p>
              </div>
            )}

            {/* Gap warning 2 */}
            {feasibility.ratio < 0.9 && !feasibility.coverageWarning && (
              <div className="flex items-start gap-2.5 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 p-3 text-xs text-[#F59E0B]">
                <Activity className="h-4 w-4 shrink-0 text-[#F59E0B] mt-0.5" />
                <p className="leading-normal">
                  Study time gap detected. You are {Math.round((1 - feasibility.ratio) * 100)}% under-budget for this target score.
                </p>
              </div>
            )}

            {/* Performance Management Advice */}
            <div className="space-y-2 text-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600/80">Performance Action Plan</p>
              <p className="text-slate-600/80 leading-relaxed">{feasibility.description}</p>
              <ul className="space-y-1.5 text-[#1E293B] mt-2">
                <li className="flex items-start gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-[#4F46E5] shrink-0 mt-0.5" />
                  <span>Study priority topics first (highest weightages first).</span>
                </li>
                {feasibility.ratio < 1 && (
                  <li className="flex items-start gap-2 text-yellow-800">
                    <Zap className="h-3.5 w-3.5 text-yellow-600 shrink-0 mt-0.5" />
                    <span>Weekly hours deficit. Use the optimization buttons below to resolve.</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Optimization & Auto-Fix buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1E293B]/10">
              <button
                type="button"
                onClick={optimizeHours}
                className="rounded-lg bg-[#4F46E5]/10 border border-[#1E293B]/10 hover:bg-[#4F46E5]/15 py-2 text-[10px] font-semibold text-[#4F46E5] text-center transition cursor-pointer"
              >
                Match Study Hours
              </button>
              <button
                type="button"
                onClick={optimizeTarget}
                className="rounded-lg bg-white/40 border border-[#1E293B]/10 hover:bg-white/60 py-2 text-[10px] font-semibold text-[#1E293B] text-center transition cursor-pointer"
              >
                Match Target Marks
              </button>
            </div>
          </Card>

          {/* AI Study Insights Panel */}
          <Card className="p-4 sm:p-5 space-y-4">
            <SectionHeader
              title="AI Study Insights"
              sub="Personalized feedback and strategy recommendations"
            />
            {/* What is Easy About This */}
            <div className="rounded-xl border border-[#10B981]/20 bg-[#10B981]/10 p-4 space-y-2">
              <div className="flex items-center gap-2 text-[#10B981]">
                <Sparkles className="h-4 w-4 shrink-0" />
                <h4 className="text-[10px] font-bold uppercase tracking-wider">What was easy about that</h4>
              </div>
              <p className="text-xs text-[#1E293B] leading-relaxed font-medium">
                {aiInsights.whatIsEasy.title}
              </p>
              <ul className="space-y-1.5 text-[11px] text-slate-600/80 leading-relaxed">
                {aiInsights.whatIsEasy.details.map((d, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#10B981] font-bold mt-0.5">•</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* How to Prepare */}
            <div className="rounded-xl border border-[#4F46E5]/20 bg-[#4F46E5]/10 p-4 space-y-2">
              <div className="flex items-center gap-2 text-[#4F46E5]">
                <BookOpen className="h-4 w-4 shrink-0" />
                <h4 className="text-[10px] font-bold uppercase tracking-wider">How to prepare</h4>
              </div>
              <p className="text-xs text-[#1E293B] leading-relaxed font-medium">
                {aiInsights.howToPrepare.title}
              </p>
              <ul className="space-y-1.5 text-[11px] text-slate-600/80 leading-relaxed">
                {aiInsights.howToPrepare.details.map((d, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#4F46E5] font-bold mt-0.5">•</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>

        {/* Middle Column: Weekly Study Plan (4/12 cols) */}
        <div className="lg:col-span-4 flex flex-col">
          <Card className="p-4 sm:p-5 flex-1 flex flex-col">
            <SectionHeader
              title="Weekly Study Plan"
              sub={`Target: ${targetMarks} Marks · Mode: ${strategyMode.split(" ")[0]}`}
            />
            <div className="space-y-3 mt-2 overflow-y-auto max-h-[750px] flex-1 pr-1">
              {plan.map((w) => {
                const isChecked = !!completedWeeks[w.week];
                return (
                  <div
                    key={w.week}
                    onClick={() => toggleWeek(w.week)}
                    className={`flex items-start gap-3 rounded-xl border p-3.5 transition cursor-pointer select-none ${
                      isChecked
                        ? "border-[#10B981]/30 bg-[#10B981]/[0.02]"
                        : "border-[#1E293B]/10 bg-white/30 hover:bg-white/65"
                    }`}
                  >
                    <button className="mt-0.5 shrink-0" type="button">
                      {isChecked ? (
                        <CheckCircle className="h-4 w-4 text-[#10B981]" />
                      ) : (
                        <Circle className="h-4 w-4 text-slate-600/80" />
                      )}
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`text-xs font-semibold ${isChecked ? "text-[#10B981]" : "text-[#1E293B] tracking-[-0.02em]"}`}>
                          {w.week}
                        </p>
                        <span className="font-mono text-[10px] text-slate-600/80 font-medium">
                          {w.hours} hrs
                        </span>
                      </div>
                      <p className="text-xs text-[#1E293B] font-medium mt-1 leading-tight">{w.focus}</p>
                      <p className="text-[10px] text-slate-600/80 mt-1 leading-normal">{w.details}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Column: Roadmap & Trend Graph (4/12 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Roadmap Milestones */}
          <Card className="p-4 sm:p-5">
            <SectionHeader title="Roadmap Milestones" sub="Phased progression checks" />
            <div className="space-y-4 mt-2">
              {roadmapStages.map((stage, idx) => (
                <div key={idx} className="flex gap-3 relative">
                  {idx !== roadmapStages.length - 1 && (
                    <div className="absolute left-[9px] top-6 bottom-0 w-0.5 bg-[#1E293B]/10" />
                  )}
                  <div
                    className="h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition"
                    style={{ borderColor: stage.statusColor, backgroundColor: `${stage.statusColor}10` }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: stage.statusColor }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <h4 className="text-xs font-bold text-[#1E293B] tracking-[-0.02em]">{stage.title}</h4>
                      <span className="text-[10px] text-slate-600/80 font-mono font-medium">{stage.weeksText}</span>
                    </div>
                    <p className="text-[10px] text-slate-600/80 mt-1 leading-normal">{stage.desc}</p>
                    <div className="mt-2 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-[#4F46E5] font-medium">{stage.targetScore}</span>
                      <span
                        className="px-2 py-0.5 rounded-full text-[9px] font-bold"
                        style={{ backgroundColor: `${stage.statusColor}15`, color: stage.statusColor }}
                      >
                        {stage.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Progress Projection Graph */}
          <Card className="p-4 sm:p-5">
            <SectionHeader title="Progress Projection" sub="Required trajectory vs. current speed" />
            <div className="mt-2 h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(30, 41, 59, 0.08)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(71, 85, 105, 0.8)" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(71, 85, 105, 0.8)" fontSize={9} tickLine={false} axisLine={false} domain={[20, 100]} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(253, 251, 247, 0.95)",
                      border: "1px solid rgba(30, 41, 59, 0.15)",
                      borderRadius: 8,
                      fontSize: 10,
                      color: "#1E293B",
                      backdropFilter: "blur(8px)"
                    }}
                  />
                  <Legend verticalAlign="top" height={24} iconType="circle" iconSize={6} wrapperStyle={{ fontSize: 9 }} />
                  <Area
                    type="monotone"
                    dataKey="Required Score"
                    stroke="#4F46E5"
                    strokeWidth={1.5}
                    fillOpacity={0.03}
                    fill="#4F46E5"
                  />
                  <Area
                    type="monotone"
                    dataKey="Projected Score"
                    stroke={feasibility.color}
                    strokeWidth={1.5}
                    fillOpacity={0.06}
                    fill={feasibility.color}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
