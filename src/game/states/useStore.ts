import { create } from "zustand";

import { createPlayerSlice, PlayerSlice } from "./slices/playerSlice";
// import { createGameSlice, GameSlice } from "./slices/gameSlice";
// import { createTypingSlice, TypingSlice } from "./slices/typingSlice";
// import { createUISlice, UISlice } from "./slices/uiSlice";

export type AppStore =
  PlayerSlice;

export const useStore = create<AppStore>()((...a) => ({
  ...createPlayerSlice(...a)
}));
