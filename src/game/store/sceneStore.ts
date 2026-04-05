import { create } from "zustand";
import { SceneNameTypes } from "../types/scene.types";
import { SceneBg } from "../data/scenes";
import { villageBg } from "@/src/assets";

/**
 * 
 *  Scene State
 */

interface SceneProps {
  scene: SceneNameTypes;
  setScene: (scene: SceneNameTypes) => void;
  getSceneBg: (scene: SceneNameTypes) => string;
}

export const useSceneStore = create<SceneProps>((set) => ({
  scene: 'village',
  setScene: (scene: SceneNameTypes) => set({ scene }),
  getSceneBg: (scene: SceneNameTypes) => SceneBg[scene]?.imgBg || villageBg
}))