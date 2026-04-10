export type InventoryNode =
  | { // Folder Node
      id: string; 
      kind: "folder"; 
      name: string; 
      children: InventoryNode[]; 
      cursed?: boolean;
    }
  | { // Item Node
      id: string;
      kind: "weapon" | "armor" | "consumable" | "misc" | "" ;
      itemId: string;        // points to registry
      name: string;
      
      // Weapons and Armors
      durability?: number;   
      cursed?: boolean;      

      // Node Config
      nameOverride?: string; // rename support
    };