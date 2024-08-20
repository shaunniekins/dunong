import { create } from "zustand";

interface CardDisplay {
  question: string;
  answer: string;
}

interface FlashcardStore {
  cards: CardDisplay[];
  setCards: (cards: CardDisplay[]) => void;
}

interface JsonDataStore {
  jsonData: string | null;
  setJsonData: (data: string | null) => void;
}

export const useFlashcardStore = create<FlashcardStore>((set) => ({
  cards: [],
  setCards: (cards) => set({ cards }),
}));

export const useJsonDataStore = create<JsonDataStore>((set) => ({
  jsonData: null,
  setJsonData: (data) => set({ jsonData: data }),
}));
