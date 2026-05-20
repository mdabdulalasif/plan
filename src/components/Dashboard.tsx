import React, { useState, useEffect } from "react";
import {
  Compass,
  Target,
  Radio,
  Users,
  CalendarCheck,
  LogOut,
  Sparkles,
  Trophy,
  Award,
  BookOpen,
  Quote,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  UserSession,
  FuturePlan,
  Contact,
  Habit,
  CommunityPost,
} from "../types";
import {
  DEFAULT_POSTS,
  INITIAL_PLANS,
  INITIAL_CONTACTS,
  INITIAL_HABITS,
} from "../mockData";
import PlansManager from "./PlansManager";
import CircleManager from "./CircleManager";
import HabitTracker from "./HabitTracker";
import CommunityPlatform from "./CommunityPlatform";

interface DashboardProps {
  session: UserSession;
  onLogout: () => void;
}

export default function Dashboard({ session, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<
    "plans" | "circle" | "habits" | "community"
  >("plans");

  // Loaded states per user
  const [plans, setPlans] = useState<FuturePlan[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);

  // Inspirational Quote
  const [quoteIdx] = useState(() => Math.floor(Math.random() * 3));
  const quotes = [
    {
      text: "The future belongs to those who plan for it today and protect the circles that inspire them.",
      author: "E. Vance",
    },
    {
      text: "A vision without daily habit repetitions is merely a hallucination.",
      author: "M. Aurel",
    },
    {
      text: "Proximity governs progress. Curate your connections as carefully as your goals.",
      author: "S. Jenkins",
    },
  ];

  // Load datasets on start
  useEffect(() => {
    const userKey = session.username.toLowerCase();

    // 1. Future Plans
    const storedPlans = localStorage.getItem(`sphere_plans_${userKey}`);
    if (storedPlans) {
      setPlans(JSON.parse(storedPlans));
    } else {
      const defaultPlans = INITIAL_PLANS(session.id);
      setPlans(defaultPlans);
      localStorage.setItem(
        `sphere_plans_${userKey}`,
        JSON.stringify(defaultPlans),
      );
    }

    // 2. Contacts CRM Circle
    const storedContacts = localStorage.getItem(`sphere_contacts_${userKey}`);
    if (storedContacts) {
      setContacts(JSON.parse(storedContacts));
    } else {
      const defaultContacts = INITIAL_CONTACTS(session.id);
      setContacts(defaultContacts);
      localStorage.setItem(
        `sphere_contacts_${userKey}`,
        JSON.stringify(defaultContacts),
      );
    }

    // 3. Daily Habits
    const storedHabits = localStorage.getItem(`sphere_habits_${userKey}`);
    if (storedHabits) {
      setHabits(JSON.parse(storedHabits));
    } else {
      const defaultHabits = INITIAL_HABITS(session.id);
      setHabits(defaultHabits);
      localStorage.setItem(
        `sphere_habits_${userKey}`,
        JSON.stringify(defaultHabits),
      );
    }

    // 4. Global Community Feed
    const storedPosts = localStorage.getItem("sphere_posts");
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    } else {
      setPosts(DEFAULT_POSTS);
      localStorage.setItem("sphere_posts", JSON.stringify(DEFAULT_POSTS));
    }
  }, [session]);

  // Persistent writes helper functions
  const handleUpdatePlans = (updatedPlans: FuturePlan[]) => {
    setPlans(updatedPlans);
    localStorage.setItem(
      `sphere_plans_${session.username.toLowerCase()}`,
      JSON.stringify(updatedPlans),
    );
  };

  const handleUpdateContacts = (updatedContacts: Contact[]) => {
    setContacts(updatedContacts);
    localStorage.setItem(
      `sphere_contacts_${session.username.toLowerCase()}`,
      JSON.stringify(updatedContacts),
    );
  };

  const handleUpdateHabits = (updatedHabits: Habit[]) => {
    setHabits(updatedHabits);
    localStorage.setItem(
      `sphere_habits_${session.username.toLowerCase()}`,
      JSON.stringify(updatedHabits),
    );
  };

  const handleUpdatePosts = (updatedPosts: CommunityPost[]) => {
    setPosts(updatedPosts);
    localStorage.setItem("sphere_posts", JSON.stringify(updatedPosts));
  };

  // Cross-module interaction: Trigger auto-post inside community when landmarks/checkups are logged
  const handleTriggerCommunityShare = (
    content: string,
    type: CommunityPost["type"],
    refTag: string,
  ) => {
    const freshPost: CommunityPost = {
      id: "post-" + Math.random().toString(36).substr(2, 9),
      userId: session.id,
      authorName: session.fullName,
      authorAvatarColor: session.avatarColor,
      authorRole: session.bio || "Sphere Elite Member",
      content,
      type,
      likes: 0,
      likedBy: [],
      comments: [],
      timestamp: new Date().toISOString(),
      refTag,
    };

    const storedPosts = localStorage.getItem("sphere_posts");
    const existingPostsList = storedPosts
      ? JSON.parse(storedPosts)
      : DEFAULT_POSTS;
    const newPostsSet = [freshPost, ...existingPostsList];
    setPosts(newPostsSet);
    localStorage.setItem("sphere_posts", JSON.stringify(newPostsSet));
  };

  // Cross-module interaction: Fast log a contact checkup in CRM from inside community targets
  const handleQuickLogMeeting = (contactId: string) => {
    const today = new Date().toISOString().split("T")[0];
    const updated = contacts.map((c) => {
      if (c.id !== contactId) return c;
      const milestoneNote = {
        id: "note-" + Math.random().toString(36).substr(2, 9),
        date: today,
        content:
          "Logged deep networking cup checkup inside Community Hub portal!",
      };
      return {
        ...c,
        lastContactDate: today,
        notes: [milestoneNote, ...c.notes],
      };
    });
    handleUpdateContacts(updated);
  };

  const targetConnects = contacts.filter(
    (c) => c.category === "Target Connect",
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col font-sans selection:bg-[#38bdf8] selection:text-slate-950">
      {/* Universal Top Nav Header */}
      <header className="bg-[#0f172a] border-b border-[#334155] text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#38bdf8] text-[#0f172a] rounded-md flex items-center justify-center font-black text-sm">
              N
            </div>
            <div>
              <span className="text-[9px] font-bold tracking-widest font-mono text-slate-400 block -mb-0.5 leading-none">
                NEXUS SYSTEM INTEGRATOR
              </span>
              <h1 className="text-base font-display font-bold tracking-tight text-white uppercase flex items-center gap-1.5">
                Sphere Hub{" "}
                <span className="text-[#38bdf8] text-xs font-light font-mono lowercase">
                  v1.4
                </span>
              </h1>
            </div>
          </div>

          {/* Connected User Badge & Logout & High-Density security details */}
          <div className="flex items-center gap-4">
            <div className="hidden md:inline-flex bg-[rgba(16,185,129,0.1)] border border-[#10b981] text-[#10b981] text-[9px] font-semibold tracking-wider font-mono uppercase rounded-full px-2.5 py-1">
              AES-256 ENCRYPTED SESSION
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex text-right flex-col">
                <span className="text-xs font-semibold text-slate-200">
                  {session.fullName}
                </span>
                <span className="text-[10px] text-[#38bdf8] font-mono">
                  ID: #{session.username}
                </span>
              </div>

              <div
                className={`w-8 h-8 rounded bg-gradient-to-tr ${session.avatarColor} flex items-center justify-center text-white text-[11px] font-bold font-mono shadow-inner border border-[#334155]`}
                title={session.fullName}
              >
                {session.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)}
              </div>

              <button
                id="btn-logout"
                onClick={onLogout}
                className="p-1.5 sm:p-2 bg-[#1e293b] hover:bg-rose-950/40 hover:text-rose-400 text-slate-400 border border-[#334155] rounded transition-all cursor-pointer active:scale-95"
                title="Logout session"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Inspirational Quotes & Dynamic Widgets bar */}
      <section className="bg-[#111827] border-b border-[#334155] py-2.5 px-4">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-400 leading-relaxed">
            <Quote className="w-3.5 h-3.5 text-[#38bdf8] flex-shrink-0" />
            <p className="tracking-wide">
              &ldquo;{quotes[quoteIdx].text}&rdquo; &mdash;{" "}
              <span className="font-mono text-slate-300 text-[11px]">
                {quotes[quoteIdx].author}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#1e293b] py-0.5 px-2.5 rounded border border-[#334155] text-[9px] text-[#94a3b8] font-mono tracking-wide">
            <ShieldCheck className="w-3 h-3 text-[#10b981]" />
            <span>SECURE SYSTEM METADATA CONTAINER LIVE</span>
          </div>
        </div>
      </section>

      {/* Main Interactive Workspaces */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        {/* Navigation Tabs bar - high density grid style */}
        <div className="bg-[#111827] p-1.5 rounded-lg border border-[#334155] shadow-inner flex flex-wrap gap-1">
          <button
            id="tab-plans-manager"
            onClick={() => setActiveTab("plans")}
            className={`flex items-center justify-center gap-2 flex-1 min-w-32 py-2 px-3 rounded font-mono font-semibold text-[11px] uppercase tracking-wider transition-all duration-200 ${
              activeTab === "plans"
                ? "bg-[#1e293b] text-[#38bdf8] border border-[#334155]"
                : "text-slate-400 hover:bg-[#1e293b]/50 hover:text-white"
            }`}
          >
            <Target className="w-3.5 h-3.5" /> Future Plan Matrix
          </button>

          <button
            id="tab-circle-manager"
            onClick={() => setActiveTab("circle")}
            className={`flex items-center justify-center gap-2 flex-1 min-w-32 py-2 px-3 rounded font-mono font-semibold text-[11px] uppercase tracking-wider transition-all duration-200 ${
              activeTab === "circle"
                ? "bg-[#1e293b] text-[#38bdf8] border border-[#334155]"
                : "text-slate-400 hover:bg-[#1e293b]/50 hover:text-white"
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Contact Directory
          </button>

          <button
            id="tab-habit-tracker"
            onClick={() => setActiveTab("habits")}
            className={`flex items-center justify-center gap-2 flex-1 min-w-32 py-2 px-3 rounded font-mono font-semibold text-[11px] uppercase tracking-wider transition-all duration-200 ${
              activeTab === "habits"
                ? "bg-[#1e293b] text-[#38bdf8] border border-[#334155]"
                : "text-slate-400 hover:bg-[#1e293b]/50 hover:text-white"
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5" /> Habit Analytics
          </button>

          <button
            id="tab-community-platform"
            onClick={() => setActiveTab("community")}
            className={`flex items-center justify-center gap-2 flex-1 min-w-32 py-2 px-3 rounded font-mono font-semibold text-[11px] uppercase tracking-wider transition-all duration-200 ${
              activeTab === "community"
                ? "bg-[#1e293b] text-[#38bdf8] border border-[#334155]"
                : "text-slate-400 hover:bg-[#1e293b]/50 hover:text-white"
            }`}
          >
            <Radio className="w-3.5 h-3.5" /> Community Forum
          </button>
        </div>

        {/* Tab views with Smooth motion entrances */}
        <div className="min-h-96">
          <AnimatePresence mode="wait">
            {activeTab === "plans" && (
              <motion.div
                key="tab-plans"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <PlansManager
                  plans={plans}
                  onUpdatePlans={handleUpdatePlans}
                  onShareToCommunity={handleTriggerCommunityShare}
                />
              </motion.div>
            )}

            {activeTab === "circle" && (
              <motion.div
                key="tab-circle"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <CircleManager
                  contacts={contacts}
                  onUpdateContacts={handleUpdateContacts}
                  onShareToCommunity={handleTriggerCommunityShare}
                />
              </motion.div>
            )}

            {activeTab === "habits" && (
              <motion.div
                key="tab-habits"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <HabitTracker
                  habits={habits}
                  onUpdateHabits={handleUpdateHabits}
                  onShareToCommunity={handleTriggerCommunityShare}
                />
              </motion.div>
            )}

            {activeTab === "community" && (
              <motion.div
                key="tab-community"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <CommunityPlatform
                  posts={posts}
                  onUpdatePosts={handleUpdatePosts}
                  currentUser={session}
                  targetConnects={targetConnects}
                  onQuickLogMeeting={handleQuickLogMeeting}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Universal humble footer */}
      <footer className="bg-[#0f172a] border-t border-[#334155] text-slate-500 py-6 text-center text-[10px] tracking-wider uppercase font-mono mt-12">
        <p>© 2026 NEXUS PLATFORM • Sphere Core Integrated Systems</p>
      </footer>
    </div>
  );
}
