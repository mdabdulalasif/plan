import React, { useState } from "react";
import {
  Shield,
  Key,
  UserPlus,
  LogIn,
  Compass,
  CheckCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { UserSession } from "../types";

interface AuthProps {
  onLoginSuccess: (session: UserSession) => void;
}

export default function Auth({ onLoginSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarColor, setAvatarColor] = useState(
    "from-indigo-500 to-purple-500",
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const colors = [
    { class: "from-indigo-500 to-purple-500", label: "Royal indigo" },
    { class: "from-blue-500 to-cyan-500", label: "Ocean cyan" },
    { class: "from-emerald-500 to-teal-500", label: "Jungle teal" },
    { class: "from-pink-500 to-rose-500", label: "Warm rose" },
    { class: "from-amber-500 to-orange-500", label: "Sunset fire" },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Username and password are required.");
      return;
    }

    const storedUsers = localStorage.getItem("sphere_users");
    const users = storedUsers ? JSON.parse(storedUsers) : {};

    const existingUser = users[username.toLowerCase().trim()];
    if (!existingUser || existingUser.password !== password) {
      setError("Invalid username or password. Please try again or sign up.");
      return;
    }

    // Success login
    const session: UserSession = {
      id: existingUser.id,
      username: existingUser.username,
      fullName: existingUser.fullName,
      avatarColor: existingUser.avatarColor,
      bio: existingUser.bio,
      registeredAt: existingUser.registeredAt,
    };

    localStorage.setItem("sphere_current_session", JSON.stringify(session));
    onLoginSuccess(session);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formattedUsername = username.toLowerCase().trim();

    if (!username.trim() || !password || !fullName.trim()) {
      setError("All fields are required.");
      return;
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }

    if (password.length < 5) {
      setError("Password must be at least 5 characters.");
      return;
    }

    const storedUsers = localStorage.getItem("sphere_users");
    const users = storedUsers ? JSON.parse(storedUsers) : {};

    if (users[formattedUsername]) {
      setError("Username already exists. Please choose another.");
      return;
    }

    // Create user
    const newUser = {
      id: "usr-" + Math.random().toString(36).substr(2, 9),
      username: username.trim(),
      password: password, // Simple client security
      fullName: fullName.trim(),
      bio: bio.trim() || "A purposeful planner charting paths.",
      avatarColor,
      registeredAt: new Date().toISOString(),
    };

    users[formattedUsername] = newUser;
    localStorage.setItem("sphere_users", JSON.stringify(users));

    setSuccess("Registration successful! Redirecting to login...");
    setTimeout(() => {
      setIsLogin(true);
      setSuccess("");
      setError("");
    }, 1500);
  };

  return (
    <div
      id="auth-screen"
      className="min-h-screen flex items-center justify-center bg-[#0f172a] overflow-hidden relative selection:bg-[#38bdf8] selection:text-[#0f172a]"
    >
      {/* Decorative vector background circles */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-[#38bdf8]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#10b981]/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

      <div className="w-full max-w-sm mx-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#111827] border border-[#334155] rounded shadow-2xl p-6.5 relative overflow-hidden"
        >
          {/* Accent top gradient bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#38bdf8] to-[#10b981]"></div>

          {/* Logo Heading */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center p-2.5 rounded bg-[#38bdf8]/10 border border-[#38bdf8]/20 text-[#38bdf8] mb-2.5">
              <Compass className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-mono font-bold text-white tracking-widest uppercase">
              SPHERE
            </h1>
            <p className="text-slate-400 text-[10px] uppercase font-mono mt-0.5 tracking-wider">
              Design Your Future • Connect Your Circles
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex bg-[#0f172a] p-1 rounded mb-5 border border-[#334155]/60">
            <button
              id="tab-login"
              type="button"
              onClick={() => {
                setIsLogin(true);
                setError("");
                setSuccess("");
              }}
              className={`flex-1 py-1.5 text-xs font-bold font-mono rounded transition-all duration-200 uppercase ${
                isLogin
                  ? "bg-[#1e293b] text-[#38bdf8] border border-[#334155] shadow-xs"
                  : "text-slate-400 hover:text-slate-205"
              }`}
            >
              Access Portal
            </button>
            <button
              id="tab-register"
              type="button"
              onClick={() => {
                setIsLogin(false);
                setError("");
                setSuccess("");
              }}
              className={`flex-1 py-1.5 text-xs font-bold font-mono rounded transition-all duration-200 uppercase ${
                !isLogin
                  ? "bg-[#1e293b] text-[#38bdf8] border border-[#334155] shadow-xs"
                  : "text-slate-400 hover:text-slate-205"
              }`}
            >
              Sign Up Guild
            </button>
          </div>

          {/* Error and Success alerts */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-2.5 bg-rose-500/10 border border-rose-500/25 text-rose-400 rounded text-[11px] leading-snug font-mono"
            >
              <span className="font-bold">Error:</span> {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-2.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded text-[11px] leading-snug font-mono flex items-center gap-1.5"
            >
              <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 text-emerald-400" />
              <span>{success}</span>
            </motion.div>
          )}

          {/* Active form panels */}
          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Username Handle
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 font-mono text-xs">
                    @
                  </span>
                  <input
                    id="login-username"
                    type="text"
                    required
                    placeholder="alex_ventures"
                    className="w-full bg-[#0f172a] border border-[#334155] rounded pl-8 p-2 text-white text-xs focus:outline-none focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8] transition-all font-mono"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Secure Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <Key className="w-3.5 h-3.5" />
                  </span>
                  <input
                    id="login-password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-[#0f172a] border border-[#334155] rounded pl-8.5 p-2 text-white text-xs focus:outline-none focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8] transition-all font-mono"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                id="btn-login-submit"
                type="submit"
                className="w-full py-2.5 bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0f172a] font-bold text-xs rounded flex items-center justify-center gap-1.5 shadow-sm cursor-pointer active:scale-95 transition-all mt-5 uppercase tracking-wide font-mono"
              >
                <LogIn className="w-3.5 h-3.5" /> Verify Credentials
              </button>

              <div className="text-center pt-3 border-t border-[#334155]/60 text-[9px] text-slate-500 leading-relaxed font-mono uppercase tracking-wider">
                🛡️ Verified Local Client Security Active
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider mb-1">
                    Real Name / Handle
                  </label>
                  <input
                    id="register-fullname"
                    type="text"
                    required
                    placeholder="Alex Mercer"
                    className="w-full bg-[#0f172a] border border-[#334155] rounded p-2 text-white text-xs focus:outline-none focus:border-[#38bdf8] transition-all font-mono"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider mb-1">
                    Login User
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-500 text-[10px] font-mono">
                      @
                    </span>
                    <input
                      id="register-username"
                      type="text"
                      required
                      placeholder="alex_m"
                      className="w-full bg-[#0f172a] border border-[#334155] rounded pl-5.5 p-2 text-white text-xs focus:outline-none focus:border-[#38bdf8] transition-all font-mono"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <input
                    id="register-password"
                    type="password"
                    required
                    placeholder="min. 5 chars"
                    className="w-full bg-[#0f172a] border border-[#334155] rounded p-2 text-white text-xs focus:outline-none focus:border-[#38bdf8] transition-all font-mono"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Short Bio of Purpose
                </label>
                <textarea
                  id="register-bio"
                  placeholder="E.g., Aspiring software lead, family focal point."
                  rows={2}
                  className="w-full bg-[#0f172a] border border-[#334155] rounded p-2 text-white text-xs focus:outline-none focus:border-[#38bdf8] resize-none font-mono"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Sphere Identity Theme
                </label>
                <div className="flex gap-2 justify-between mt-1">
                  {colors.map((c) => (
                    <button
                      key={c.class}
                      type="button"
                      title={c.label}
                      className={`w-6 h-6 rounded bg-gradient-to-tr ${c.class} cursor-pointer transition-all duration-200 border ${
                        avatarColor === c.class
                          ? "border-white scale-110 shadow-lg"
                          : "border-transparent opacity-50 hover:opacity-90"
                      }`}
                      onClick={() => setAvatarColor(c.class)}
                    />
                  ))}
                </div>
              </div>

              <button
                id="btn-register-submit"
                type="submit"
                className="w-full py-2.5 bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0f172a] font-bold text-xs rounded flex items-center justify-center gap-1.5 shadow-sm cursor-pointer active:scale-95 transition-all mt-4 uppercase tracking-wide font-mono"
              >
                <UserPlus className="w-3.5 h-3.5" /> Instantiate Account
              </button>
            </form>
          )}
        </motion.div>

        {/* Demo Account Tip */}
        <p className="text-center text-[9px] uppercase tracking-wide text-slate-500 mt-4 leading-relaxed font-mono">
          🔒 SPHERE ISOLATED LOCAL STORAGE MODE ACTIVED
        </p>
      </div>
    </div>
  );
}
