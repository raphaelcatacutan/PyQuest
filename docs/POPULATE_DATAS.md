# How to Populate Game Data

This guide will walk you through using the **Item Architect Suite** to populate your game data files (bosses, enemies, consumables, armor, and weapons).

## Quick Start

### 1. Start the Development Servers

Run this command
```bash
npm run dev:all
```

### 2. Access the Architect Suite

Navigate to: **http://localhost:3000/architect**

You'll see tabs for:
- Boss
- Enemy
- Consumable
- Armor
- Weapon

## Creating Items

### Architecture of Each Architect

Each architect follows the same pattern:

**Left Side (Form):**
- Organized sections for different item properties
- Live input fields with helpful placeholders
- A save button at the bottom

**Right Side (Preview):**
- Live JSON preview of your item
- Shows exactly what will be saved to the file

### General Workflow

1. **Click the tab** for the item type you want to create
2. **Fill in the ID field** - This is required and should be unique
   - IDs are used as the key in the JSON database
   - Example: `fire_boss`, `wooden_sword`, `health_potion`
3. **Fill in other fields** - Most fields have helpful placeholders
4. **Watch the preview** - The right side updates in real-time
5. **Click SAVE button** - Saves to the corresponding JSON file

---

## Item Type Guides

### Boss Architect

**Key Sections:**
1. **Identity & Visuals** - ID, name, description, image path
2. **Vitals** - HP, Energy, Defense (Max values auto-sync)
3. **Skills** - Add combat abilities:
   - Type skill name and damage
   - Click "ADD SKILL" to add to list
4. **Combat Stats** - Damage, attack speed, crit chance, evasion
5. **Loot Drop Table** - XP and coin rewards

**Tips:**
- Max HP/Energy/Def automatically sync with their base values
- Higher spawn rate increases frequency of appearance
- Add multiple skills to create varied combat patterns

### Enemy Architect

**Key Sections:**
1. **Identity & Visuals** - ID, name, description, image
2. **Vitals** - HP, Energy, Defense
3. **Skills** - Add enemy abilities
4. **Combat Stats** - Damage, attack speed, crit stats, evasion
5. **Loot Drop Table** - Coins and XP rewards

**Tips:**
- Easier enemies should have lower HP and damage
- Spawn rate affects how often they appear in dungeons
- Skills make encounters more interesting

### Consumable Architect

**Key Sections:**
1. **Identity** - ID, filename, name, description, image
2. **Mechanics & Vitals** - Cooldown, heal amount, duration
3. **Stat Increases (Buffs)** - Temporary stat boosts
4. **Stat Infliction (Debuffs)** - Damage-over-time effects
5. **Economy & Spawning** - Drop rate, buy/sell prices

**Examples:**
- Health Potion: High heal, low cooldown, low cost
- Damage Buff: dmgIncrease value, duration in ms
- Poison: healthInflict value (damage per tick)

### Armor Architect

**Key Sections:**
1. **Identity** - ID, filename, name, description, image
2. **Classification** - Class type, rarity, slot (head/body)
3. **Defense Stats** - DEF value, damage reduction, evasion
4. **Stat Penalties** - Trade-offs (e.g., heavy armor reduces speed)
5. **Stat Bonuses** - Additional benefits
6. **Economy & Spawning** - Drop rate, pricing

**Tips:**
- Higher rarity → stronger stats
- Heavy armor has good DEF but movement penalties
- Light armor trades defense for speed

### Weapon Architect

**Key Sections:**
1. **Identity** - ID, filename, name, description, image
2. **Classification** - Wield type (one-handed/dual), class, rarity
3. **Damage Stats** - Base damage, crit damage, crit chance
4. **Mechanics** - Energy cost per use
5. **Stat Bonuses** - Additional bonuses when equipped
6. **Economy & Spawning** - Drop rate, pricing

**Tips:**
- Dual-wield weapons should be weaker but allow two at once
- Higher crit chance makes weapons feel more dynamic
- Energy cost limits how often high-damage weapons can be used

---

## Important: Asset Files

When you enter an image path in any architect, you must:

1. **Create the image file** (PNG format recommended)
2. **Upload it to the corresponding folder in `/src/assets/`:**
   - Bosses → `/src/assets/bosses/`
   - Enemies → `/src/assets/enemies/`
   - Consumables → `/src/assets/consumables/`
   - Armor → `/src/assets/armors/`
   - Weapons → `/src/assets/weapons/`
3. **Use the correct path** in the architect (e.g., `bosses/dark_lord.png`)

⚠️ **The system won't validate if the image exists**, so make sure the file is actually in the folder!

---

## File Locations

All populated data is saved to:
- `/src/game/json/bosses.json`
- `/src/game/json/enemies.json`
- `/src/game/json/consumables.json`
- `/src/game/json/armors.json`
- `/src/game/json/weapons.json`

These files are imported by:
- `/src/game/data/bosses.ts`
- `/src/game/data/enemies.ts`
- `/src/game/data/consumables.ts`
- `/src/game/data/armors.ts`
- `/src/game/data/weapons.ts`

---

## Troubleshooting

### "Server error. Is dev-server running?"
Make sure you have `node dev-server.cjs` running in a terminal.

### Changes aren't showing up in game
1. Check that the JSON file in `/src/game/json/` was updated
2. Restart your Vite dev server (`npm run dev`)
3. Hard refresh in browser (Ctrl+Shift+R)

### ID not unique
Each item must have a unique ID within its JSON file. If you try to save with an existing ID, it will overwrite the old item.

### Stats/Values seem wrong
Check that you're using the correct format:
- Numbers only in stat fields
- Percentages as decimals (0.5 = 50%)
- Durations in milliseconds (1000 = 1 second)

---

## Best Practices

1. **Start with a plan** - Sketch out your item stats before entering
2. **Use consistent naming** - `snake_case` for IDs (e.g., `fire_sword`, `poison_potion`)
3. **Test values** - Balance items as you go, don't wait until the end
4. **Back up JSON files** - Keep copies before major changes
5. **Watch the preview** - Use the JSON preview to catch mistakes before saving
6. **Add descriptions** - Good descriptions help during development
7. **Name skills clearly** - Make skill names descriptive (not just "Attack 1", "Attack 2")

---

## Quick Reference: Stat Ranges

| Stat | Type | Typical Range | Notes |
|------|------|---------------|-------|
| HP | number | 10-500 | Higher = tankier |
| Damage | number | 1-100 | Higher = more DPS |
| DEF | number | 0-100 | Reduces incoming damage |
| Crit Chance | decimal | 0-1 | 0.15 = 15% |
| Crit Damage | decimal | 0.5-3 | Multiplier on crit hits |
| Attack Speed | decimal | 0.5-2 | 1.0 = normal speed |
| Evasion | decimal | 0-0.5 | 0.2 = 20% dodge chance |
| Spawn Rate | decimal | 0-1 | How often appears |
| Duration | ms | 1000-30000 | Buff/effect length |
| Cooldown | ms | 1000-60000 | Time between uses |

---

## Need Help?

Refer to existing items in the JSON files for examples of well-balanced items. You can use them as templates!
