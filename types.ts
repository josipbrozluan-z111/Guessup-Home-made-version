
export enum Language {
  ENGLISH = 'en',
  FINNISH = 'fi',
  VIETNAMESE = 'vi'
}

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export enum GameState {
  LOBBY = 'lobby',
  SETUP = 'setup',
  ROUND_START = 'round_start',
  CLUE_GIVING = 'clue_giving',
  GUESSING = 'guessing',
  RESULTS = 'results',
  GAME_OVER = 'game_over'
}

export interface GameTopic {
  secret: string;
  category: string;
  forbidden: string[];
  imageUrl?: string;
}

export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface GameConfig {
  language: Language;
  difficulty: Difficulty;
  maxPoints: number;
  timeLimit: number; // in seconds
}

export interface AspectRatioOption {
  label: string;
  value: "1:1" | "2:3" | "3:2" | "3:4" | "4:3" | "9:16" | "16:9" | "21:9";
}

export interface ImageSizeOption {
  label: string;
  value: "1K" | "2K" | "4K";
}
