
interface Skill {
  name: string;
  dmg: number;
  // TODO: Confirm Skill attributes
}

export interface Enemy {
  enemy_id: string;
  enemyImg: string;
  enemy_name: string;
  enemy_hp: number;
  enemy_maxHp: number;
  enemy_energy: number;
  enemy_maxEnergy: number;
  enemy_skills: Skill[];
  // TODO: Add rewards, coin range reward, 
}