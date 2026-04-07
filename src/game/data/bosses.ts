import { Boss } from "../types/boss.types"
import bossData from '../json/bosses.json'
import {

} from '@/src/assets'

/**
 * 
 *  Boss Database
 */

export const Bosses: Record<string, Boss> = bossData as Record<string, Boss>;