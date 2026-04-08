import { Armor } from "../types/armor.types";
import armorData from "../json/armors.json"
import {

} from '@/src/assets'

/**
 * 
 *  Armor Database
 */

export const Armors: Record<string, Armor> = armorData as Record<string, Armor>