import { create } from "zustand";
import { SceneNameTypes } from "../types/scene.types";
import { Scene } from "../data/scenes";
import { villageBg } from "@/src/assets";

/**
 * 
 *  Scene State
 */

interface SceneProps {
  scene: SceneNameTypes;
  sceneBg: string;
  setScene: (scene: SceneNameTypes) => void;
}

export const useSceneStore = create<SceneProps>((set) => ({
  scene: 'village',
  sceneBg: villageBg,
  setScene: (scene: SceneNameTypes) => set({ scene: scene, sceneBg: Scene[scene] }),
  // getSceneBg: (scene: SceneNameTypes) => SceneBg[scene]?.imgBg || villageBg
}))