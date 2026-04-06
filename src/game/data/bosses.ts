import { Boss } from "../types/boss.types"
import {

} from '@/src/assets'

/**
 * 
 *  Boss Database
 */

export const Bosses: Record<string, Boss> = {
  tarantula: {
    id: "tarantula",
    name: "Giant Tarantula",
    description: "A massive eight-legged arachnid with a venomous bite and surprising speed",
    bossImg: "",
    hp: 120,
    maxHp: 120,
    energy: 80,
    maxEnergy: 80,
    def: 15,
    maxDef: 15,
    skills: [
      { name: "Venomous Bite", dmg: 25, energyCost: 30 },
      { name: "Web Shot", dmg: 18, energyCost: 10 },
      { name: "Frenzied Attack", dmg: 30, energyCost: 35 },
    ],
    dmg: 20,
    atkSpeed: 1.2,
    critDmg: 1.5,
    critChance: 0.15,
    evasion: 0.2,
    spawnRate: 0.15,
    lootDrop: {
      xpDropMin: 0,
      xpDropMax: 0,
      coinDropMin: 0,
      coinDropMax: 0,
      armors: [],       // TODO: To be configured
      weapons: [],
      consumables: []
    },
  }
}