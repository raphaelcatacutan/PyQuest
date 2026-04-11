import { create } from "zustand";
import { Howl, Howler } from "howler";
import shotgunSFX from '@/src/assets/audio/sfx/shotgun.mp3'
import healSFX from '@/src/assets/audio/sfx/heal.mp3'
import deathSFX from '@/src/assets/audio/sfx/death.mp3'
import hitSFX from '@/src/assets/audio/sfx/hit1.mp3'

/**
 * 
 *  Sound Store
 */

type SFX = 'click' | 'hit' | 'heal' | 'death'

interface SoundStoreProps {
  sounds: Record<string, Howl>;
  masterVolume: number;
  
  initSounds: () => void;
  playSfx: (name: SFX) => void;
  setMasterVolume: (val: number) => void;
}

export const useSoundStore = create<SoundStoreProps>((set, get) => ({
  sounds: {},
  masterVolume: 0.5,

  initSounds: () => {
    const soundMap = {
      click: new Howl({ src: [shotgunSFX], preload: true }),
      hit: new Howl({ src: [hitSFX], preload: true }),
      heal: new Howl({ src: [healSFX] }),
      death: new Howl({ src: [deathSFX] }),
      // hit: new Howl({ src: ['/audio/sfx/hit.wav'], volume: 0.8 }),
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