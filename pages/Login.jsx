import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  Loader2,
  Phone,
  Hash,
  Github,
  Linkedin,
  Target
} from "lucide-react";

export default function Login({ onLoginSuccess }) {
  // Login / Register state
  const [isRegister, setIsRegister] = useState(false);
  const [loginMethod, setLoginMethod] = useState("email"); // "email" or "phone"

  // Credentials form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Phone number form states
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [smsAlert, setSmsAlert] = useState("");

  // Loading states
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [linkedinLoading, setLinkedinLoading] = useState(false);

  // Notification states
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Email validation rules
  const validateEmailForm = () => {
    setError("");
    if (!email) {
      setError("Gmail address is required.");
      return false;
    }
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(email)) {
      setError("Please enter a valid Gmail address (ending in @gmail.com).");
      return false;
    }
    if (!password) {
      setError("Password is required.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    if (isRegister) {
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return false;
      }
    }
    return true;
  };

  // Submit email login/register
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!validateEmailForm()) return;

    setLoading(true);
    setError("");
    setSuccessMsg("");

    setTimeout(() => {
      const usersData = localStorage.getItem("examinsight_registered_users");
      const users = usersData ? JSON.parse(usersData) : {};

      if (isRegister) {
        if (users[email.toLowerCase()]) {
          setError("An account with this Gmail address already exists.");
          setLoading(false);
          return;
        }

        // Save new user
        users[email.toLowerCase()] = password;
        localStorage.setItem("examinsight_registered_users", JSON.stringify(users));

        setSuccessMsg("Account created successfully! You can now log in.");
        setIsRegister(false);
        setPassword("");
        setConfirmPassword("");
        setLoading(false);
      } else {
        const storedPassword = users[email.toLowerCase()];
        if (!storedPassword || storedPassword !== password) {
          setError("Invalid Gmail address or password.");
          setLoading(false);
          return;
        }

        // Success session
        const displayName = email.split("@")[0];
        const userSession = {
          email: email.toLowerCase(),
          name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
          avatarLetter: displayName.substring(0, 2).toUpperCase(),
          authMethod: "credentials"
        };

        onLoginSuccess(userSession);
      }
    }, 1200);
  };

  // Trigger Phone OTP request
  const handleSendOtp = (e) => {
    e.preventDefault();
    setError("");
    setSmsAlert("");

    // Simple phone validator
    const phoneClean = phoneNumber.replace(/\D/g, "");
    if (phoneClean.length < 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      setSmsAlert("SMS Simulator: Your verification OTP code is 123456");
    }, 1200);
  };

  // Verify Phone OTP code
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setError("");

    if (otpCode !== "123456") {
      setError("Invalid OTP verification code. Enter 123456 for testing.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+91 ${phoneNumber}`;
      const userSession = {
        email: formattedPhone,
        name: "SMS Student",
        avatarLetter: "PH",
        authMethod: "phone"
      };
      setLoading(false);
      onLoginSuccess(userSession);
    }, 1000);
  };

  // OAuth Mock Handlers
  const handleGoogleLogin = () => {
    setError("");
    setGoogleLoading(true);
    setTimeout(() => {
      const userSession = {
        email: "student.insight@gmail.com",
        name: "Google Student",
        avatarLetter: "GS",
        authMethod: "google"
      };
      setGoogleLoading(false);
      onLoginSuccess(userSession);
    }, 1200);
  };

  const handleGithubLogin = () => {
    setError("");
    setGithubLoading(true);
    setTimeout(() => {
      const userSession = {
        email: "developer.insight@github.com",
        name: "GitHub Scholar",
        avatarLetter: "GH",
        authMethod: "github"
      };
      setGithubLoading(false);
      onLoginSuccess(userSession);
    }, 1200);
  };

  const handleLinkedinLogin = () => {
    setError("");
    setLinkedinLoading(true);
    setTimeout(() => {
      const userSession = {
        email: "expert.advisor@linkedin.com",
        name: "LinkedIn Advisor",
        avatarLetter: "LN",
        authMethod: "linkedin"
      };
      setLinkedinLoading(false);
      onLoginSuccess(userSession);
    }, 1200);
  };

  const isAnyLoading = loading || googleLoading || githubLoading || linkedinLoading;

  return (
    <div className="flex min-h-screen bg-[#FDFBF7] text-[#1E293B] relative overflow-hidden">
      
      {/* LEFT PANEL: Branding & Visuals (Hidden on small viewports) */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-[#FDFBF7] via-[#EAE5D8] to-[#E5DFD0] border-r border-[#1E293B]/10 relative overflow-hidden">
        
        {/* Glow ambient backdrops */}
        <div className="absolute top-1/4 left-1/4 h-[350px] w-[350px] rounded-full bg-[#4F46E5]/5 blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 h-[350px] w-[350px] rounded-full bg-[#0D9488]/5 blur-[100px] animate-pulse" />
        
        {/* Logo and brand name */}
        <div className="flex items-center gap-2 relative z-10">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#0D9488] shadow-md shadow-[#4F46E5]/20">
            <Target className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="font-serif text-lg font-bold text-[#1E293B] tracking-wide">ExamInsight</span>
        </div>

        {/* Visual orbital & metrics */}
        <div className="my-auto space-y-8 relative z-10">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#4F46E5]/10 px-3 py-1 text-xs font-semibold text-[#4F46E5] border border-[#4F46E5]/20">
            <Sparkles className="h-3.5 w-3.5" />
            Innovative AI Syllabus Engine
          </div>
          <h1 className="font-serif text-4xl font-extrabold tracking-tight leading-tight text-[#1E293B] max-w-md">
            Accelerate your exam scores with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#0D9488]">intelligent predictions</span>.
          </h1>
          <p className="text-sm text-slate-600/80 max-w-sm leading-relaxed">
            Analyze past papers, converse with a curriculum-aware AI agent, and get customized daily preparation calendars instantly.
          </p>
          
          {/* Glassmorphic visual coverage card */}
          <div className="rounded-2xl border border-[#1E293B]/10 bg-white/45 p-4 backdrop-blur-md max-w-xs shadow-xl shadow-black/[0.03]">
            <p className="text-[10px] uppercase tracking-wider text-slate-600/80 font-semibold">Live Syllabus Coverage</p>
            <div className="flex items-center gap-3 mt-2">
              <div className="h-8 w-8 rounded-lg bg-[#0D9488]/10 border border-[#0D9488]/20 flex items-center justify-center text-[#0D9488]">
                <ShieldCheck className="h-4.5 w-4.5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-xs font-semibold text-[#1E293B]">
                  <span>Database Systems</span>
                  <span>84%</span>
                </div>
                <div className="mt-1 h-1.5 w-full rounded-full bg-[#1E293B]/10 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#4F46E5] to-[#0D9488] rounded-full" style={{ width: "84%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-xs text-slate-500 relative z-10">
          © 2026 ExamInsight. Empowering student grades through analytics.
        </p>
      </div>

      {/* RIGHT PANEL: Authentication Panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 relative overflow-hidden bg-[#FDFBF7]">
        
        {/* Glow ambient background on mobile */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-[#4F46E5]/5 blur-[80px] lg:hidden" />

        {/* Auth form container */}
        <div className="w-full max-w-md rounded-2xl border border-[#1E293B]/10 bg-white/45 p-8 shadow-2xl backdrop-blur-xl ring-1 ring-black/[0.02] relative z-10 animate-slideUp">
          
          {/* Header section */}
          <div className="flex flex-col items-center text-center">
            <div className="flex lg:hidden h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#0D9488] shadow-md shadow-[#4F46E5]/20 mb-3">
              <Target className="h-5 w-5 text-white" />
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1E293B]">
              {isRegister ? "Create your account" : "Welcome back"}
            </h2>
            <p className="mt-1 text-xs text-slate-600/80">
              {isRegister ? "Unlock dynamic study roadmaps and AI tools" : "Sign in to access your ExamInsight dashboard"}
            </p>
          </div>

          {/* Error notifications */}
          {error && (
            <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs text-[#EF4444]">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
              <p className="leading-normal">{error}</p>
            </div>
          )}

          {/* Success notifications */}
          {successMsg && (
            <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-[#10B981]">
              <Sparkles className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
              <p className="leading-normal">{successMsg}</p>
            </div>
          )}

          {/* Simulated SMS Log banner */}
          {smsAlert && (
            <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-800 font-mono">
              <Sparkles className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
              <p className="leading-normal">{smsAlert}</p>
            </div>
          )}

          {/* Authentication Method Sub-Tabs */}
          {!isRegister && (
            <div className="grid grid-cols-2 gap-1 bg-white/40 p-1 rounded-xl border border-[#1E293B]/10 mt-5">
              <button
                type="button"
                onClick={() => {
                  setLoginMethod("email");
                  setError("");
                  setSmsAlert("");
                }}
                className={`flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                  loginMethod === "email"
                    ? "bg-[#4F46E5] text-[#FDFBF7] shadow-md shadow-[#4F46E5]/20"
                    : "text-slate-600/80 hover:text-[#1E293B]"
                }`}
              >
                <Mail className="h-3.5 w-3.5" />
                Gmail Account
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginMethod("phone");
                  setError("");
                  setSmsAlert("");
                }}
                className={`flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                  loginMethod === "phone"
                    ? "bg-[#4F46E5] text-[#FDFBF7] shadow-md shadow-[#4F46E5]/20"
                    : "text-slate-600/80 hover:text-[#1E293B]"
                }`}
              >
                <Phone className="h-3.5 w-3.5" />
                Phone & OTP
              </button>
            </div>
          )}

          {/* Form display condition */}
          {loginMethod === "email" || isRegister ? (
            /* email form */
            <form onSubmit={handleEmailSubmit} className="mt-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600/80 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-[#4F46E5]" /> Gmail Address
                </label>
                <input
                  type="text"
                  placeholder="yourname@gmail.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  disabled={isAnyLoading}
                  className="w-full rounded-xl border border-[#1E293B]/10 bg-white/40 px-3.5 py-2.5 text-xs text-[#1E293B] placeholder-slate-500 outline-none transition focus:border-[#4F46E5] disabled:opacity-50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600/80 flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-[#4F46E5]" /> Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password (min 6 characters)"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError("");
                    }}
                    disabled={isAnyLoading}
                    className="w-full rounded-xl border border-[#1E293B]/10 bg-white/40 pl-3.5 pr-10 py-2.5 text-xs text-[#1E293B] placeholder-slate-500 outline-none transition focus:border-[#4F46E5] disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600/80 hover:text-[#1E293B] transition cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {isRegister && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600/80 flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-[#4F46E5]" /> Confirm Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (error) setError("");
                    }}
                    disabled={isAnyLoading}
                    className="w-full rounded-xl border border-[#1E293B]/10 bg-white/40 px-3.5 py-2.5 text-xs text-[#1E293B] placeholder-slate-500 outline-none transition focus:border-[#4F46E5] disabled:opacity-50"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isAnyLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#4F46E5] py-2.5 text-xs font-semibold text-[#FDFBF7] shadow-lg shadow-[#4F46E5]/20 hover:bg-[#4F46E5]/90 transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isRegister ? "Creating account..." : "Signing in..."}
                  </>
                ) : (
                  isRegister ? "Create Account" : "Sign In with Gmail"
                )}
              </button>
            </form>
          ) : (
            /* phone & OTP form */
            <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="mt-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600/80 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-[#4F46E5]" /> Phone Number
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-600/80">+91</span>
                  <input
                    type="tel"
                    placeholder="98765 43210"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      if (error) setError("");
                    }}
                    disabled={otpSent || isAnyLoading}
                    className="w-full rounded-xl border border-[#1E293B]/10 bg-white/40 pl-12 pr-3.5 py-2.5 text-xs text-[#1E293B] placeholder-slate-500 outline-none transition focus:border-[#4F46E5] disabled:opacity-50"
                  />
                </div>
              </div>

              {otpSent && (
                <div className="space-y-1.5 animate-slideUp">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600/80 flex items-center gap-1.5">
                    <Hash className="h-3.5 w-3.5 text-[#4F46E5]" /> OTP verification code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit OTP code"
                    value={otpCode}
                    onChange={(e) => {
                      setOtpCode(e.target.value.replace(/\D/g, ""));
                      if (error) setError("");
                    }}
                    disabled={isAnyLoading}
                    className="w-full rounded-xl border border-[#1E293B]/10 bg-white/40 px-3.5 py-2.5 text-xs text-[#1E293B] placeholder-slate-500 outline-none transition focus:border-[#4F46E5] disabled:opacity-50 text-center font-mono tracking-widest text-lg font-bold"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isAnyLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#4F46E5] py-2.5 text-xs font-semibold text-[#FDFBF7] shadow-lg shadow-[#4F46E5]/20 hover:bg-[#4F46E5]/90 transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {otpSent ? "Verifying code..." : "Requesting code..."}
                  </>
                ) : (
                  otpSent ? "Verify OTP & Log In" : "Request OTP Code"
                )}
              </button>
            </form>
          )}

          {/* Social Sign-in Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#1E293B]/10" />
            </div>
            <div className="relative flex justify-center text-[9px] uppercase tracking-wider">
              <span className="bg-[#FDFBF7] px-3 text-slate-600/80 font-semibold">Or instantly login via</span>
            </div>
          </div>

          {/* Social Login Button Row */}
          <div className="grid grid-cols-3 gap-2">
            
            {/* Google button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isAnyLoading}
              title="Google"
              className="flex items-center justify-center h-10 rounded-xl border border-[#1E293B]/10 bg-white/40 hover:bg-white/60 text-[#1E293B] transition disabled:opacity-50 cursor-pointer hover:border-[#4F46E5]/30"
            >
              {googleLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-[#4F46E5]" />
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
              )}
            </button>

            {/* GitHub button */}
            <button
              type="button"
              onClick={handleGithubLogin}
              disabled={isAnyLoading}
              title="GitHub"
              className="flex items-center justify-center h-10 rounded-xl border border-[#1E293B]/10 bg-white/40 hover:bg-white/60 text-[#1E293B] transition disabled:opacity-50 cursor-pointer hover:border-[#4F46E5]/30"
            >
              {githubLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-[#4F46E5]" />
              ) : (
                <Github className="h-4.5 w-4.5 text-[#1E293B]" />
              )}
            </button>

            {/* LinkedIn button */}
            <button
              type="button"
              onClick={handleLinkedinLogin}
              disabled={isAnyLoading}
              title="LinkedIn"
              className="flex items-center justify-center h-10 rounded-xl border border-[#1E293B]/10 bg-white/40 hover:bg-white/60 text-[#1E293B] transition disabled:opacity-50 cursor-pointer hover:border-[#0D9488]/30"
            >
              {linkedinLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-[#0D9488]" />
              ) : (
                <Linkedin className="h-4.5 w-4.5 text-[#0D9488]" />
              )}
            </button>
          </div>

          {/* Toggle between register and login */}
          <p className="mt-6 text-center text-xs text-slate-600/80">
            {isRegister ? "Already have an account?" : "Don't have a Gmail account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
                setSuccessMsg("");
                setSmsAlert("");
              }}
              className="font-semibold text-[#4F46E5] hover:underline cursor-pointer"
            >
              {isRegister ? "Sign In" : "Create one now"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
