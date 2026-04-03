import { create } from "zustand";
import villageBg from "@/public/assets/maps/village1.png?url"
import labyrinthBg from "@/public/assets/maps/labyrinth.png?url"
import dungeonBg from "@/public/assets/maps/dungeon.png?url"

/**
 * 
 *  Scene State
 */

export type SceneName = 'village' | 'labyrinth' | 'dungeon'

const SceneBg: Record<SceneName, { imgBg: string }> = {
  village: {
    imgBg: villageBg
  },
  labyrinth: {
    imgBg: labyrinthBg
  },
  dungeon: {
    imgBg: dungeonBg
  }
  // TODO: Follow-up other scenes 
}

interface SceneProps {
  scene: SceneName;
  setScene: (scene: SceneName) => void;
  getSceneBg: (scene: SceneName) => string;
}

export const useSceneStore = create<SceneProps>((set) => ({
  scene: 'village',
  setScene: (scene: SceneName) => set({ scene }),
  getSceneBg: (scene: SceneName) => SceneBg[scene]?.imgBg || villageBg
}))