import { create } from "zustand";

interface CardDisplay {
  question: string;
  answer: string;
}

interface FlashcardStore {
  cards: CardDisplay[];
  setCards: (cards: CardDisplay[]) => void;
}

export const useFlashcardStore = create<FlashcardStore>((set) => ({
  cards: [],
  setCards: (cards) => set({ cards }),
}));
