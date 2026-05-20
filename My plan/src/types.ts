export type ContactCategory =
  | "Family"
  | "Friend"
  | "Colleague"
  | "Professional"
  | "Target Connect";
export type ContactTier = "Core" | "Good" | "Better" | "Best";

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface FuturePlan {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string; // 'Career' | 'Personal' | 'Financial' | 'Health' | 'Social'
  targetDate: string;
  progress: number; // 0-100
  status: "Planning" | "In Progress" | "Completed" | "Deferred";
  milestones: Milestone[];
  reflections?: string;
  createdAt: string;
}

export interface ContactNote {
  id: string;
  date: string;
  content: string;
}

export interface Contact {
  id: string;
  userId: string;
  name: string;
  role: string;
  category: ContactCategory;
  tier: ContactTier;
  email?: string;
  phone?: string;
  lastContactDate?: string;
  frequencyDays: number; // e.g. 7 days for core, 30 for good, etc.
  notes: ContactNote[];
  avatarColor: string;
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  category:
    | "Wellness"
    | "Intellect"
    | "Productivity"
    | "Connection"
    | "Creation";
  streak: number;
  bestStreak: number;
  history: string[]; // dates e.g. '2026-05-20'
  createdAt: string;
}

export interface CommunityComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
}

export interface CommunityPost {
  id: string;
  userId: string;
  authorName: string;
  authorAvatarColor: string;
  authorRole: string;
  content: string;
  type: "Plan Shared" | "Habit Milestone" | "Goal Met" | "Knowledge";
  likes: number;
  likedBy: string[]; // list of user ids
  comments: CommunityComment[];
  timestamp: string;
  refTag?: string; // target tag or plan reference
}

export interface UserSession {
  id: string;
  username: string;
  fullName: string;
  avatarColor: string;
  bio?: string;
  registeredAt: string;
}
