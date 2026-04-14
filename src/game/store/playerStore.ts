import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Player } from '../types/player.types';
import { useSoundStore } from './soundStore';
import { resetInventoryPersist } from './inventoryStore';
import { resetBountyPersist } from './bountyQuestStore';
import { resetDungeonPersist } from './dungeonStore';
import { resetKillTrackerPersist } from './killTrackerStore';

export const loadUserProfile = async (playerId: string) => {
  if (!playerId) return;

  const playerStorageKey = `${playerId}-stats`;
  
  const existingData = localStorage.getItem(playerStorageKey);
  const isNewPlayer = !existingData;

  // Switch to this player's storage
  usePlayerStore.persist.setOptions({
    name: playerStorageKey,
  });

  // Only reset to initial state if this is a BRAND NEW player
  if (isNewPlayer) {
    usePlayerStore.setState({ 
      user_id: playerId,
      hp: 100,
      maxHP: 100,
      def: 0,
      maxDef: 0,
      energy: 100,
      maxEnergy: 100,
      coins: 0,
      XP: 0,
      level: 1,
      xpRequirement: 100,
    });
  }

  // Load from localStorage for this player (or keep initial if new)
  await usePlayerStore.persist.rehydrate();
  
  // Ensure the user_id matches the account
  usePlayerStore.setState({ user_id: playerId });

  // Load the inventory profile for this player
  // await loadInventoryProfile(playerId);

  console.log(`Successfully loaded profile for: ${playerId}`);
};

interface PlayerStoreProps extends Player {
  setUserId: (user_id: string) => void;
  setUsername: (username: string) => void;
  setPassword: (pass: string) => void;
  gainHP: (amount: number) => void;
  setMaxHP: (amount: number) => void;
  resetMaxHP: () => void;
  gainDef: (amount: number) => void;
  setMaxDef: (amount: number) => void;
  resetMaxDef: () => void;
  gainEnergy: (amount: number) => void;
  setMaxEnergy: (amount: number) => void;
  spendEnergy: (amount: number) => void;
  resetMaxEnergy: () => void;
  setDamage: (amount: number) => void;
  takeDamage: (amount: number) => void;
  resetDamage: () => void;
  setCritDmg: (amount: number) => void;
  resetCritDmg: () => void;
  setCritChance: (amount: number) => void;
  resetCritChange: () => void;
  setAtkSpeed: (amount: number) => void;
  resetAtkSpeed: () => void;
  equipLeftHandWith: (weapon: string, weaponDmg: number) => void;
  equipRightHandWith: (weapon: string, weaponDmg: number) => void;
  unequipLeftHand: () => void;
  unequipRightHand: () => void;
  equipHeadSlotWith: (headArmor: string, defBonus: number) => void;
  equipBodySlotWith: (bodyArmor: string, defBonus: number) => void;
  unequipHeadArmor: () => void;
  unequipBodyArmor: () => void;
  gainCoins: (amount: number) => void;
  deductCoins: (amount: number) => void;
  gainXP: (amount: number) => void;
  setXpRequirement: (amount: number) => void;
  levelUp: () => void;
  toggleIsDamaged: (state: boolean | null) => void;
  toggleIsHealing: (state: boolean | null) => void;
  logOut: () => void;
}

export const usePlayerStore = create<PlayerStoreProps>()(
  persist(
    (set) => ({
      user_id: "",
      username: "",
      password: "",
      hp: 100,
      maxHP: 100,
      def: 0,
      maxDef: 0,
      energy: 100,
      maxEnergy: 100,
      maxXP: 0,
      baseDmg: 2,
      baseCritDmg: 0,
      baseCritChance: 3,
      atkSpeed: 3000,
      leftHand: "",
      rightHand: "",
      headSlot: "",
      bodySlot: "",
      coins: 0,
      XP: 0,
      xpRequirement: 100,
      level: 1,
      isDamaged: false,
      isHealing: false,

      // ⚡️ Authentication & Loading Logic
      setUserId: (user_id) => {
        set({ user_id });
        // When we set the user, we immediately tell the inventory store to rehydrate its data
        // loadInventoryProfile(user_id);
      },
      
      setUsername: (username) => set({ username }),
      setPassword: (pass) => set({ password: pass }),

      // gainHP: (amount) => set((state) => ({ hp: state.hp + amount })),
      gainHP: (amount) => {
        useSoundStore.getState().playSfx('heal'),
        set((state) => ({ hp: state.hp + amount }))
      },
      setMaxHP: (amount) => set((state) => ({ maxHP: state.maxHP + amount })),
      resetMaxHP: () => set({ maxHP: 100 }),

      gainDef: (amount) => set((state) => ({ def: state.def + amount })),
      setMaxDef: (amount) => set((state) => ({ maxDef: state.maxDef + amount })),
      resetMaxDef: () => set({ def: 0, maxDef: 0 }),

      gainEnergy: (amount) => set((state) => ({ energy: state.energy + amount })),
      setMaxEnergy: (amount) => set((state) => ({ maxEnergy: state.maxEnergy + amount })),
      spendEnergy: (amount) => set((state) => ({ energy: state.energy - amount })),
      resetMaxEnergy: () => set({ maxEnergy: 100 }),

      setDamage: (amount) => set((state) => ({ baseDmg: state.baseDmg + amount })),
      // takeDamage: (amount) => set((state) => ({ hp: Math.max(0, state.hp - amount) })),
      takeDamage: (amount) => set((state) => {
        const hp = Math.max(0, state.hp - amount)
        if (hp <= 0) { useSoundStore.getState().playSfx('death') } 
        return { hp: hp}
      }),
      resetDamage: () => set({ baseDmg: 2 }),

      setCritDmg: (amount) => set((state) => ({ baseCritDmg: state.baseCritDmg + amount })),
      resetCritDmg: () => set({ baseCritDmg: 0 }),
      setCritChance: (amount) => set((state) => ({ baseCritChance: state.baseCritChance + amount })),
      resetCritChange: () => set({ baseCritChance: 0 }),

      setAtkSpeed: (amount) => set((state) => ({ atkSpeed: state.atkSpeed + amount })),
      resetAtkSpeed: () => set({ atkSpeed: 3000 }),

      equipLeftHandWith: (weapon, weaponDmg) => set((state) => ({ leftHand: weapon, baseDmg: state.baseDmg + weaponDmg })),
      equipRightHandWith: (weapon, weaponDmg) => set((state) => ({ rightHand: weapon, baseDmg: state.baseDmg + weaponDmg })),
      unequipLeftHand: () => set({ leftHand: "", baseDmg: 2 }),
      unequipRightHand: () => set({ rightHand: "", baseDmg: 2 }),
      equipHeadSlotWith: (headArmor, defBonus) => set((state) => ({ headSlot: headArmor, def: state.def + defBonus })),
      equipBodySlotWith: (bodyArmor, defBonus) => set((state) => ({ bodySlot: bodyArmor, def: state.def + defBonus })),
      unequipHeadArmor: () => set({ def: 0 }),
      unequipBodyArmor: () => set({ def: 0 }),

      gainCoins: (amount) => set((s) => ({ coins: s.coins + amount })),
      deductCoins: (amount) => set((s) => ({ coins: s.coins - amount })),

      gainXP: (amount) => set((state) => {
        let newXP = state.XP + amount;
        let newLevel = state.level;
        let newXpRequirement = state.xpRequirement;
        while (newXP >= newXpRequirement) {
          newXP -= newXpRequirement;
          newLevel += 1;
          newXpRequirement = Math.floor(newXpRequirement * 1.2);
        }
        return { XP: newXP, level: newLevel, xpRequirement: newXpRequirement };
      }),

      setXpRequirement: (amount) => set({ xpRequirement: amount }),
      levelUp: () => set((state) => ({ level: state.level + 1 })),

      toggleIsDamaged: (bool) => set((s) => ({ isDamaged: bool ?? !s.isDamaged })),
      toggleIsHealing: (bool) => set((s) => ({ isHealing: bool ?? !s.isHealing })),

      logOut: () => {
        // Reset all persist keys before clearing state to prevent ghost logins
        usePlayerStore.persist.setOptions({
          name: 'pyquest-active-session',
        });
        resetInventoryPersist();
        resetBountyPersist();
        resetDungeonPersist();
        resetKillTrackerPersist();
        
        set({
          user_id: "",
          username: "",
          password: "",
          hp: 100,
          energy: 100,
          XP: 0,
          level: 1,
          leftHand: "",
          rightHand: "",
          isDamaged: false
        });
        localStorage.removeItem('pyquest-active-session');
      }
    }),
    {
      name: 'pyquest-active-session', // This key stores current character stats
      storage: createJSONStorage(() => localStorage),
    }
  )
);