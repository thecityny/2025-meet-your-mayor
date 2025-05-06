import { create } from 'zustand';
import { QuizInput, ScoreCard } from './components/QuizContent';

export type Party = "democrat" | "other" | null;


type AppState = {
  party: Party;
  setParty: (party: Party) => void;
  favoriteTopics: Set<string>;
  setFavoriteTopics: (favoriteTopics: Set<string>) => void;
  answers: QuizInput[];
  setAnswers: (answers: QuizInput[]) => void;
  score: ScoreCard | null;
  setScore: (score: ScoreCard) => void;
};

export const useAppStore = create<AppState>((set) => ({
  party: null,
  setParty: (party) => set({ party }),
  favoriteTopics: new Set(),
  setFavoriteTopics: (favoriteTopics) => set({favoriteTopics}),
  answers: [],
  setAnswers: (answers) => set({answers}),
  score: null,
  setScore: (score) => set({score})
}));
