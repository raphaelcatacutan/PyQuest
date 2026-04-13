import { SceneTypes } from "./scene.types";
import { LootDrop } from "./loot.types";

export interface MachineProblem {
  problem: string;
  correct_code: string;
  expected_output: string;
  reward: LootDrop;
}

export interface MPData {
  [scene: string]: MachineProblem[];
}