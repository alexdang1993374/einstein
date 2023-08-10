import { create } from "zustand";

interface IProModalStore {
  isOpen: boolean;
  onOpen: VoidFunction;
  onClose: VoidFunction;
}

const useProModal = create<IProModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useProModal;
