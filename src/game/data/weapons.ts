import { Weapon } from "../types/weapon.types";
import weaponData from "./weapons.json"
import {

} from '@/src/assets'

/**
 * 
 *  Weapon Database
 */

export const Weapons: Record<string, Weapon> = weaponData as Record<string, Weapon>