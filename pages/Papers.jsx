import React, { useState, useMemo } from "react";
import {
  UploadCloud,
  FileText,
  Link2,
  AlignLeft,
  Check,
  Loader2,
  Clock,
  Compass,
  Sparkles,
  BookOpen,
  Award,
  Trash2,
  Edit2,
  Plus,
  X,
} from "lucide-react";
import Card from "../components/Card.jsx";
import SectionHeader from "../components/SectionHeader.jsx";

import {
  SUBJECT_TOPICS,
  recalculateAnalysis,
  getAnalysisForResource,
  getInitialPapers
} from "../data/analyzer.js";

const SUBJECTS = ["Database Management Systems", "Computer Networks", "Operating Systems", "Algorithms"];

const loadPdfJS = () => {
  return new Promise((resolve, reject) => {
    if (window.pdfjsLib) {
      resolve(window.pdfjsLib);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js";
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";
      resolve(window.pdfjsLib);
    };
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });
};

export default function Papers({
  config,
  setConfig,
  papersList,
  setPapersList,
  selectedPaperIndex,
  setSelectedPaperIndex
}) {
  const [activeTab, setActiveTab] = useState("file");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form states for uploading
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [rawText, setRawText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  // States for Manual Plan Selector
  const [showManualSelector, setShowManualSelector] = useState(false);
  const [selectedManualSubject, setSelectedManualSubject] = useState("Database Management Systems");

  // States for Custom Adding Form
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");
  const [newTopicUnit, setNewTopicUnit] = useState(1);
  const [newTopicDifficulty, setNewTopicDifficulty] = useState("Medium");
  const [newTopicWeightage, setNewTopicWeightage] = useState(10);

  // States for inline row editing
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editName, setEditName] = useState("");
  const [editDifficulty, setEditDifficulty] = useState("Medium");
  const [editWeightage, setEditWeightage] = useState(10);

  const activePaper = papersList[selectedPaperIndex];
  const analysis = activePaper?.analysis;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setSelectedFile(file);
    }
  };

  const finishSourceAddition = (newPaper, detectedSubject) => {
    setLoading(false);
    setSuccess(true);

    if (detectedSubject !== config.subject) {
      const targetSaved = localStorage.getItem(`examinsight_papers_list_${detectedSubject}`);
      let targetList = targetSaved ? JSON.parse(targetSaved) : getInitialPapers(detectedSubject);
      targetList = [newPaper, ...targetList];
      localStorage.setItem(`examinsight_papers_list_${detectedSubject}`, JSON.stringify(targetList));
      localStorage.setItem(`examinsight_selected_paper_index_${detectedSubject}`, "0");
      setConfig({ ...config, subject: detectedSubject });
    } else {
      setPapersList([newPaper, ...papersList]);
      setSelectedPaperIndex(0);
    }

    // Reset fields
    setFileName("");
    setSelectedFile(null);
    setRawText("");
    setLinkUrl("");

    setTimeout(() => setSuccess(false), 2000);
  };

  const handleAddSource = (e) => {
    if (e) e.preventDefault();
    let type = activeTab;

    setLoading(true);
    setSuccess(false);

    if (activeTab === "file") {
      if (!selectedFile) {
        setLoading(false);
        return;
      }
      const file = selectedFile;
      const reader = new FileReader();

      const processExtractedText = (extractedText) => {
        const analysisDetails = getAnalysisForResource(file.name, type, extractedText);
        const newPaper = {
          name: file.name,
          type,
          uploaded: "Just now",
          status: "Processed",
          rawText: extractedText,
          analysis: analysisDetails,
          topics: analysisDetails.topics.length
        };
        finishSourceAddition(newPaper, analysisDetails.subject);
      };

      if (file.name.toLowerCase().endsWith(".pdf")) {
        reader.onload = async (event) => {
          const arrayBuffer = event.target.result;
          try {
            const pdfjsLib = await loadPdfJS();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let fullText = "";
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              // Join items with newlines to preserve text block boundaries
              const pageText = textContent.items.map(item => item.str).join("\n");
              fullText += pageText + "\n";
            }
            processExtractedText(fullText);
          } catch (error) {
            console.error("Error parsing PDF file:", error);
            // Fallback to name only
            processExtractedText("");
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        // Assume text file
        reader.onload = (event) => {
          processExtractedText(event.target.result || "");
        };
        reader.readAsText(file);
      }
    } else if (activeTab === "text") {
      if (!rawText.trim()) {
        setLoading(false);
        return;
      }
      const name = rawText.trim().substring(0, 30) + "... (Pasted Text)";
      setTimeout(() => {
        const analysisDetails = getAnalysisForResource(name, type, rawText);
        const newPaper = {
          name,
          type,
          uploaded: "Just now",
          status: "Processed",
          rawText: rawText,
          analysis: analysisDetails,
          topics: analysisDetails.topics.length
        };
        finishSourceAddition(newPaper, analysisDetails.subject);
      }, 1000);
    } else if (activeTab === "link") {
      if (!linkUrl.trim()) {
        setLoading(false);
        return;
      }
      const name = linkUrl.trim();
      setTimeout(() => {
        const analysisDetails = getAnalysisForResource(name, type, "");
        const newPaper = {
          name,
          type,
          uploaded: "Just now",
          status: "Processed",
          rawText: "",
          analysis: analysisDetails,
          topics: analysisDetails.topics.length
        };
        finishSourceAddition(newPaper, analysisDetails.subject);
      }, 1000);
    }
  };

  // Handles manual study plan sheet creation (completely bypassing uploads)
  const handleCreateManualPlan = (e) => {
    e.preventDefault();
    const sheetName = `Manual Prep Sheet - ${selectedManualSubject}`;
    
    // Initialize a blank study sheet structure
    const blankAnalysis = {
      subject: selectedManualSubject,
      difficulty: "Medium",
      difficultyColor: "#F59E0B",
      timeToMaster: "0 hours",
      topics: [],
      roadmap: [],
      insights: "No topics have been parsed for this subject yet. Upload a syllabus file or paste text to generate automated study guidelines and strategies.",
      unit1: {
        topics: [],
        studyHours: 0,
        weightage: 0,
        possibilityColor: "#64748B",
        possibilityText: "Add Unit 1 topics to calculate score potential & likelihood indicators.",
        likelihoodPercentage: 0,
        roadmap: [{ step: "Step 1: Add a Unit 1 topic to generate a roadmap", duration: "0 Hours" }]
      }
    };

    const newManualPaper = {
      name: sheetName,
      type: "manual",
      uploaded: "Just now",
      status: "Processed",
      analysis: blankAnalysis,
      topics: 0
    };

    if (selectedManualSubject !== config.subject) {
      // Load current papers list for target subject, add new manual paper, and save
      const targetSaved = localStorage.getItem(`examinsight_papers_list_${selectedManualSubject}`);
      let targetList = targetSaved ? JSON.parse(targetSaved) : getInitialPapers(selectedManualSubject);
      targetList = [newManualPaper, ...targetList];
      localStorage.setItem(`examinsight_papers_list_${selectedManualSubject}`, JSON.stringify(targetList));
      localStorage.setItem(`examinsight_selected_paper_index_${selectedManualSubject}`, "0");
      
      // Update config subject - this triggers the useEffect in dashboard.jsx which loads this new list
      setConfig({ ...config, subject: selectedManualSubject });
    } else {
      setPapersList([newManualPaper, ...papersList]);
      setSelectedPaperIndex(0);
    }
    setShowManualSelector(false);
  };

  const updateActiveAnalysis = (updatedAnalysis) => {
    setPapersList(papersList.map((p, idx) => {
      if (idx === selectedPaperIndex) {
        return {
          ...p,
          topics: updatedAnalysis.topics.length,
          analysis: updatedAnalysis
        };
      }
      return p;
    }));
  };

  // Add a manually defined topic
  const handleAddCustomTopic = (e) => {
    e.preventDefault();
    if (!newTopicName.trim()) return;

    const difficultyColors = {
      "Easy": "#10B981",
      "Medium": "#F59E0B",
      "Hard": "#EF4444",
      "Very Hard": "#A855F7"
    };

    const priority = newTopicWeightage >= 14 ? "High" : newTopicWeightage <= 9 ? "Low" : "Medium";
    const importance = Math.min(98, newTopicWeightage * 5 + (priority === "High" ? 30 : 15));

    const formattedNewTopic = {
      id: `t_custom_${Date.now()}`,
      name: `${newTopicName.trim()} (Unit ${newTopicUnit})`,
      unit: parseInt(newTopicUnit),
      difficulty: newTopicDifficulty,
      difficultyColor: difficultyColors[newTopicDifficulty] || "#F59E0B",
      weightage: `${newTopicWeightage}%`,
      priority,
      hours: newTopicDifficulty === "Easy" ? 3 : newTopicDifficulty === "Medium" ? 5 : newTopicDifficulty === "Hard" ? 7 : 8,
      freq: Math.max(1, Math.round(newTopicWeightage / 3)),
      totalExams: 6,
      avgMarks: parseInt(newTopicWeightage) || 10,
      lastSeen: "Just now",
      importance,
      history: [1, 0, 1, 1, 0, 1]
    };

    const updatedTopics = [...(analysis.topics || []), formattedNewTopic];
    const updatedAnalysis = recalculateAnalysis(analysis, updatedTopics);

    updateActiveAnalysis(updatedAnalysis);

    // Reset Form State
    setNewTopicName("");
    setIsAddingTopic(false);
  };

  // Triggers inline editing mode
  const startEditingTopic = (index, topic) => {
    setEditingIndex(index);
    setEditName(topic.name);
    setEditDifficulty(topic.difficulty);
    setEditWeightage(parseInt(topic.weightage) || 10);
  };

  // Save inline modifications
  const handleSaveTopicEdit = (index) => {
    if (!editName.trim()) return;

    const difficultyColors = {
      "Easy": "#10B981",
      "Medium": "#F59E0B",
      "Hard": "#EF4444",
      "Very Hard": "#A855F7"
    };

    const updatedTopics = analysis.topics.map((t, idx) => {
      if (idx === index) {
        const priority = editWeightage >= 14 ? "High" : editWeightage <= 9 ? "Low" : "Medium";
        const importance = Math.min(98, editWeightage * 5 + (priority === "High" ? 30 : 15));
        return {
          ...t,
          name: editName.trim(),
          difficulty: editDifficulty,
          difficultyColor: difficultyColors[editDifficulty] || "#F59E0B",
          weightage: `${editWeightage}%`,
          priority,
          hours: editDifficulty === "Easy" ? 3 : editDifficulty === "Medium" ? 5 : editDifficulty === "Hard" ? 7 : 8,
          avgMarks: parseInt(editWeightage) || 10,
          importance
        };
      }
      return t;
    });

    const updatedAnalysis = recalculateAnalysis(analysis, updatedTopics);
    updateActiveAnalysis(updatedAnalysis);
    setEditingIndex(-1);
  };

  // Delete a topic
  const handleDeleteTopic = (index) => {
    const updatedTopics = analysis.topics.filter((_, idx) => idx !== index);
    const updatedAnalysis = recalculateAnalysis(analysis, updatedTopics);
    updateActiveAnalysis(updatedAnalysis);
  };

  const getIcon = (type) => {
    switch (type) {
      case "text":
        return AlignLeft;
      case "link":
        return Link2;
      case "manual":
        return BookOpen;
      default:
        return FileText;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <Card className="p-5 border border-[#1E293B]/10 bg-gradient-to-r from-white/30 via-white/45 to-white/30">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#4F46E5]" />
            <h2 className="font-serif text-lg text-[#1E293B]">Your Subject Analyzer</h2>
          </div>
          <button
            onClick={() => setShowManualSelector(true)}
            className="flex items-center gap-1.5 rounded-xl bg-[#4F46E5]/10 border border-[#4F46E5]/20 hover:bg-[#4F46E5]/25 px-3 py-1.5 text-xs text-[#4F46E5] font-semibold transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Create Manual Study Plan
          </button>
        </div>
        <p className="text-xs text-slate-600/80 mt-1">
          Extract study plans from course resources, or bypass uploads to create custom sheets manually.
        </p>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Side: Upload Widget, Manual Creator & Recently Analyzed List (5/12 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Manual Selector Dropdown (Appears when clicked) */}
          {showManualSelector && (
            <Card className="p-5 border-[#4F46E5]/30 bg-white/45 shadow-lg shadow-[#4F46E5]/5">
              <div className="flex items-center justify-between border-b border-[#1E293B]/10 pb-2.5">
                <h3 className="font-serif text-xs font-bold text-[#1E293B]">Create Manual Study Plan</h3>
                <button onClick={() => setShowManualSelector(false)} className="text-slate-600/80 hover:text-[#1E293B] cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={handleCreateManualPlan} className="mt-3.5 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600/80">Select Subject</label>
                  <select
                    value={selectedManualSubject}
                    onChange={(e) => setSelectedManualSubject(e.target.value)}
                    className="w-full bg-white/40 text-[#1E293B] border border-[#1E293B]/10 rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#4F46E5] cursor-pointer font-semibold"
                  >
                    {SUBJECTS.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setShowManualSelector(false)}
                    className="rounded-xl px-3 py-1.5 text-slate-600/80 hover:bg-white/60 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-[#4F46E5] px-4 py-1.5 font-semibold text-[#FDFBF7] hover:bg-[#4F46E5]/90 transition cursor-pointer"
                  >
                    Create Plan
                  </button>
                </div>
              </form>
            </Card>
          )}

          {/* Upload Widget */}
          <Card className="p-5">
            <div className="flex items-center justify-between border-b border-[#1E293B]/10 pb-3">
              <div>
                <h3 className="font-serif text-sm font-semibold text-[#1E293B]">Analyze Source</h3>
                <p className="text-[10px] text-slate-600/80">Import PDF, Text, or Links</p>
              </div>
              <div className="flex gap-1 bg-white/40 p-0.5 rounded-lg border border-[#1E293B]/10">
                {["file", "text", "link"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab);
                      setSuccess(false);
                    }}
                    className={`rounded-md px-2.5 py-1 text-[10px] font-semibold capitalize transition cursor-pointer ${
                      activeTab === tab
                        ? "bg-[#4F46E5] text-[#FDFBF7]"
                        : "text-slate-600/80 hover:text-[#1E293B]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddSource} className="mt-4">
              {activeTab === "file" && (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#1E293B]/10 bg-white/30 p-6 text-center">
                  <UploadCloud className="h-7 w-7 text-[#4F46E5]" />
                  <p className="mt-2 text-xs font-semibold text-[#1E293B] truncate max-w-full">
                    {fileName ? fileName : "Drop a question paper PDF/Image to analyze"}
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-600/80">
                    Supports PDF, PNG, JPG · OCR auto-runs
                  </p>
                  <label className="mt-3 cursor-pointer rounded-xl bg-white/40 px-3.5 py-1.5 text-xs font-semibold text-[#1E293B] hover:bg-white/60 transition ring-1 ring-[#1E293B]/10">
                    Choose file
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              )}

              {activeTab === "text" && (
                <div className="space-y-2">
                  <textarea
                    placeholder="Paste exam questions, syllabus sections, or text contents here..."
                    rows={4}
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    className="w-full rounded-xl border border-[#1E293B]/10 bg-white/40 p-3 text-xs text-[#1E293B] placeholder-slate-600/50 outline-none focus:ring-1 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5]"
                  />
                </div>
              )}

              {activeTab === "link" && (
                <div className="space-y-2">
                  <input
                    type="url"
                    placeholder="https://example.com/syllabus-or-question-paper.html"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="w-full rounded-xl border border-[#1E293B]/10 bg-white/40 p-3 text-xs text-[#1E293B] placeholder-slate-600/50 outline-none focus:ring-1 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5]"
                  />
                </div>
              )}

              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={
                    loading ||
                    (activeTab === "file" && !fileName) ||
                    (activeTab === "text" && !rawText.trim()) ||
                    (activeTab === "link" && !linkUrl.trim())
                  }
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-white transition cursor-pointer ${
                    success
                      ? "bg-[#10B981]"
                      : "bg-[#4F46E5] hover:bg-[#4F46E5]/90 disabled:opacity-50 disabled:pointer-events-none"
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Extracting topics...
                    </>
                  ) : success ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Processed successfully!
                    </>
                  ) : (
                    "Analyze & Extract"
                  )}
                </button>
              </div>
            </form>
          </Card>

          {/* Recently Analyzed resources list */}
          <Card className="p-5">
            <SectionHeader title="Recent Material List" sub="Select a resource to review workflow output" />
            <div className="space-y-2 mt-2">
              {papersList.map((p, idx) => {
                const Icon = getIcon(p.type);
                const isSelected = selectedPaperIndex === idx;
                return (
                  <div
                    key={p.name + idx}
                    onClick={() => {
                      setSelectedPaperIndex(idx);
                      setEditingIndex(-1);
                      setIsAddingTopic(false);
                    }}
                    className={`flex items-center gap-3 rounded-xl border p-3.5 transition cursor-pointer select-none ${
                      isSelected
                        ? "border-[#4F46E5] bg-[#4F46E5]/5 ring-1 ring-[#4F46E5]/25"
                        : "border-[#1E293B]/10 bg-white/30 hover:bg-white/60"
                    }`}
                  >
                    <div
                      className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? "bg-[#4F46E5]/20 text-[#4F46E5]" : "bg-white/40 text-slate-600/80"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`truncate text-xs font-semibold ${isSelected ? "text-[#4F46E5]" : "text-[#1E293B]"}`} title={p.name}>
                        {p.name}
                      </p>
                      <p className="text-[10px] text-slate-600/80 font-mono mt-0.5">
                        {p.uploaded} · {p.topics} topics · <span className="capitalize">{p.type}</span>
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-[#10B981]/10 px-2 py-0.5 text-[9px] font-bold text-[#10B981] ring-1 ring-[#10B981]/20">
                      {p.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Side: Analysis & Study Roadmap Output (7/12 cols) */}
        <div className="lg:col-span-7">
          {analysis ? (
            <Card className="p-4 sm:p-6 space-y-6">
              
              {/* Header Details */}
              <div className="border-b border-themeBorder pb-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-themeAccentSoft px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-themeAccent">
                      {activePaper.type} Source
                    </span>
                    <span className="text-xs text-themeMuted font-mono">•</span>
                    <span className="text-[10px] text-themeMuted font-mono font-medium">
                      Uploaded {activePaper.uploaded}
                    </span>
                  </div>
                  <span className="text-[10px] text-red-500 font-semibold bg-red-500/5 px-2 py-0.5 rounded-lg border border-red-500/10">
                    Editable plan
                  </span>
                </div>
                <h3 className="font-serif text-base sm:text-lg text-themeText mt-2.5 truncate" title={activePaper.name}>
                  {activePaper.name}
                </h3>
                <p className="text-xs text-themeMuted font-mono mt-1 flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-themeAccent" /> {analysis.subject}
                </p>
              </div>

              {/* High-level metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-themeBorder bg-white/[0.01] p-3 text-center">
                  <p className="text-[9px] uppercase tracking-wider text-themeMuted">Difficulty</p>
                  <p className="text-xs font-bold mt-1 font-mono" style={{ color: analysis.difficultyColor }}>
                    {analysis.difficulty}
                  </p>
                </div>
                <div className="rounded-xl border border-themeBorder bg-white/[0.01] p-3 text-center">
                  <p className="text-[9px] uppercase tracking-wider text-themeMuted">Time to Master</p>
                  <p className="text-xs font-bold text-themeText mt-1 font-mono">{analysis.timeToMaster}</p>
                </div>
                <div className="rounded-xl border border-themeBorder bg-white/[0.01] p-3 text-center">
                  <p className="text-[9px] uppercase tracking-wider text-themeMuted">Topics Found</p>
                  <p className="text-xs font-bold text-themeAccent mt-1 font-mono">{analysis.topics.length}</p>
                </div>
              </div>

              {/* Categorized Topics Table (Fully Editable CRUD System) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-themeMuted flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-themeAccent" /> Extracted Study Topics
                  </p>
                  <button
                    onClick={() => setIsAddingTopic(!isAddingTopic)}
                    className="flex items-center gap-1 rounded bg-themeAccentSoft hover:bg-themeAccent/20 px-2 py-0.5 text-[10px] text-themeAccent font-bold transition cursor-pointer"
                  >
                    {isAddingTopic ? <X className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                    {isAddingTopic ? "Cancel" : "Add Topic"}
                  </button>
                </div>

                {/* Add Topic Inline Form Card */}
                {isAddingTopic && (
                  <form onSubmit={handleAddCustomTopic} className="rounded-xl border border-themeAccent/30 bg-themeSidebar p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-themeBorder pb-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-themeAccent flex items-center gap-1">
                        <Plus className="h-3.5 w-3.5" /> Add custom topic
                      </p>
                      <button type="button" onClick={() => setIsAddingTopic(false)} className="text-themeMuted hover:text-themeText cursor-pointer">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-themeMuted">Topic Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Subnet masks splits"
                          value={newTopicName}
                          onChange={(e) => setNewTopicName(e.target.value)}
                          className="w-full rounded-lg border border-themeBorder bg-themeBg px-2.5 py-1.5 text-xs text-themeText outline-none focus:border-themeAccent"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-themeMuted">Unit</label>
                          <select
                             value={newTopicUnit}
                             onChange={(e) => setNewTopicUnit(parseInt(e.target.value))}
                             className="w-full rounded-lg border border-themeBorder bg-themeBg p-1.5 text-xs text-themeText outline-none"
                          >
                            {[1, 2, 3, 4, 5].map(u => (
                              <option key={u} value={u}>U{u}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-themeMuted">Diff</label>
                          <select
                            value={newTopicDifficulty}
                            onChange={(e) => setNewTopicDifficulty(e.target.value)}
                            className="w-full rounded-lg border border-themeBorder bg-themeBg p-1.5 text-xs text-themeText outline-none"
                          >
                            {["Easy", "Medium", "Hard", "Very Hard"].map(d => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-themeMuted">Weight %</label>
                          <input
                            type="number"
                            min="1"
                            max="50"
                            value={newTopicWeightage}
                            onChange={(e) => setNewTopicWeightage(parseInt(e.target.value) || 1)}
                            className="w-full rounded-lg border border-themeBorder bg-themeBg p-1.5 text-xs text-themeText text-center outline-none font-mono"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        className="rounded-lg bg-themeAccent px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-themeAccent/90 cursor-pointer"
                      >
                        Add Topic
                      </button>
                    </div>
                  </form>
                )}

                {/* Topics Table - Wrapped in overflow-x-auto to prevent layout squishing */}
                <div className="overflow-x-auto rounded-xl border border-themeBorder bg-white/[0.01]">
                  <div className="min-w-[500px]">
                    <div className="grid grid-cols-12 bg-white/[0.03] p-2.5 text-[9px] font-bold uppercase tracking-wider text-themeMuted border-b border-themeBorder items-center">
                      <div className="col-span-6">Topic Details</div>
                      <div className="col-span-2 text-center">Difficulty</div>
                      <div className="col-span-2 text-center">Weight</div>
                      <div className="col-span-2 text-right">Actions</div>
                    </div>
                    <div className="divide-y divide-themeBorder">
                      {analysis.topics.length === 0 ? (
                        <div className="p-6 text-center text-xs text-themeMuted">
                          No study topics added yet. Click "+ Add Topic" to insert your manual preparation data.
                        </div>
                      ) : (
                        analysis.topics.map((t, index) => {
                          const isEditing = editingIndex === index;
                          return (
                            <div key={index} className="grid grid-cols-12 p-3 text-xs items-center hover:bg-white/[0.01] transition gap-1.5">
                              {isEditing ? (
                                <>
                                  {/* Row Editing Inputs */}
                                  <div className="col-span-6 pr-2">
                                    <input
                                      type="text"
                                      value={editName}
                                      onChange={(e) => setEditName(e.target.value)}
                                      className="w-full rounded bg-themeBg border border-themeAccent px-2 py-1 text-xs text-themeText outline-none"
                                    />
                                  </div>
                                  <div className="col-span-2 flex justify-center">
                                    <select
                                      value={editDifficulty}
                                      onChange={(e) => setEditDifficulty(e.target.value)}
                                      className="rounded bg-themeBg border border-themeBorder px-1 py-1 text-[10px] text-themeText outline-none"
                                    >
                                      {["Easy", "Medium", "Hard", "Very Hard"].map(d => (
                                        <option key={d} value={d}>{d}</option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="col-span-2 flex justify-center items-center gap-0.5">
                                    <input
                                      type="number"
                                      min="1"
                                      max="50"
                                      value={editWeightage}
                                      onChange={(e) => setEditWeightage(parseInt(e.target.value) || 1)}
                                      className="w-10 rounded bg-themeBg border border-themeBorder p-1 text-[10px] text-center text-themeText outline-none font-mono"
                                    />
                                    <span className="text-[10px] text-themeMuted font-mono">%</span>
                                  </div>
                                  <div className="col-span-2 flex justify-end gap-1.5">
                                    <button
                                      onClick={() => handleSaveTopicEdit(index)}
                                      className="text-[#10B981] hover:underline text-[10px] font-bold cursor-pointer"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => setEditingIndex(-1)}
                                      className="text-themeMuted hover:underline text-[10px] cursor-pointer"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </>
                              ) : (
                                <>
                                  {/* Standard Row Rendering */}
                                  <div className="col-span-6 font-medium text-themeText truncate pr-2" title={t.name}>
                                    {t.name}
                                  </div>
                                  <div className="col-span-2 flex justify-center">
                                    <span
                                      className="px-2 py-0.5 rounded-full text-[9px] font-bold"
                                      style={{ backgroundColor: `${t.difficultyColor}15`, color: t.difficultyColor }}
                                    >
                                      {t.difficulty}
                                    </span>
                                  </div>
                                  <div className="col-span-2 text-center font-mono text-[10px] text-themeMuted">
                                    {t.weightage}%
                                  </div>
                                  <div className="col-span-2 flex justify-end gap-2.5">
                                    <button
                                      onClick={() => startEditingTopic(index, t)}
                                      className="text-themeMuted hover:text-themeAccent transition cursor-pointer"
                                      title="Edit Topic"
                                    >
                                      <Edit2 className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteTopic(index)}
                                      className="text-themeMuted hover:text-red-500 transition cursor-pointer"
                                      title="Delete Topic"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Unit 1 Focus & Marks Breakdown */}
              {analysis.unit1 && (
                <div className="rounded-xl border border-themeBorder bg-white/30 p-5 space-y-4">
                  <div className="flex items-center gap-2.5 border-b border-themeBorder pb-3">
                    <Award className="h-5 w-5 text-[#E8B339]" />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-themeText">Unit 1 Study Advisor</h4>
                      <p className="text-[10px] text-themeMuted">Dynamic focus plan & score probability for Unit 1</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Unit 1 Study Hours & Marks potential */}
                    <div className="space-y-3">
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-themeMuted font-semibold">Recommended Hours</p>
                        <p className="text-xs text-themeText font-mono mt-0.5 flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-themeAccent" />
                          Spend <span className="text-themeAccent font-bold">{analysis.unit1.studyHours} Hours</span> on Unit 1
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-themeMuted font-semibold">Mark Potential</p>
                        <p className="text-xs text-themeText font-mono mt-0.5">
                          Worth approx <span className="text-[#10B981] font-bold">{analysis.unit1.weightage}%</span> of total exam marks
                        </p>
                        <div className="mt-1.5 h-1.5 w-full rounded-full bg-[#1E293B]/10">
                          <div className="h-1.5 rounded-full bg-[#10B981]" style={{ width: `${Math.min(100, (analysis.unit1.weightage / 20) * 100)}%` }} />
                        </div>
                      </div>
                    </div>

                    {/* Possibility of Getting Marks */}
                    <div className="space-y-1 rounded-xl bg-white/30 border border-themeBorder p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] uppercase tracking-wider text-themeMuted font-semibold">Mark Likelihood</span>
                        <span className="text-xs font-bold font-mono text-[#10B981]" style={{ color: analysis.unit1.possibilityColor }}>
                          {analysis.unit1.likelihoodPercentage}%
                        </span>
                      </div>
                      <p className="text-[11px] text-themeMuted leading-relaxed mt-1">
                        {analysis.unit1.possibilityText}
                      </p>
                    </div>
                  </div>

                  {/* Important Unit 1 Topics */}
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[9px] uppercase tracking-wider text-themeMuted font-semibold">Important Topics in Unit 1</p>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.unit1.topics.length === 0 ? (
                        <span className="text-[10px] text-slate-600/80 italic">No Unit 1 topics added yet.</span>
                      ) : (
                        analysis.unit1.topics.map((t, idx) => (
                          <span key={idx} className="rounded-lg bg-[#4F46E5]/10 border border-[#4F46E5]/20 px-2 py-1 text-[10px] text-[#1E293B] font-medium">
                            {t}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Unit 1 Roadmap timeline */}
                  <div className="space-y-2 pt-1">
                    <p className="text-[9px] uppercase tracking-wider text-slate-600/80 font-semibold">Unit 1 study roadmap</p>
                    <div className="space-y-2.5 bg-white/40 border border-[#1E293B]/10 rounded-lg p-3">
                      {analysis.unit1.roadmap.map((route, index) => (
                        <div key={index} className="flex gap-2.5 relative items-start">
                          {index !== analysis.unit1.roadmap.length - 1 && (
                            <div className="absolute left-[5.5px] top-4.5 bottom-0 w-px bg-[#1E293B]/10" />
                          )}
                          <div className="h-3 w-3 rounded-full bg-[#4F46E5]/10 border border-[#4F46E5]/30 flex items-center justify-center shrink-0 mt-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#4F46E5]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-[11px] text-[#1E293B] font-medium truncate">{route.step}</p>
                              <span className="text-[9px] text-slate-600/80 font-mono shrink-0">{route.duration}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Learning Roadmap / Timeline Workflow */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600/80 flex items-center gap-1">
                  <Compass className="h-3.5 w-3.5 text-[#4F46E5]" /> Custom Resource Study Roadmap
                </p>
                <div className="space-y-3 bg-white/40 rounded-xl border border-[#1E293B]/10 p-4">
                  {analysis.roadmap.length === 0 ? (
                    <div className="p-3 text-center text-xs text-slate-600/80">
                      Add study topics to generate the general preparation roadmap.
                    </div>
                  ) : (
                    analysis.roadmap.map((route, index) => (
                      <div key={index} className="flex gap-3 relative">
                        {index !== analysis.roadmap.length - 1 && (
                          <div className="absolute left-[7px] top-5 bottom-0 w-0.5 bg-[#1E293B]/10" />
                        )}
                        <div className="h-4 w-4 rounded-full bg-[#4F46E5]/10 border border-[#4F46E5]/30 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#4F46E5]" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-baseline justify-between gap-2">
                            <p className="text-xs text-[#1E293B] font-medium">{route.step}</p>
                            <span className="text-[10px] text-slate-600/80 font-mono shrink-0">{route.duration}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Actionable Study Tips */}
              <div className="flex items-start gap-2.5 rounded-xl bg-[#4F46E5]/5 border border-[#4F46E5]/15 p-4 text-xs text-[#1E293B]">
                <Clock className="h-4 w-4 shrink-0 text-[#4F46E5] mt-0.5" />
                <div>
                  <p className="font-semibold text-xs text-[#4F46E5] mb-1">Study Insight</p>
                  <p className="text-slate-600/80 leading-relaxed">{analysis.insights}</p>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-8 text-center flex flex-col items-center justify-center h-full min-h-[400px] gap-4">
              <div>
                <Compass className="h-12 w-12 text-slate-600/80 animate-pulse mx-auto" />
                <h3 className="font-serif text-sm font-semibold text-[#1E293B] mt-4">No Material Selected</h3>
                <p className="text-xs text-slate-600/80 mt-1 max-w-xs leading-normal mx-auto">
                  Upload a course resource on the left, or create a blank custom prep sheet to build your study plan manually.
                </p>
              </div>
              <button
                onClick={() => setShowManualSelector(true)}
                className="flex items-center gap-1.5 rounded-xl bg-[#4F46E5] hover:bg-[#4F46E5]/90 px-4.5 py-2 text-xs text-[#FDFBF7] font-semibold shadow-lg shadow-[#4F46E5]/10 transition cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Create Manual Study Plan
              </button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
