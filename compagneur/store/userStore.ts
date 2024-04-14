import { create } from "zustand";

type UserStore = {
  userID: string;
  setUserID: (userID: string) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  userID: "",
  setUserID: (userID: string) => set({ userID }),
}));
