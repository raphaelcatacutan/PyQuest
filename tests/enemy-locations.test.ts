import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Enemy location coverage', () => {
  it('keeps at least 5 enemies per active and required location', () => {
    const requiredLocations = [
      'forest',
      'desert',
      'swamp',
      'cemetery',
      'tundra',
      'jungle',
      'temple',
    ];

    const enemies = JSON.parse(
      readFileSync(resolve(process.cwd(), 'src/game/json/enemies.json'), 'utf8'),
    ) as Record<string, { location?: Record<string, number> }>;

    const strictLocationNames: Record<string, string> = {
      forest_fang: 'forest',
      dune_raider: 'desert',
      dungeon_puppet: 'dungeon',
      village_thief: 'village',
      labyrinth_guardian: 'labyrinth',
    };

    for (const [enemyId, requiredLocation] of Object.entries(strictLocationNames)) {
      const enemyLocations = Object.keys(enemies[enemyId]?.location ?? {});
      expect(enemyLocations).toEqual([requiredLocation]);
    }

    const scenes = Object.keys(
      JSON.parse(
        readFileSync(resolve(process.cwd(), 'src/game/json/scenes.json'), 'utf8'),
      ) as Record<string, string>,
    );

    const locationsToValidate = [...new Set([...scenes, ...requiredLocations])];

    const enemyCountByScene = Object.fromEntries(
      locationsToValidate.map((scene) => [scene, 0]),
    );

    for (const enemy of Object.values(enemies)) {
      for (const scene of locationsToValidate) {
        if (enemy.location && scene in enemy.location) {
          enemyCountByScene[scene] += 1;
        }
      }
    }

    for (const scene of locationsToValidate) {
      expect(enemyCountByScene[scene]).toBeGreaterThanOrEqual(5);
    }
  });
});