import { create } from "zustand";
import { SceneTypes } from "../types/scene.types";
import { Scene } from "../data/scenes";
import { villageBg } from "@/src/assets";

/**
 * 
 *  Scene State
 */

interface SceneProps {
  scene: SceneTypes;
  sceneBg: string;
  setScene: (scene: SceneTypes) => void;
}

export const useSceneStore = create<SceneProps>((set) => ({
  scene: 'village',
  sceneBg: villageBg,
  setScene: (scene: SceneTypes) => set({ scene: scene, sceneBg: Scene[scene] }),
  // getSceneBg: (scene: SceneTypes) => SceneBg[scene]?.imgBg || villageBg
}))