import { create } from "zustand";

interface IFreeCounterStore {
  apiLimitCount: number;
  setApiLimitCount: (num: number) => void;
}

const useFreeCounter = create<IFreeCounterStore>((set) => ({
  apiLimitCount: 0,
  setApiLimitCount: (apiLimitCount: number) => set({ apiLimitCount }),
}));

export default useFreeCounter;
