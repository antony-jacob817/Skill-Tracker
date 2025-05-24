// Skill level enum
export enum SkillLevel {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced"
}

// Skill status enum
export enum SkillStatus {
  NotStarted = "Not Started",
  Learning = "Learning",
  Mastered = "Mastered"
}

// Session interface
export interface Session {
  id: string;
  date: string; // ISO string
  duration: number; // in minutes
  notes: string;
}

// Task interface for checklists
export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

// Skill interface
export interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
  status: SkillStatus;
  totalTime: number; // in minutes
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  pinned: boolean;
  sessions: Session[];
  tasks: Task[];
}

// Content suggestion interface
export interface ContentSuggestion {
  id: string;
  title: string;
  url: string;
  duration: number; // estimated in minutes
  type: "video" | "article" | "course";
  skillId: string;
}

// User preferences interface
export interface UserPreferences {
  darkMode: boolean;
  reminderEnabled: boolean;
  reminderTime: string; // HH:MM format
}

// Analytics data point
export interface DataPoint {
  date: string;
  value: number;
}

// Analytics time distribution
export interface TimeDistribution {
  skillId: string;
  skillName: string;
  value: number;
  color: string;
}