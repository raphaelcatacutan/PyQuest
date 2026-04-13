import { fileIcon } from "@/src/assets";
import { Armors } from "@/src/game/data/armors";
import { Weapons } from "@/src/game/data/weapons";
import { InventoryNode } from "@/src/game/types/inventory.types";

export const INVENTORY_ITEM_IMAGE_PLACEHOLDER = fileIcon;

export type InventoryItemImage = {
  src: string;
  alt: string;
  category: "weapon" | "armor";
  usedPlaceholder: boolean;
};

export function resolveInventoryItemImage(node: InventoryNode): InventoryItemImage | null {
  if (node.kind === "folder") {
    return null;
  }

  const category = resolveItemCategory(node);
  if (!category) {
    return null;
  }

  const imagePath = category === "weapon"
    ? Weapons[node.itemId]?.weaponImg
    : Armors[node.itemId]?.armorImg;

  const normalizedPath = normalizeImagePath(imagePath);
  if (normalizedPath) {
    return {
      src: normalizedPath,
      alt: `${node.name} ${category}`,
      category,
      usedPlaceholder: false,
    };
  }

  return {
    src: INVENTORY_ITEM_IMAGE_PLACEHOLDER,
    alt: "Missing item image placeholder",
    category,
    usedPlaceholder: true,
  };
}

function resolveItemCategory(node: Exclude<InventoryNode, { kind: "folder" }>): "weapon" | "armor" | null {
  if (node.kind === "weapon") return "weapon";
  if (node.kind === "armor") return "armor";

  if (Weapons[node.itemId]) return "weapon";
  if (Armors[node.itemId]) return "armor";
  return null;
}

function normalizeImagePath(rawPath: string | undefined): string | null {
  if (!rawPath) return null;
  const trimmedPath = rawPath.trim();
  if (!trimmedPath) return null;

  if (
    trimmedPath.startsWith("http://")
    || trimmedPath.startsWith("https://")
    || trimmedPath.startsWith("data:")
  ) {
    return trimmedPath;
  }

  if (trimmedPath.startsWith("/")) {
    return trimmedPath;
  }

  if (trimmedPath.startsWith("src/")) {
    return `/${trimmedPath}`;
  }

  if (trimmedPath.startsWith("./")) {
    return trimmedPath.slice(1);
  }

  return trimmedPath;
}
