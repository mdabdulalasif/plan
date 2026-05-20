import React, { useState } from "react";
import {
  Target,
  PlusCircle,
  CheckSquare,
  Square,
  Calendar,
  ChevronRight,
  MessageSquare,
  Trash2,
  Edit3,
  TrendingUp,
  Sparkles,
  Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { FuturePlan, Milestone } from "../types";

interface PlansManagerProps {
  plans: FuturePlan[];
  onUpdatePlans: (updated: FuturePlan[]) => void;
  onShareToCommunity: (
    content: string,
    type: "Plan Shared" | "Goal Met",
    refTag: string,
  ) => void;
}

export default function PlansManager({
  plans,
  onUpdatePlans,
  onShareToCommunity,
}: PlansManagerProps) {
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState("Career");
  const [newTargetDate, setNewTargetDate] = useState("2026-12-31");
  const [newMilestones, setNewMilestones] = useState<string[]>([""]);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState("");

  const categories = ["Career", "Personal", "Financial", "Learning", "Health"];
  const statuses = ["Planning", "In Progress", "Completed", "Deferred"];

  const handleAddPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    // Filter out blank milestones
    const ms: Milestone[] = newMilestones
      .filter((m) => m.trim() !== "")
      .map((title) => ({
        id: "ms-" + Math.random().toString(36).substr(2, 9),
        title: title.trim(),
        completed: false,
      }));

    const newPlan: FuturePlan = {
      id: "plan-" + Math.random().toString(36).substr(2, 9),
      userId: "current",
      title: newTitle.trim(),
      description: newDesc.trim() || "No description provided.",
      category: newCategory,
      targetDate: newTargetDate,
      progress: 0,
      status: "Planning",
      milestones: ms,
      reflections: "",
      createdAt: new Date().toISOString(),
    };

    const updated = [newPlan, ...plans];
    onUpdatePlans(updated);

    // Automatically post about it in the mock community!
    onShareToCommunity(
      `Mapped out a brand new future roadmap plan: "${newPlan.title}" (${newPlan.category} category) aimed for completion by ${newPlan.targetDate}. Let's work hard!`,
      "Plan Shared",
      newPlan.category,
    );

    // Reset Form
    setNewTitle("");
    setNewDesc("");
    setNewCategory("Career");
    setNewTargetDate("2026-12-31");
    setNewMilestones([""]);
    setIsAdding(false);
  };

  const handleAddMilestoneInput = () => {
    setNewMilestones([...newMilestones, ""]);
  };

  const handleMilestoneInputChange = (index: number, val: string) => {
    const copy = [...newMilestones];
    copy[index] = val;
    setNewMilestones(copy);
  };

  const handleRemoveMilestoneInput = (index: number) => {
    if (newMilestones.length === 1) {
      setNewMilestones([""]);
    } else {
      setNewMilestones(newMilestones.filter((_, i) => i !== index));
    }
  };

  const toggleMilestone = (planId: string, milestoneId: string) => {
    const updated = plans.map((p) => {
      if (p.id !== planId) return p;

      const updatedMilestones = p.milestones.map((m) => {
        if (m.id !== milestoneId) return m;
        return { ...m, completed: !m.completed };
      });

      // Recalculate automatic progress based on completed milestones
      const total = updatedMilestones.length;
      const completed = updatedMilestones.filter((m) => m.completed).length;
      const progress =
        total === 0 ? p.progress : Math.round((completed / total) * 100);

      // Handle automatic completion status transition
      let status = p.status;
      if (progress === 100 && p.status !== "Completed") {
        status = "Completed";
        setTimeout(() => {
          onShareToCommunity(
            `🚀 Landmark achievement! I fully finished all milestones for my future plan "${p.title}"! Grateful for the energy.`,
            "Goal Met",
            p.category,
          );
        }, 300);
      } else if (progress < 100 && p.status === "Completed") {
        status = "In Progress";
      }

      return {
        ...p,
        milestones: updatedMilestones,
        progress,
        status,
      } as FuturePlan;
    });

    onUpdatePlans(updated);
  };

  const updateManualProgress = (planId: string, val: number) => {
    const updated = plans.map((p) => {
      if (p.id !== planId) return p;
      let status = p.status;
      if (val === 100 && p.status !== "Completed") {
        status = "Completed";
      } else if (val < 100 && p.status === "Completed") {
        status = "In Progress";
      }
      return { ...p, progress: val, status };
    });
    onUpdatePlans(updated);
  };

  const updatePlanStatus = (planId: string, status: FuturePlan["status"]) => {
    const updated = plans.map((p) => {
      if (p.id !== planId) return p;
      return { ...p, status };
    });
    onUpdatePlans(updated);
  };

  const saveReflections = (planId: string) => {
    const updated = plans.map((p) => {
      if (p.id !== planId) return p;
      return { ...p, reflections: tempNotes };
    });
    onUpdatePlans(updated);
    setActivePlanId(null);
  };

  const deletePlan = (planId: string) => {
    if (
      confirm(
        "Are you sure you want to remove this future plan from your roadmap?",
      )
    ) {
      onUpdatePlans(plans.filter((p) => p.id !== planId));
    }
  };

  const filteredPlans = plans.filter((p) => {
    const matchCat = filterCategory === "All" || p.category === filterCategory;
    const matchStat = filterStatus === "All" || p.status === filterStatus;
    return matchCat && matchStat;
  });

  // Calculate statistics
  const totalCount = plans.length;
  const completedCount = plans.filter((p) => p.status === "Completed").length;
  const activeCount = plans.filter((p) => p.status === "In Progress").length;
  const averageProgress =
    totalCount === 0
      ? 0
      : Math.round(plans.reduce((sum, p) => sum + p.progress, 0) / totalCount);

  return (
    <div className="space-y-5 text-slate-200">
      {/* Overview Bento Board */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div
          id="stat-total-plans"
          className="bg-[#1e293b] p-4 rounded border border-[#334155] flex flex-col justify-between"
        >
          <span className="text-slate-400 font-medium text-[10px] font-mono uppercase tracking-widest block">
            Roadmap Plans
          </span>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-2xl font-bold text-white tracking-tight">
              {totalCount}
            </span>
            <span className="text-[9px] text-slate-500 font-mono">
              active map
            </span>
          </div>
        </div>

        <div
          id="stat-active-plans"
          className="bg-[#1e293b] p-4 rounded border border-[#334155] flex flex-col justify-between"
        >
          <span className="text-slate-400 font-medium text-[10px] font-mono uppercase tracking-widest block">
            Active Execution
          </span>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-2xl font-bold text-[#38bdf8] tracking-tight">
              {activeCount}
            </span>
            <span className="text-[9px] text-[#10b981] font-mono font-medium uppercase">
              In Progress
            </span>
          </div>
        </div>

        <div
          id="stat-completed-plans"
          className="bg-[#1e293b] p-4 rounded border border-[#334155] flex flex-col justify-between"
        >
          <span className="text-slate-400 font-medium text-[10px] font-mono uppercase tracking-widest block">
            Plans Actualized
          </span>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-2xl font-bold text-[#10b981] tracking-tight">
              {completedCount}
            </span>
            <span className="text-[9px] text-slate-500 font-mono uppercase">
              {totalCount > 0
                ? Math.round((completedCount / totalCount) * 100)
                : 0}
              % success
            </span>
          </div>
        </div>

        <div
          id="stat-avg-progress"
          className="bg-[#1e293b] p-4 rounded border border-[#334155] flex flex-col justify-between"
        >
          <span className="text-slate-400 font-medium text-[10px] font-mono uppercase tracking-widest block">
            Avg Progress Depth
          </span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl font-bold text-[#38bdf8] tracking-tight font-mono">
              {averageProgress}%
            </span>
            <div className="w-16 bg-[#334155] rounded h-1 overflow-hidden self-center">
              <div
                className="bg-[#38bdf8] h-full"
                style={{ width: `${averageProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Header banner */}
      <div className="bg-[#111827] p-3.5 rounded border border-[#334155] flex flex-wrap items-center justify-between gap-3.5">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3 text-[#38bdf8]" /> Filters:
          </span>

          {/* Category selection */}
          <div className="flex gap-1 bg-[#0f172a] p-0.5 rounded border border-[#334155]">
            <button
              onClick={() => setFilterCategory("All")}
              className={`px-2.5 py-1 text-[10px] font-mono rounded transition-all ${
                filterCategory === "All"
                  ? "bg-[#1e293b] text-[#38bdf8] border border-[#334155]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              All Types
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 text-[10px] font-mono rounded transition-all ${
                  filterCategory === cat
                    ? "bg-[#1e293b] text-[#38bdf8] border border-[#334155]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Status selection */}
          <select
            id="filter-status-select"
            className="bg-[#0f172a] border border-[#334155] text-slate-300 px-2 py-1 text-[11px] font-mono rounded focus:outline-none focus:ring-1 focus:ring-[#38bdf8]"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All statuses</option>
            {statuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        <button
          id="btn-trigger-add-plan"
          onClick={() => setIsAdding(!isAdding)}
          className="px-3 py-1.5 bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0f172a] font-bold font-mono text-[10px] uppercase rounded flex items-center gap-1 transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <PlusCircle className="w-3.5 h-3.5" /> Initialize Plan
        </button>
      </div>

      {/* Expandable Add Plan Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form
              onSubmit={handleAddPlan}
              className="bg-[#111827] p-5 rounded border border-[#334155] space-y-4 mb-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-[#334155]">
                <h3 className="font-mono font-bold text-xs text-[#38bdf8] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Initialize Custom Future
                  Plan Entry
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-slate-400 hover:text-white text-xs font-mono"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                      Plan Title
                    </label>
                    <input
                      id="plan-input-title"
                      type="text"
                      required
                      placeholder="E.g., Complete AWS Cloud Architect Certification"
                      className="w-full text-xs bg-[#1e293b] text-white border border-[#334155] rounded p-2 focus:outline-none focus:ring-1 focus:ring-[#38bdf8] focus:border-[#38bdf8] transition-all font-medium"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                      Core Description / Vision
                    </label>
                    <textarea
                      id="plan-input-desc"
                      placeholder="Describe what success looks like in physical terms..."
                      rows={3}
                      className="w-full text-xs bg-[#1e293b] text-white border border-[#334155] rounded p-2 focus:outline-none focus:ring-1 focus:ring-[#38bdf8] focus:border-[#38bdf8] transition-all"
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                        Category
                      </label>
                      <select
                        id="plan-input-category"
                        className="w-full text-xs font-mono bg-[#1e293b] text-white border border-[#334155] rounded p-2"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                      >
                        {categories.map((c) => (
                          <option key={c} value={c} className="bg-[#111827]">
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                        Target Date
                      </label>
                      <input
                        id="plan-input-date"
                        type="date"
                        required
                        className="w-full text-xs font-mono bg-[#1e293b] text-white border border-[#334155] rounded p-2"
                        value={newTargetDate}
                        onChange={(e) => setNewTargetDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Milestones Building List */}
                <div className="bg-[#0f172a] p-4 rounded border border-[#334155] space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                        Plan Milestones
                      </label>
                      <button
                        id="btn-add-milestone-field"
                        type="button"
                        onClick={handleAddMilestoneInput}
                        className="text-[#38bdf8] hover:text-[#0ea5e9] text-[10px] font-bold font-mono uppercase"
                      >
                        + Add Milestone
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500 mb-2 leading-tight">
                      Divide this goal into sequential milestones to naturally
                      measure progress.
                    </p>

                    <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                      {newMilestones.map((m, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            id={`milestone-${idx}`}
                            type="text"
                            placeholder={`Milestone #${idx + 1}`}
                            className="flex-1 text-xs bg-[#1e293b] text-white border border-[#334155] rounded p-2 focus:outline-none"
                            value={m}
                            onChange={(e) =>
                              handleMilestoneInputChange(idx, e.target.value)
                            }
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveMilestoneInput(idx)}
                            className="text-slate-550 hover:text-rose-450 p-1 font-mono text-base"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    id="btn-add-plan-submit"
                    type="submit"
                    className="w-full py-2 px-3 bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0f172a] font-bold font-mono text-xs rounded uppercase tracking-wider"
                  >
                    Commit Roadmap Future Plan
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main roadmaps layout */}
      {filteredPlans.length === 0 ? (
        <div className="bg-[#111827] border border-[#334155] rounded p-12 text-center text-slate-550 space-y-3">
          <Target className="w-12 h-12 mx-auto text-slate-600 stroke-1" />
          <p className="font-mono font-bold text-slate-300 uppercase tracking-widest text-xs">
            No active plans match filters
          </p>
          <p className="text-xs max-w-sm mx-auto text-slate-500">
            Create a roadmap of future career or personal plans and divide them
            into tangible checklists here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredPlans.map((plan) => {
            const hasMilestones = plan.milestones.length > 0;
            return (
              <motion.div
                key={plan.id}
                layout
                className="bg-[#1e293b] rounded border border-[#334155] hover:border-[#38bdf8]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden relative"
              >
                {/* Category accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#38bdf8]" />

                <div className="p-4.5 space-y-4">
                  {/* Category Status details */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="px-2 py-0.5 font-mono text-[9px] font-semibold tracking-wider bg-[#0f172a] text-slate-300 border border-[#334155] rounded">
                      {plan.category}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          plan.status === "Completed"
                            ? "bg-[#10b981]"
                            : plan.status === "In Progress"
                              ? "bg-[#38bdf8]"
                              : plan.status === "Planning"
                                ? "bg-amber-500"
                                : "bg-slate-400"
                        }`}
                      />
                      <select
                        id={`plan-status-select-${plan.id}`}
                        className="bg-transparent border-none text-[#38bdf8] font-mono font-bold focus:outline-none cursor-pointer p-0 text-[10px]"
                        value={plan.status}
                        onChange={(e) =>
                          updatePlanStatus(
                            plan.id,
                            e.target.value as FuturePlan["status"],
                          )
                        }
                      >
                        {statuses.map((st) => (
                          <option
                            key={st}
                            value={st}
                            className="bg-[#1e293b] text-white"
                          >
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1">
                    <h4 className="font-sans font-semibold text-white text-sm tracking-tight leading-tight">
                      {plan.title}
                    </h4>
                    <p className="text-xs text-slate-400 leading-normal">
                      {plan.description}
                    </p>
                  </div>

                  {/* Progress slide metric */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-400 font-mono text-[10px] tracking-wider">
                        PROGRESS DEPTH
                      </span>
                      <span className="font-bold text-[#38bdf8] font-mono">
                        {plan.progress}%
                      </span>
                    </div>
                    {hasMilestones ? (
                      <div className="w-full bg-[#0f172a] rounded h-1.5 overflow-hidden border border-[#334155]/60">
                        <div
                          className="bg-[#38bdf8] h-full rounded transition-all duration-500"
                          style={{ width: `${plan.progress}%` }}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          id={`progress-slider-${plan.id}`}
                          type="range"
                          min="0"
                          max="100"
                          value={plan.progress}
                          onChange={(e) =>
                            updateManualProgress(
                              plan.id,
                              parseInt(e.target.value),
                            )
                          }
                          className="flex-1 accent-[#38bdf8] cursor-pointer h-1.5 bg-[#0f172a] rounded"
                        />
                      </div>
                    )}
                  </div>

                  {/* Milestones Checklists */}
                  {hasMilestones && (
                    <div className="pt-2.5 border-t border-[#334155]/60 space-y-2">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-[#64748b] font-mono">
                        MILESTONES CHECKLIST
                      </span>
                      <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                        {plan.milestones.map((m) => (
                          <button
                            id={`btn-toggle-milestone-${m.id}`}
                            key={m.id}
                            type="button"
                            onClick={() => toggleMilestone(plan.id, m.id)}
                            className="w-full text-left flex items-start gap-2 p-1.5 hover:bg-[#0f172a]/40 rounded transition-all text-xs"
                          >
                            <span className="flex-shrink-0 text-[#38bdf8] mt-0.5">
                              {m.completed ? (
                                <CheckSquare className="w-4 h-4 fill-[#0f172a]" />
                              ) : (
                                <Square className="w-4 h-4 text-[#334155]" />
                              )}
                            </span>
                            <span
                              className={`leading-tight font-mono text-[11px] ${m.completed ? "line-through text-slate-500 font-normal" : "text-slate-300 font-medium"}`}
                            >
                              {m.title}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reflections toggle note space */}
                  <div className="pt-2.5 border-t border-[#334155]/60">
                    {activePlanId === plan.id ? (
                      <div className="space-y-2 pt-1">
                        <textarea
                          id={`reflection-input-${plan.id}`}
                          placeholder="Note down current bottlenecks, lessons, or plans to share..."
                          className="text-xs w-full bg-[#0f172a] text-slate-100 border border-[#334155] rounded p-2 focus:outline-none"
                          rows={2}
                          value={tempNotes}
                          onChange={(e) => setTempNotes(e.target.value)}
                        />
                        <div className="flex justify-end gap-1.5">
                          <button
                            id={`btn-cancel-notes-${plan.id}`}
                            type="button"
                            onClick={() => setActivePlanId(null)}
                            className="px-2 py-1 text-[10px] text-slate-400 font-mono"
                          >
                            Cancel
                          </button>
                          <button
                            id={`btn-save-notes-${plan.id}`}
                            type="button"
                            onClick={() => saveReflections(plan.id)}
                            className="px-2.5 py-1 text-[10px] bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0f172a] font-bold rounded font-mono"
                          >
                            Save Note
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center bg-[#111827] py-1.5 px-2.5 rounded border border-[#334155]">
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 overflow-hidden text-ellipsis whitespace-nowrap">
                          <MessageSquare className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                          <span>
                            {plan.reflections
                              ? plan.reflections
                              : "No reflection logs yet."}
                          </span>
                        </div>
                        <button
                          id={`btn-edit-reflection-${plan.id}`}
                          type="button"
                          onClick={() => {
                            setActivePlanId(plan.id);
                            setTempNotes(plan.reflections || "");
                          }}
                          className="text-[10px] font-mono text-[#38bdf8] hover:text-[#0ea5e9] font-medium"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer panel targets info */}
                <div className="px-4.5 py-2.5 border-t border-[#334155]/60 bg-[#0f172a]/30 flex justify-between items-center text-[#10px]">
                  <span className="flex items-center gap-1 text-slate-400 font-mono uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5 text-[#38bdf8]" /> TARGET:{" "}
                    {plan.targetDate}
                  </span>
                  <button
                    id={`btn-delete-plan-${plan.id}`}
                    type="button"
                    onClick={() => deletePlan(plan.id)}
                    className="p-1 text-slate-500 hover:text-rose-455 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
