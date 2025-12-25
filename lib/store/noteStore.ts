import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Tag } from "@/types/note";

export type Draft = {
  title: string;
  content: string;
  tag: Tag;
};

export type NoteStore = {
  draft: Draft;
  setDraft: (draft: Draft) => void;
  clearDraft: () => void;
};

export const initialDraft: Draft = {
  title: "",
  content: "",
  tag: "Todo",
};

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (draft) => set({ draft }),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: "notehub-draft",
    }
  )
);
