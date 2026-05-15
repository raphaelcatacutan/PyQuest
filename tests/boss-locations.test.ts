import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Boss location coverage', () => {
  it('keeps at least 3 unique bosses per required location with two locations per boss', () => {
    const requiredLocations = ['forest', 'swamp', 'jungle', 'temple', 'desert', 'village'];

    const bosses = JSON.parse(
      readFileSync(resolve(process.cwd(), 'src/game/json/bosses.json'), 'utf8'),
    ) as Record<string, { location?: Record<string, number>; skills?: unknown[] }>;

    const bossCountByLocation = Object.fromEntries(
      requiredLocations.map((location) => [location, 0]),
    );

    for (const boss of Object.values(bosses)) {
      const bossLocations = Object.keys(boss.location ?? {});
      const skillCount = boss.skills?.length ?? 0;

      expect(bossLocations.length).toBe(2);
      expect(skillCount).toBeGreaterThanOrEqual(1);
      expect(skillCount).toBeLessThanOrEqual(4);

      for (const location of bossLocations) {
        expect(requiredLocations).toContain(location);
        bossCountByLocation[location] += 1;
      }
    }

    for (const location of requiredLocations) {
      expect(bossCountByLocation[location]).toBeGreaterThanOrEqual(3);
    }
  });
});