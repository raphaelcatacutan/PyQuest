import Editor, { OnMount } from "@monaco-editor/react";
import { useRef, useEffect, useState } from "react";
import * as monaco from 'monaco-editor';
import Button from "../ui/Button";  
import {
  playIcon,
  clearIcon,
  saveIcon,
  closeIcon
} from '@/src/assets'
import { usePlayerStore, useTerminalStore, useEditorStore, useGameStore, useEnemyStore, useBossStore, useInventoryStore } from "@/src/game/store";
import { useShallow } from "zustand/shallow";
import { getAllModules, registerModules, runPython, unregisterModule, type CustomModule } from "@/src/backend/mechanics/parser";
import { bindPythonRuntimeToZustand, unbindPythonRuntimeFromZustand } from "@/src/backend/mechanics/zustand-runtime";
import { dispatchPythonRuntimeEvent } from "@/src/backend/mechanics/runtime-event-dispatcher";
import showToast from "../ui/Toast";
import type { MachineProblem } from "@/src/game/types/mp.types";
import type { InventoryNode } from "@/src/game/types/inventory.types";
import { validateMachineProblemSolution } from "@/src/game/data/mps";


export default function CodeEditor() {
  const [ hover, isHovered ] = useState(false)
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
  const { playerInventory, setInventoryItemCode } = useInventoryStore(
    useShallow((s) => ({
      playerInventory: s.playerInventory,
      setInventoryItemCode: s.setInventoryItemCode,
    }))
  )
  const { inCombat, isEnemy } = useGameStore(
    useShallow((s) => ({
      inCombat: s.inCombat,
      isEnemy: s.isEnemy,
    }))
  )
  const {
    activeFile,
    activeFileId,
    activeFilePath,
    activeCode,
    isActiveFileReadOnly,
    setActiveCode,
  } = useEditorStore(
    useShallow((s) => ({
      activeFile: s.activeFile,
      activeFileId: s.activeFileId,
      activeFilePath: s.activeFilePath,
      activeCode: s.activeCode,
      isActiveFileReadOnly: s.isActiveFileReadOnly,
      setActiveCode: s.setActiveCode,
    }))
  )
  const highlightRange = useEditorStore((state) => state.highlightRange);
  const decorationRef = useRef<string[]>([]);
  const registeredUserModuleNamesRef = useRef<Set<string>>(new Set())

  function isInitFileName(name: string): boolean {
    const normalized = name.trim().toLowerCase()
    return normalized === "init.py" || normalized === "__init__.py"
  }

  function isPythonScriptNode(node: InventoryNode): node is Exclude<InventoryNode, { kind: "folder" }> {
    return node.kind !== "folder" && node.name.toLowerCase().endsWith(".py") && !isInitFileName(node.name)
  }

  function normalizeModuleSegment(segment: string): string {
    const sanitized = segment
      .trim()
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9_]/g, "_")
      .replace(/^_+|_+$/g, "")

    if (!sanitized) {
      return "module"
    }

    return /^[0-9]/.test(sanitized) ? `_${sanitized}` : sanitized
  }

  function buildUserScriptModules(mainCode: string): Array<{ name: string; code: string; sourcePath: string }> {
    const modulesByName = new Map<string, { name: string; code: string; sourcePath: string }>()
    const baseNameCandidates = new Map<string, { code: string }[]>()

    const walk = (nodes: InventoryNode[], folderSegments: string[]) => {
      nodes.forEach((node) => {
        if (node.kind === "folder") {
          const nextFolderSegment = normalizeModuleSegment(node.name)
          walk(node.children, [...folderSegments, nextFolderSegment])
          return
        }

        if (!isPythonScriptNode(node)) {
          return
        }

        const baseSegment = normalizeModuleSegment(node.name)
        const fullName = [...folderSegments, baseSegment].filter(Boolean).join(".")
        if (!fullName) {
          return
        }

        const code = node.id === activeFileId ? mainCode : (node.code ?? "")
        modulesByName.set(fullName, {
          name: fullName,
          code,
          sourcePath: `${fullName.replace(/\./g, "/")}.py`,
        })

        const candidates = baseNameCandidates.get(baseSegment) ?? []
        candidates.push({ code })
        baseNameCandidates.set(baseSegment, candidates)
      })
    }

    walk(playerInventory, [])

    baseNameCandidates.forEach((candidates, aliasName) => {
      if (candidates.length !== 1 || modulesByName.has(aliasName)) {
        return
      }

      modulesByName.set(aliasName, {
        name: aliasName,
        code: candidates[0].code,
        sourcePath: `${aliasName}.py`,
      })
    })

    return Array.from(modulesByName.values())
  }

  function syncUserScriptModules(mainCode: string): number {
    const moduleDefinitions = buildUserScriptModules(mainCode)
    const previouslyRegistered = registeredUserModuleNamesRef.current
    const existingModuleNames = new Set(getAllModules().map((moduleRecord) => moduleRecord.name))

    previouslyRegistered.forEach((moduleName) => existingModuleNames.delete(moduleName))

    const filteredDefinitions = moduleDefinitions.filter((moduleDefinition) => !existingModuleNames.has(moduleDefinition.name))
    const newNames = new Set(filteredDefinitions.map((moduleDefinition) => moduleDefinition.name))

    previouslyRegistered.forEach((moduleName) => {
      if (!newNames.has(moduleName)) {
        unregisterModule(moduleName)
      }
    })

    const modulesToRegister: CustomModule[] = filteredDefinitions.map((moduleDefinition) => ({
      name: moduleDefinition.name,
      code: moduleDefinition.code,
      sourcePath: moduleDefinition.sourcePath,
      visibility: "public",
      prelude: false,
      description: "User script module",
    }))

    if (modulesToRegister.length > 0) {
      registerModules(modulesToRegister)
    }

    registeredUserModuleNamesRef.current = newNames

    return moduleDefinitions.length - filteredDefinitions.length
  }

  function completeMachineProblemAndDefeatTarget(): void {
    showToast({
      variant: "success",
      message: "Machine problem solved!",
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

  useEffect(() => {
    if (!editorRef.current) return;

    // 1. Always clear old decorations first
    const newDecorations = [];

    // 2. If we have a range, create the new decoration
    if (highlightRange) {
      newDecorations.push({
        range: new monaco.Range(
          highlightRange.start, 
          1, 
          highlightRange.end, 
          1
        ),
        options: {
          isWholeLine: true,
          className: 'bg-yellow-700', // Your CSS class
          linesDecorationsClassName: 'myGutterHighlight', // Optional: highlight the line number gutter too
        },
      });
      
      // Reveal the start of the range so it's visible
      editorRef.current.revealLineInCenterIfOutsideViewport(highlightRange.start);
    }

    // 3. Sync with Monaco
    decorationRef.current = editorRef.current.deltaDecorations(
      decorationRef.current,
      newDecorations
    );
  }, [highlightRange]);
  
  function handleClear() {
    setActiveCode("");
  }

  function handleSave() {
    if (!activeFileId) {
      showToast({
        variant: "warning",
        message: "Open a file from the inventory first.",
      })
      return
    }

    if (isActiveFileReadOnly) {
      showToast({
        variant: "warning",
        message: "This file is read-only.",
      })
      return
    }

    if (isInitFileName(activeFile)) {
      showToast({
        variant: "warning",
        message: "init files cannot be edited.",
      })
      return
    }

    const code = editorRef.current?.getValue() ?? activeCode
    setInventoryItemCode(activeFileId, code)
    setActiveCode(code)
    showToast({
      variant: "success",
      message: `Saved ${activeFile}.`,
    })
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

    const skippedModuleCount = syncUserScriptModules(code)
    if (skippedModuleCount > 0) {
      appendToLogs(`[PY]: ${skippedModuleCount} user module(s) were skipped due to name conflicts.`)
    }

    if (inCombat) {
      const activeProblem = isEnemy
        ? useEnemyStore.getState().activeProblem
        : useBossStore.getState().activeProblem;

      const solved = validateMachineProblemSolution(activeProblem, code);
      if (solved) {
        appendToLogs("[PY]: Machine problem requirements satisfied.");
        completeMachineProblemAndDefeatTarget();
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

  function handleExitFile() {

  }

  return (
    <div id="code-editor" className="relative w-150 flex flex-col h-full bg-[#23100a]">
      <div className="flex flex-row m-1">
        <div className="flex w-10/12 pl-1 gap-1">
          <span className="truncate">Current File:</span>
          <span className="truncate border rounded-lg px-2">
            {activeFilePath || activeFile}
            {activeFilePath !== 'main.py' && <Button variant="icon-only-btn" icon={closeIcon} iconSize={15} onClick={handleExitFile}/>}
          </span>
          {isActiveFileReadOnly && (
            <>
              <span className="truncate text-amber-300">read-only</span>
            </>
          )}
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
          value={activeCode}
          theme="vs-dark"
          onMount={(editor, monacoInstance) => {
            handleEditorDidMount(editor, monacoInstance);
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
            readOnly: isActiveFileReadOnly,
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