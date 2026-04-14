import { create } from "zustand";

/**
 * 
 *  Item Overlay Store
 */

interface infoOverlayProps {
  displayInfoOverlay: boolean;
  itemId: string;
  info: string;

  setItemId: (itemId: string) => void;
  setInfo: (info: string) => void;
  setDisplayInfoOverlay: (state?: boolean) => void;
}

export const useInfoOverlayStore = create<infoOverlayProps>((set) => ({
  displayInfoOverlay: true,
  itemId: "",
  info: "",

  setItemId: (itemId) => {
    // TODO: Query Item Info
    set({ itemId: itemId })
  },
  setInfo: (info) => set({ info: info }),
  setDisplayInfoOverlay: (state) => set((s) => ({ displayInfoOverlay: state ?? !s.displayInfoOverlay })),
}))