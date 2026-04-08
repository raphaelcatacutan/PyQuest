import { Consumable } from "../types/consumable.types";
import consumableData from "../json/consumables.json"

/**
 * 
 *  Consumable Database
 */

export const Consumables: Record<string, Consumable> = consumableData as Record<string, Consumable>