export interface LootItem {
  itemId: string;
  dropRate: number;
  quantity?: number;
}

export interface LootDrop {
  xpDropMin: number;
  xpDropMax: number;
  coinDropMin: number;
  coinDropMax: number;
  weapons: LootItem[];
  armors: LootItem[];
  consumables: LootItem[];
}
