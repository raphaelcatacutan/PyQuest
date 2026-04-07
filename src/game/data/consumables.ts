import { Consumable } from "../types/consumable.types";
import consumableData from "./consumables.json"

/**
 * 
 *  Consumable Database
 */

export const Consumables: Record<string, Consumable> = consumableData as Record<string, Consumable>