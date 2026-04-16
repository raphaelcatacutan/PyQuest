import Editor, { OnMount } from "@monaco-editor/react";
import { useRef, useEffect } from "react";
import * as monaco from 'monaco-editor';
import Button from "../ui/Button";  
import {
  playIcon,
  clearIcon,
  saveIcon
} from '@/src/assets'
import { usePlayerStore, useTerminalStore, useEditorStore, useGameStore, useEnemyStore, useBossStore, useInventoryStore } from "@/src/game/store";
import { useShallow } from "zustand/shallow";
import { runPython } from "@/src/backend/mechanics/parser";
import { bindPythonRuntimeToZustand, unbindPythonRuntimeFromZustand } from "@/src/backend/mechanics/zustand-runtime";
import { dispatchPythonRuntimeEvent } from "@/src/backend/mechanics/runtime-event-dispatcher";
import showToast from "../ui/Toast";
import type { MachineProblem } from "@/src/game/types/mp.types";
import type { LootDrop, LootItem } from "@/src/game/types/loot.types";
import { validateMachineProblemSolution } from "@/src/game/data/mps";


export default function CodeEditor() {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const runningRef = useRef(false);
  const handleEditorDidMount: OnMount = (editor, _monaco) => {
    editorRef.current = editor;
    editor.addCommand(_monaco.KeyMod.CtrlCmd | _monaco.KeyCode.Enter, () => {
      handleRun();
    });
  };
  const { hp, maxHP } = usePlayerStore(
    useShallow((s) => ({
      hp: s.hp,
      maxHP: s.maxHP
    }))
  )
  const { energy, maxEnergy } = usePlayerStore(
    useShallow((s) => ({
      energy: s.energy,
      maxEnergy: s.maxEnergy
    }))
  )
  const appendToLogs = useTerminalStore((s) => s.appendToLog)
  const addInventoryItem = useInventoryStore((s) => s.addInventoryItem)
  const gainXP = usePlayerStore((s) => s.gainXP)
  const gainCoins = usePlayerStore((s) => s.gainCoins)
  const { inCombat, isEnemy } = useGameStore(
    useShallow((s) => ({
      inCombat: s.inCombat,
      isEnemy: s.isEnemy,
    }))
  )
  const { activeFile, setActiveCode } = useEditorStore(
    useShallow((s) => ({
      activeFile: s.activeFile,
      setActiveCode: s.setActiveCode,
    }))
  )

  function randomBetween(min: number, max: number): number {
    const low = Math.max(0, Math.floor(Math.min(min, max)));
    const high = Math.max(low, Math.floor(Math.max(min, max)));
    return Math.floor(Math.random() * (high - low + 1)) + low;
  }

  function grantLootItems(reward: LootDrop): number {
    let totalGranted = 0;

    const grantCategory = (items: LootItem[], kind: "weapon" | "armor" | "consumable") => {
      items.forEach((item) => {
        const quantity = Math.max(1, item.quantity ?? 1);
        for (let index = 0; index < quantity; index += 1) {
          const uniqueId = `mp-loot-${item.itemId}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
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

  function completeMachineProblemAndDefeatTarget(activeProblem: MachineProblem): void {
    const reward = activeProblem.reward;
    const xpReward = randomBetween(reward.xpDropMin, reward.xpDropMax);
    const coinReward = randomBetween(reward.coinDropMin, reward.coinDropMax);
    const grantedLootCount = grantLootItems(reward);

    if (xpReward > 0) {
      gainXP(xpReward);
    }

    if (coinReward > 0) {
      gainCoins(coinReward);
    }

    const rewardSuffix = grantedLootCount > 0 ? ` + ${grantedLootCount} loot item(s)` : "";

    appendToLogs(`[PY]: Machine problem solved. +${xpReward} XP, +${coinReward} coins${rewardSuffix}.`);
    showToast({
      variant: "success",
      message: `Machine problem solved! +${xpReward} XP, +${coinReward} coins${rewardSuffix}`,
    });

    if (isEnemy) {
      const enemy = useEnemyStore.getState().enemy;
      if (enemy && enemy.hp > 0) {
        useEnemyStore.getState().takeDamage(enemy.hp);
      }
      return;
    }

    const boss = useBossStore.getState();
    if (boss.hp > 0) {
      useBossStore.getState().takeDamage(boss.hp);
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRun();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  function handleClear() {
    if (editorRef.current) {
      editorRef.current.setValue("");
      setActiveCode("");
    }
  }

  // TODO: Save changes to File Tree only
  function handleSave() {
    // if (editorRef.current) {
    //   const code = editorRef.current.getValue();
    //   const blob = new Blob([code], { type: "text/plain" });
    //   const url = URL.createObjectURL(blob);

    //   const a = document.createElement("a");
    //   a.href = url;
    //   a.download = "code.py";
    //   a.click();

    //   URL.revokeObjectURL(url);
    // }
  }
  
  async function handleRun() {
    const code = editorRef.current?.getValue() ?? "";
    setActiveCode(code);

    if (!code.trim()) {
      appendToLogs("[PY]: Nothing to run.");
      return;
    }

    if (runningRef.current) {
      appendToLogs("[PY]: A script is already running.");
      return;
    }

    runningRef.current = true;

    if (inCombat) {
      const activeProblem = isEnemy
        ? useEnemyStore.getState().activeProblem
        : useBossStore.getState().activeProblem;

      const solved = validateMachineProblemSolution(activeProblem, code);
      if (solved) {
        appendToLogs("[PY]: Machine problem requirements satisfied.");
        completeMachineProblemAndDefeatTarget(activeProblem);
        runningRef.current = false;
        return;
      }
    }

    appendToLogs("[PY]: Running script...");
    bindPythonRuntimeToZustand((event) => {
      dispatchPythonRuntimeEvent(event);
    });

    try {
      const output = await runPython(code);
      const lines = output
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      if (lines.length === 0) {
        appendToLogs("[PY]: Script finished.");
      } else {
        lines.forEach((line) => {
          if (/^Error:/i.test(line)) {
            appendToLogs(`[PY-ERR]: ${line}`);
            return;
          }

          appendToLogs(`[PY-OUT]: ${line}`);
        });
      }
    } catch (error) {
      appendToLogs(`[PY-ERR]: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      unbindPythonRuntimeFromZustand();
      runningRef.current = false;
    }
  }

  return (
    <div id="code-editor" className="relative w-150 flex flex-col h-full bg-[#23100a]">
      <div className="flex flex-row m-1">
        <div className="flex w-10/12 pl-1 gap-1">
          <span className="truncate">Current File:</span>
          <span className="truncate border rounded-lg px-2">{activeFile}</span>
        </div>
        <div className="flex flex-row-reverse gap-2">
          <Button variant="icon-only-btn" icon={clearIcon} iconSize={20} onClick={handleClear} title="Clear editor"/>
          <Button variant="icon-only-btn" icon={saveIcon} iconSize={20} onClick={handleSave} title="Save code"/>
          {/* <Button variant="icon-only-btn" icon={openIcon} iconSize={20} onClick={handleOpen} title="Open a file"/> */}
          <Button variant="icon-only-btn" icon={playIcon} iconSize={20} onClick={handleRun} title="Execute code (Ctrl + Enter)"/>
        </div>
      </div>
      <div className="flex-1 relative">
        <Editor
          height="100%"
          defaultLanguage="python"
          defaultValue="# Welcome to PyQuest! 
# Start writing your coding journey in Python here!"
          theme="vs-dark"
          onMount={(editor, monacoInstance) => {
            handleEditorDidMount(editor, monacoInstance);
            setActiveCode(editor.getValue());
          }}
          onChange={(value) => setActiveCode(value ?? "")}
          options={{
            minimap: { enabled: false},
            glyphMargin: false,
            lineNumbersMinChars: 4,
            lineDecorationsWidth: 0,
            quickSuggestions: {
              other: false,
              comments: false,
              strings: false
            },
            suggestOnTriggerCharacters: false,
            parameterHints: {
              enabled: false
            },
            wordBasedSuggestions: "off", // Prevents suggesting words found in the document
            snippetSuggestions: "none",  // Prevents code snippets from popping up
          }}
        />

        {/* {isDragging && (
          <div className="absolute inset-0 bg-blue-500 bg-opacity-10 border-2 border-dashed border-blue-400 pointer-events-none flex items-center justify-center">
            <span className="text-white font-semibold">Drop file to insert filename</span>
          </div>
        )} */}
      </div>
      <div id="status-bar" className="absolute bottom-0 w-full p-2 flex gap-4 pointer-events-none z-50">
        <div className="flex flex-col flex-1">
          {/* <span className="text-xs text-gray-700 font-semibold">Health</span> */}
          <div className="relative w-full bg-gray-200 border-2 border-gray-400 rounded h-6 overflow-hidden">
            <div 
              className="bg-red-600 h-full transition-all duration-300" 
              style={{ width: `${(hp / maxHP) * 100}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">
              {hp}/{maxHP}
            </span>
          </div>
        </div>
        <div className="flex flex-col flex-1">
          {/* <span className="text-xs text-gray-700 font-semibold">Energy</span> */}
          <div className="relative w-full bg-gray-200 border-2 border-gray-400 rounded h-6 overflow-hidden">
            <div 
              className="bg-blue-500 h-full transition-all duration-300" 
              style={{ width: `${(energy / maxEnergy) * 100}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">
              {energy}/{maxEnergy}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}