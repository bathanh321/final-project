import {create} from "zustand";

type UsePracticeModalState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const usePracticeModal = create<UsePracticeModalState>((set) => ({
    isOpen: false,
    open: () => set({isOpen: true}),
    close: () => set({isOpen: false}),
}));