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

export const useInventoryStore = create<InventoryStoreProps>((set) => ({
  player_id: "",
  playerInventory: InitialPlayerInventory,
  
  setPlayerId: (id) => set({ player_id: id }),
  
  addInventoryItem: (parentId, item) => set((state) => {
    const newInventory = JSON.parse(JSON.stringify(state.playerInventory));
    
    if (!parentId) {
      newInventory.push(item);
      return { playerInventory: newInventory };
    }
    
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
    return { playerInventory: deleteFromArray(state.playerInventory) };
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
    
    return { playerInventory: newInventory };
  }),
}))
