import React, { useState } from "react";
import {
  Share2,
  Heart,
  MessageSquare,
  Send,
  Award,
  Network,
  Sparkles,
  UserCheck,
  Star,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CommunityPost, UserSession, Contact } from "../types";

interface CommunityPlatformProps {
  posts: CommunityPost[];
  onUpdatePosts: (updated: CommunityPost[]) => void;
  currentUser: UserSession;
  targetConnects: Contact[];
  onQuickLogMeeting: (contactId: string) => void;
}

export default function CommunityPlatform({
  posts,
  onUpdatePosts,
  currentUser,
  targetConnects,
  onQuickLogMeeting,
}: CommunityPlatformProps) {
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostType, setNewPostType] =
    useState<CommunityPost["type"]>("Knowledge");
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>(
    {},
  );

  const postTypes: CommunityPost["type"][] = [
    "Plan Shared",
    "Habit Milestone",
    "Goal Met",
    "Knowledge",
  ];

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost: CommunityPost = {
      id: "post-" + Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      authorName: currentUser.fullName,
      authorAvatarColor: currentUser.avatarColor,
      authorRole: currentUser.bio || "Core Sphere Pioneer",
      content: newPostContent.trim(),
      type: newPostType,
      likes: 0,
      likedBy: [],
      comments: [],
      timestamp: new Date().toISOString(),
    };

    onUpdatePosts([newPost, ...posts]);
    setNewPostContent("");
    setNewPostType("Knowledge");
  };

  const handleLikePost = (postId: string) => {
    const updated = posts.map((p) => {
      if (p.id !== postId) return p;

      const isLiked = p.likedBy.includes(currentUser.id);
      const newLikedBy = isLiked
        ? p.likedBy.filter((id) => id !== currentUser.id)
        : [...p.likedBy, currentUser.id];

      return {
        ...p,
        likes: isLiked ? p.likes - 1 : p.likes + 1,
        likedBy: newLikedBy,
      };
    });
    onUpdatePosts(updated);
  };

  const handleAddComment = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const commentText = commentInputs[postId];
    if (!commentText || !commentText.trim()) return;

    const updated = posts.map((p) => {
      if (p.id !== postId) return p;

      const newComment = {
        id: "c-" + Math.random().toString(36).substr(2, 9),
        authorName: currentUser.fullName,
        authorAvatar: currentUser.avatarColor,
        content: commentText.trim(),
        timestamp: new Date().toISOString(),
      };

      return {
        ...p,
        comments: [...p.comments, newComment],
      };
    });

    onUpdatePosts(updated);
    setCommentInputs({
      ...commentInputs,
      [postId]: "",
    });
  };

  const handleCommentInputChange = (postId: string, val: string) => {
    setCommentInputs({
      ...commentInputs,
      [postId]: val,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start text-slate-200">
      {/* Target Connections Directory Widget on Left */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-[#111827] border border-[#334155] rounded p-4 text-white shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#38bdf8]/5 rounded-full blur-2xl"></div>

          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500/10" />
            <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-slate-200">
              Community Targets Index
            </h4>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
            Direct integration of Category 5:{" "}
            <strong>Target connections</strong>. Move targets to active core
            orbits by initiating conversations.
          </p>
        </div>

        {/* Directory cards */}
        <div className="bg-[#111827] rounded p-4 border border-[#334155] space-y-3.5">
          <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400 font-mono block">
            Pending Target Connects ({targetConnects.length})
          </span>
          {targetConnects.length === 0 ? (
            <div className="text-center py-4 text-slate-500 font-mono text-xs">
              No target contacts declared. Add contacts under category
              &quot;Target Connect&quot; to populate.
            </div>
          ) : (
            <div className="space-y-2">
              {targetConnects.map((tc) => {
                const initials = tc.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2);
                return (
                  <div
                    key={tc.id}
                    className="p-3 bg-[#1e293b] border border-[#334155]/50 rounded flex items-center justify-between gap-2 hover:border-[#38bdf8]/30 transition-all font-mono"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div
                        className={`w-8 h-8 rounded bg-gradient-to-tr ${tc.avatarColor} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}
                      >
                        {initials}
                      </div>
                      <div className="overflow-hidden">
                        <h6 className="font-bold text-white text-xs truncate leading-snug">
                          {tc.name}
                        </h6>
                        <p className="text-[9px] text-slate-400 truncate max-w-32">
                          {tc.role}
                        </p>
                      </div>
                    </div>

                    <button
                      id={`btn-target-meet-${tc.id}`}
                      type="button"
                      onClick={() => {
                        onQuickLogMeeting(tc.id);
                        alert(
                          `Successfully logged coffee meeting checkup with target contact: ${tc.name}! Status updated.`,
                        );
                      }}
                      className="px-2.5 py-1.5 bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0f172a] rounded text-[9px] font-mono font-bold leading-none select-none flex items-center gap-1 cursor-pointer transition-all active:scale-95 flex-shrink-0 uppercase"
                    >
                      <UserCheck className="w-3 h-3" /> Connect
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Feed on Right */}
      <div className="lg:col-span-8 space-y-5">
        {/* Composer Widget */}
        <form
          onSubmit={handleCreatePost}
          className="bg-[#111827] p-4 rounded border border-[#334155] space-y-3 relative"
        >
          <div className="flex gap-3">
            <div
              className={`w-8.5 h-8.5 rounded bg-gradient-to-tr ${currentUser.avatarColor} flex items-center justify-center text-white text-xs font-bold font-mono`}
            >
              {currentUser.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)}
            </div>

            <div className="flex-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                Sphere Feed Composer
              </span>
              <textarea
                id="composer-post-input"
                required
                placeholder="Share a vision, habit accomplishment, or general update with the Sphere community..."
                rows={3}
                className="w-full text-xs bg-[#1e293b] text-white p-3 rounded border border-[#334155] focus:outline-none focus:ring-1 focus:ring-[#38bdf8] focus:border-[#38bdf8] transition-all font-mono resize-none mt-1"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-[#334155]/60">
            {/* Tag Selection */}
            <div className="flex gap-1 bg-[#0f172a] p-0.5 rounded border border-[#334155]">
              {postTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setNewPostType(type)}
                  className={`py-1 px-2.5 text-[9px] font-mono rounded transition-all ${
                    newPostType === type
                      ? "bg-[#1e293b] text-[#38bdf8] font-bold border border-[#334155]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <button
              id="btn-composer-submit"
              type="submit"
              className="py-1.5 px-3 bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0f172a] font-bold font-mono text-[10px] uppercase rounded flex items-center gap-1 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5" /> Broadcast Entry
            </button>
          </div>
        </form>

        {/* Dynamic community list */}
        <div className="space-y-4">
          <AnimatePresence>
            {posts.map((post) => {
              const userHasLiked = post.likedBy.includes(currentUser.id);
              const initials = post.authorName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2);

              return (
                <motion.div
                  key={post.id}
                  layout
                  className="bg-[#1e293b] rounded border border-[#334155] p-4.5 space-y-4 hover:border-[#38bdf8]/35 transition-all duration-300"
                >
                  {/* Header info */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded bg-gradient-to-tr ${post.authorAvatarColor} flex items-center justify-center text-white text-xs font-mono font-bold shadow-inner`}
                      >
                        {initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-mono font-bold text-white text-sm leading-tight">
                            {post.authorName}
                          </h5>
                          <span className="px-1.5 py-0.5 text-[8px] font-mono font-bold uppercase tracking-wider rounded bg-[#0f172a] text-[#38bdf8] border border-[#334155]">
                            {post.type}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {post.authorRole}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(post.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {/* Body content */}
                  <p className="text-xs text-slate-350 leading-relaxed font-sans mt-0.5">
                    {post.content}
                  </p>

                  {/* Liked status badges interactions */}
                  <div className="flex items-center gap-4 pt-1 text-xs">
                    <button
                      id={`btn-like-post-${post.id}`}
                      type="button"
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center gap-1.5 transition-all ${
                        userHasLiked
                          ? "text-rose-500 font-bold scale-110"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${userHasLiked ? "fill-rose-500 text-rose-500" : ""}`}
                      />
                      <span className="font-mono text-[11px]">
                        {post.likes}
                      </span>
                    </button>

                    <div className="flex items-center gap-1 text-slate-400 font-mono">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-[11px]">
                        {post.comments.length} comments
                      </span>
                    </div>

                    {post.refTag && (
                      <span className="text-[9px] font-mono text-[#38bdf8] font-bold ml-auto bg-[#0f172a] py-0.5 px-2 rounded border border-[#334155]/60 uppercase tracking-widest">
                        #{post.refTag}
                      </span>
                    )}
                  </div>

                  {/* Nested Comments section */}
                  <div className="bg-[#111827] p-3 rounded border border-[#334155]/40 space-y-3">
                    {post.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="flex gap-2.5 items-start text-xs border-b border-[#334155]/45 pb-2.5 last:border-b-0 last:pb-0"
                      >
                        <div
                          className={`w-6 h-6 rounded bg-gradient-to-tr ${
                            comment.authorAvatar.startsWith("from-")
                              ? comment.authorAvatar
                              : "from-indigo-400 to-purple-400"
                          } flex items-center justify-center text-white text-[8px] font-bold font-mono`}
                        >
                          {comment.authorName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .substring(0, 2)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-300 font-mono text-[10px]">
                              {comment.authorName}
                            </span>
                            <span className="text-[8px] text-slate-500 font-mono">
                              {new Date(comment.timestamp).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" },
                              )}
                            </span>
                          </div>
                          <p className="text-slate-400 mt-0.5 text-[10.5px] leading-relaxed">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Comment Composer */}
                    <form
                      onSubmit={(e) => handleAddComment(post.id, e)}
                      className="flex gap-2 mt-2 pt-1.5 border-t border-[#334155]/30"
                    >
                      <input
                        id={`comment-input-${post.id}`}
                        type="text"
                        placeholder="Type a supportive thought or comment..."
                        className="bg-[#0f172a] border border-[#334155] rounded text-xs px-2.5 py-1.5 flex-1 focus:outline-none text-white font-mono placeholder-slate-650"
                        value={commentInputs[post.id] || ""}
                        onChange={(e) =>
                          handleCommentInputChange(post.id, e.target.value)
                        }
                      />
                      <button
                        id={`btn-comment-submit-${post.id}`}
                        type="submit"
                        className="px-3.5 py-1.5 bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0f172a] rounded text-[10px] flex items-center justify-center cursor-pointer active:scale-95 font-mono font-bold uppercase"
                      >
                        <Send className="w-3 h-3" />
                      </button>
                    </form>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
