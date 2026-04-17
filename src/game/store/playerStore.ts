import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Player } from '../types/player.types';
import { useSoundStore } from './soundStore';
import { resetInventoryPersist } from './inventoryStore';
import { resetBountyPersist } from './bountyQuestStore';
import { resetDungeonPersist } from './dungeonStore';
import { resetKillTrackerPersist } from './killTrackerStore';
import showToast from '@/src/components/ui/Toast';
import { useSceneStore } from './sceneStore';
import { useTerminalStore } from './terminalStore';

const DEFAULT_PLAYER_ATTACK_INTERVAL_SECONDS = 3.125;
const MIN_PLAYER_ATTACK_INTERVAL_SECONDS = 0.1;
const MAX_PLAYER_ATTACK_INTERVAL_SECONDS = 10;
const LEGACY_ATTACK_INTERVAL_SLOWDOWN_MULTIPLIER = 1.25;
const DEFAULT_PLAYER_HP_REGEN_PER_SECOND = 5;
const DEFAULT_PLAYER_ENERGY_REGEN_PER_SECOND = 4;
const OUT_OF_COMBAT_ENERGY_REGEN_MULTIPLIER = 3;

function clampPlayerAttackIntervalSeconds(value: number): number {
  if (!Number.isFinite(value)) {
    return DEFAULT_PLAYER_ATTACK_INTERVAL_SECONDS;
  }
  return Math.min(
    MAX_PLAYER_ATTACK_INTERVAL_SECONDS,
    Math.max(MIN_PLAYER_ATTACK_INTERVAL_SECONDS, value),
  );
}

function normalizePlayerAttackSpeed(atkSpeed: number): number {
  if (!Number.isFinite(atkSpeed) || atkSpeed <= 0) {
    return DEFAULT_PLAYER_ATTACK_INTERVAL_SECONDS;
  }

  // Legacy saves used milliseconds between attacks (e.g. 3000).
  if (atkSpeed > 10) {
    return clampPlayerAttackIntervalSeconds(
      (atkSpeed / 1000) * LEGACY_ATTACK_INTERVAL_SLOWDOWN_MULTIPLIER,
    );
  }

  // Legacy values may be attacks-per-second.
  if (atkSpeed <= 1) {
    return clampPlayerAttackIntervalSeconds(
      (1 / atkSpeed) * LEGACY_ATTACK_INTERVAL_SLOWDOWN_MULTIPLIER,
    );
  }

  return clampPlayerAttackIntervalSeconds(atkSpeed);
}

function clampPlayerEnergy(energy: number, maxEnergy: number): number {
  const normalizedEnergy = Number.isFinite(energy) ? Math.floor(energy) : 0;
  const normalizedMax = Number.isFinite(maxEnergy) ? Math.max(0, Math.floor(maxEnergy)) : 0;
  return Math.max(0, Math.min(normalizedMax, normalizedEnergy));
}

function clampPlayerHp(hp: number, maxHP: number): number {
  const normalizedHp = Number.isFinite(hp) ? Math.floor(hp) : 0;
  const normalizedMax = Number.isFinite(maxHP) ? Math.max(0, Math.floor(maxHP)) : 0;
  return Math.max(0, Math.min(normalizedMax, normalizedHp));
}

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
      hpRegenPerSecond: DEFAULT_PLAYER_HP_REGEN_PER_SECOND,
      hpRegenCarry: 0,
      def: 0,
      maxDef: 0,
      energy: 100,
      maxEnergy: 100,
      energyRegenPerSecond: DEFAULT_PLAYER_ENERGY_REGEN_PER_SECOND,
      energyRegenCarry: 0,
      coins: 0,
      XP: 0,
      level: 1,
      xpRequirement: 100,
      atkSpeed: DEFAULT_PLAYER_ATTACK_INTERVAL_SECONDS,
    });
  }

  // Load from localStorage for this player (or keep initial if new)
  await usePlayerStore.persist.rehydrate();
  
  // Ensure the user_id matches the account and normalize legacy attack speed values.
  usePlayerStore.setState((state) => ({
    user_id: playerId,
    hp: clampPlayerHp(state.hp, state.maxHP),
    hpRegenPerSecond: Number.isFinite(state.hpRegenPerSecond)
      ? Math.max(0, state.hpRegenPerSecond)
      : DEFAULT_PLAYER_HP_REGEN_PER_SECOND,
    hpRegenCarry: Number.isFinite(state.hpRegenCarry)
      ? Math.max(0, Math.min(0.999999, state.hpRegenCarry))
      : 0,
    atkSpeed: normalizePlayerAttackSpeed(state.atkSpeed),
    energyRegenPerSecond: Number.isFinite(state.energyRegenPerSecond)
      ? Math.max(0, state.energyRegenPerSecond)
      : DEFAULT_PLAYER_ENERGY_REGEN_PER_SECOND,
    energyRegenCarry: Number.isFinite(state.energyRegenCarry)
      ? Math.max(0, Math.min(0.999999, state.energyRegenCarry))
      : 0,
    energy: clampPlayerEnergy(state.energy, state.maxEnergy),
  }));

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
  applyEnergyRegen: (deltaSeconds: number, mode: "combat" | "out_of_combat") => void;
  applyHpRegen: (deltaSeconds: number, mode: "combat" | "out_of_combat") => void;
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
      hpRegenPerSecond: DEFAULT_PLAYER_HP_REGEN_PER_SECOND,
      hpRegenCarry: 0,
      def: 0,
      maxDef: 0,
      energy: 100,
      maxEnergy: 100,
      energyRegenPerSecond: DEFAULT_PLAYER_ENERGY_REGEN_PER_SECOND,
      energyRegenCarry: 0,
      maxXP: 0,
      baseDmg: 2,
      baseCritDmg: 0,
      baseCritChance: 3,
      atkSpeed: DEFAULT_PLAYER_ATTACK_INTERVAL_SECONDS,
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
        useSoundStore.getState().playSfx('heal');
        set((state) => ({ hp: state.hp + amount }));
      },
      setMaxHP: (amount) => set((state) => ({ maxHP: state.maxHP + amount })),
      resetMaxHP: () => set({ maxHP: 100 }),

      gainDef: (amount) => set((state) => ({ def: state.def + amount })),
      setMaxDef: (amount) => set((state) => ({ maxDef: state.maxDef + amount })),
      resetMaxDef: () => set({ def: 0, maxDef: 0 }),

      gainEnergy: (amount) => set((state) => ({
        energy: clampPlayerEnergy(state.energy + amount, state.maxEnergy),
      })),
      setMaxEnergy: (amount) => set((state) => {
        const nextMaxEnergy = Math.max(0, Math.floor(state.maxEnergy + amount));
        return {
          maxEnergy: nextMaxEnergy,
          energy: clampPlayerEnergy(state.energy, nextMaxEnergy),
        };
      }),
      spendEnergy: (amount) => set((state) => ({
        energy: clampPlayerEnergy(state.energy - amount, state.maxEnergy),
      })),
      applyEnergyRegen: (deltaSeconds, mode) => set((state) => {
        const regenBase = Number.isFinite(state.energyRegenPerSecond)
          ? Math.max(0, state.energyRegenPerSecond)
          : 0;
        const normalizedDelta = Number.isFinite(deltaSeconds) ? Math.max(0, deltaSeconds) : 0;
        if (regenBase <= 0 || normalizedDelta <= 0 || state.energy >= state.maxEnergy) {
          return state;
        }

        const regenMultiplier =
          mode === "out_of_combat" ? OUT_OF_COMBAT_ENERGY_REGEN_MULTIPLIER : 1;
        const carry = Number.isFinite(state.energyRegenCarry)
          ? Math.max(0, Math.min(0.999999, state.energyRegenCarry))
          : 0;
        const regenAmount = (regenBase * normalizedDelta * regenMultiplier) + carry;
        const wholeEnergy = Math.floor(regenAmount);
        const nextCarry = regenAmount - wholeEnergy;

        if (wholeEnergy <= 0) {
          if (nextCarry === carry) {
            return state;
          }
          return {
            energyRegenCarry: nextCarry,
          };
        }

        const nextEnergy = clampPlayerEnergy(state.energy + wholeEnergy, state.maxEnergy);
        if (nextEnergy === state.energy && nextCarry === carry) {
          return state;
        }

        return {
          energy: nextEnergy,
          energyRegenCarry: nextCarry,
        };
      }),
      applyHpRegen: (deltaSeconds, mode) => set((state) => {
        if (mode !== "out_of_combat") {
          return state;
        }

        const regenBase = Number.isFinite(state.hpRegenPerSecond)
          ? Math.max(0, state.hpRegenPerSecond)
          : 0;
        const normalizedDelta = Number.isFinite(deltaSeconds) ? Math.max(0, deltaSeconds) : 0;
        if (regenBase <= 0 || normalizedDelta <= 0 || state.hp >= state.maxHP) {
          return state;
        }

        const carry = Number.isFinite(state.hpRegenCarry)
          ? Math.max(0, Math.min(0.999999, state.hpRegenCarry))
          : 0;
        const regenAmount = (regenBase * normalizedDelta) + carry;
        const wholeHp = Math.floor(regenAmount);
        const nextCarry = regenAmount - wholeHp;

        if (wholeHp <= 0) {
          if (nextCarry === carry) {
            return state;
          }
          return {
            hpRegenCarry: nextCarry,
          };
        }

        const nextHp = clampPlayerHp(state.hp + wholeHp, state.maxHP);
        if (nextHp === state.hp && nextCarry === carry) {
          return state;
        }

        return {
          hp: nextHp,
          hpRegenCarry: nextCarry,
        };
      }),
      resetMaxEnergy: () => set({ maxEnergy: 100 }),

      setDamage: (amount) => set((state) => ({ baseDmg: state.baseDmg + amount })),
      // takeDamage: (amount) => set((state) => ({ hp: Math.max(0, state.hp - amount) })),
      takeDamage: (amount) => set((state) => {
        const hp = Math.max(0, state.hp - amount)
        if (hp <= 0) { useSoundStore.getState().playSfx('death') }
        else { useSoundStore.getState().playSfx('hurt') }
        return { hp: hp }
      }),
      resetDamage: () => set({ baseDmg: 2 }),

      setCritDmg: (amount) => set((state) => ({ baseCritDmg: state.baseCritDmg + amount })),
      resetCritDmg: () => set({ baseCritDmg: 0 }),
      setCritChance: (amount) => set((state) => ({ baseCritChance: state.baseCritChance + amount })),
      resetCritChange: () => set({ baseCritChance: 0 }),

      setAtkSpeed: (amount) => set((state) => ({
        atkSpeed: clampPlayerAttackIntervalSeconds(state.atkSpeed + amount),
      })),
      resetAtkSpeed: () => set({ atkSpeed: DEFAULT_PLAYER_ATTACK_INTERVAL_SECONDS }),

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
          showToast({variant: 'info', message: "You Leveled up!"})
        }
        return { XP: newXP, level: newLevel, xpRequirement: newXpRequirement };
      }),

      setXpRequirement: (amount) => set({ xpRequirement: amount }),
      // levelUp: () => set((state) => ({ level: state.level + 1 })),
      levelUp: () => {
        showToast({variant: 'success', message: "You Leveled up!"})
        set((state) => ({ level: state.level + 1 }))
      },

      toggleIsDamaged: (bool) => set((s) => ({ isDamaged: bool ?? !s.isDamaged })),
      toggleIsHealing: (bool) => set((s) => ({ isHealing: bool ?? !s.isHealing })),

      logOut: () => {
        useSceneStore.getState().setScene('village')
        useTerminalStore.getState().clearLogs()

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
          maxHP: 100,
          hpRegenPerSecond: DEFAULT_PLAYER_HP_REGEN_PER_SECOND,
          hpRegenCarry: 0,
          energy: 100,
          maxEnergy: 100,
          XP: 0,
          level: 1,
          atkSpeed: DEFAULT_PLAYER_ATTACK_INTERVAL_SECONDS,
          energyRegenPerSecond: DEFAULT_PLAYER_ENERGY_REGEN_PER_SECOND,
          energyRegenCarry: 0,
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
