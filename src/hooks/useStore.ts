import create, { SetState } from "zustand";

type Store = {
  userId: number | undefined;
  setUserId: (userId: number | undefined) => void;
};

const useStore = create<Store>((set: SetState<Store>) => ({
  userId: undefined,
  setUserId: (userId) => {
    set({ userId: userId });
  },
}));

export default useStore;
