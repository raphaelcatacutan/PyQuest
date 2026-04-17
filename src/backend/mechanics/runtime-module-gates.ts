import { useGameStore } from "../../game/store/gameStore";
import { useInventoryStore } from "../../game/store/inventoryStore";
import type { InventoryNode } from "../../game/types/inventory.types";
import {
    isConsumableModule,
    isPickedupModule,
    isWeaponModule,
    normalizeImportedItemSymbol,
    normalizeItemId
} from "./shop-item-modules";

export function isEnemyBattleActive(): boolean {
    const gameState = useGameStore.getState();
    return gameState.inCombat && gameState.isEnemy;
}

export function getUnlockedWeaponImportIds(): string[] {
    const purchasedWeaponIds = useInventoryStore.getState().purchasedWeaponIds;
    return purchasedWeaponIds.map((itemId) => normalizeItemId(itemId));
}

export function getUnlockedConsumableImportIds(): string[] {
    const purchasedConsumableIds = useInventoryStore.getState().purchasedConsumableIds;
    return purchasedConsumableIds.map((itemId) => normalizeItemId(itemId));
}

export type PickedupImportState = {
    weaponItemIds: string[];
    consumableItemIds: string[];
    armorItemIds: string[];
    allItemIds: string[];
};

function findPickedupFolder(items: InventoryNode[]): InventoryNode | undefined {
    for (const item of items) {
        if (item.kind === "folder") {
            if (item.id === "pickedup_folder" || item.name.toLowerCase() === "pickedup") {
                return item;
            }

            const nested = findPickedupFolder(item.children);
            if (nested) {
                return nested;
            }
        }
    }

    return undefined;
}

function appendPickedupItem(item: InventoryNode, state: {
    weaponIds: Set<string>;
    consumableIds: Set<string>;
    armorIds: Set<string>;
}): void {
    if (item.kind === "folder") {
        for (const child of item.children) {
            appendPickedupItem(child, state);
        }
        return;
    }

    const normalizedItemId = normalizeItemId(item.itemId);
    if (normalizedItemId.length === 0) {
        return;
    }

    if (item.kind === "weapon") {
        state.weaponIds.add(normalizedItemId);
        return;
    }

    if (item.kind === "consumable") {
        state.consumableIds.add(normalizedItemId);
        return;
    }

    if (item.kind === "armor") {
        state.armorIds.add(normalizedItemId);
    }
}

function appendOwnedInventoryItems(items: InventoryNode[], state: {
    weaponIds: Set<string>;
    consumableIds: Set<string>;
    armorIds: Set<string>;
}): void {
    for (const item of items) {
        if (item.kind === "folder") {
            appendOwnedInventoryItems(item.children, state);
            continue;
        }

        const normalizedItemId = normalizeItemId(item.itemId);
        if (normalizedItemId.length === 0) {
            continue;
        }

        if (item.kind === "weapon") {
            state.weaponIds.add(normalizedItemId);
            continue;
        }

        if (item.kind === "consumable") {
            state.consumableIds.add(normalizedItemId);
            continue;
        }

        if (item.kind === "armor") {
            state.armorIds.add(normalizedItemId);
        }
    }
}

export function getUnlockedPickedupImportState(): PickedupImportState {
    const inventoryState = useInventoryStore.getState();
    const inventory = inventoryState.playerInventory;
    const pickedupFolder = findPickedupFolder(inventory);
    const state = {
        weaponIds: new Set<string>(),
        consumableIds: new Set<string>(),
        armorIds: new Set<string>()
    };

    if (pickedupFolder) {
        appendPickedupItem(pickedupFolder, state);
    }

    // Fallback: include all owned item nodes regardless of folder placement.
    appendOwnedInventoryItems(inventory, state);

    for (const purchasedWeaponId of inventoryState.purchasedWeaponIds) {
        const normalizedWeaponId = normalizeItemId(purchasedWeaponId);
        if (normalizedWeaponId.length > 0) {
            state.weaponIds.add(normalizedWeaponId);
        }
    }

    for (const purchasedConsumableId of inventoryState.purchasedConsumableIds) {
        const normalizedConsumableId = normalizeItemId(purchasedConsumableId);
        if (normalizedConsumableId.length > 0) {
            state.consumableIds.add(normalizedConsumableId);
        }
    }

    const weaponItemIds = Array.from(state.weaponIds);
    const consumableItemIds = Array.from(state.consumableIds);
    const armorItemIds = Array.from(state.armorIds);

    return {
        weaponItemIds,
        consumableItemIds,
        armorItemIds,
        allItemIds: [...weaponItemIds, ...consumableItemIds, ...armorItemIds]
    };
}

function hasUnlockedRequestedItems(unlockedItemIds: string[], importedNames?: string[]): boolean {
    if (!importedNames || importedNames.length === 0) {
        return unlockedItemIds.length > 0;
    }

    const importedItemIds = importedNames
        .map((name) => normalizeImportedItemSymbol(name))
        .filter((name) => name.length > 0 && name !== "*");

    if (importedItemIds.length === 0) {
        return unlockedItemIds.length > 0;
    }

    return importedItemIds.every((itemId) => unlockedItemIds.includes(itemId));
}

export function isRuntimeImportUnlocked(moduleName: string, importedNames?: string[]): boolean {
    if (isPickedupModule(moduleName)) {
        const pickedupState = getUnlockedPickedupImportState();
        return hasUnlockedRequestedItems(pickedupState.allItemIds, importedNames);
    }

    if (isWeaponModule(moduleName)) {
        if (!isEnemyBattleActive()) {
            return false;
        }

        return hasUnlockedRequestedItems(getUnlockedWeaponImportIds(), importedNames);
    }

    if (isConsumableModule(moduleName)) {
        if (!isEnemyBattleActive()) {
            return false;
        }

        return hasUnlockedRequestedItems(getUnlockedConsumableImportIds(), importedNames);
    }

    return true;
}
