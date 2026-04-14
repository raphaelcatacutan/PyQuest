import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { InventoryNode } from "@/src/game/types/inventory.types";

export const loadInventoryProfile = async (playerId: string) => {
  if (!playerId) return;

  const storageKey = `${playerId}-inventory`;
  
  // ✅ Check if this player has EXISTING saved inventory data
  const existingData = localStorage.getItem(storageKey);
  const isNewPlayer = !existingData;

  useInventoryStore.persist.setOptions({
    name: storageKey,
  });

  // Only reset to initial state if this is a BRAND NEW player
  if (isNewPlayer) {
    useInventoryStore.setState({ playerInventory: InitialPlayerInventory });
  }

  // Load from localStorage for this player (or keep initial if new)
  await useInventoryStore.persist.rehydrate();
  
  // Force the player_id to match the account
  useInventoryStore.setState({ player_id: playerId });

  console.log(`Successfully loaded inventory for: ${playerId}`);
};

const InitialPlayerInventory: InventoryNode[] = [
  { 
    id: "root",
    kind: "folder", 
    name: "user", 
    children: [
      { id: "init_file_root", kind: "util", itemId: "init_file_wp" , name: "init.py" },
      { id: "wp_folder", kind: "folder", name: "weapons", children: [{ id: "init_file_wp", kind: "util", itemId: "init_file_wp" , name: "init.py" }]},   
      { id: "arm_folder", kind: "folder", name: "armors", children: [{ id: "init_file_arm", kind: "util", itemId: "init_file_arm" , name: "init.py" }]},    
      { id: "cons_folder", kind: "folder", name: "consumables", children: [{ id: "init_file_cons", kind: "util", itemId: "init_file_cons" , name: "init.py" }]},   
    ]
  },
  { id: "misc_folder", kind: "folder", name: "miscellaneous", children: [
    { id: "init_file_misc", kind: "util", itemId: "init_file_misc" , name: "init.py" },
    { id: "handbook", kind: "util", itemId: "handboom_misc" , name: "handbook.py" },
    { id: "abilities", kind: "util", itemId: "abilities_misc" , name: "abilities.py" },
  ]},   
  { id: "pickedup_folder", kind: "folder", name: "pickedup", children: []},   
];

interface InventoryStoreProps {
  player_id: string;
  playerInventory: InventoryNode[];
  setPlayerId: (id: string) => void;
  addInventoryItem: (parentId: string | undefined, item: InventoryNode) => void;
  deleteInventoryItem: (nodeId: string) => void;
  renameInventoryItem: (nodeId: string, newName: string) => void;
  moveInventoryItem: (dragIds: string[], parentId: string | null, index: number) => void;
  resetInventory: () => void;
}

export const useInventoryStore = create<InventoryStoreProps>()(
  persist(
    (set) => ({
      player_id: "",
      playerInventory: InitialPlayerInventory,

      setPlayerId: (id) => set({ player_id: id }),

      addInventoryItem: (parentId, item) => set((state) => {
        const newInventory = JSON.parse(JSON.stringify(state.playerInventory));
        
        if (!parentId) {
          newInventory.push(item);
        } else {
          const addToFolder = (items: InventoryNode[]): boolean => {
            for (const node of items) {
              if (node.id === parentId && node.kind === "folder") {
                node.children.push(item);
                return true;
              }
              if (node.kind === "folder" && addToFolder(node.children)) return true;
            }
            return false;
          };
          addToFolder(newInventory);
        }
        return { playerInventory: newInventory };
      }),

      deleteInventoryItem: (nodeId) => set((state) => {
        const deleteFromArray = (items: InventoryNode[]): InventoryNode[] => {
          return items
            .filter(item => item.id !== nodeId)
            .map(item => item.kind === "folder" 
              ? { ...item, children: deleteFromArray(item.children) } 
              : item
            );
        };
        return { playerInventory: deleteFromArray(state.playerInventory) };
      }),

      renameInventoryItem: (nodeId, newName) => set((state) => {
        const renameInArray = (items: InventoryNode[]): InventoryNode[] => {
          return items.map(item => 
            item.id === nodeId ? { ...item, name: newName } :
            item.kind === "folder" ? { ...item, children: renameInArray(item.children) } : item
          );
        };
        return { playerInventory: renameInArray(state.playerInventory) };
      }),

      moveInventoryItem: (dragIds, parentId, index) => set((state) => {
        let newInventory = JSON.parse(JSON.stringify(state.playerInventory));
        const nodesToMove: InventoryNode[] = [];
        
        const removeNodes = (items: InventoryNode[]): InventoryNode[] => {
          const result: InventoryNode[] = [];
          for (const item of items) {
            if (dragIds.includes(item.id)) {
              nodesToMove.push(item);
            } else {
              result.push(item.kind === "folder" ? { ...item, children: removeNodes(item.children) } : item);
            }
          }
          return result;
        };
        
        newInventory = removeNodes(newInventory);

        if (parentId === null) {
          newInventory.splice(index, 0, ...nodesToMove);
        } else {
          const insertIntoParent = (items: InventoryNode[]): InventoryNode[] => {
            return items.map(item => {
              if (item.id === parentId && item.kind === "folder") {
                const newChildren = [...item.children];
                newChildren.splice(index, 0, ...nodesToMove);
                return { ...item, children: newChildren };
              }
              return item.kind === "folder" ? { ...item, children: insertIntoParent(item.children) } : item;
            });
          };
          newInventory = insertIntoParent(newInventory);
        }
        return { playerInventory: newInventory };
      }),

      resetInventory: () => set({ playerInventory: InitialPlayerInventory }),
    }),
    {
      name: "player-inventory-default", // Default key, will be changed dynamically
      storage: createJSONStorage(() => localStorage),
      skipHydration: true
    }
  )
);