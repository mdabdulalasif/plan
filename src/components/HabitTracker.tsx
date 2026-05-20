import React, { useState } from "react";
import {
  Check,
  Flame,
  Plus,
  Calendar,
  BadgeAlert,
  Award,
  Star,
  Trophy,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Habit } from "../types";

interface HabitTrackerProps {
  habits: Habit[];
  onUpdateHabits: (updated: Habit[]) => void;
  onShareToCommunity: (
    content: string,
    type: "Habit Milestone",
    refTag: string,
  ) => void;
}

export default function HabitTracker({
  habits,
  onUpdateHabits,
  onShareToCommunity,
}: HabitTrackerProps) {
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<Habit["category"]>("Wellness");
  const [isAdding, setIsAdding] = useState(false);

  const categories: Habit["category"][] = [
    "Wellness",
    "Intellect",
    "Productivity",
    "Connection",
    "Creation",
  ];

  // Helper: Get list of previous 7 dates (ending in today) formatted as strings
  const getPastWeekDates = (): string[] => {
    const dates = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      dates.push(d.toISOString().split("T")[0]);
    }
    return dates;
  };

  const weekDates = getPastWeekDates();

  // Helper: Print nicely formatted short weekdays (e.g. "Mon 20")
  const formatWeekDay = (dateStr: string): string => {
    const date = new Date(dateStr);
    const day = date.toLocaleDateString("en-US", { weekday: "short" });
    const num = date.getDate();
    return `${day} ${num}`;
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newHabit: Habit = {
      id: "habit-" + Math.random().toString(36).substr(2, 9),
      userId: "current",
      name: newName.trim(),
      category: newCategory,
      streak: 0,
      bestStreak: 0,
      history: [],
      createdAt: new Date().toISOString(),
    };

    const updated = [...habits, newHabit];
    onUpdateHabits(updated);

    onShareToCommunity(
      `Set a recurring daily dedication habit: "${newHabit.name}" in the ${newHabit.category} category. Accountability drives consistency!`,
      "Habit Milestone",
      newHabit.category,
    );

    setNewName("");
    setNewCategory("Wellness");
    setIsAdding(false);
  };

  const toggleHabitHistory = (habitId: string, dateStr: string) => {
    const updated = habits.map((h) => {
      if (h.id !== habitId) return h;

      const isCompleted = h.history.includes(dateStr);
      let newHistory = [...h.history];

      if (isCompleted) {
        newHistory = newHistory.filter((d) => d !== dateStr);
      } else {
        newHistory.push(dateStr);
      }

      // Recalculate streak based on sequential history
      // Quick approximation for streaks: Sort history descending, count continuous days back from today
      const sortedDates = [...newHistory].sort(
        (a, b) => new Date(b).getTime() - new Date(a).getTime(),
      );

      let calcStreak = 0;
      let checkDate = new Date(); // start checking from today

      // If we did it today OR yesterday, count continuous days
      const todayStr = checkDate.toISOString().split("T")[0];
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      if (
        sortedDates.includes(todayStr) ||
        sortedDates.includes(yesterdayStr)
      ) {
        let currentCheckStr = sortedDates.includes(todayStr)
          ? todayStr
          : yesterdayStr;
        calcStreak = 0;

        // Loop backward checking continuous days
        let checking = true;
        const streakDate = new Date(currentCheckStr);
        while (checking) {
          const checkStr = streakDate.toISOString().split("T")[0];
          if (newHistory.includes(checkStr)) {
            calcStreak++;
            streakDate.setDate(streakDate.getDate() - 1);
          } else {
            checking = false;
          }
        }
      } else {
        calcStreak = 0;
      }

      const bestStreak = Math.max(h.bestStreak, calcStreak);

      // Social trigger on landmark streak multiples!
      if (calcStreak > 0 && calcStreak % 3 === 0 && !isCompleted) {
        setTimeout(() => {
          onShareToCommunity(
            `🔥 Habit Streak Milestone! I just scored a ${calcStreak}-day streak on my "${h.name}" daily habit! Staying dedicated.`,
            "Habit Milestone",
            h.category,
          );
        }, 300);
      }

      return {
        ...h,
        history: newHistory,
        streak: calcStreak,
        bestStreak,
      };
    });

    onUpdateHabits(updated);
  };

  const deleteHabit = (habitId: string) => {
    if (
      confirm("Verify: Remove this habit tracker? Past stats will be cleared.")
    ) {
      onUpdateHabits(habits.filter((h) => h.id !== habitId));
    }
  };

  // Stats summaries
  const totalStreaks = habits.reduce((max, h) => Math.max(max, h.streak), 0);
  const totalCompletedToday = habits.filter((h) =>
    h.history.includes(new Date().toISOString().split("T")[0]),
  ).length;
  const totalPointsEarned = habits.reduce(
    (sum, h) => sum + h.history.length * 15 + h.streak * 50,
    0,
  );

  return (
    <div className="space-y-5 text-slate-200">
      {/* Habits Streaks Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          id="stat-habit-streak"
          className="bg-[#111827] p-4.5 rounded border border-[#334155] flex items-center justify-between"
        >
          <div>
            <span className="text-slate-400 font-bold text-[10px] font-mono uppercase tracking-wider block">
              Max Burning Streak
            </span>
            <span className="text-2xl font-mono font-bold text-white mt-1 block">
              {totalStreaks} days
            </span>
          </div>
          <div className="p-2.5 bg-amber-500/10 rounded text-amber-500 border border-amber-500/20">
            <Flame className="w-6 h-6 fill-amber-500/10" />
          </div>
        </div>

        <div
          id="stat-habit-count"
          className="bg-[#111827] p-4.5 rounded border border-[#334155] flex items-center justify-between"
        >
          <div>
            <span className="text-slate-400 font-bold text-[10px] font-mono uppercase tracking-wider block">
              Today Completions
            </span>
            <span className="text-2xl font-mono font-bold text-[#38bdf8] mt-1 block">
              {totalCompletedToday}{" "}
              <span className="text-xs text-slate-500 font-normal">
                / {habits.length} habits
              </span>
            </span>
          </div>
          <div className="p-2.5 bg-[#38bdf8]/10 rounded text-[#38bdf8] border border-[#38bdf8]/20">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div
          id="stat-habit-experience"
          className="bg-[#111827] p-4.5 rounded border border-[#334155] flex items-center justify-between"
        >
          <div>
            <span className="text-slate-400 font-bold text-[10px] font-mono uppercase tracking-wider block">
              Tracker Experience Gained
            </span>
            <span className="text-2xl font-mono font-bold text-[#10b981] mt-1 block">
              {totalPointsEarned} XP
            </span>
          </div>
          <div className="p-2.5 bg-[#10b981]/10 rounded text-[#10b981] border border-[#10b981]/20">
            <Trophy className="w-6 h-6 fill-[#10b981]/10" />
          </div>
        </div>
      </div>

      {/* Control bar */}
      <div className="bg-[#111827] p-3.5 rounded border border-[#334155] flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="font-mono font-bold text-white text-xs uppercase tracking-wider">
            Habit Loop Tracking Console
          </h4>
          <p className="text-[10px] text-slate-500 leading-normal font-mono">
            Consistently checking off items unlocks community progress shares.
          </p>
        </div>

        <button
          id="btn-trigger-add-habit"
          onClick={() => setIsAdding(!isAdding)}
          className="px-3 py-1.5 bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0f172a] font-bold font-mono text-[10px] uppercase rounded flex items-center gap-1 transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" /> Initialize Habit
        </button>
      </div>

      {/* Expandable Add Habit */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form
              onSubmit={handleAddHabit}
              className="bg-[#111827] p-5 rounded border border-[#334155] space-y-4 mb-4"
            >
              <div className="flex-1 space-y-3">
                <span className="text-[10px] font-bold text-[#38bdf8] uppercase tracking-widest font-mono flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Configure Habit Anchor
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                      Habit Action Name
                    </label>
                    <input
                      id="habit-input-name"
                      type="text"
                      required
                      placeholder="E.g., Read technical journals for 30 mins"
                      className="w-full text-xs bg-[#1e293b] text-white border border-[#334155] rounded p-2 focus:outline-none"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                      Category Domain
                    </label>
                    <div className="flex gap-1 bg-[#0f172a] p-0.5 rounded border border-[#334155]">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setNewCategory(cat)}
                          className={`flex-1 py-1 px-1.5 text-[9px] font-mono rounded transition-all ${
                            newCategory === cat
                              ? "bg-[#1e293b] text-[#38bdf8] border border-[#334155] font-bold"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 border border-[#334155] hover:bg-[#1e293b] text-slate-350 rounded text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  id="btn-add-habit-submit"
                  type="submit"
                  className="px-4 py-1.5 bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0f172a] rounded text-xs font-bold font-mono"
                >
                  Instantiate Tracker
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Habits List Grid layout */}
      {habits.length === 0 ? (
        <div className="bg-[#111827] border border-[#334155] rounded p-12 text-center text-slate-550 space-y-3">
          <BadgeAlert className="w-12 h-12 mx-auto text-slate-600 stroke-1" />
          <p className="font-mono font-bold text-slate-300 uppercase tracking-widest text-xs">
            No habit anchors defined
          </p>
          <p className="text-xs max-w-sm mx-auto text-slate-500">
            Build daily habits to fuel your progress and keep yourself
            accountable with other community members.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {habits.map((habit) => {
            const todayStr = new Date().toISOString().split("T")[0];
            const completedToday = habit.history.includes(todayStr);

            return (
              <div
                key={habit.id}
                className="bg-[#1e293b] rounded border border-[#334155] p-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 hover:border-[#38bdf8]/30 transition-all duration-300"
              >
                {/* Details left */}
                <div className="space-y-1.5 max-w-sm">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 text-[9px] font-mono bg-[#0f172a] text-[#38bdf8] border border-[#334155] rounded">
                      {habit.category}
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono">
                      START: {new Date(habit.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h5 className="font-sans font-bold text-white text-sm leading-snug">
                    {habit.name}
                  </h5>
                </div>

                {/* Tracking Calendar Panel */}
                <div className="flex flex-wrap items-center gap-4">
                  {/* Calendar row past 7 days */}
                  <div className="flex items-center gap-1 bg-[#0f172a] p-1 rounded border border-[#334155]/60">
                    {weekDates.map((dateStr) => {
                      const isDone = habit.history.includes(dateStr);
                      const isToday = dateStr === todayStr;
                      const dayLabel = formatWeekDay(dateStr);

                      return (
                        <button
                          key={dateStr}
                          id={`btn-habit-${habit.id}-day-${dateStr}`}
                          type="button"
                          onClick={() => toggleHabitHistory(habit.id, dateStr)}
                          className={`flex flex-col items-center p-1 w-11 rounded transition-all ${
                            isDone
                              ? "bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30"
                              : isToday
                                ? "bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/20"
                                : "text-slate-500 hover:bg-[#1e293b]"
                          }`}
                        >
                          <span className="text-[8px] font-mono font-bold leading-none mb-1.5">
                            {dayLabel}
                          </span>
                          <span
                            className={`w-4.5 h-4.5 rounded-full flex items-center justify-center border transition-all ${
                              isDone
                                ? "bg-[#10b981] text-[#0f172a] border-[#10b981]"
                                : "bg-[#1e293b] text-slate-500 border-[#334155] hover:border-slate-400"
                            }`}
                          >
                            {isDone && (
                              <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Flame indicator streaks */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 px-2.5 py-1.5 bg-[#111827] rounded border border-[#334155]/60 text-amber-500 font-mono">
                      <Flame className="w-3.5 h-3.5 fill-amber-550/10" />
                      <span className="text-[11px] font-bold leading-none">
                        {habit.streak}d
                      </span>
                    </div>

                    <div
                      className="flex items-center gap-1 px-2 py-1.5 bg-[#111827] rounded border border-[#334155]/40 text-slate-400 font-mono"
                      title="Best Streak record"
                    >
                      <Award className="w-3.5 h-3.5 text-[#38bdf8]" />
                      <span className="text-[9px] font-semibold leading-none">
                        BEST: {habit.bestStreak}d
                      </span>
                    </div>

                    <button
                      id={`btn-delete-habit-${habit.id}`}
                      type="button"
                      onClick={() => deleteHabit(habit.id)}
                      className="text-slate-500 hover:text-rose-500 p-1"
                    >
                      <Check className="w-4 h-4 rotate-45" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
