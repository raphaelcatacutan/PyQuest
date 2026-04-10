import { SceneTypes } from '../types/scene.types'
import sceneData from '../json/scenes.json'

/**
 * 
 *  Scene Database
 */

export const Scenes: Record<SceneTypes, string> = sceneData as Record<SceneTypes, string>