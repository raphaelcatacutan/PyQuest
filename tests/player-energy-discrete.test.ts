/** @vitest-environment jsdom */

import { beforeEach, describe, expect, it } from "vitest";
import { usePlayerStore } from "../src/game/store/playerStore";

describe("player regen discretization", () => {
  beforeEach(() => {
    usePlayerStore.setState({
      hp: 10,
      maxHP: 20,
      hpRegenPerSecond: 5,
      hpRegenCarry: 0,
      energy: 10,
      maxEnergy: 20,
      energyRegenPerSecond: 4,
      energyRegenCarry: 0,
    });
  });

  it("keeps gainEnergy and spendEnergy integer-only", () => {
    const player = usePlayerStore.getState();

    player.gainEnergy(1.9);
    expect(usePlayerStore.getState().energy).toBe(11);
    expect(Number.isInteger(usePlayerStore.getState().energy)).toBe(true);

    player.spendEnergy(0.4);
    expect(usePlayerStore.getState().energy).toBe(10);
    expect(Number.isInteger(usePlayerStore.getState().energy)).toBe(true);
  });

  it("accumulates regen carry while storing only integer energy", () => {
    const player = usePlayerStore.getState();

    player.applyEnergyRegen(0.2, "combat");
    expect(usePlayerStore.getState().energy).toBe(10);
    expect(usePlayerStore.getState().energyRegenCarry).toBeGreaterThan(0);
    expect(usePlayerStore.getState().energyRegenCarry).toBeLessThan(1);

    player.applyEnergyRegen(0.2, "combat");
    expect(usePlayerStore.getState().energy).toBe(11);
    expect(Number.isInteger(usePlayerStore.getState().energy)).toBe(true);
    expect(usePlayerStore.getState().energyRegenCarry).toBeGreaterThanOrEqual(0);
    expect(usePlayerStore.getState().energyRegenCarry).toBeLessThan(1);
  });

  it("clamps out-of-combat regen to maxEnergy with no decimals", () => {
    usePlayerStore.setState({
      energy: 19,
      maxEnergy: 20,
      energyRegenPerSecond: 4,
      energyRegenCarry: 0,
    });

    usePlayerStore.getState().applyEnergyRegen(1, "out_of_combat");
    expect(usePlayerStore.getState().energy).toBe(20);
    expect(Number.isInteger(usePlayerStore.getState().energy)).toBe(true);
  });

  it("regenerates hp out of combat with integer steps", () => {
    const player = usePlayerStore.getState();

    player.applyHpRegen(0.1, "out_of_combat");
    expect(usePlayerStore.getState().hp).toBe(10);
    expect(usePlayerStore.getState().hpRegenCarry).toBeGreaterThan(0);
    expect(usePlayerStore.getState().hpRegenCarry).toBeLessThan(1);

    player.applyHpRegen(0.1, "out_of_combat");
    expect(usePlayerStore.getState().hp).toBe(11);
    expect(Number.isInteger(usePlayerStore.getState().hp)).toBe(true);
    expect(usePlayerStore.getState().hpRegenCarry).toBeGreaterThanOrEqual(0);
    expect(usePlayerStore.getState().hpRegenCarry).toBeLessThan(1);
  });

  it("does not regenerate hp in combat mode", () => {
    usePlayerStore.getState().applyHpRegen(1, "combat");
    expect(usePlayerStore.getState().hp).toBe(10);
    expect(usePlayerStore.getState().hpRegenCarry).toBe(0);
  });

  it("clamps out-of-combat hp regen to maxHP", () => {
    usePlayerStore.setState({
      hp: 19,
      maxHP: 20,
      hpRegenPerSecond: 5,
      hpRegenCarry: 0,
    });

    usePlayerStore.getState().applyHpRegen(1, "out_of_combat");
    expect(usePlayerStore.getState().hp).toBe(20);
    expect(Number.isInteger(usePlayerStore.getState().hp)).toBe(true);
  });

  it("does not regenerate energy while dead", () => {
    usePlayerStore.setState({
      hp: 0,
      energy: 10,
      maxEnergy: 20,
      energyRegenPerSecond: 4,
      energyRegenCarry: 0.4,
    });

    usePlayerStore.getState().applyEnergyRegen(1, "out_of_combat");
    expect(usePlayerStore.getState().energy).toBe(10);
    expect(usePlayerStore.getState().energyRegenCarry).toBe(0.4);
  });

  it("does not regenerate hp while dead", () => {
    usePlayerStore.setState({
      hp: 0,
      maxHP: 20,
      hpRegenPerSecond: 5,
      hpRegenCarry: 0.6,
    });

    usePlayerStore.getState().applyHpRegen(1, "out_of_combat");
    expect(usePlayerStore.getState().hp).toBe(0);
    expect(usePlayerStore.getState().hpRegenCarry).toBe(0.6);
  });
});
