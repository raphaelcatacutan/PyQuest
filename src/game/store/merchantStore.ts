import { create } from "zustand";
import { InventoryNode } from "../types/inventory.types";
import ArmorsCatalog from "../json/armors.json";
import WeaponsCatalog from "../json/weapons.json";
import ConsumablesCatalog from "../json/consumables.json";
import { useBountyQuestStore } from "./bountyQuestStore";
import { usePlayerStore } from "./playerStore";

/**
 * Merchant Store - Manages merchant inventory and shop state
 */

const initialInventory: InventoryNode[] = [
        {
          id: "Store",
          name: "Store",
          kind: "folder",
          children: [
            {
              id: "armors-category",
              name: "Armors",
              kind: "folder",
              children: [],
            },
            {
              id: "weapons-category",
              name: "Weapons",
              kind: "folder",
              children: [],
            },
            {
              id: "consumables-category",
              name: "Consumables",
              kind: "folder",
              children: [],
            },
          ],
        },
      ];

interface MerchantStoreProps {
  merchantInventory: InventoryNode[];
  selectedNodeId: string | null;

  setMerchantInventory: (inventory: InventoryNode[]) => void;
  removeInventoryItem: (nodeId: string) => void;
  setSelectedNodeId: (nodeId: string | null) => void;
  toggleSelectedNodeId: (nodeId: string) => void;
  clearSelection: () => void;
  refreshStore: () => void;
}

/**
 * Helper function to randomly sample items from a catalog
 */
function sampleRandomItems(catalog: Record<string, any>, count: number) {
  const entries = Object.entries(catalog);
  const sampled = [];
  const usedIndices = new Set<number>();

  for (let i = 0; i < Math.min(count, entries.length); i++) {
    let randomIndex = Math.floor(Math.random() * entries.length);
    // Ensure we don't pick the same item twice
    while (usedIndices.has(randomIndex)) {
      randomIndex = Math.floor(Math.random() * entries.length);
    }
    usedIndices.add(randomIndex);
    const [, item] = entries[randomIndex];
    sampled.push(item);
  }

  return sampled;
}

// Initial merchant inventory data
const initialMerchantInventory: InventoryNode[] = [
  {
    id: "Store",
    name: "Store",
    kind: "folder",
    children: [],
  },
];

export const useMerchantStore = create<MerchantStoreProps>((set) => ({
  merchantInventory: initialMerchantInventory,
  selectedNodeId: null,

  setMerchantInventory: (inventory: InventoryNode[]) =>
    set({ merchantInventory: inventory }),

  removeInventoryItem: (nodeId: string) =>
    set((state) => {
      const deleteFromArray = (items: InventoryNode[]): InventoryNode[] => {
        return items
          .filter((item) => item.id !== nodeId)
          .map((item) =>
            item.kind === "folder"
              ? { ...item, children: deleteFromArray(item.children) }
              : item,
          );
      };
      return {
        merchantInventory: deleteFromArray(state.merchantInventory),
        selectedNodeId: null,
      };
    }),

  setSelectedNodeId: (nodeId: string | null) => set({ selectedNodeId: nodeId }),

  toggleSelectedNodeId: (nodeId: string) =>
    set((state) => ({
      selectedNodeId: state.selectedNodeId === nodeId ? null : nodeId,
    })),

  clearSelection: () => set({ selectedNodeId: null }),

  refreshStore: () =>
    set(() => {
      // Randomly sample 2-4 items from each catalog
      let multiplier = 0
      if (useBountyQuestStore.getState().questLevel >= 6){ multiplier = 3 }
      else if (useBountyQuestStore.getState().questLevel >= 5) { multiplier = 2}
      else if (useBountyQuestStore.getState().questLevel >= 4) { multiplier = 1 }
      else { return { merchantInventory: initialInventory, selectedNodeId: null } }

      const armorCount = Math.floor(Math.random() * 3) + multiplier; // 2-4 items
      const weaponCount = Math.floor(Math.random() * 3) + multiplier;
      const consumableCount = Math.floor(Math.random() * 3) + multiplier;

      const armorSample = sampleRandomItems(ArmorsCatalog, armorCount).map(
        (item: any) => ({
          id: `armor-${item.id}-${Math.random()}`, // Unique ID for each refresh
          name: item.name + ".py",
          kind: "armor" as const,
          itemId: item.id,
        })
      );

      const weaponSample = sampleRandomItems(WeaponsCatalog, weaponCount).map(
        (item: any) => ({
          id: `weapon-${item.id}-${Math.random()}`,
          name: item.name + ".py",
          kind: "weapon" as const,
          itemId: item.id,
          children: [],
        })
      );

      const consumableSample = sampleRandomItems(
        ConsumablesCatalog,
        consumableCount
      ).map((item: any) => ({
        id: `consumable-${item.id}-${Math.random()}`,
        name: item.name + ".py",
        kind: "consumable" as const,
        itemId: item.id,
      }));

      const refreshedInventory: InventoryNode[] = [
        {
          id: "Store",
          name: "Store",
          kind: "folder",
          children: [
            {
              id: "armors-category",
              name: "Armors",
              kind: "folder",
              children: armorSample,
            },
            {
              id: "weapons-category",
              name: "Weapons",
              kind: "folder",
              children: weaponSample,
            },
            {
              id: "consumables-category",
              name: "Consumables",
              kind: "folder",
              children: consumableSample,
            },
          ],
        },
      ];

      return {
        merchantInventory: refreshedInventory,
        selectedNodeId: null,
      };
    }),
}));
