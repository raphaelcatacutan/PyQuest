import Button from "./Button";
import { closeIcon } from "@/src/assets";
import { useDashboardStore } from "@/src/game/store/dashboardStore";
import { usePlayerStore } from "@/src/game/store/playerStore";
import { useBountyQuestStore } from "@/src/game/store/bountyQuestStore";
import { useTrialsStore } from "@/src/game/store/trialsStore";
import { useShallow } from "zustand/shallow";

const MACHINE_PROBLEM_PLACES: string[] = [
  "forest",
  "desert",
  "swamp",
  "cemetery",
  "tundra",
  "jungle",
  "temple",
  "labyrinth",
  "dungeon",
  "trials",
];

function getUnlockedPlacesByQuestLevel(level: number): string[] {
  if (MACHINE_PROBLEM_PLACES.length === 0) {
    return [];
  }
  const unlockedCount = Math.min(level, MACHINE_PROBLEM_PLACES.length);
  return MACHINE_PROBLEM_PLACES.slice(0, unlockedCount);
}

export default function Dashboard() {
  const { displayDashboard, toggleDisplayDashboard } = useDashboardStore(
    useShallow((s) => ({
      displayDashboard: s.displayDashboard,
      toggleDisplayDashboard: s.toggleDisplayDashboard,
    })),
  );

  const playerInfo = usePlayerStore(
    useShallow((s) => ({
      username: s.username,
      level: s.level,
      age: s.age,
      XP: s.XP,
      xpRequirement: s.xpRequirement,
      hp: s.hp,
      maxHP: s.maxHP,
      energy: s.energy,
      maxEnergy: s.maxEnergy,
      coins: s.coins,
      baseDmg: s.baseDmg,
      baseCritChance: s.baseCritChance,
      baseCritDmg: s.baseCritDmg,
      def: s.def,
      maxDef: s.maxDef,
      atkSpeed: s.atkSpeed,
      leftHand: s.leftHand,
      rightHand: s.rightHand,
      headSlot: s.headSlot,
      bodySlot: s.bodySlot,
    })),
  );

  const questLevel = useBountyQuestStore((s) => s.questLevel);
  const difficulty = useTrialsStore((s) => s.mode);
  const unlockedScenes = getUnlockedPlacesByQuestLevel(questLevel);

  if (!displayDashboard) return null;

  const xpProgress = (playerInfo.XP / playerInfo.xpRequirement) * 100;
  const hpProgress = (playerInfo.hp / playerInfo.maxHP) * 100;
  const energyProgress = (playerInfo.energy / playerInfo.maxEnergy) * 100;

  return (
    <div className="absolute flex w-full h-dvh z-99 bg-black/50 justify-center items-center">
      <div className="w-400 h-150 border-5 border-[#a34c24] rounded-xl p-10 m-80 overflow-y-auto bg-[#ffd06c]">
        <div className="flex flex-row-reverse w-full right-0" title="Close">
          <Button
            variant="icon-only-btn"
            icon={closeIcon}
            iconSize={30}
            onClick={() => toggleDisplayDashboard()}
          />
        </div>

        {/* Header */}
        <div className="text-2xl font-bold text-[#a34c24] mb-3">
          {playerInfo.username || "Player"} • Lv {playerInfo.level}
        </div>

        {/* Quick Info Row */}
        <div className="grid grid-cols-2 gap-2 text-sm text-black mb-2">
          <div>Age: {playerInfo.age || "—"}</div>
          <div>Coins: {playerInfo.coins}</div>
          <div>Diff: {difficulty || "—"}</div>
          <div className="truncate">Quest: Lvl {questLevel}</div>
        </div>

        {/* XP Bar */}
        <div className="mb-2">
          <div className="text-sm font-semibold text-black mb-1">
            XP: {playerInfo.XP} / {playerInfo.xpRequirement}
          </div>
          <div className="w-full bg-gray-700 border-2 border-[#a34c24] rounded h-4 overflow-hidden">
            <div
              className="bg-yellow-500 h-full transition-all duration-300"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </div>

        {/* HP & Energy Bars */}
        <div className="mb-2">
          <div className="text-sm font-semibold text-black mb-1">
            HP: {playerInfo.hp} / {playerInfo.maxHP}
          </div>
          <div className="w-full bg-gray-700 border-2 border-[#a34c24] rounded h-3 overflow-hidden mb-1">
            <div
              className="bg-red-500 h-full transition-all duration-300"
              style={{ width: `${hpProgress}%` }}
            />
          </div>

          <div className="text-sm font-semibold text-black mb-1">
            Energy: {playerInfo.energy} / {playerInfo.maxEnergy}
          </div>
          <div className="w-full bg-gray-700 border-2 border-[#a34c24] rounded h-3 overflow-hidden">
            <div
              className="bg-cyan-400 h-full transition-all duration-300"
              style={{ width: `${energyProgress}%` }}
            />
          </div>
        </div>

        {/* Stats Grid - 3 columns */}
        <div className="border-t-2 border-[#a34c24] pt-2 mb-2">
          <div className="text-sm font-bold text-[#a34c24] mb-1">STATS</div>
          <div className="grid grid-cols-3 gap-2 text-sm text-black">
            <div className="bg-yellow-100 p-1 rounded border-2 border-[#a34c24] text-center">
              <div className="font-semibold text-sm">{playerInfo.baseDmg}</div>
              <div className="text-xs leading-none">DMG</div>
            </div>
            <div className="bg-yellow-100 p-1 rounded border-2 border-[#a34c24] text-center">
              <div className="font-semibold text-sm">
                {playerInfo.baseCritChance}%
              </div>
              <div className="text-xs leading-none">CRIT</div>
            </div>
            <div className="bg-yellow-100 p-1 rounded border-2 border-[#a34c24] text-center">
              <div className="font-semibold text-sm">
                {playerInfo.baseCritDmg}
              </div>
              <div className="text-xs leading-none">CRIT DMG</div>
            </div>
            <div className="bg-yellow-100 p-1 rounded border-2 border-[#a34c24] text-center">
              <div className="font-semibold text-sm">
                {playerInfo.def}/{playerInfo.maxDef}
              </div>
              <div className="text-xs leading-none">DEF</div>
            </div>
            <div className="bg-yellow-100 p-1 rounded border-2 border-[#a34c24] text-center">
              <div className="font-semibold text-sm">
                {playerInfo.atkSpeed.toFixed(1)}s
              </div>
              <div className="text-xs leading-none">SPD</div>
            </div>
            <div className="bg-yellow-100 p-1 rounded border-2 border-[#a34c24] text-center">
              <div className="font-semibold text-sm">—</div>
              <div className="text-xs leading-none">—</div>
            </div>
          </div>
        </div>

        {/* Equipment - 2x2 Grid */}
        <div className="border-t-2 border-[#a34c24] pt-2 mb-2">
          <div className="text-sm font-bold text-[#a34c24] mb-1">EQUIP</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-yellow-100 p-1 rounded border-2 border-[#a34c24]">
              <div className="font-semibold text-sm leading-none">L-Hand</div>
              <div className="text-xs leading-tight truncate text-gray-700">
                {playerInfo.leftHand
                  ? playerInfo.leftHand.substring(0, 12)
                  : "—"}
              </div>
            </div>
            <div className="bg-yellow-100 p-1 rounded border-2 border-[#a34c24]">
              <div className="font-semibold text-sm leading-none">R-Hand</div>
              <div className="text-xs leading-tight truncate text-gray-700">
                {playerInfo.rightHand
                  ? playerInfo.rightHand.substring(0, 12)
                  : "—"}
              </div>
            </div>
            <div className="bg-yellow-100 p-1 rounded border-2 border-[#a34c24]">
              <div className="font-semibold text-sm leading-none">Head</div>
              <div className="text-xs leading-tight truncate text-gray-700">
                {playerInfo.headSlot
                  ? playerInfo.headSlot.substring(0, 12)
                  : "—"}
              </div>
            </div>
            <div className="bg-yellow-100 p-1 rounded border-2 border-[#a34c24]">
              <div className="font-semibold text-sm leading-none">Body</div>
              <div className="text-xs leading-tight truncate text-gray-700">
                {playerInfo.bodySlot
                  ? playerInfo.bodySlot.substring(0, 12)
                  : "—"}
              </div>
            </div>
          </div>
        </div>

        {/* Unlocked Scenes */}
        <div className="border-t-2 border-[#a34c24] pt-1">
          <div className="text-sm font-bold text-[#a34c24] mb-1">UNLOCKED</div>
          <div className="flex flex-wrap gap-1">
            {unlockedScenes.length > 0 ? (
              unlockedScenes.map((scene) => (
                <span
                  key={scene}
                  className="bg-yellow-100 text-black text-xs px-2 py-1 rounded border-2 border-[#a34c24] capitalize"
                >
                  {scene}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-700">village</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
