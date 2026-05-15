# DFD Generation Plan — PyQuest

> Based on: [GeeksforGeeks — What is DFD](https://www.geeksforgeeks.org/software-engineering/what-is-dfddata-flow-diagram/)
> Reference: existing diagrams in `../current_diagrams/` and `../diagrams/`

---

## Overview

This plan produces **12 DFD diagram files** (+ 1 notation legend), organized by:

- **2 Levels**: Level 0 (Context Diagram) and Level 1
- **2 Types** per level: Logical and Physical
- **3 Notations** per type: Yourdon & DeMarco, Gane & Sarson, SSADM

### File Matrix

| Level | Type | Notation | Filename |
|-------|------|----------|----------|
| 0 | Logical | Yourdon & DeMarco | `L0-logical-yourdon.md` |
| 0 | Logical | Gane & Sarson | `L0-logical-gane.md` |
| 0 | Logical | SSADM | `L0-logical-ssadm.md` |
| 0 | Physical | Yourdon & DeMarco | `L0-physical-yourdon.md` |
| 0 | Physical | Gane & Sarson | `L0-physical-gane.md` |
| 0 | Physical | SSADM | `L0-physical-ssadm.md` |
| 1 | Logical | Yourdon & DeMarco | `L1-logical-yourdon.md` |
| 1 | Logical | Gane & Sarson | `L1-logical-gane.md` |
| 1 | Logical | SSADM | `L1-logical-ssadm.md` |
| 1 | Physical | Yourdon & DeMarco | `L1-physical-yourdon.md` |
| 1 | Physical | Gane & Sarson | `L1-physical-gane.md` |
| 1 | Physical | SSADM | `L1-physical-ssadm.md` |
| — | Reference | — | `notation-legend.md` |

**Total: 13 files** in `docs/diagrams/new-dfd/`

---

## Notation Styles — Symbol Differences

Each notation uses different **shapes** for the 4 DFD elements. Since Mermaid has limited shape options, the `.md` files will each contain:
1. A **symbol legend** table explaining which Mermaid shape maps to which DFD element
2. The **Mermaid diagram** itself
3. A **description table** listing all elements, data flows, and their labels

### Symbol Mapping per Notation

| DFD Element | Yourdon & DeMarco | Gane & Sarson | SSADM |
|-------------|-------------------|---------------|-------|
| **External Entity** | Circle / Oval `([Entity])` | Square / Rectangle `[Entity]` | Oval `([Entity])` |
| **Process** | Circle `((Process))` | Rounded rectangle with horizontal divider (use `[/id\n---\nProcess/]` or just `[Process]`) | Rectangle `[Process]` |
| **Data Store** | Two parallel lines `[(D1 Store)]` | Open-ended rectangle with ID section `[(D1 - Store)]` | Open-ended rectangle `[(Store)]` |
| **Data Flow** | Arrow with label `-->\|label\|` | Arrow with label `-->\|label\|` | Arrow with label `-->\|label\|` |

> **Note**: Mermaid cannot perfectly replicate the exact shapes of each notation. Each file will include a legend describing the intended shapes so a manual tool (draw.io, Lucidchart, Visio) can render them precisely if needed.

---

## DFD Elements — PyQuest System

### External Entities

| ID | Name | Description |
|----|------|-------------|
| E1 | **User (Student/Player)** | The primary user who logs in, writes Python code, plays the game, and interacts with all game features |

### Data Stores (Logical)

| ID | Name | Actual Source | Data Contents |
|----|------|---------------|---------------|
| D1 | Player Data | `playerStore.ts` | HP, DEF, Energy, Coins, XP, Level, Equipment Slots, credentials |
| D2 | Inventory Data | `inventoryStore.ts` | Folder/file tree of items (weapons, armors, consumables) |
| D3 | Challenge Progress | `dungeonStore.ts`, `trialsStore.ts` | Easy/Medium/Hard solved counts, attempt counts per problem |
| D4 | Game Metrics | `metricsStore.ts` | Playtime, deaths, errors, coins earned/spent, XP gained — all per level |
| D5 | Game Content | JSON files (`bosses.json`, `enemies.json`, `consumables.json`, `armors.json`, `weapons.json`) | Enemy/Boss/Item definitions, stats, skills, loot tables |
| D6 | User Credentials | `authService.ts` via LocalStorage | `{username, password}` pairs |

### Data Stores (Physical — adds implementation detail)

| ID | Name | Technology | Key Pattern | Storage Type |
|----|------|-----------|-------------|-------------|
| D1 | Player Session | Zustand + LocalStorage | `pyquest-active-session` | JSON in browser LocalStorage |
| D2 | Player Inventory | Zustand + LocalStorage | `player-inventory-{userId}` | JSON in browser LocalStorage |
| D3 | Dungeon Progress | Zustand + LocalStorage | `player-dungeon-{userId}` | JSON in browser LocalStorage |
| D3b | Trials Progress | Zustand + LocalStorage | `player-trials-{userId}` | JSON in browser LocalStorage |
| D4 | Player Metrics | Manual LocalStorage save | `metrics-{playerId}` | JSON in browser LocalStorage |
| D5 | Game Content Files | Static JSON + Vite bundler | `src/game/json/*.json` | Bundled at build time, imported as ES modules |
| D6 | User Credentials | Manual LocalStorage | `user-{username}` | JSON in browser LocalStorage |

### Processes

#### Level 0 (Context)

| ID | Name (Logical) | Name (Physical) |
|----|----------------|-----------------|
| P0 | PyQuest System | PyQuest Web Application (React + Vite + Skulpt) |

#### Level 1 (Decomposed)

| ID | Name (Logical) | Name (Physical) | Source Files |
|----|----------------|-----------------|-------------|
| P1 | Authenticate User | Auth Module (localStorage read/write via `authService.ts`) | `LoginPage.tsx`, `SignupPage.tsx`, `authService.ts` |
| P2 | Execute Python Code | Skulpt Runtime Pipeline (Monaco Editor → Lezer Parser → Module Registry → Skulpt → Event Dispatcher) | `CodeEditor.tsx`, `parser.ts`, `module-registry.ts`, `zustand-runtime.ts`, `runtime-event-dispatcher.ts` |
| P3 | Process Combat | Combat AI Engine (EncounterController with Q-Learning, 200ms tick loop) | `Combat.tsx`, `encounter.ts`, `actions.ts`, `qlearning.ts` |
| P4 | Process Challenges | Challenge Validation Module (Dungeon machine problems + Trials debug problems) | `Dungeon.tsx`, `Trials.tsx`, `dungeonStore.ts`, `trialsStore.ts` |
| P5 | Manage Inventory | Inventory CRUD Module (tree operations: add, delete, rename, move, equip) | `LeftSideBar.tsx`, `RightSideBar.tsx`, `inventoryStore.ts` |
| P6 | Render Game UI | React Component Tree (scene transitions, combat overlays, stat bars, terminal) | `GamePage.tsx`, `NavBar.tsx`, `Terminal.tsx`, `DialogueBox.tsx`, `Guide.tsx` |

---

## Data Flows

### Level 0 — Flows

| # | From | To | Label (Logical) | Label (Physical) |
|---|------|----|-----------------|-----------------|
| F0.1 | E1 (User) | P0 (System) | Login credentials, Python code, gameplay actions | HTTP form data, Monaco editor value, DOM click/drag events |
| F0.2 | P0 (System) | E1 (User) | Game view, terminal output, combat feedback, stats | React DOM renders, CSS transitions, toast notifications |
| F0.3 | P0 (System) | D (storage) | Save player state and progress | `localStorage.setItem()` JSON serialization |
| F0.4 | D (storage) | P0 (System) | Load saved state | `localStorage.getItem()` + Zustand `rehydrate()` |

### Level 1 — Flows

| # | From | To | Label (Logical) | Label (Physical) |
|---|------|----|-----------------|-----------------|
| F1.1 | E1 | P1 | Username + Password | Form input values via React `useState` |
| F1.2 | P1 | D6 | Store credentials | `localStorage.setItem('user-{username}', JSON)` |
| F1.3 | D6 | P1 | Validate credentials | `localStorage.getItem('user-{username}')` + JSON.parse |
| F1.4 | P1 | D1 | Initialize player session | `usePlayerStore.setState({user_id, username})` |
| F1.5 | P1 | E1 | Auth result (success/fail) | React Router redirect to `/game` or error toast |
| F2.1 | E1 | P2 | Python source code | `editorRef.current.getValue()` from Monaco |
| F2.2 | P2 | D1 | Player stat changes | `gainHP()`, `takeDamage()`, `gainCoins()`, `gainXP()` via event dispatch |
| F2.3 | P2 | E1 | Terminal output | `appendToLog()` → Terminal component re-render |
| F2.4 | D5 | P2 | Game module definitions | Module registry imports from `game-modules.ts` |
| F3.1 | D5 | P3 | Enemy/Boss data | `getEnemiesByLocation()`, `getBossesByLocation()` |
| F3.2 | P3 | D1 | Damage to player, loot rewards | `takeDamage()`, `gainCoins()`, `gainXP()` |
| F3.3 | D1 | P3 | Player combat stats | Read `hp`, `def`, `baseDmg`, `atkSpeed`, etc. |
| F3.4 | P3 | D4 | Track kills, damage taken | `trackEnemyDefeated()`, `trackBossDefeated()`, `trackDamageTaken()` |
| F4.1 | E1 | P4 | Difficulty selection, solution/fix code | UI button clicks, editor value |
| F4.2 | P4 | D3 | Update challenge progress | `addSolvedEasy()`, `incrementAttempt()`, etc. |
| F4.3 | D3 | P4 | Current progress state | Read `currEasy`, `currMedium`, `currHard`, `currAttempt` |
| F4.4 | P4 | D1 | Challenge rewards | `gainCoins()`, `gainXP()` |
| F4.5 | P4 | D4 | Track errors | `trackError(level)` |
| F5.1 | E1 | P5 | Item operations (add/delete/rename/move/equip) | Drag-and-drop events, context menu actions |
| F5.2 | P5 | D2 | Updated inventory tree | `addInventoryItem()`, `deleteInventoryItem()`, `moveInventoryItem()` |
| F5.3 | D2 | P5 | Current inventory state | Read `playerInventory` tree |
| F5.4 | P5 | D1 | Equip/unequip gear | `equipLeftHandWith()`, `equipBodySlotWith()`, etc. |
| F6.1 | D1 & D2 & D3 | P6 | All game state | Zustand subscriptions via `useShallow()` selectors |
| F6.2 | P6 | E1 | Rendered game interface | React DOM output (scene backgrounds, HP bars, inventory tree, combat UI) |

---

## File Descriptions

### Level 0 Files (6 total)

Each Level 0 file will contain:

1. **Title** — e.g., "Level 0 DFD — Logical (Yourdon & DeMarco Notation)"
2. **Notation Legend** — table showing which Mermaid shape = which DFD symbol in that notation
3. **Mermaid Diagram** — Context diagram with: E1 (User), P0 (PyQuest System), D (data store), and 4 data flows
4. **Elements Table** — listing all external entities, processes, data stores, and flows with descriptions
5. **Logical vs Physical note**:
   - **Logical**: Labels describe *what* happens (e.g., "Login credentials", "Save player state")
   - **Physical**: Labels describe *how* it happens (e.g., "`localStorage.setItem()` JSON serialization", "Zustand `rehydrate()`")

### Level 1 Files (6 total)

Each Level 1 file will contain:

1. **Title** — e.g., "Level 1 DFD — Physical (Gane & Sarson Notation)"
2. **Notation Legend** — table for that notation style
3. **Mermaid Diagram** — Decomposed diagram with: E1 (User), P1–P6 (6 processes), D1–D6 (6 data stores), and all data flows
4. **Elements Table** — full listing of all elements
5. **Data Flow Table** — every arrow labeled and described
6. **Logical vs Physical note**:
   - **Logical**: Process names like "Authenticate User", "Execute Python Code"
   - **Physical**: Process names like "Auth Module (localStorage read/write)", "Skulpt Runtime Pipeline"

### Notation Legend File (1 total)

A reference document comparing all three notations side-by-side:
- Symbol shapes for External Entity, Process, Data Store, Data Flow
- Visual examples and descriptions
- When to use each notation

---

## Logical vs Physical — Key Differences

| Aspect | Logical DFD | Physical DFD |
|--------|-------------|-------------|
| **Focus** | *What* the system does | *How* the system does it |
| **Process names** | Business-oriented (e.g., "Authenticate User") | Technology-specific (e.g., "Auth Module via localStorage") |
| **Data store names** | Conceptual (e.g., "Player Data") | Implementation (e.g., "Zustand + LocalStorage: `pyquest-active-session`") |
| **Data flow labels** | Abstract (e.g., "Login credentials") | Technical (e.g., "Form input via React `useState`") |
| **External entity labels** | Role-based (e.g., "User") | Platform-specific (e.g., "Web Browser Client") |
| **Includes hardware/software?** | No | Yes (mentions React, Vite, Skulpt, Monaco, LocalStorage) |

---

## Execution Checklist

- [ ] Create `notation-legend.md`
- [ ] Create `L0-logical-yourdon.md`
- [ ] Create `L0-logical-gane.md`
- [ ] Create `L0-logical-ssadm.md`
- [ ] Create `L0-physical-yourdon.md`
- [ ] Create `L0-physical-gane.md`
- [ ] Create `L0-physical-ssadm.md`
- [ ] Create `L1-logical-yourdon.md`
- [ ] Create `L1-logical-gane.md`
- [ ] Create `L1-logical-ssadm.md`
- [ ] Create `L1-physical-yourdon.md`
- [ ] Create `L1-physical-gane.md`
- [ ] Create `L1-physical-ssadm.md`
- [ ] Review all diagrams for DFD rule compliance (no entity→entity, no entity→store, no store→store flows)
- [ ] Optionally export Mermaid diagrams to PNG via CLI or web tool
