# How to Add Items

This guide walks you through adding new items (consumables, weapons, armors) to your game.

## Overview

All items are stored in `/src/game/data/` with three main files:
- `consumables.ts` - Potions, buffs, debuffs
- `weapons.ts` - Swords, bows, etc.
- `armors.ts` - Chest plates, helmets, etc.

Each item type has a corresponding TypeScript interface in `/src/game/types/`.

---

## Step 0: Prepare Assets (All Item Types)

Before adding an item to the database, you need to upload the asset image and export it.

### Assets Folder Structure

```
/src/assets/
├── consumables/
│   ├── index.ts
│   └── [your-image-here].png
├── weapons/
│   ├── index.ts
│   └── [your-image-here].png
└── armors/
    ├── index.ts
    └── [your-image-here].png
```

### Step 1: Add the Image File

1. Save your item's image (`.png`, `.jpg`, or `.svg`) into the appropriate folder:
   - **Consumables**: `src/assets/consumables/`
   - **Weapons**: `src/assets/weapons/`
   - **Armors**: `src/assets/armors/`

2. Name the file using snake_case matching your item ID:
   - Example: `health_potion.png`, `iron_sword.png`, `wooden_armor.png`

### Step 2: Export from Index File

Open the corresponding `index.ts` file and add an export for your image:

**For Consumables** (`src/assets/consumables/index.ts`):
```typescript
import healthPotion from './health_potion.png';
// ... other imports

export {
  healthPotion,
  // ... other exports
};
```

**For Weapons** (`src/assets/weapons/index.ts`):
```typescript
import ironSword from './iron_sword.png';
// ... other imports

export {
  ironSword,
  // ... other exports
};
```

**For Armors** (`src/assets/armors/index.ts`):
```typescript
import woodenArmor from './wooden_armor.png';
// ... other imports

export {
  woodenArmor,
  // ... other exports
};
```

### Step 3: Update Your Item Data

Use the exported asset in your item definition:

```typescript
// consumables.ts example
import { healthPotion } from '@/src/assets/consumables';

export const Consumables: Record<string, Consumable> = {
  health_potion: {
    id: "health_potion",
    filename: "health_potion",
    name: "Health Potion",
    description: "Restores 50 HP when consumed.",
    consumableImg: healthPotion, // ← Use the imported asset
    // ... rest of properties
  }
}
```

---

## Adding a Consumable

### Step 1: Identify the Consumable Type Structure

Check `src/game/types/consumable.types.ts`:

```typescript
interface Consumable { 
  id: string;
  filename: string;
  name: string;
  description: string;
  consumableImg: string;
  
  cooldown: number;
  heal: number;
  dmgIncrease: number;
  defIncrease: number;
  energyIncrease: number;
  atkSpeedIncrease: number;
  
  // Negative Buffs
  healthInflict: number;
  dmgInflict: number;
  defInflict: number;
  energyInflict: number;
  atkSpeedInflict: number;
  duration: number;
  
  dropRate: number;
  sellCost: number;
  buyCost: number;
}
```

### Step 2: Add to Consumables Database

Open `src/game/data/consumables.ts` and add your item to the `Consumables` object:

```typescript
export const Consumables: Record<string, Consumable> = {
  health_potion: { ...existing... },
  
  mana_potion: {  // ← NEW ITEM
    id: "mana_potion",
    filename: "mana_potion",
    name: "Mana Potion",
    description: "Restores 30 energy when consumed.",
    consumableImg: "", // TODO: Add image path
    
    cooldown: 5000,
    heal: 0,
    dmgIncrease: 0,
    defIncrease: 0,
    energyIncrease: 30,  // ← Main effect
    atkSpeedIncrease: 0,
    
    healthInflict: 0,
    dmgInflict: 0,
    defInflict: 0,
    energyInflict: 0,
    atkSpeedInflict: 0,
    duration: 0,
    
    dropRate: 0.10,
    sellCost: 30,
    buyCost: 60,
  }
}
```

### Step 3: Populate All Fields

**Required fields always:**
- `id` - Unique identifier (use snake_case, lowercase)
- `name` - Display name
- `description` - What it does
- `filename` - Asset reference name
- `consumableImg` - Image path (or empty for now)

**For healing/buff effects:** Set the appropriate number (e.g., `heal: 20`, `energyIncrease: 15`)
**For debuffs:** Use the *Inflict fields (e.g., `dmgInflict: -5` applies -5 damage for `duration` ms)
**Economy:** Set `dropRate` (0-1), `sellCost`, `buyCost`

---

## Adding a Weapon

### Step 1: Know the Weapon Type

Check `src/game/types/weapon.types.ts` for the full interface structure.

### Step 2: Add to Weapons Database

Open `src/game/data/weapons.ts`:

```typescript
export const Weapons: Record<string, Weapon> = {
  wooden_sword: { ...existing... },
  
  iron_sword: {  // ← NEW WEAPON
    id: "iron_sword",
    filename: "iron_sword",
    name: "Iron Sword",
    description: "A sturdy blade forged from iron.",
    weaponImg: "", // TODO: Add image path
    wieldType: "one",  // "one" = one-handed, "two" = two-handed
    class: "Warrior",
    rarity: "Common",  // Common, Uncommon, Rare, Epic, Legendary
    
    dmg: 8,  // Damage per hit
    critDmg: 0.5,  // 50% additional damage on crit
    critChance: 0.05,  // 5% chance to crit
    durability: 100,  // 0 = infinite
    
    energyCost: 10,  // Energy consumed per use
    
    dmgBonus: 0,  // Permanent stat bonus
    atkSpeedBonus: 0,
    
    dropRate: 0.08,
    sellCost: 50,
    buyCost: 100,
  }
}
```

### Step 3: Key Weapon Fields

- `wieldType`: `"one"` (one-handed) or `"two"` (two-handed)
- `class`: Determines who can equip it
- `rarity`: Affects drop rates and value
- `dmg`: Base damage
- `critChance`: 0.05 = 5%
- `energyCost`: Energy required per attack (0 = no cost)

---

## Adding an Armor

### Step 1: Know the Armor Type

Check `src/game/types/armor.types.ts` for the full interface.

### Step 2: Add to Armors Database

Open `src/game/data/armors.ts`:

```typescript
export const Armors: Record<string, Armor> = {
  wooden_armor: { ...existing... },
  
  iron_chestplate: {  // ← NEW ARMOR
    id: "iron_chestplate",
    filename: "iron_chestplate",
    name: "Iron Chestplate",
    description: "Heavy iron protection for the torso.",
    armorImg: "", // TODO: Add image path
    class: "Warrior",
    rarity: "Uncommon",
    
    def: 5,  // Defense value
    dmgReduction: 0.15,  // 15% damage reduction
    evasion: 0,  // Dodge chance
    durability: 150,
    
    // Penalties for wearing heavy armor
    dmgPenalty: 0,
    energyPenalty: 0,
    atkSpeedPenalty: 0,
    healthPenalty: 0,
    
    // Bonuses
    energyBonus: 0,
    atkSpeedBonus: 0,
    healthBonus: 10,  // +10 max HP
    defBonus: 0,
    
    dropRate: 0.05,
    sellCost: 75,
    buyCost: 150,
  }
}
```

### Step 3: Key Armor Fields

- `def`: Defense stat (reduces incoming damage)
- `dmgReduction`: Percentage damage reduction (0.15 = 15%)
- `evasion`: Chance to dodge attacks entirely
- `healthBonus`/`energyBonus`: Permanent stat increases
- `Penalties`: Heavy armor may reduce speed or damage output
- `durability`: 0 = infinite, otherwise degrades over time

---

## Common Tips

### 1. **ID Naming Convention**
- Use lowercase snake_case: `health_potion`, `iron_sword`, `wooden_armor`
- Match `id` to the object key for clarity

### 2. **Asset Images**
- Set `consumableImg`, `weaponImg`, or `armorImg` to the image file path
- Example: `"/assets/items/health_potion.png"`
- If image not ready, leave as empty string `""`

### 3. **Rarity Levels**
```
Common → Uncommon → Rare → Epic → Legendary
```

### 4. **Drop Rates**
- `dropRate: 1.0` = 100% drop chance
- `dropRate: 0.05` = 5% drop chance
- `dropRate: 0` = Don't drop (quest item, shop-only, etc.)

### 5. **Economy Balance**
- General formula: `buyCost = sellCost × 2`
- Rare items: Higher ratios (sellCost × 3-4)

### 6. **Cooldowns (Consumables Only)**
- `cooldown: 0` = No cooldown (can use every turn)
- `cooldown: 5000` = 5 second cooldown between uses

### 7. **Verify Compilation**
After adding items, check the terminal for TypeScript errors:
```bash
npm run dev  # Watch mode for automatic compilation
```

---

## Checklist

Before committing your items:

- [ ] All required fields populated (no `undefined`)
- [ ] `id` matches the object key
- [ ] `dropRate`, `sellCost`, `buyCost` are set
- [ ] Stats make sense for balance
- [ ] No syntax errors in TypeScript
- [ ] Image paths correct (or marked TODO if pending)
- [ ] Description is clear and helpful

---

## Example: Complete Item Addition Flow

**Goal:** Add a "Strength Potion" consumable

1. Open `src/game/data/consumables.ts`
2. Add to the `Consumables` object:
   ```typescript
   strength_potion: {
     id: "strength_potion",
     filename: "strength_potion",
     name: "Strength Potion",
     description: "Increases attack damage by 5 for 10 seconds.",
     consumableImg: "/assets/items/strength_potion.png",
     cooldown: 3000,
     heal: 0,
     dmgIncrease: 5,  // ← Main effect
     defIncrease: 0,
     energyIncrease: 0,
     atkSpeedIncrease: 0,
     healthInflict: 0,
     dmgInflict: 0,
     defInflict: 0,
     energyInflict: 0,
     atkSpeedInflict: 0,
     duration: 10000,  // 10 seconds
     dropRate: 0.12,
     sellCost: 35,
     buyCost: 70,
   }
   ```
3. Save file
4. Verify no TypeScript errors in terminal
5. Done! Available in-game

