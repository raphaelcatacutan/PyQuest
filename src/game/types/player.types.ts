export interface Player {  
  user_id: string;
  username: string;
  password: string;

  hp: number;
  maxHP: number;
  def: number;
  maxDef: number;
  energy: number;
  maxEnergy: number;
  maxXP: number;
  baseDmg: number;
  baseCritDmg: number,
  baseCritChance: number;
  atkSpeed: number;
  
  leftHand: string;
  rightHand: string;
  headSlot: string;
  bodySlot: string;
  
  coins: number;
  XP: number;
  xpRequirement: number;
  level: number;
  isDamaged: boolean;
}