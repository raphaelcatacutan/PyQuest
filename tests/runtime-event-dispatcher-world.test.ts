/** @vitest-environment jsdom */

import { beforeEach, describe, expect, it } from "vitest";
import { dispatchPythonRuntimeEvent } from "../src/backend/mechanics/runtime-event-dispatcher";
import {
  useGameStore,
  useSceneStore,
  useTerminalStore,
  useTutorialStore,
} from "../src/game/store";

describe("runtime world events", () => {
  beforeEach(() => {
    useGameStore.setState({
      inVillage: true,
      isEnemy: true,
      inCombat: false,
    });
    useSceneStore.setState({ scene: "village" });
    useTutorialStore.setState({ isTutorial: false });
    useTerminalStore.setState({ logs: [] });
  });

  it("blocks explore() in village", () => {
    dispatchPythonRuntimeEvent({
      name: "builtin.explore",
      payload: { state: true },
    });

    expect(useGameStore.getState().inCombat).toBe(false);
    expect(useTerminalStore.getState().logs).toContain(
      "[PY]: explore() is not allowed in village. Use goTo(...) first.",
    );
  });

  it("allows explore() outside village", () => {
    useSceneStore.setState({ scene: "forest" });

    dispatchPythonRuntimeEvent({
      name: "builtin.explore",
      payload: { state: true },
    });

    expect(useGameStore.getState().inCombat).toBe(true);
  });

  it("blocks explore(False) during active enemy battle", () => {
    useSceneStore.setState({ scene: "forest" });
    useGameStore.setState({ inCombat: true, isEnemy: true });

    dispatchPythonRuntimeEvent({
      name: "builtin.explore",
      payload: { state: false },
    });

    expect(useGameStore.getState().inCombat).toBe(true);
    expect(useTerminalStore.getState().logs).toContain(
      "[PY]: explore(False) cannot end an active enemy battle.",
    );
  });
});
