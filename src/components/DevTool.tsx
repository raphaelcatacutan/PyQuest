import Button from "./ui/Button";
import {
  useCombatDebugStore,
  useDevToolStore,
  useEnemyStore,
  useBossStore,
  useGameStore,
  usePlayerStore,
  useBountyQuestStore,
  useSceneStore,
  useTerminalStore,
  useGuideStore,
  useInventoryStore,
  useTrialsStore,
  useTutorialStore,
  useNPCStore,
  useKillTrackerStore,
} from "../game/store";
import { SceneTypes } from "../game/types/scene.types";
import { useState } from "react";
import { Enemies } from "../game/data/enemies";
import { MachineProblems } from "../game/data/dungeon";
import { useShallow } from "zustand/shallow";
import showToast from "./ui/Toast";
import { getDPByDifficulty } from "../game/data/trials";
import { Tutorials } from "../game/data/tutorial";
import { useSoundStore } from "../game/store/soundStore";
import { LootDrop, LootItem } from "../game/types/loot.types";

export default function DevTool() {
  const { devTool, toggleDevTool } = useDevToolStore(
    useShallow((s) => ({
      devTool: s.devTool,
      toggleDevTool: s.toggleDevTool,
    })),
  );
  if (!devTool) return null;

  const [input, setInput] = useState("");
  const { playerId, addInventoryItem } = useInventoryStore(
    useShallow((s) => ({
      playerId: s.player_id,
      addInventoryItem: s.addInventoryItem,
    })),
  );
  const { inCombat, toggleInCombat } = useGameStore(
    useShallow((s) => ({
      inCombat: s.inCombat,
      toggleInCombat: s.toggleInCombat,
    })),
  );
  const { isEnemy, toggleIsEnemy } = useGameStore(
    useShallow((s) => ({
      isEnemy: s.isEnemy,
      toggleIsEnemy: s.toggleIsEnemy,
    })),
  );
  const clearEnemy = useEnemyStore((s) => s.clearEnemy);
  const enemyHp = useEnemyStore((s) => s.enemy?.hp ?? 0);
  const enemyProblem = useEnemyStore((s) => s.activeProblem);
  const enemyTakeDamage = useEnemyStore((s) => s.takeDamage);
  const bossHp = useBossStore((s) => s.hp);
  const bossProblem = useBossStore((s) => s.activeProblem);
  const bossTakeDamage = useBossStore((s) => s.takeDamage);
  const { isDamaged, toggleIsDamaged } = usePlayerStore(
    useShallow((s) => ({
      isDamaged: s.isDamaged,
      toggleIsDamaged: s.toggleIsDamaged,
    })),
  );
  const { displayBountyQuest, toggleDisplayBountyQuest, toggleQuest } =
    useBountyQuestStore(
      useShallow((s) => ({
        displayBountyQuest: s.displayBountyQuest,
        toggleDisplayBountyQuest: s.toggleDisplayBountyQuest,
        toggleQuest: s.toggleQuest,
      })),
    );
  const { scene, setScene } = useSceneStore();
  const user_id = usePlayerStore((s) => s.user_id);
  const appendToLogs = useTerminalStore((s) => s.appendToLog);
  const gainCoin = usePlayerStore((s) => s.gainCoins);
  const { hp, selfHarm, gainHP } = usePlayerStore(
    useShallow((s) => ({
      hp: s.hp,
      selfHarm: s.takeDamage,
      gainHP: s.gainHP,
    })),
  );
  const guide = useGuideStore();
  const trials = useTrialsStore();
  const npc = useNPCStore();
  const tutorial = useTutorialStore();

  const gainXP = usePlayerStore((s) => s.gainXP);

  const easyDP = getDPByDifficulty("easy");
  const easyLength = easyDP.length;
  const mediumDP = getDPByDifficulty("medium");
  const hardDP = getDPByDifficulty("hard");

  const combatText = `Combat (${inCombat})`;
  const dmgHUDText = `Dmg HUD (${isDamaged})`;
  // const toastText = `Toast (${})`
  const BountyQuestText = `Bounty Quest (${displayBountyQuest})`;
  const sceneText = `Scene: ${scene}`;
  const playerDataText = `UserId: ${user_id} | PlayerId: ${playerId}`;

  const tuts = useTutorialStore();
  const sfx = useSoundStore();
  const bounty = useBountyQuestStore();
  const kill = useKillTrackerStore();

  function randomBetween(min: number, max: number): number {
    const low = Math.max(0, Math.floor(Math.min(min, max)));
    const high = Math.max(low, Math.floor(Math.max(min, max)));
    return Math.floor(Math.random() * (high - low + 1)) + low;
  }

  function grantLootItems(reward: LootDrop): number {
    let totalGranted = 0;

    const grantCategory = (
      items: LootItem[],
      kind: "weapon" | "armor" | "consumable",
    ) => {
      items.forEach((item) => {
        const quantity = Math.max(1, item.quantity ?? 1);
        for (let index = 0; index < quantity; index += 1) {
          const uniqueId = `dev-loot-${item.itemId}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
          addInventoryItem("pickedup_folder", {
            id: uniqueId,
            kind,
            itemId: item.itemId,
            name: item.itemId,
          });
          totalGranted += 1;
        }
      });
    };

    grantCategory(reward.weapons, "weapon");
    grantCategory(reward.armors, "armor");
    grantCategory(reward.consumables, "consumable");

    return totalGranted;
  }

  function devKillLikeNormalFlow() {
    const activeProblem = isEnemy ? enemyProblem : bossProblem;
    const reward = activeProblem.reward;

    const xpReward = randomBetween(reward.xpDropMin, reward.xpDropMax);
    const coinReward = randomBetween(reward.coinDropMin, reward.coinDropMax);
    const lootCount = grantLootItems(reward);

    if (xpReward > 0) gainXP(xpReward);
    if (coinReward > 0) gainCoin(coinReward);

    if (isEnemy) {
      enemyTakeDamage(enemyHp);
    } else {
      bossTakeDamage(bossHp);
    }

    const lootSuffix = lootCount > 0 ? ` + ${lootCount} loot item(s)` : "";
    showToast({
      variant: "success",
      message: `Dev kill applied rewards: +${xpReward} XP, +${coinReward} coins${lootSuffix}`,
    });
  }

  return (
    <>
      <div className="absolute z-101 bottom-0 right-0 flex gap-2 w-fit p-1 border bg-zinc-900 flex-wrap">
        <span>DevTool:</span>
        {/* <span className="text-yellow-300">{playerDataText}</span> */}
        <input
          type="text"
          className="border bg-zinc-800"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        ></input>
        <Button
          text="Print All"
          onClick={() => {
            console.log("=== PLAYER DATA ===");
            console.log("user_id:", user_id);
            console.log("playerId:", playerId);
            console.log("localStorage keys:", Object.keys(localStorage));
            console.log("Full inventoryStore:", useInventoryStore.getState());
            console.log("Full playerStore:", usePlayerStore.getState());
          }}
        />
        <Button text="Print" onClick={() => console.log(user_id)} />
        {/* <Button text="Next" onClick={() => tuts.nextStep()}/> */}
        <Button
          text="Add to Terminal"
          onClick={() => {
            appendToLogs(input);
          }}
        />
        <Button text="Coin+" onClick={() => gainCoin(100)} />
        <Button text="Hp-" onClick={() => selfHarm(20)} />
        <span>{hp}</span>
        <Button text="Hp+" onClick={() => gainHP(10)} />
        <Button text="XP+" onClick={() => gainXP(100)} />
        <Button
          text="Toast"
          onClick={() => {
            showToast({ variant: "info", message: "Test" });
          }}
        />
        <Button
          text={combatText}
          onClick={() => {
            toggleInCombat(null);
          }}
        />
        <Button
          text="Enemy/Boss"
          onClick={() => {
            toggleIsEnemy(null);
            console.log(`Toggled Enemy/Boss: ${isEnemy}`);
          }}
        />
        <Button
          text="Hit"
          onClick={() => {
            if (isEnemy) {
              enemyTakeDamage(20);
            } else {
              bossTakeDamage(20);
            }
          }}
        />
        <Button
          text="Kill Enemy"
          onClick={() => {
            devKillLikeNormalFlow();
          }}
        />
        <Button
          text={BountyQuestText}
          onClick={() => toggleDisplayBountyQuest()}
        />
        <Button
          text="Refresh Quests"
          onClick={() => {
            bounty.refreshQuest();
            console.log("Toggled Refresh Quests");
          }}
        />
        <Button
          text="+Quest Lvl"
          onClick={() => bounty.incrementQuestLevel()}
        />
        <Button
          text="Record Slime Kill"
          onClick={() => kill.recordKill("slime")}
        />
        {/* <Button text='+Slime Kill' onClick={() => bounty.incrementQuestLevel()}/> */}
        <Button
          text="Check"
          onClick={() => {
            bounty.toggleQuest("1");
          }}
        />
        <Button
          text={sceneText}
          onClick={() => {
            const scenes: SceneTypes[] = [
              "village",
              "forest",
              "temple",
              "cemetery",
              "swamp",
              "jungle",
              "desert",
            ];
            const randomScene =
              scenes[Math.floor(Math.random() * scenes.length)];
            setScene(randomScene);
          }}
        />
        <Button text="Guide" onClick={() => guide.toggleGuide(null)} />
        <Button
          text="NPC"
          onClick={() => {
            npc.toggleDisplayNPC();
          }}
        />
        <Button text="Tutorial" onClick={() => tutorial.toggleIsTutorial()} />
        <Button
          text="SFX"
          onClick={() => {
            useSoundStore.getState().playSfx("click");
            console.log("Played Hit SFX");
          }}
        />
        <Button
          text={`Combat Log (${showCombatDebug ? "on" : "off"})`}
          onClick={() => setShowCombatDebug((s) => !s)}
        />
      </div>

      {showCombatDebug && (
        <div className="absolute z-101 bottom-20 right-0 w-[420px] max-h-72 overflow-auto border bg-zinc-900 p-2 text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold">Combat Debug</span>
            <Button text="Clear Logs" onClick={clearCombatLogs} />
          </div>
          {latestCombatDebug ? (
            <>
              <div>Type: {latestCombatDebug.isBoss ? "Boss" : "Mob"}</div>
              <div>Enemy: {latestCombatDebug.enemyId}</div>
              <div>Action: {latestCombatDebug.action}</div>
              <div>Reward: {latestCombatDebug.reward}</div>
              <div>
                Damage Causes:{" "}
                {latestCombatDebug.damageCauses.join(", ") || "none"}
              </div>
              <div>
                Analytics Time:{" "}
                {Math.round(latestCombatDebug.analytics.elapsedMs)}ms
              </div>
              <div>
                Analytics To Player:{" "}
                {latestCombatDebug.analytics.totalDamageToPlayer}
              </div>
              <div>
                Analytics To Enemy:{" "}
                {latestCombatDebug.analytics.totalDamageToEnemy}
              </div>
              <div>
                Analytics DOT Player:{" "}
                {latestCombatDebug.analytics.totalDotDamageToPlayer}
              </div>
              <div>
                Analytics DOT Enemy:{" "}
                {latestCombatDebug.analytics.totalDotDamageToEnemy}
              </div>
              <div>
                Analytics Player Attacks:{" "}
                {latestCombatDebug.analytics.totalPlayerAttacks}
              </div>
              <div>
                Analytics Enemy Actions:{" "}
                {latestCombatDebug.analytics.totalEnemyActions}
              </div>
              <div>
                Analytics Enemy Skills:{" "}
                {latestCombatDebug.analytics.totalEnemySkillCasts}
              </div>
            </>
          ) : (
            <div>No combat snapshot yet.</div>
          )}
          <div className="font-semibold mt-2">Combat Log</div>
          {combatLogs.length === 0 ? (
            <div>No log entries.</div>
          ) : (
            combatLogs
              .slice(-15)
              .map((line, index) => <div key={`${index}-${line}`}>{line}</div>)
          )}
        </div>
      )}
    </>
  );
}
