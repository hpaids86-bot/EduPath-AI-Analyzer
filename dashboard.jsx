import React, { useState, useMemo, useEffect } from "react";
import {
  LayoutDashboard,
  Target,
  CalendarClock,
  GraduationCap,
  UploadCloud,
  Settings,
  Flame,
  Search,
  Bell,
  ChevronDown,
  BarChart3,
  ShieldAlert,
  LogOut,
  Sparkles,
  Brain,
  Palette,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  MoreHorizontal,
} from "lucide-react";

import Overview from "./pages/Overview.jsx";
import TopicImportance from "./pages/TopicImportance.jsx";
import UnitWeightage from "./pages/UnitWeightage.jsx";
import Planner from "./pages/Planner.jsx";
import PassStrategy from "./pages/PassStrategy.jsx";
import Roadmaps from "./pages/Roadmaps.jsx";
import Papers from "./pages/Papers.jsx";
import Login from "./pages/Login.jsx";
import AgentPlayground from "./pages/AgentPlayground.jsx";
import AIPredictor from "./pages/AIPredictor.jsx";

import { getInitialPapers } from "./data/analyzer.js";
import { glassTheme } from "./theme.js";

const navItems = [
  { id: "predictor", label: "AI Exam Predictor", icon: Brain },
  { id: "agent", label: "Curriculum AI Agent", icon: Sparkles },
  { id: "papers", label: "Your Subject Analyzer", icon: UploadCloud },
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "topics", label: "Topic Importance", icon: Flame },
  { id: "units", label: "Unit Weightage", icon: BarChart3 },
  { id: "planner", label: "Study Planner", icon: CalendarClock },
  { id: "pass", label: "Pass Strategy", icon: ShieldAlert },
  { id: "roadmaps", label: "Competitive Roadmaps", icon: GraduationCap },
];

export default function ExamInsightDashboard() {
  // Authentication State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("examinsight_current_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [profileOpen, setProfileOpen] = useState(false);

  // Lifted Preparation Configuration State
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem("examinsight_config");
    return saved ? JSON.parse(saved) : {
      subject: "Database Management Systems",
      durationWeeks: 5,
      weeklyHours: 10,
      targetMarks: 80,
      strategyMode: "High Score Strategy"
    };
  });

  const [active, setActive] = useState("predictor");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem("examinsight_sidebar_collapsed") === "true";
  });
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("examinsight_theme") || "amethyst";
  });
  const [isHowToUseOpen, setIsHowToUseOpen] = useState(true);

  // Themes list
  const themes = [
    { id: "amethyst", label: "Midnight Amethyst", color: "from-[#8B5CF6] to-[#06B6D4]" },
    { id: "sunset", label: "Sunset Cyber", color: "from-[#F97316] to-[#F43F5E]" },
    { id: "emerald", label: "Emerald Forest", color: "from-[#10B981] to-[#06B6D4]" },
    { id: "light", label: "Aurora Light", color: "from-[#6366F1] to-[#EC4899]" },
  ];

  // Lifted Papers List & Active Index State
  const [papersList, setPapersList] = useState(() => {
    const saved = localStorage.getItem(`examinsight_papers_list_${config.subject}`);
    return saved ? JSON.parse(saved) : getInitialPapers(config.subject);
  });

  const [selectedPaperIndex, setSelectedPaperIndex] = useState(() => {
    const saved = localStorage.getItem(`examinsight_selected_paper_index_${config.subject}`);
    return saved ? parseInt(saved) || 0 : 0;
  });

  // Keep papersList and selectedPaperIndex synced when configuration subject shifts
  useEffect(() => {
    const savedList = localStorage.getItem(`examinsight_papers_list_${config.subject}`);
    const savedIndex = localStorage.getItem(`examinsight_selected_paper_index_${config.subject}`);
    
    setPapersList(savedList ? JSON.parse(savedList) : getInitialPapers(config.subject));
    setSelectedPaperIndex(savedIndex ? parseInt(savedIndex) || 0 : 0);
  }, [config.subject]);

  useEffect(() => {
    localStorage.setItem("examinsight_sidebar_collapsed", sidebarCollapsed);
  }, [sidebarCollapsed]);

  useEffect(() => {
    localStorage.setItem("examinsight_theme", theme);
  }, [theme]);

  const handleUpdatePapersList = (newList) => {
    setPapersList(newList);
    localStorage.setItem(`examinsight_papers_list_${config.subject}`, JSON.stringify(newList));
  };

  const handleUpdateSelectedPaperIndex = (newIndex) => {
    setSelectedPaperIndex(newIndex);
    localStorage.setItem(`examinsight_selected_paper_index_${config.subject}`, JSON.stringify(newIndex));
  };

  const activePaper = papersList[selectedPaperIndex] || null;
  const activeAnalysis = activePaper?.analysis || null;

  const handleLoginSuccess = (userSession) => {
    localStorage.setItem("examinsight_current_user", JSON.stringify(userSession));
    setUser(userSession);
  };

  const handleLogout = () => {
    localStorage.removeItem("examinsight_current_user");
    setUser(null);
    setProfileOpen(false);
  };

  const handleUpdateConfig = (newConfig) => {
    setConfig(newConfig);
    localStorage.setItem("examinsight_config", JSON.stringify(newConfig));
  };

  const content = useMemo(() => {
    switch (active) {
      case "overview":
        return <Overview config={config} activeAnalysis={activeAnalysis} />;
      case "topics":
        return <TopicImportance activeAnalysis={activeAnalysis} />;
      case "units":
        return <UnitWeightage config={config} activeAnalysis={activeAnalysis} />;
      case "planner":
        return <Planner config={config} setConfig={handleUpdateConfig} activeAnalysis={activeAnalysis} />;
      case "pass":
        return <PassStrategy activeAnalysis={activeAnalysis} />;
      case "roadmaps":
        return <Roadmaps />;
      case "papers":
        return (
          <Papers
            config={config}
            setConfig={handleUpdateConfig}
            papersList={papersList}
            setPapersList={handleUpdatePapersList}
            selectedPaperIndex={selectedPaperIndex}
            setSelectedPaperIndex={handleUpdateSelectedPaperIndex}
          />
        );
      case "agent":
        return <AgentPlayground />;
      case "predictor":
        return (
          <AIPredictor
            config={config}
            setConfig={handleUpdateConfig}
            activeAnalysis={activeAnalysis}
            papersList={papersList}
            setPapersList={handleUpdatePapersList}
            selectedPaperIndex={selectedPaperIndex}
            setSelectedPaperIndex={handleUpdateSelectedPaperIndex}
          />
        );
      default:
        return <Overview config={config} activeAnalysis={activeAnalysis} />;
    }
  }, [active, config, activeAnalysis, papersList, selectedPaperIndex]);

  const activeLabel = navItems.find((n) => n.id === active)?.label;

  // Render Login if no active user session
  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Sidebar item list configuration
  const primaryMobileIds = ["predictor", "agent", "papers", "planner"];

  return (
    <div data-theme={theme} className={`min-h-screen w-full ${glassTheme.background} text-[#1E293B] transition-colors duration-300 font-sans`}>
      <div className="flex">
        {/* Desktop Sidebar - Hidden on mobile viewports */}
        <aside
          className={`relative z-30 shrink-0 border-r border-[#1E293B]/10 bg-white/45 backdrop-blur-[20px] shadow-xl transition-all duration-300 hidden lg:block h-screen sticky top-0 ${
            sidebarCollapsed ? "w-20" : "w-64"
          }`}
        >
          {/* Logo Section */}
          <div className={`flex h-16 items-center border-b border-[#1E293B]/10 px-5 ${sidebarCollapsed ? "justify-center" : "justify-between"}`}>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4F46E5] shadow-md shadow-[#4F46E5]/20">
                <Target className="h-4 w-4 text-white" />
              </div>
              {!sidebarCollapsed && (
                <span className="font-serif text-lg font-bold text-[#1E293B] tracking-[-0.02em] animate-slideUp">ExamInsight</span>
              )}
            </div>
          </div>

          {/* Sidebar Collapse Toggle Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute top-1/2 -translate-y-1/2 -right-3 z-40 h-6 w-6 items-center justify-center rounded-full border border-[#1E293B]/10 bg-white/45 text-slate-600/80 hover:text-[#1E293B] hover:border-[#4F46E5]/40 transition hidden lg:flex cursor-pointer"
          >
            <ChevronLeft className={`h-3.5 w-3.5 transition-transform duration-300 ${sidebarCollapsed ? "rotate-180" : ""}`} />
          </button>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActive(item.id);
                  }}
                  title={sidebarCollapsed ? item.label : ""}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 relative group ${
                    sidebarCollapsed ? "justify-center px-0" : ""
                  } ${
                    isActive
                      ? "bg-[#4F46E5]/10 border border-[#4F46E5]/30 text-[#4F46E5] font-semibold"
                      : "text-slate-600/80 hover:bg-white/20 hover:text-[#1E293B]"
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-[#4F46E5]" : ""}`} />
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  
                  {/* Floating tooltip on hover when collapsed */}
                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-[#FDFBF7] border border-[#1E293B]/10 text-xs text-[#1E293B] opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap pointer-events-none z-50 shadow-xl font-medium">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Logout Section */}
          <div className="absolute bottom-0 w-full border-t border-[#1E293B]/10 p-3 bg-white/45">
            <button
              onClick={handleLogout}
              title={sidebarCollapsed ? "Sign Out" : ""}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 hover:bg-red-500/10 transition-all duration-200 cursor-pointer ${
                sidebarCollapsed ? "justify-center px-0" : ""
              }`}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {!sidebarCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#1E293B]/10 bg-white/35 px-4 backdrop-blur-[20px] shadow-sm sm:px-6">
            <div className="flex items-center gap-2 lg:gap-3">
              {/* Logo / Brand on mobile header */}
              <div className="flex lg:hidden h-7 w-7 items-center justify-center rounded-lg bg-[#4F46E5] shadow-md shadow-[#4F46E5]/20">
                <Target className="h-4 w-4 text-white" />
              </div>
              <span className="lg:hidden font-serif text-sm font-semibold text-[#1E293B] mr-1">ExamInsight</span>
              <div className="h-4 w-px bg-[#1E293B]/10 lg:hidden" />
              <div>
                <p className="text-xs sm:text-sm font-semibold text-[#1E293B] tracking-[-0.02em]">{activeLabel}</p>
                <p className="hidden text-[10px] text-slate-600/80 sm:block">{config.subject} · UKG to 12th Hub</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Bar - hidden on mobile */}
              <div className="hidden sm:flex items-center gap-2 rounded-lg bg-white/30 border border-[#1E293B]/10 px-2.5 py-1.5">
                <Search className="h-3.5 w-3.5 text-slate-600/80" />
                <input
                  placeholder="Search topics..."
                  className="w-24 md:w-32 bg-transparent text-xs text-[#1E293B] placeholder-slate-500 outline-none"
                />
              </div>

              {/* Theme Switcher Button */}
              <div className="relative">
                <button
                  onClick={() => setThemeOpen(!themeOpen)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/30 border border-[#1E293B]/10 hover:bg-white/40 text-slate-600/80 hover:text-[#1E293B] transition cursor-pointer"
                  title="Switch Theme"
                >
                  <Palette className="h-4 w-4" />
                </button>

                {themeOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setThemeOpen(false)} />
                    <div className="absolute right-0 mt-2 z-40 w-48 rounded-xl border border-[#1E293B]/10 bg-white/80 backdrop-blur-[20px] p-1.5 shadow-2xl ring-1 ring-black/[0.02] animate-slideUp">
                      <div className="px-2.5 py-1.5 border-b border-[#1E293B]/10 mb-1">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-600/80">Aesthetic Theme</p>
                      </div>
                      {themes.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => {
                            setTheme(t.id);
                            setThemeOpen(false);
                          }}
                          className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition ${
                            theme === t.id
                              ? "bg-[#4F46E5]/15 text-[#4F46E5] border border-[#4F46E5]/30 font-semibold"
                              : "text-[#1E293B] hover:bg-white/20"
                          }`}
                        >
                          <span className={`h-3 w-3 rounded-full bg-gradient-to-r ${t.color}`} />
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Notification Bell */}
              <button className="relative rounded-lg p-2 hover:bg-white/30 text-slate-600/80 hover:text-[#1E293B]">
                <Bell className="h-4 w-4" />
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#4F46E5] animate-ping" />
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-white/30 transition cursor-pointer"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#4F46E5] to-[#0D9488] text-xs font-semibold text-white">
                    {user.avatarLetter || "S"}
                  </div>
                  <span className="hidden text-xs font-medium text-[#1E293B] sm:block">{user.name}</span>
                  <ChevronDown className="hidden h-3.5 w-3.5 text-slate-600/80 sm:block" />
                </button>

                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 mt-2 z-40 w-56 rounded-xl border border-[#1E293B]/10 bg-white/80 backdrop-blur-[20px] p-2 shadow-2xl ring-1 ring-black/[0.02] animate-slideUp">
                      <div className="px-3 py-2 border-b border-[#1E293B]/10 mb-1">
                        <p className="text-xs font-semibold text-[#1E293B] truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-600/80 truncate font-mono mt-0.5">{user.email}</p>
                        <span className="mt-1.5 inline-block rounded-full bg-[#4F46E5]/10 px-2 py-0.5 text-[9px] font-bold text-[#4F46E5] capitalize">
                          {user.authMethod} session
                        </span>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs text-red-500 hover:bg-red-500/10 transition"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>

          <main className="p-4 sm:p-6 pb-24 lg:pb-6">
            {content}

            {/* How to Use Collapsible Guide */}
            <div className="mt-8 border-t border-[#1E293B]/10 pt-6 max-w-5xl mx-auto">
              <div className="rounded-2xl border border-[#1E293B]/10 bg-white/45 p-5 space-y-4 backdrop-blur-[20px]">
                <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsHowToUseOpen(!isHowToUseOpen)}>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-[#4F46E5]" />
                    <h4 className="text-sm font-bold uppercase tracking-wider text-[#1E293B] tracking-[-0.02em]">How to use ExamInsight Website</h4>
                  </div>
                  <span className="text-xs text-[#4F46E5] font-semibold hover:underline">
                    {isHowToUseOpen ? "Hide Guide" : "Show Quick Guide"}
                  </span>
                </div>
                
                {isHowToUseOpen && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2 text-xs leading-relaxed text-slate-600/80 animate-slideUp">
                    {/* Step 1 */}
                    <div className="space-y-1">
                      <p className="font-bold text-[#1E293B] flex items-center gap-1.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#4F46E5]/10 text-[10px] font-bold text-[#4F46E5]">1</span>
                        Select Grade & Subject
                      </p>
                      <p>Go to the **Study Planner** or **AI Predictor** and choose your level from the dropdown (UKG to 12th Std, JEE, NEET, or UPSC).</p>
                    </div>
                    {/* Step 2 */}
                    <div className="space-y-1">
                      <p className="font-bold text-[#1E293B] flex items-center gap-1.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#4F46E5]/10 text-[10px] font-bold text-[#4F46E5]">2</span>
                        Simulate Target Marks
                      </p>
                      <p>Use the **AI Exam Predictor** sliders to simulate target marks and immediately filter topics of highest probability.</p>
                    </div>
                    {/* Step 3 */}
                    <div className="space-y-1">
                      <p className="font-bold text-[#1E293B] flex items-center gap-1.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#4F46E5]/10 text-[10px] font-bold text-[#4F46E5]">3</span>
                        Review & Edit Roadmap
                      </p>
                      <p>Inspect extracted topics in the **Subject Analyzer**. You can add custom items, edit weights, or delete topics dynamically.</p>
                    </div>
                    {/* Step 4 */}
                    <div className="space-y-1">
                      <p className="font-bold text-[#1E293B] flex items-center gap-1.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#4F46E5]/10 text-[10px] font-bold text-[#4F46E5]">4</span>
                        Ask the AI Agent
                      </p>
                      <p>Click the **AI Curriculum Agent** or open the chat bubble in the bottom right corner for real-time guidance on any syllabus topics.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Floating Bottom Navigation Bar (Mobile Viewports only) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/60 border-t border-[#1E293B]/10 flex justify-around items-center h-16 pb-safe px-2 shadow-xl backdrop-blur-[20px]">
        {navItems.filter(item => primaryMobileIds.includes(item.id)).map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id && !bottomSheetOpen;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActive(item.id);
                setBottomSheetOpen(false);
              }}
              className={`flex flex-col items-center justify-center w-16 h-12 rounded-xl transition ${
                isActive ? "text-[#4F46E5]" : "text-slate-600/80 hover:text-[#1E293B]"
              }`}
            >
              <Icon className="h-5 w-5 mb-0.5" />
              <span className="text-[9px] font-semibold truncate max-w-full px-0.5">{item.label.replace("AI ", "").replace("Your ", "").split(" ")[0]}</span>
            </button>
          );
        })}
        
        {/* More button */}
        <button
          onClick={() => setBottomSheetOpen(!bottomSheetOpen)}
          className={`flex flex-col items-center justify-center w-16 h-12 rounded-xl transition ${
            bottomSheetOpen ? "text-[#4F46E5]" : "text-slate-600/80 hover:text-[#1E293B]"
          }`}
        >
          <MoreHorizontal className="h-5 w-5 mb-0.5" />
          <span className="text-[9px] font-semibold">More</span>
        </button>
      </div>

      {/* Bottom Sheet Drawer for Mobile Menu */}
      {bottomSheetOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity"
            onClick={() => setBottomSheetOpen(false)}
          />
          {/* Drawer */}
          <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl border-t border-[#1E293B]/10 bg-white/70 px-4 pt-5 pb-8 shadow-2xl backdrop-blur-[32px] transition-transform lg:hidden animate-slideUp">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#1E293B]/10" />
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-[#1E293B] tracking-[-0.02em]">More Options</h4>
              <button onClick={() => setBottomSheetOpen(false)} className="text-slate-600/80 hover:text-[#1E293B]">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Secondary Nav Items Grid */}
            <div className="grid grid-cols-2 gap-2">
              {navItems
                .filter(item => !primaryMobileIds.includes(item.id))
                .map((item) => {
                  const Icon = item.icon;
                  const isActive = active === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActive(item.id);
                        setBottomSheetOpen(false);
                      }}
                      className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-xs transition ${
                        isActive
                          ? "bg-[#4F46E5]/15 text-[#4F46E5] border border-[#4F46E5]/30 font-semibold"
                          : "text-slate-600/80 hover:bg-white/20 hover:text-[#1E293B]"
                      }`}
                    >
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-[#4F46E5]" : ""}`} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
            </div>

            {/* User Session Info & Sign Out inside Bottom Drawer */}
            <div className="mt-6 border-t border-[#1E293B]/10 pt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#4F46E5] to-[#0D9488] text-xs font-semibold text-white">
                  {user.avatarLetter || "S"}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#1E293B] truncate max-w-[140px] tracking-[-0.02em]">{user.name}</p>
                  <p className="text-[9px] text-slate-600/80 font-mono truncate max-w-[140px]">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-500 hover:bg-red-500/20 transition cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
