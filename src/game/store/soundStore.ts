import { create } from "zustand";
import { Howl, Howler } from "howler";
import shotgunSFX from '@/src/assets/audio/sfx/shotgun.mp3'
import healSFX from '@/src/assets/audio/sfx/heal.mp3'
import deathSFX from '@/src/assets/audio/sfx/death1.mp3'
import hitSFX from '@/src/assets/audio/sfx/hit1.mp3'
import criticalSFX from '@/src/assets/audio/sfx/critical_hit.mp3'
import tradeSFX from '@/src/assets/audio/sfx/trade.mp3'
import hurtSFX from '@/src/assets/audio/sfx/hurt.mp3'
import innkeeperSFX from '@/src/assets/audio/sfx/innkeeper_v1.mp3'

// ⚡️ Import your music files
import mainBGM from '@/src/assets/audio/musics/background.mp3'
import villageBGM from '@/src/assets/audio/musics/villageBGM.mp3'
// import combatBGM from '@/src/assets/audio/music/combat.mp3'

type SFX = 'click' | 'hit' | 'critical' | 'heal' | 'death' | 'trade' | 'hurt' | 'innkeeper'
type BGM = 'main' | 'village' |  'combat' // ⚡️ Define your music keys

interface SoundStoreProps {
  sounds: Record<string, Howl>;
  currentMusic: Howl | null; // ⚡️ Track current BGM
  masterVolume: number;
  
  initSounds: () => void;
  playSfx: (name: SFX) => void;
  playMusic: (name: BGM) => void; // ⚡️ New action for music
  stopMusic: () => void;          // ⚡️ New action to stop music
  setMasterVolume: (val: number) => void;
}

export const useSoundStore = create<SoundStoreProps>((set, get) => ({
  sounds: {},
  currentMusic: null,
  masterVolume: 0.5,

  initSounds: () => {
    const soundMap = {
      click: new Howl({ src: [shotgunSFX], preload: true }),
      hit: new Howl({ src: [hitSFX], preload: true }),
      critical: new Howl({ src: [criticalSFX], preload: true }),
      heal: new Howl({ src: [healSFX] }),
      death: new Howl({ src: [deathSFX] }),
      trade: new Howl({ src: [tradeSFX] }),
      hurt: new Howl({ src: [hurtSFX] }),
      innkeeper: new Howl({ src: [innkeeperSFX] }),

      // ⚡️ Add Music to the map
      main: new Howl({ src: [mainBGM], loop: true, html5: true }), //
      village: new Howl({ src: [villageBGM], loop: true, html5: true, volume: 0.5 }), //
      combat: new Howl({ src: [mainBGM], loop: true, html5: true, volume: 0.5 }),
    };

    set({ sounds: soundMap });
  },

  playSfx: (name) => {
    const { sounds } = get();
    if (sounds[name]) {
      sounds[name].play(); //
    }
  },

  // ⚡️ Logic to switch background music
  playMusic: (name) => {
    const { sounds, currentMusic } = get();
    
    // Stop currently playing music if it exists
    if (currentMusic) {
      currentMusic.stop();
    }

    const music = sounds[name];
    if (music) {
      music.play(); //
      set({ currentMusic: music });
    }
  },

  stopMusic: () => {
    const { currentMusic } = get();
    if (currentMusic) {
      currentMusic.stop(); //
      set({ currentMusic: null });
    }
  },

  setMasterVolume: (val) => {
    set({ masterVolume: val });
    Howler.volume(val); //
  }
}))