export const SUBJECT = "Database Management Systems";
export const EXAM_DATE = "2026-07-22";

export const topics = [
  { id: "t1", name: "Normalization (1NF–BCNF)", unit: "Unit 2", freq: 6, totalExams: 6, avgMarks: 13, lastSeen: "2026 Apr", importance: 96, priority: "High", history: [1, 1, 1, 0, 1, 1] },
  { id: "t2", name: "ER to Relational Mapping", unit: "Unit 1", freq: 5, totalExams: 6, avgMarks: 10, lastSeen: "2026 Apr", importance: 88, priority: "High", history: [1, 1, 0, 1, 1, 1] },
  { id: "t3", name: "Transaction ACID Properties", unit: "Unit 4", freq: 5, totalExams: 6, avgMarks: 8, lastSeen: "2025 Dec", importance: 81, priority: "High", history: [1, 0, 1, 1, 1, 1] },
  { id: "t4", name: "Concurrency Control (Locking)", unit: "Unit 4", freq: 4, totalExams: 6, avgMarks: 9, lastSeen: "2026 Apr", importance: 74, priority: "High", history: [0, 1, 1, 0, 1, 1] },
  { id: "t5", name: "SQL Joins & Nested Queries", unit: "Unit 3", freq: 6, totalExams: 6, avgMarks: 7, lastSeen: "2026 Apr", importance: 70, priority: "Medium", history: [1, 1, 1, 1, 1, 1] },
  { id: "t6", name: "Indexing (B+ Tree)", unit: "Unit 5", freq: 3, totalExams: 6, avgMarks: 6, lastSeen: "2025 Dec", importance: 52, priority: "Medium", history: [0, 0, 1, 1, 0, 1] },
  { id: "t7", name: "RAID Levels", unit: "Unit 5", freq: 2, totalExams: 6, avgMarks: 4, lastSeen: "2025 Apr", importance: 31, priority: "Low", history: [1, 0, 0, 1, 0, 0] },
  { id: "t8", name: "Deadlock Detection", unit: "Unit 4", freq: 2, totalExams: 6, avgMarks: 5, lastSeen: "2025 Dec", importance: 38, priority: "Low", history: [0, 0, 1, 0, 1, 0] },
];

export const units = [
  { unit: "Unit 1", name: "ER Modeling", weightage: 18, topics: 4 },
  { unit: "Unit 2", name: "Normalization", weightage: 24, topics: 3 },
  { unit: "Unit 3", name: "SQL & Queries", weightage: 20, topics: 5 },
  { unit: "Unit 4", name: "Transactions", weightage: 26, topics: 4 },
  { unit: "Unit 5", name: "Storage & Indexing", weightage: 12, topics: 3 },
];

export const trendData = [
  { exam: "2024-A", marks: 62 },
  { exam: "2024-D", marks: 65 },
  { exam: "2025-A", marks: 70 },
  { exam: "2025-D", marks: 68 },
  { exam: "2026-A", marks: 74 },
];

export const weeklyPlan = [
  { week: "Week 1", focus: "Unit 2 — Normalization", hours: 9, status: "done" },
  { week: "Week 2", focus: "Unit 4 — Transactions & Concurrency", hours: 11, status: "done" },
  { week: "Week 3", focus: "Unit 1 — ER Mapping", hours: 8, status: "active" },
  { week: "Week 4", focus: "Unit 3 — SQL Practice", hours: 10, status: "upcoming" },
  { week: "Week 5", focus: "Unit 5 — Indexing + Full Revision", hours: 7, status: "upcoming" },
];

export const radarData = units.map((u) => ({ unit: u.unit, weightage: u.weightage }));

