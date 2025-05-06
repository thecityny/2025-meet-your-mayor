import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { QuizInput, ScoreCard } from './components/QuizContent';

export type Party = "democrat" | "other" | null;

type AppState = {
  party: Party;
  setParty: (party: Party) => void;
  favoriteTopics: string[];
  setFavoriteTopics: (favoriteTopics: string[]) => void;
  answers: QuizInput[];
  setAnswers: (answers: QuizInput[]) => void;
  score: ScoreCard | null;
  setScore: (score: ScoreCard) => void;
   /**
   * This state is used to keep track of the number of the last question
   * that was visible to the user.
   */
  highestVisibleQuestion: number;
  setHighestVisibleQuestion: (highestVisibleQuestion: number) => void;
};


export const useAppStore = create<AppState>()(persist((set) => ({
  party: null,
  setParty: (party) => set({ party }),
  favoriteTopics: [],
  setFavoriteTopics: (favoriteTopics) => set({favoriteTopics}),
  answers: [],
  setAnswers: (answers) => set({answers}),
  score: null,
  setScore: (score) => set({score}),
  highestVisibleQuestion: 0,
  setHighestVisibleQuestion: (highestVisibleQuestion) => set({highestVisibleQuestion})
}), {
  name: 'app-store',
  version: 1,
}));
