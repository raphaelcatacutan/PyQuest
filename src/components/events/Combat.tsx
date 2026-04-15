import { useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/shallow";
import EnemyEncounter from "./EnemyEncounter";
import BossEncounter from "./BossEncounter";
import {
  useBountyQuestStore,
  useBossStore,
  useEnemyStore,
  useGameStore,
  useKillTrackerStore,
  usePlayerStore,
  useSceneStore,
  useTutorialStore,
} from "@/src/game/store";
import {
  createEncounterController,
  EncounterController,
} from "@/src/backend/mechanics/combat";
import { getEnemiesByLocation } from "@/src/game/data/enemies";
import { getBossesByLocation } from "@/src/game/data/bosses";

const DEBUG_AI = true;

export default function Combat() {
  const scene = useSceneStore((s) => s.scene);
  const { inCombat, isEnemy, toggleInCombat, toggleIsEnemy } = useGameStore(
    useShallow((s) => ({
      inCombat: s.inCombat,
      isEnemy: s.isEnemy,
      toggleInCombat: s.toggleInCombat,
      toggleIsEnemy: s.toggleIsEnemy,
    })),
  );

  const enemyId = useEnemyStore((s) => s.enemy?.id ?? "");
  const bossId = useBossStore((s) => s.id);
  const enemyHp = useEnemyStore((s) => s.enemy?.hp ?? 0);
  const bossHp = useBossStore((s) => s.hp);
  const playerHp = usePlayerStore((s) => s.hp);
  const playerMaxHp = usePlayerStore((s) => s.maxHP);
  const playerMaxEnergy = usePlayerStore((s) => s.maxEnergy);

  const spawnEnemy = useEnemyStore((s) => s.spawnEnemy);
  const clearEnemy = useEnemyStore((s) => s.clearEnemy);
  const spawnBoss = useBossStore((s) => s.spawnBoss);
  const clearBoss = useBossStore((s) => s.clearBoss);

  const handleQuestProgressAfterKill = (targetId: string) => {
    if (!targetId) return;

    const killTracker = useKillTrackerStore.getState();
    const bounty = useBountyQuestStore.getState();

    killTracker.recordKill(targetId);
    bounty.checkQuestProgress();

    const latestBounty = useBountyQuestStore.getState();
    const currentLevelKey = latestBounty.questLevel.toString();
    const currentLevelQuests = latestBounty.allQuests[currentLevelKey] || [];
    const hasQuestList = currentLevelQuests.length > 0;
    const isLevelComplete = hasQuestList && currentLevelQuests.every((quest) => quest.isCompleted);

    if (!isLevelComplete) {
      return;
    }

    const availableLevels = Object.keys(latestBounty.allQuests)
      .map((level) => Number(level))
      .filter((level) => Number.isFinite(level));
    const maxQuestLevel = availableLevels.length > 0 ? Math.max(...availableLevels) : latestBounty.questLevel;

    if (latestBounty.questLevel >= maxQuestLevel) {
      latestBounty.setHeader("All bounty quests are complete.");
      latestBounty.toggleDisplayBountyQuest(true);
      return;
    }

    latestBounty.incrementQuestLevel();
    const nextLevel = useBountyQuestStore.getState().questLevel;
    usePlayerStore.getState().levelUp();
    useTutorialStore.getState().toggleIsTutorial(false);
    useBountyQuestStore.getState().setHeader(`New bounty quests unlocked for level ${nextLevel}.`);
    useBountyQuestStore.getState().toggleDisplayBountyQuest(true);
  };

  const resetToCurrentLessonOnDeath = () => {
    const questLevel = useBountyQuestStore.getState().questLevel;
    const targetPhaseIndex = Math.max(0, questLevel - 1);

    useTutorialStore.getState().skipToPhase(targetPhaseIndex);
    useTutorialStore.getState().toggleIsTutorial(true);

    usePlayerStore.setState({
      hp: playerMaxHp,
      energy: playerMaxEnergy,
    });

    useSceneStore.getState().setScene("village");
    useGameStore.setState({
      inVillage: true,
      inCombat: false,
    });

    clearEnemy();
    clearBoss();
  };

  const controllerRef = useRef<EncounterController | null>(null);
  const activeKeyRef = useRef<string>("");
  const timerRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);

  const [debugState, setDebugState] = useState<{
    isBoss: boolean;
    enemyId: string;
    action: string;
    reward: number;
    dmgToPlayer: number;
    dmgToEnemy: number;
    healEnemy: number;
    energyDelta: number;
    playerHp: number;
    enemyHp: number;
    enemyEnergy: number;
    tickMs: number;
    done: boolean;
  } | null>(null);

  const stopLoop = () => {
    if (controllerRef.current) {
      controllerRef.current.endEncounter();
      controllerRef.current = null;
      activeKeyRef.current = "";
    }

    if (timerRef.current != null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    if (!inCombat) {
      stopLoop();
      return;
    }

    if (enemyId || bossId) return;

    const enemies = getEnemiesByLocation(scene);
    const bosses = getBossesByLocation(scene);
    const enemyKeys = Object.keys(enemies);
    const bossKeys = Object.keys(bosses);

    const canSpawnEnemy = enemyKeys.length > 0;
    const canSpawnBoss = bossKeys.length > 0;
    if (!canSpawnEnemy && !canSpawnBoss) {
      toggleInCombat(false);
      return;
    }

    const shouldSpawnBoss =
      canSpawnBoss && (!canSpawnEnemy || Math.random() <= 0.5);

    if (shouldSpawnBoss) {
      const randomBossKey =
        bossKeys[Math.floor(Math.random() * bossKeys.length)];
      spawnBoss(bosses[randomBossKey]);
      clearEnemy();
      toggleIsEnemy(false);
      return;
    }

    const randomEnemyKey =
      enemyKeys[Math.floor(Math.random() * enemyKeys.length)];
    spawnEnemy(enemies[randomEnemyKey]);
    clearBoss();
    toggleIsEnemy(true);
  }, [
    inCombat,
    enemyId,
    bossId,
    scene,
    spawnEnemy,
    clearEnemy,
    spawnBoss,
    clearBoss,
    toggleIsEnemy,
  ]);

  useEffect(() => {
    if (!inCombat) return;

    if (playerHp <= 0) {
      stopLoop();
      resetToCurrentLessonOnDeath();
      return;
    }

    if (isEnemy && enemyId && enemyHp <= 0) {
      handleQuestProgressAfterKill(enemyId);
      toggleInCombat(false);
      clearEnemy();
      return;
    }

    if (!isEnemy && bossId && bossHp <= 0) {
      handleQuestProgressAfterKill(bossId);
      toggleInCombat(false);
      clearBoss();
    }
  }, [
    inCombat,
    isEnemy,
    enemyId,
    bossId,
    enemyHp,
    bossHp,
    playerHp,
    clearEnemy,
    clearBoss,
    toggleInCombat,
  ]);

  useEffect(() => {
    if (!inCombat) {
      stopLoop();
      return;
    }

    const activeId = isEnemy ? enemyId : bossId;
    if (!activeId) {
      stopLoop();
      return;
    }

    const key = `${isEnemy ? "enemy" : "boss"}:${activeId}`;
    if (activeKeyRef.current !== key) {
      const target = isEnemy
        ? useEnemyStore.getState().enemy
        : useBossStore.getState();
      if (!target) return;
      controllerRef.current = createEncounterController({
        kind: isEnemy ? "mob" : "boss",
        enemy: {
          hp: target.hp,
          maxHp: target.maxHp,
          energy: target.energy,
          maxEnergy: target.maxEnergy,
          def: target.def,
          dmg: target.dmg,
          critChance: target.critChance,
          critDmg: target.critDmg,
          atkSpeed: target.atkSpeed,
          skills: target.skills,
        },
      });
      activeKeyRef.current = key;
    }

    if (timerRef.current == null) {
      lastTickRef.current = performance.now();
      timerRef.current = window.setInterval(() => {
        const controller = controllerRef.current;
        if (!controller) return;

        const now = performance.now();
        const deltaMs = now - lastTickRef.current;
        lastTickRef.current = now;

        const player = usePlayerStore.getState();
        const enemyState = isEnemy ? useEnemyStore.getState() : null;
        const bossState = !isEnemy ? useBossStore.getState() : null;
        const target = isEnemy ? enemyState?.enemy : bossState;
        if (!target?.id) return;

        const result = controller.tick({
          player: {
            hp: player.hp,
            maxHP: player.maxHP,
            def: player.def,
            baseDmg: player.baseDmg,
            baseCritChance: player.baseCritChance,
            baseCritDmg: player.baseCritDmg,
            atkSpeed: player.atkSpeed,
            level: player.level,
          },
          enemy: {
            hp: target.hp,
            maxHp: target.maxHp,
            energy: target.energy,
            maxEnergy: target.maxEnergy,
            def: target.def,
            dmg: target.dmg,
            critChance: target.critChance,
            critDmg: target.critDmg,
            atkSpeed: target.atkSpeed,
            skills: target.skills,
          },
          deltaMs,
        });

        if (result.damageToPlayer > 0) {
          usePlayerStore.getState().takeDamage(result.damageToPlayer);
        }

        if (result.damageToEnemy > 0) {
          const applyDamage = isEnemy
            ? useEnemyStore.getState().takeDamage
            : useBossStore.getState().takeDamage;
          applyDamage(result.damageToEnemy);
        }

        if (result.healEnemy > 0) {
          const applyHeal = isEnemy
            ? useEnemyStore.getState().gainHp
            : useBossStore.getState().gainHp;
          applyHeal(result.healEnemy);
        }

        if (result.energyDelta !== 0) {
          if (result.energyDelta < 0) {
            const spendEnergy = isEnemy
              ? useEnemyStore.getState().takeEnergyCost
              : useBossStore.getState().takeEnergyCost;
            spendEnergy(Math.abs(result.energyDelta));
          } else {
            const gainEnergy = isEnemy
              ? useEnemyStore.getState().gainEnergy
              : useBossStore.getState().gainEnergy;
            gainEnergy(result.energyDelta);
          }
        }

        if (DEBUG_AI) {
          const playerAfter = usePlayerStore.getState();
          const enemyAfter = isEnemy
            ? useEnemyStore.getState().enemy
            : useBossStore.getState();
          if (enemyAfter) {
            setDebugState({
              isBoss: !isEnemy,
              enemyId: enemyAfter.id,
              action: result.enemyAction?.label ?? "none",
              reward: Number(result.reward.toFixed(3)),
              dmgToPlayer: result.damageToPlayer,
              dmgToEnemy: result.damageToEnemy,
              healEnemy: result.healEnemy,
              energyDelta: result.energyDelta,
              playerHp: playerAfter.hp,
              enemyHp: enemyAfter.hp,
              enemyEnergy: enemyAfter.energy,
              tickMs: Math.round(deltaMs),
              done: result.done,
            });
          }
        }

        if (result.done) {
          const playerAfter = usePlayerStore.getState();
          if (playerAfter.hp <= 0) {
            stopLoop();
            resetToCurrentLessonOnDeath();
            return;
          }

          const activeTarget = isEnemy
            ? useEnemyStore.getState().enemy
            : useBossStore.getState();

          if (activeTarget?.id && activeTarget.hp <= 0) {
            handleQuestProgressAfterKill(activeTarget.id);
          }

          stopLoop();
          toggleInCombat(false);
        }
      }, 200);
    }

    return () => stopLoop();
  }, [inCombat, isEnemy, enemyId, bossId, toggleInCombat]);

  if (!inCombat) return null;
  if (isEnemy && !enemyId) return null;
  if (!isEnemy && !bossId) return null;

  return (
    <div className="relative flex h-full w-full z-1">
      {isEnemy ? <EnemyEncounter /> : <BossEncounter />}

      {DEBUG_AI && debugState && (
        <div className="absolute left-3 bottom-3 z-10 text-xs bg-black/70 text-white rounded px-3 py-2 w-64">
          <div className="font-semibold">AI Debug</div>
          <div>Type: {debugState.isBoss ? "Boss" : "Mob"}</div>
          <div>Enemy: {debugState.enemyId || "-"}</div>
          <div>Action: {debugState.action}</div>
          <div>Reward: {debugState.reward}</div>
          <div>Tick: {debugState.tickMs}ms</div>
          <div>Player HP: {debugState.playerHp}</div>
          <div>Enemy HP: {debugState.enemyHp}</div>
          <div>Enemy EN: {debugState.enemyEnergy}</div>
          <div>DMG to Player: {debugState.dmgToPlayer}</div>
          <div>DMG to Enemy: {debugState.dmgToEnemy}</div>
          <div>Heal Enemy: {debugState.healEnemy}</div>
          <div>Energy Delta: {debugState.energyDelta}</div>
          <div>Done: {debugState.done ? "yes" : "no"}</div>
        </div>
      )}
    </div>
  );
}
