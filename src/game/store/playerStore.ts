import { create } from 'zustand'
import { useInventoryStore } from './inventoryStore';
import { Player } from '../types/player.types';

/**
 * 
 *  Player State
 */

// TODO: ToLocalStorage

interface PlayerStoreProps extends Player {
  setUserId: (user_id: string) => void;
  setUsername: (username: string) => void;
  setPassword: (pass: string) => void;

  gainHP: (amount: number) => void;
  setMaxHP: (amount: number) => void;
  resetMaxHP: () => void

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

export const usePlayerStore = create<PlayerStoreProps>((set) => ({
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
  setUserId: (user_id) => set(({ user_id: user_id })),
  setUsername: (username) => set(({ username: username })),
  setPassword: (pass) => set(({ password: pass })),

  gainHP: (amount) => set((state) => ({ hp: state.hp + amount })),  
  setMaxHP: (amount) => set((state) => ({ maxHP: state.maxHP + amount })),
  resetMaxHP: () => set({ maxHP: 100 }),

  gainDef: (amount) => set((state) => ({ def: state.def + amount })),
  setMaxDef: (amount) => set((state) => ({ maxDef: state.maxDef + amount })),
  resetMaxDef: () => set({ def: 0, maxDef: 0 }),

  gainEnergy: (amount) => set((state) => ({ energy: state.energy + amount})),
  setMaxEnergy: (amount) => set((state) => ({ maxEnergy: state.maxEnergy + amount })),
  spendEnergy: (amount) => set((state) => ({ energy: state.energy - amount })),
  resetMaxEnergy: () => set({ maxEnergy: 100 }),

  setDamage: (amount) => set((state) => ({ baseDmg: state.baseDmg + amount })),
  takeDamage: (amount) => set((state) => ({ hp: Math.max(0, state.hp - amount) })),
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
  unequipHeadArmor: () => set({ def: 0 }), // TODO: Figure out how to reduce a certain amount of def provided by the helmet
  unequipBodyArmor: () => set({ def: 0 }), // TODO: Figure out how to reduce a certain amount of def provided by the helmet

  gainCoins: (amount) => set((s) => ({ coins: s.coins + amount })),
  deductCoins: (amount) => set((s) => ({ coins: s.coins - amount })),
  gainXP: (amount) => set((state) => {
    let newXP = state.XP + amount;
    let newLevel = state.level;
    let newXpRequirement = state.xpRequirement;

    // Check if XP meets requirement and level up
    while (newXP >= newXpRequirement) {
      newXP -= newXpRequirement;
      newLevel += 1;
      newXpRequirement = Math.floor(newXpRequirement * 1.2); // Increase requirement by 20% per level (TODO: Modify)
    }

    return { XP: newXP, level: newLevel, xpRequirement: newXpRequirement };
  }),
  setXpRequirement: (amount) => set({ xpRequirement: amount }),
  levelUp: () => set((state) => ({ level: state.level + 1 })),

  toggleIsDamaged: (bool) => { 
    if (bool != null){
      return set({ isDamaged: bool })
    } else {
      return set((s) => ({ isDamaged: !s.isDamaged })) 
    } 
  },
  toggleIsHealing: (bool) => { 
    if (bool != null){
      return set({ isHealing: bool }) 
    } else {
      return set((s) => ({ isHealing: !s.isHealing })) 
    } 
  },

  logOut: () => {
    useInventoryStore.setState({ player_id: "" })
    set({ 
      user_id: "",
      username: "",
      password: "",
      hp: 0,
      energy: 0,
      XP: 0,
      leftHand: "",
      rightHand: "",
      isDamaged: false
    })
  }
}))