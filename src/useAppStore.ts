import { create } from "zustand";
import { persist } from "zustand/middleware";
import { QuizInput, ScoreCard } from "./components/QuizContent";
import { questionContent } from "./question-content";
import { track } from "@amplitude/analytics-browser";

export type Party = "democrat" | "other" | null;

/**
 * A blank template to keep track of user's
 * responses to quiz questions.
 */
export const blankAnswersList = Object.entries(questionContent).map(
  (question, i) => ({
    questionNumber: i + 1,
    answer: null,
  })
);

type AppState = {
  version: number;
  party: Party;
  setParty: (party: Party, delay?: number) => void;
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
  resetAnswers: () => void;
};

export const useAppStore = create<AppState>()(
  persist<AppState>(
    (set, get) => ({
      version: 2,
      party: null,
      setParty: (party, delay) => {
        track(`Selected party`, {
          party: party,
        });
        const highestVisibleQuestion = get().highestVisibleQuestion;
        const setHighestVisibleQuestion = get().setHighestVisibleQuestion;
        if (highestVisibleQuestion === 0 && !!party) {
          setHighestVisibleQuestion(1);
        }
        setTimeout(() => {
          set({ party });
        }, delay || 0);
      },
      favoriteTopics: [],
      setFavoriteTopics: (favoriteTopics) => {
        set({ favoriteTopics });
      },
      answers: blankAnswersList,
      setAnswers: (answers) => set({ answers }),
      score: null,
      setScore: (score) => {
        set({ score });
      },
      highestVisibleQuestion: 0,
      setHighestVisibleQuestion: (highestVisibleQuestion) =>
        set({ highestVisibleQuestion }),
      resetAnswers: () => {
        track(`Reset answers`);
        set({
          answers: blankAnswersList,
          favoriteTopics: [],
          highestVisibleQuestion: 0,
          party: null,
        });
      },
    }),
    {
      name: "app-store",
      version: 2,
      migrate: (persistedState, version): AppState => {
        console.log("Migrating AppState from version", version);

        const state = persistedState as AppState;

        if (!!!version || version < 2) {
          return {
            ...state,
            answers: blankAnswersList,
            favoriteTopics: [],
            highestVisibleQuestion: 0,
            score: null,
            party: null,
            version: 2,
          };
        } else
          return {
            ...state,
            version: 2,
          };
      },
    }
  )
);
