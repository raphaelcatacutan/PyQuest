import { Consumables } from "../../game/data/consumables";
import { Weapons } from "../../game/data/weapons";
import type { Consumable } from "../../game/types/consumable.types";
import { normalizeItemId } from "./shop-item-modules";

function computeConsumableEnergyCost(consumable: Consumable): number {
    // Cooldown is stored in seconds.
    const cooldownCost = Math.max(1, Math.round(consumable.cooldown / 2));

    const effectCost = consumable.effects.reduce((total, effect) => {
        if (effect.type === "restore") {
            return total + Math.max(1, Math.ceil(effect.amount / 30));
        }

        if (effect.type === "buff") {
            return total + Math.max(2, Math.ceil((effect.multiplier - 1) * 10));
        }

        return total + Math.max(2, Math.ceil(effect.amount / 20));
    }, 0);

    return Math.max(1, cooldownCost + effectCost - 1);
}

export const weaponUseEnergyCosts: Record<string, number> = Object.fromEntries(
    Object.values(Weapons).map((weapon) => {
        const itemId = normalizeItemId(weapon.id);
        const energyCost = Math.max(1, Math.floor(weapon.energyCostPerSwing));

        return [itemId, energyCost];
    })
);

export const consumableUseEnergyCosts: Record<string, number> = Object.fromEntries(
    Object.values(Consumables).map((consumable) => {
        const itemId = normalizeItemId(consumable.id);
        const energyCost = computeConsumableEnergyCost(consumable);

        return [itemId, energyCost];
    })
);

export function resolveWeaponUseEnergyCost(itemId: string, fallback = 1): number {
    const normalizedItemId = normalizeItemId(itemId);
    const resolved = weaponUseEnergyCosts[normalizedItemId];

    return typeof resolved === "number" && Number.isFinite(resolved)
        ? Math.max(1, Math.floor(resolved))
        : Math.max(1, Math.floor(fallback));
}

export function resolveConsumableUseEnergyCost(itemId: string, fallback = 1): number {
    const normalizedItemId = normalizeItemId(itemId);
    const resolved = consumableUseEnergyCosts[normalizedItemId];

    return typeof resolved === "number" && Number.isFinite(resolved)
        ? Math.max(1, Math.floor(resolved))
        : Math.max(1, Math.floor(fallback));
}
