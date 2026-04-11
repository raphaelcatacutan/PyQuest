import { create } from "zustand";
import { Howl, Howler } from "howler";
import shotgunSFX from '@/src/assets/audio/sfx/shotgun.mp3'

/**
 * 
 *  Sound Store
 */

interface SoundStoreProps {
  sounds: Record<string, Howl>;
  masterVolume: number;
  
  initSounds: () => void;
  playSfx: (name: 'click' | 'hit' | 'heal') => void;
  setMasterVolume: (val: number) => void;
}

export const useSoundStore = create<SoundStoreProps>((set, get) => ({
  sounds: {},
  masterVolume: 0.5,

  initSounds: () => {
    const soundMap = {
      click: new Howl({ src: [shotgunSFX], preload: true }),
      // hit: new Howl({ src: ['/audio/sfx/hit.wav'], volume: 0.8 }),
      // heal: new Howl({ src: ['/audio/sfx/sparkle.mp3'] }),
      // TODO: Add More Sound Effects
    };

    set({ sounds: soundMap });
  },

  playSfx: (name) => {
    const { sounds } = get();
    if (sounds[name]) {
      sounds[name].play();
    }
  },

  setMasterVolume: (val) => {
    set({ masterVolume: val });
    Howler.volume(val);
  }
}))