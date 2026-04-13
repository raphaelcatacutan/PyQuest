import { create } from "zustand";
import { SceneTypes } from "../types/scene.types";
import { Scenes } from "../data/scenes";
import { villageBg } from "@/src/assets";
import { useSoundStore } from "./soundStore";

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
  // setScene: (scene: SceneTypes) => set({ scene: scene, sceneBg: Scenes[scene] }),
  setScene: (scene: SceneTypes) => {
    // 1. Update the visual scene data
    set({ scene: scene, sceneBg: Scenes[scene] });

    // 2. ⚡️ Update the music based on the new scene
    // If scene is 'village', play 'village' BGM. If 'dungeon', maybe play 'combat'?
    const musicToPlay = scene === 'village' ? 'village' : 'combat';
    useSoundStore.getState().playMusic(musicToPlay);
  },
  // getSceneBg: (scene: SceneTypes) => SceneBg[scene]?.imgBg || villageBg
}))