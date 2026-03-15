import { create } from 'zustand';
import type { Phase, StudentProfile, TrajectoryStep, Task, CodeReview } from '../types';

interface StudentStore {
  phase: Phase;
  student: StudentProfile | null;
  trajectory: TrajectoryStep[];
  currentTask: Task | null;
  taskHistory: Array<{ task: Task; code: string; review: CodeReview }>;
  currentCode: string;
  lastReview: CodeReview | null;

  setPhase: (phase: Phase) => void;
  setStudent: (profile: StudentProfile) => void;
  setTrajectory: (steps: TrajectoryStep[]) => void;
  setCurrentTask: (task: Task) => void;
  setCurrentCode: (code: string) => void;
  submitReview: (code: string, review: CodeReview) => void;
  reset: () => void;
}

export const useStudentStore = create<StudentStore>((set) => ({
  phase: 'welcome',
  student: null,
  trajectory: [],
  currentTask: null,
  taskHistory: [],
  currentCode: '',
  lastReview: null,

  setPhase: (phase) => set({ phase }),

  setStudent: (profile) => set({ student: profile }),

  setTrajectory: (steps) => set({ trajectory: steps }),

  setCurrentTask: (task) => set({
    currentTask: task,
    currentCode: task.starterCode || '',
    lastReview: null,
    phase: 'lesson',
  }),

  setCurrentCode: (code) => set({ currentCode: code }),

  submitReview: (code, review) => set((state) => ({
    lastReview: review,
    taskHistory: state.currentTask
      ? [...state.taskHistory, { task: state.currentTask, code, review }]
      : state.taskHistory,
    phase: 'review',
  })),

  reset: () => set({
    phase: 'welcome',
    student: null,
    trajectory: [],
    currentTask: null,
    taskHistory: [],
    currentCode: '',
    lastReview: null,
  }),
}));
