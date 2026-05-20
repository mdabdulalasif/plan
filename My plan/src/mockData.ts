import { Contact, FuturePlan, Habit, CommunityPost } from './types';

export const DEFAULT_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    userId: 'user-sarah',
    authorName: 'Sarah K. Jenkins',
    authorAvatarColor: 'from-pink-500 to-rose-500',
    authorRole: 'Core Family Architect',
    content: 'Just successfully scheduled our first quarterly multi-generational reunion plan! Managed to sync dates with 12 family members. Keeping our Core Circle fully connected this year. ❤️',
    type: 'Goal Met',
    likes: 12,
    likedBy: [],
    comments: [
      {
        id: 'c-1',
        authorName: 'Marcus Aurel',
        authorAvatar: 'bg-emerald-500',
        content: 'This is brilliant, Sarah! Multi-generational planning is tough but incredibly rewarding.',
        timestamp: '2026-05-20T10:00:00Z'
      }
    ],
    timestamp: '2026-05-20T08:30:00Z',
    refTag: 'Family Circle'
  },
  {
    id: 'post-2',
    userId: 'user-marcus',
    authorName: 'Marcus Vance',
    authorAvatarColor: 'from-emerald-500 to-teal-500',
    authorRole: 'Strategic Connector',
    content: 'Completed my weekly "Deep Network Catchup" with 3 professional contacts. Moving 2 target accounts from "Better" position to "Best" partner level based on yesterday\'s working lunch!',
    type: 'Habit Milestone',
    likes: 8,
    likedBy: [],
    comments: [],
    timestamp: '2026-05-20T14:15:00Z',
    refTag: 'Professional Networking'
  },
  {
    id: 'post-3',
    userId: 'user-elena',
    authorName: 'Elena Rostova',
    authorAvatarColor: 'from-violet-500 to-purple-500',
    authorRole: 'AI Tech Lead',
    content: 'Shared my 5-Year Tech Vision Plan today. Breaking it down into bi-weekly milestones (1. Build prototype, 2. Secure early core circle feedback, 3. Community Launch). Focus creates momentum!',
    type: 'Plan Shared',
    likes: 19,
    likedBy: [],
    comments: [
      {
        id: 'c-2',
        authorName: 'Sarah K. Jenkins',
        authorAvatar: 'bg-rose-500',
        content: 'Love this progressive breakdown. What\'s your first focus sprint topic?',
        timestamp: '2026-05-20T15:20:00Z'
      },
      {
        id: 'c-3',
        authorName: 'Elena Rostova',
        authorAvatar: 'bg-purple-500',
        content: 'First focus is designing local client state and mock synchronization! Keep it light and ultra-responsive.',
        timestamp: '2026-05-20T15:35:00Z'
      }
    ],
    timestamp: '2026-05-20T15:00:00Z',
    refTag: 'Future Path'
  }
];

export const INITIAL_PLANS = (userId: string): FuturePlan[] => [
  {
    id: 'plan-1',
    userId,
    title: 'Launch SaaS Prototype',
    description: 'Build and wire up standard functional layouts, integrate local persistence APIs, and secure test feedback from core network connections.',
    category: 'Career',
    targetDate: '2026-09-15',
    progress: 40,
    status: 'In Progress',
    milestones: [
      { id: 'm1', title: 'Define application specifications and wireframes', completed: true },
      { id: 'm2', title: 'Code base architecture construction', completed: true },
      { id: 'm3', title: 'Hook up state management and dashboard navigation', completed: false },
      { id: 'm4', title: 'Deploy private server & launch with core circles', completed: false }
    ],
    reflections: 'Progress is moving smoothly. Need to sync with target leads before drafting production release dates.',
    createdAt: '2026-05-18T10:00:00Z'
  },
  {
    id: 'plan-2',
    userId,
    title: 'Health & Endurance Optimization',
    description: 'Commit to full healthy routine, including daily cardio exercise sprints and mental tracking indicators to bolster longevity.',
    category: 'Health',
    targetDate: '2026-12-30',
    progress: 25,
    status: 'In Progress',
    milestones: [
      { id: 'm21', title: 'Schedule medical cardiovascular assessment', completed: true },
      { id: 'm22', title: 'Hit 21-day streak on morning physical habits', completed: false },
      { id: 'm23', title: 'Log a sub-50 minute 10k race milestone', completed: false }
    ],
    reflections: 'Streaks are recovering. Focusing heavily on morning routine hydration and dynamic lunges.',
    createdAt: '2026-05-10T09:00:00Z'
  }
];

export const INITIAL_CONTACTS = (userId: string): Contact[] => [
  {
    id: 'contact-1',
    userId,
    name: 'Elena Rostova',
    role: 'Staff Engineer @ CloudCorp',
    category: 'Colleague',
    tier: 'Best',
    email: 'elena.r@cloudcorp.com',
    phone: '+1 (555) 432-1098',
    lastContactDate: '2026-05-18',
    frequencyDays: 14,
    notes: [
      { id: 'n1', date: '2026-05-18', content: 'Met for coffee. Discussed cloud scale optimizations. Elena was extremely helpful.' },
      { id: 'n2', date: '2026-05-04', content: 'Sync call regarding our quarterly pipeline projections.' }
    ],
    avatarColor: 'from-purple-500 to-indigo-500'
  },
  {
    id: 'contact-2',
    userId,
    name: 'Robert Stark',
    role: 'Eldest Family Member',
    category: 'Family',
    tier: 'Core',
    email: 'robert.s@starklegacy.org',
    phone: '+1 (555) 555-0192',
    lastContactDate: '2026-05-19',
    frequencyDays: 7,
    notes: [
      { id: 'n3', date: '2026-05-19', content: 'Sunday dinner catchup. Talked about family plan reunion planning in detail.' }
    ],
    avatarColor: 'from-amber-500 to-red-500'
  },
  {
    id: 'contact-3',
    userId,
    name: 'Amanda Vance',
    role: 'VP of Investment Strategies',
    category: 'Target Connect',
    tier: 'Better',
    email: 'amanda.vance@vanceequity.com',
    phone: '+1 (555) 987-6543',
    lastContactDate: '2026-05-05',
    frequencyDays: 30,
    notes: [
      { id: 'n4', date: '2026-05-05', content: 'Introduced via LinkedIn. Set calendar invite to discuss SaaS seed rounds next month.' }
    ],
    avatarColor: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'contact-4',
    userId,
    name: 'Julian Chen',
    role: 'Senior Product Lead',
    category: 'Professional',
    tier: 'Good',
    email: 'julian.chen@productverse.io',
    phone: '+1 (555) 303-9111',
    lastContactDate: '2026-04-20',
    frequencyDays: 45,
    notes: [
      { id: 'n5', date: '2026-04-20', content: 'Brief meet at Technology Forum. Advised on target product positioning models.' }
    ],
    avatarColor: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'contact-5',
    userId,
    name: 'Lucas Dupont',
    role: 'College Best Friend / Designer',
    category: 'Friend',
    tier: 'Core',
    email: 'lucas.dupont@pixelcraft.studio',
    phone: '+1 (555) 123-4567',
    lastContactDate: '2026-05-15',
    frequencyDays: 7,
    notes: [
      { id: 'n6', date: '2026-05-15', content: 'Duo gaming session. Discussed creative portfolio designs and UI ideas.' }
    ],
    avatarColor: 'from-pink-500 to-purple-500'
  }
];

export const INITIAL_HABITS = (userId: string): Habit[] => [
  {
    id: 'habit-1',
    userId,
    name: 'Morning Hydration & Stretching (20m)',
    category: 'Wellness',
    streak: 5,
    bestStreak: 14,
    history: ['2026-05-20', '2026-05-19', '2026-05-18', '2026-05-17', '2026-05-16'],
    createdAt: '2026-05-01'
  },
  {
    id: 'habit-2',
    userId,
    name: 'Connect with a Network Circle Member',
    category: 'Connection',
    streak: 2,
    bestStreak: 6,
    history: ['2026-05-19', '2026-05-18'],
    createdAt: '2026-05-01'
  },
  {
    id: 'habit-3',
    userId,
    name: 'Deep Working Sprint (90m on Planning)',
    category: 'Productivity',
    streak: 0,
    bestStreak: 4,
    history: ['2026-05-17'],
    createdAt: '2026-05-01'
  }
];
