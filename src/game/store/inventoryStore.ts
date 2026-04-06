import { create } from "zustand";
import { InventoryNode } from "@/src/domain/inventory/inventory.types";

const InitialPlayerInventory: InventoryNode[] = [
  { 
    id: "root",
    kind: "folder", 
    name: "User", 
    children: [
      { id: "wp_folder", kind: "folder", name: "Weapons", children: [] },   
      { id: "arm_folder", kind: "folder", name: "Armors", children: [] },   
      { id: "cons_folder", kind: "folder", name: "Consumables", children: [] }
    ]
  },
  { id: "misc_folder", kind: "folder", name: "Miscellaneous", children: [] },
  { id: "pickedup_folder", kind: "folder", name: "Picked-up", children: [] },
];

interface InventoryStoreProps {
  player_id: string;
  playerInventory: InventoryNode[];
  
  // Player and tree mutation methods
  setPlayerId: (id: string) => void;
  addInventoryItem: (parentId: string | undefined, item: InventoryNode) => void;
  deleteInventoryItem: (nodeId: string) => void;
  renameInventoryItem: (nodeId: string, newName: string) => void;
  moveInventoryItem: (dragIds: string[], parentId: string | null, index: number) => void;
}

// Helper to save inventory to localStorage
const saveToLocalStorage = (playerId: string, inventory: InventoryNode[]) => {
  if (playerId) {
    localStorage.setItem(
      `player-inventory-${playerId}`,
      JSON.stringify(inventory)
    );
  }
};

export const useInventoryStore = create<InventoryStoreProps>()((set) => ({
  player_id: (() => {
    // Restore player_id from localStorage on init
    return localStorage.getItem("current-player-id") || "";
  })(),
  playerInventory: (() => {
    // Restore player_id and inventory from localStorage on init
    const playerId = localStorage.getItem("current-player-id");
    if (playerId) {
      const saved = localStorage.getItem(`player-inventory-${playerId}`);
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return InitialPlayerInventory;
  })(),
  
  setPlayerId: (id) => set((state) => {
    // Save current player's inventory under their own key before switching
    if (state.player_id && state.player_id !== id) {
      saveToLocalStorage(state.player_id, state.playerInventory);
    }
    
    // Load new player's inventory
    const savedInventory = localStorage.getItem(`player-inventory-${id}`);
    const newInventory = savedInventory 
      ? JSON.parse(savedInventory)
      : JSON.parse(JSON.stringify(InitialPlayerInventory));
    
    // Save current player_id for next session
    localStorage.setItem("current-player-id", id);
    
    return {
      player_id: id,
      playerInventory: newInventory
    };
  }),
  
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
          if (node.kind === "folder" && addToFolder(node.children)) {
            return true;
          }
        }
        return false;
      };
      addToFolder(newInventory);
    }
    
    saveToLocalStorage(state.player_id, newInventory);
    return { playerInventory: newInventory };
  }),
  
  deleteInventoryItem: (nodeId) => set((state) => {
    const deleteFromArray = (items: InventoryNode[]): InventoryNode[] => {
      return items
        .filter(item => item.id !== nodeId)
        .map(item => 
          item.kind === "folder" 
            ? { ...item, children: deleteFromArray(item.children) }
            : item
        );
    };
    const newInventory = deleteFromArray(state.playerInventory);
    
    saveToLocalStorage(state.player_id, newInventory);
    return { playerInventory: newInventory };
  }),
  
  renameInventoryItem: (nodeId, newName) => set((state) => {
    const renameInArray = (items: InventoryNode[]): InventoryNode[] => {
      return items.map(item => 
        item.id === nodeId
          ? { ...item, name: newName }
          : item.kind === "folder"
          ? { ...item, children: renameInArray(item.children) }
          : item
      );
    };
    const newInventory = renameInArray(state.playerInventory);
    
    saveToLocalStorage(state.player_id, newInventory);
    return { playerInventory: newInventory };
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
          if (item.kind === "folder") {
            result.push({ ...item, children: removeNodes(item.children) });
          } else {
            result.push(item);
          }
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
          if (item.kind === "folder") {
            return { ...item, children: insertIntoParent(item.children) };
          }
          return item;
        });
      };
      newInventory = insertIntoParent(newInventory);
    }
    
    saveToLocalStorage(state.player_id, newInventory);
    return { playerInventory: newInventory };
  }),
}));
