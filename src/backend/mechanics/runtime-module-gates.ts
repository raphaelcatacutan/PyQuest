import { useGameStore } from "../../game/store/gameStore";
import { useInventoryStore } from "../../game/store/inventoryStore";
import {
    isConsumableModule,
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
