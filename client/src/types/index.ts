export type StudentGoal =
  | 'make_game'
  | 'get_job'
  | 'automate'
  | 'learn_ml'
  | 'school_project'
  | 'just_curious';

export const GOAL_LABELS: Record<StudentGoal, string> = {
  make_game: 'Сделать свою игру',
  get_job: 'Стать программистом',
  automate: 'Автоматизировать задачи',
  learn_ml: 'Изучить нейросети',
  school_project: 'Для школы / олимпиады',
  just_curious: 'Просто интересно',
};

export interface StudentProfile {
  name: string;
  age: number;
  pythonExperience: 'none' | 'some' | 'confident';
  experienceDuration?: string;
  goal: StudentGoal;
  weeklyHours: number;
  quizScore: number;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface TrajectoryStep {
  id: string;
  title: string;
  emoji: string;
  durationWeeks: number;
  description?: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  exampleInput?: string;
  exampleOutput?: string;
  hint?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  conceptsTaught: string[];
  starterCode?: string;
}

export interface CodeReview {
  score: number;
  summary: string;
  whatWasGreat: string[];
  whatToImprove: string[];
  correctedCode?: string;
  nextTaskHint: string;
}

export type Phase = 'welcome' | 'profile' | 'quiz' | 'trajectory' | 'lesson' | 'review';
