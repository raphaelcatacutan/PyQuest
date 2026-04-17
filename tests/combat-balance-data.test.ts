import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

type Combatant = {
  id: string;
  dmg: number;
  atkSpeed: number;
};

function readCombatantMap(path: string): Record<string, Combatant> {
  const raw = readFileSync(path, "utf8");
  return JSON.parse(raw) as Record<string, Combatant>;
}

describe("combat balance data", () => {
  it("keeps all enemy attack speed values between 3 and 5 seconds", () => {
    const enemies = Object.values(readCombatantMap("src/game/json/enemies.json"));
    expect(enemies.length).toBeGreaterThan(0);

    enemies.forEach((enemy) => {
      expect(enemy.atkSpeed).toBeGreaterThanOrEqual(3);
      expect(enemy.atkSpeed).toBeLessThanOrEqual(5);
    });
  });

  it("keeps all boss attack speed values between 3 and 5 seconds", () => {
    const bosses = Object.values(readCombatantMap("src/game/json/bosses.json"));
    expect(bosses.length).toBeGreaterThan(0);

    bosses.forEach((boss) => {
      expect(boss.atkSpeed).toBeGreaterThanOrEqual(3);
      expect(boss.atkSpeed).toBeLessThanOrEqual(5);
    });
  });

  it("keeps damage in reduced post-balance ranges", () => {
    const enemies = Object.values(readCombatantMap("src/game/json/enemies.json"));
    const bosses = Object.values(readCombatantMap("src/game/json/bosses.json"));

    enemies.forEach((enemy) => {
      expect(enemy.dmg).toBeGreaterThanOrEqual(1);
      expect(enemy.dmg).toBeLessThanOrEqual(16);
      expect(Number.isInteger(enemy.dmg)).toBe(true);
    });

    bosses.forEach((boss) => {
      expect(boss.dmg).toBeGreaterThanOrEqual(1);
      expect(boss.dmg).toBeLessThanOrEqual(26);
      expect(Number.isInteger(boss.dmg)).toBe(true);
    });
  });
});

