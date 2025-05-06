import { create } from 'zustand';

export type Party = "democrat" | "other" | null;


type AppState = {
  party: Party;
  setParty: (party: Party) => void;
  favoriteTopics: Set<string>;
  setFavoriteTopics: (favoriteTopics: Set<string>) => void;
};

export const useAppStore = create<AppState>((set) => ({
  party: null,
  setParty: (party) => set({ party }),
  favoriteTopics: new Set(),
  setFavoriteTopics: (favoriteTopics) => set({favoriteTopics})
}));
