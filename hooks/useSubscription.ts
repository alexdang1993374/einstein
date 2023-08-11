import { create } from "zustand";

interface ISubscriptionStore {
  isSubscribed: boolean;
  setIsSubscribed: (sub: boolean) => void;
}

const useSubscription = create<ISubscriptionStore>((set) => ({
  isSubscribed: false,
  setIsSubscribed: (sub: boolean) => set({ isSubscribed: sub }),
}));

export default useSubscription;
