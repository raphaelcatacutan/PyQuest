# PyQuest Python Function Index

## src/backend/mechanics/game-modules.ts

### Built-in preloaded functions (no import)
- set_delay(milliseconds=0)
- sleep(milliseconds=0)
- roll_dice(sides=6, count=1)
- chance(percentage)
- random_choice(items)
- clamp(value, min_value, max_value)
- goTo(locationId)
- gain_hp(amount=10)
- take_damage(amount=10)
- gain_coins(amount=1)
- gain_xp(amount=10)
- combat(state=True)
- target_enemy(state=True)
- log(message="")
- scavenge()
- explore(state=True)

### Preloaded object: player
- player.equip(item)
- player.unequip()
- player.gain_hp(amount=10)
- player.take_damage(amount=10)
- player.gain_coins(amount=1)
- player.gain_xp(amount=10)
- player.go_to(location_id)

### Module user.weapons
Import style: from user.weapons import spear
- spear.attack()
- spear.thrust()
- spear.pierce()

### Module spear
- Spear(damage=10, durability=100)
- Spear.attack(target_name="Enemy")
- Spear.thrust(target_name="Enemy")
- Spear.repair(amount=50)
- attack(target_name="Enemy", damage=10)
- create_spear(damage=10)

### Module inventory
- Item(name, quantity=1, value=0)
- add_item(name, quantity=1, value=0)
- remove_item(name, quantity=1)
- get_item(name)
- list_items()
- get_total_value()
- clear_inventory()

### Module magic
- Spell(name, mana_cost, damage, spell_type="offensive")
- Spell.cast(caster_mana, target_name="Enemy")
- cast_spell(spell_name, caster_mana, target_name="Enemy")
- mana_cost(spell_name)

### Module utils
- roll_dice(sides=6, count=1)
- chance(percentage)
- random_choice(items)
- clamp(value, min_value, max_value)

## src/backend/mechanics/shop-item-modules.ts

### Module consumable
Import style: from consumable import health_potion

Per-symbol methods:
- consume()
- use()

Importable symbols:
- berserk_draught
- chaos_elixir
- corrosion_vial
- dense_tar_essence
- focus_concoction
- grand_berserk_draught
- grand_guard_elixir
- grand_haste_phial
- greater_health_potion
- greater_mana_potion
- guard_elixir
- haste_phial
- health_potion
- iron_stew
- juggernaut_tonic
- lesser_berserk_draught
- lesser_guard_elixir
- lesser_haste_phial
- mana_potion
- mind_leech
- risky_war_broth
- severe_corrosion_vial
- severe_mind_leech
- spark_noodle_bowl
- superior_health_potion
- superior_mana_potion
- tar_essence
- weak_corrosion_vial
- weak_mind_leech
- weak_tar_essence

### Module weapon
Import style: from weapon import wooden_wand

Per-symbol methods:
- use(target_name="Enemy")
- attack(target_name="Enemy")
- named skill methods (see list below)

Importable symbols:
- academy_wand
- amethyst_staff
- ancient_of_rites
- ashen_sword
- blighted_bow
- butterfly_knife
- coated_blade
- common_sword
- crossbow
- cursed_wand
- dagger
- diamond_staff
- duskblade
- elbrauns_blade
- elven_bow
- fire_drake_wand
- fire_fang
- floyds_sage_wand
- galaxies_tear
- great_forests_wand
- heavenly_sword
- hells_bane
- lantiers_hidden_blade
- last_whisper
- lightning_bow
- lightning_dagger
- lightning_spear
- lightning_staff
- lunar_promise
- multishot_bow
- old_compound_bow
- old_staff
- poisoned_throwing_knives
- quickblade
- rapier
- rusted_kukri
- rusty_axe
- seasons_blessing
- serrated_dirk
- shadow_glaive
- slingshot
- sorbets_great_bow
- spear
- staff_of_ages
- steel_axe
- steel_crossbow
- steel_kukri
- steel_sword
- stiletto
- training_sword
- vampire_fans
- volcanic_bow
- wilted_bow
- wilted_wand
- wooden_bow
- wooden_wand

Named skill methods by symbol:
- ancient_of_rites: damage(), stun(), heal()
- ashen_sword: bleed()
- blighted_bow: bleed(), damage()
- coated_blade: bleed()
- cursed_wand: bleed()
- diamond_staff: damage()
- duskblade: damage(), bleed()
- elbrauns_blade: damage(), stun()
- elven_bow: heal()
- fire_drake_wand: damage()
- fire_fang: damage()
- floyds_sage_wand: heal(), damage()
- galaxies_tear: damage(), heal(), stun()
- great_forests_wand: heal()
- heavenly_sword: heal(), damage()
- hells_bane: damage(), bleed()
- lantiers_hidden_blade: stun(), bleed()
- last_whisper: damage(), stun(), bleed()
- lightning_bow: stun()
- lightning_dagger: stun()
- lightning_spear: stun()
- lightning_staff: stun()
- lunar_promise: damage(), stun(), heal()
- multishot_bow: damage()
- poisoned_throwing_knives: bleed()
- seasons_blessing: heal(), damage()
- serrated_dirk: bleed()
- shadow_glaive: bleed(), damage()
- sorbets_great_bow: damage(), stun()
- staff_of_ages: damage(), heal()
- steel_axe: damage()
- steel_crossbow: damage()
- steel_kukri: damage()
- steel_sword: damage()
- vampire_fans: heal(), bleed()
- volcanic_bow: damage()

### Module pickedup
Import style: from pickedup import health_potion

Per-symbol methods depend on item kind:
- picked-up consumables: consume(), use()
- picked-up weapons: use(target_name="Enemy"), attack(target_name="Enemy"), plus named skill methods
- picked-up armors: equip(), use()

Importable symbols:
- dynamic from player inventory folder pickedup (pickedup_folder)
- symbol names are normalized from itemId (lowercase with underscores)

## src/backend/mechanics/item-energy-costs.ts

Functions:
- resolveWeaponUseEnergyCost(itemId, fallback=1)
- resolveConsumableUseEnergyCost(itemId, fallback=1)

Runtime event usage:
- shop.weapon.use uses resolveWeaponUseEnergyCost(...)
- shop.consumable.use uses resolveConsumableUseEnergyCost(...)

Weapon use energy cost by symbol:
- academy_wand: 8
- amethyst_staff: 8
- ancient_of_rites: 16
- ashen_sword: 12
- blighted_bow: 13
- butterfly_knife: 7
- coated_blade: 12
- common_sword: 10
- crossbow: 9
- cursed_wand: 10
- dagger: 7
- diamond_staff: 10
- duskblade: 11
- elbrauns_blade: 14
- elven_bow: 11
- fire_drake_wand: 10
- fire_fang: 9
- floyds_sage_wand: 12
- galaxies_tear: 14
- great_forests_wand: 10
- heavenly_sword: 14
- hells_bane: 13
- lantiers_hidden_blade: 11
- last_whisper: 13
- lightning_bow: 11
- lightning_dagger: 9
- lightning_spear: 12
- lightning_staff: 10
- lunar_promise: 15
- multishot_bow: 11
- old_compound_bow: 9
- old_staff: 8
- poisoned_throwing_knives: 9
- quickblade: 7
- rapier: 10
- rusted_kukri: 7
- rusty_axe: 10
- seasons_blessing: 12
- serrated_dirk: 9
- shadow_glaive: 14
- slingshot: 9
- sorbets_great_bow: 13
- spear: 10
- staff_of_ages: 12
- steel_axe: 12
- steel_crossbow: 11
- steel_kukri: 9
- steel_sword: 12
- stiletto: 7
- training_sword: 10
- vampire_fans: 11
- volcanic_bow: 11
- wilted_bow: 9
- wilted_wand: 8
- wooden_bow: 9
- wooden_wand: 8

Consumable use energy cost by symbol:
- berserk_draught: 5
- chaos_elixir: 12
- corrosion_vial: 4
- dense_tar_essence: 5
- focus_concoction: 8
- grand_berserk_draught: 7
- grand_guard_elixir: 9
- grand_haste_phial: 6
- greater_health_potion: 3
- greater_mana_potion: 3
- guard_elixir: 7
- haste_phial: 4
- health_potion: 2
- iron_stew: 7
- juggernaut_tonic: 11
- lesser_berserk_draught: 4
- lesser_guard_elixir: 4
- lesser_haste_phial: 3
- mana_potion: 2
- mind_leech: 4
- risky_war_broth: 8
- severe_corrosion_vial: 5
- severe_mind_leech: 5
- spark_noodle_bowl: 7
- superior_health_potion: 5
- superior_mana_potion: 5
- tar_essence: 4
- weak_corrosion_vial: 4
- weak_mind_leech: 4
- weak_tar_essence: 3
