import create, { SetState } from "zustand";

type Store = {
  userId: number | null;
  setUserId: (value: number | null) => void;
  fromUrl: string | null;
  setFromUrl: (value: string | null) => void;
};

const useStore = create<Store>((set: SetState<Store>) => ({
  userId: null,
  setUserId: (value) => {
    set({ userId: value });
  },
  fromUrl: null,
  setFromUrl: (value) => {
    set({ fromUrl: value });
  },
}));

export default useStore;
