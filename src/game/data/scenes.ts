import { SceneNameTypes } from '../types/scene.types'
import {
  villageBg,
  labyrinthBg,
  dungeonBg,
} from '@/src/assets'

/**
 * 
 *  Scene Database
 */

export const Scene: Record<SceneNameTypes, string> = {
  village: villageBg,
  labyrinth: labyrinthBg,
  dungeon: dungeonBg,
  // TODO: Follow-up other scenes 
}