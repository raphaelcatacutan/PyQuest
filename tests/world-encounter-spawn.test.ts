import { describe, expect, it } from "vitest";
import { pickWorldEncounterKind } from "../src/components/events/worldEncounterSpawn";

describe("world encounter spawn selection", () => {
  it("returns enemy 90% branch when both pools exist", () => {
    const result = pickWorldEncounterKind({
      enemyCount: 5,
      bossCount: 2,
      enemyChance: 0.9,
      rng: () => 0.25,
    });
    expect(result).toBe("enemy");
  });

  it("returns boss 10% branch when both pools exist", () => {
    const result = pickWorldEncounterKind({
      enemyCount: 5,
      bossCount: 2,
      enemyChance: 0.9,
      rng: () => 0.95,
    });
    expect(result).toBe("boss");
  });

  it("falls back to enemy when boss pool is empty", () => {
    const result = pickWorldEncounterKind({
      enemyCount: 3,
      bossCount: 0,
      rng: () => 0.99,
    });
    expect(result).toBe("enemy");
  });

  it("falls back to boss when enemy pool is empty", () => {
    const result = pickWorldEncounterKind({
      enemyCount: 0,
      bossCount: 3,
      rng: () => 0.01,
    });
    expect(result).toBe("boss");
  });

  it("returns null when no encounters are available", () => {
    const result = pickWorldEncounterKind({
      enemyCount: 0,
      bossCount: 0,
    });
    expect(result).toBeNull();
  });
});

