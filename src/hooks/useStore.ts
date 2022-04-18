import create, { SetState } from "zustand";

type Store = {
  userId?: number;
  userLogin: (userId: number) => void;
  userLogout: () => void;
};

const useStore = create<Store>((set: SetState<Store>) => ({
  userId: null,
  userLogin: (userId) => {
    set({ userId: userId });
  },
  userLogout: () => {
    set({ userId: null });
  },
}));

export default useStore;
