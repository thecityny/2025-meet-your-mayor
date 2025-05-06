import { create } from 'zustand';

export type Party = "democrat" | "other" | null;

type AppState = {
  party: Party;
  setParty: (party: Party) => void;
};

export const useAppStore = create<AppState>((set) => ({
  party: null,
  setParty: (party) => set({ party }),
}));
