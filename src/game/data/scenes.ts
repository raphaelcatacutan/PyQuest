import { SceneNameTypes } from '../store/scene.types'
import {
  villageBg,
  labyrinthBg,
  dungeonBg,
} from '@/src/assets'

/**
 * 
 *  Scene Database
 */

export const SceneBg: Record<SceneNameTypes, { imgBg: string }> = {
  village: {
    imgBg: villageBg
  },
  labyrinth: {
    imgBg: labyrinthBg
  },
  dungeon: {
    imgBg: dungeonBg
  }
  // TODO: Follow-up other scenes 
}