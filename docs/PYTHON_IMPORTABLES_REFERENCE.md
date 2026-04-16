# PyQuest Python Runtime Reference

This reference includes every player-facing callable currently available in the Python runtime.

## Preloaded callables (no import required)

Global functions:
- goTo(locationId)
  - effect: requests scene transition to locationId
- scavenge()
  - effect: emits scavenge event for current scene
- explore(state=True)
  - effect: emits explore event for current scene

Preloaded object: player
- player.equip(item)
  - effect: equips an item object that has a name field
- player.unequip()
  - effect: unequips current player equipment

Readable player properties:
- player.hp
- player.energy
- player.armor.type
- player.armor.durability

## Module importability status

Importable module(s):
- from pickedup import <item_id>

Internal or blocked from direct import in player scripts:
- builtin
- abstracts
- weapon (legacy/blocked)
- consumable (legacy/blocked)
- user.weapons (removed)
- spear (removed)
- inventory (removed)
- magic (removed)
- utils (removed)

## Pickedup item callables

Only this module is player-accessible for items:
- from pickedup import <item_id>

## Consumables

from pickedup import berserk_draught
- consume()
  - effect: buff dmg by 22% for 13000ms
  - energy cost: 5

from pickedup import chaos_elixir
- consume()
  - effect: buff dmg by 30% for 14000ms; buff speed by 15% for 14000ms; debuff enemy hp by 22 for 14000ms
  - energy cost: 12

from pickedup import corrosion_vial
- consume()
  - effect: debuff enemy hp by 24 for 13000ms
  - energy cost: 4

from pickedup import dense_tar_essence
- consume()
  - effect: debuff enemy speed by 0.18 for 16000ms
  - energy cost: 5

from pickedup import focus_concoction
- consume()
  - effect: buff speed by 22% for 12000ms; debuff enemy energy by 18 for 12000ms
  - energy cost: 8

from pickedup import grand_berserk_draught
- consume()
  - effect: buff dmg by 35% for 16000ms
  - energy cost: 7

from pickedup import grand_guard_elixir
- consume()
  - effect: buff def by 55% for 18000ms
  - energy cost: 9

from pickedup import grand_haste_phial
- consume()
  - effect: buff speed by 25% for 15000ms
  - energy cost: 6

from pickedup import greater_health_potion
- consume()
  - effect: restore 45 hp
  - energy cost: 3

from pickedup import greater_mana_potion
- consume()
  - effect: restore 45 energy
  - energy cost: 3

from pickedup import guard_elixir
- consume()
  - effect: buff def by 35% for 15000ms
  - energy cost: 7

from pickedup import haste_phial
- consume()
  - effect: buff speed by 15% for 12000ms
  - energy cost: 4

from pickedup import health_potion
- consume()
  - effect: restore 25 hp
  - energy cost: 2

from pickedup import iron_stew
- consume()
  - effect: restore 35 hp; buff def by 15% for 12000ms
  - energy cost: 7

from pickedup import juggernaut_tonic
- consume()
  - effect: buff def by 45% for 15000ms; debuff enemy speed by 0.1 for 13000ms
  - energy cost: 11

from pickedup import lesser_berserk_draught
- consume()
  - effect: buff dmg by 12% for 10000ms
  - energy cost: 4

from pickedup import lesser_guard_elixir
- consume()
  - effect: buff def by 20% for 12000ms
  - energy cost: 4

from pickedup import lesser_haste_phial
- consume()
  - effect: buff speed by 8% for 9000ms
  - energy cost: 3

from pickedup import mana_potion
- consume()
  - effect: restore 25 energy
  - energy cost: 2

from pickedup import mind_leech
- consume()
  - effect: debuff enemy energy by 24 for 13000ms
  - energy cost: 4

from pickedup import risky_war_broth
- consume()
  - effect: buff dmg by 25% for 12000ms; debuff enemy hp by 16 for 12000ms
  - energy cost: 8

from pickedup import severe_corrosion_vial
- consume()
  - effect: debuff enemy hp by 38 for 16000ms
  - energy cost: 5

from pickedup import severe_mind_leech
- consume()
  - effect: debuff enemy energy by 38 for 16000ms
  - energy cost: 5

from pickedup import spark_noodle_bowl
- consume()
  - effect: restore 35 energy; buff speed by 12% for 10000ms
  - energy cost: 7

from pickedup import superior_health_potion
- consume()
  - effect: restore 70 hp
  - energy cost: 5

from pickedup import superior_mana_potion
- consume()
  - effect: restore 70 energy
  - energy cost: 5

from pickedup import tar_essence
- consume()
  - effect: debuff enemy speed by 0.12 for 13000ms
  - energy cost: 4

from pickedup import weak_corrosion_vial
- consume()
  - effect: debuff enemy hp by 12 for 10000ms
  - energy cost: 4

from pickedup import weak_mind_leech
- consume()
  - effect: debuff enemy energy by 12 for 10000ms
  - energy cost: 4

from pickedup import weak_tar_essence
- consume()
  - effect: debuff enemy speed by 0.06 for 10000ms
  - energy cost: 3

## Weapons

from pickedup import academy_wand
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 8

from pickedup import amethyst_staff
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 8

from pickedup import ancient_of_rites
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 16
- damage()
  - effect: damage enemy by 18
  - energy cost: 18
- stun()
  - effect: stun enemy for 1300
  - energy cost: 18
- heal()
  - effect: heal player by 14
  - energy cost: 18

from pickedup import ashen_sword
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 12
- bleed()
  - effect: bleed enemy by 2 over 3000
  - energy cost: 10

from pickedup import blighted_bow
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 13
- bleed()
  - effect: bleed enemy by 3 over 4000
  - energy cost: 14
- damage()
  - effect: damage enemy by 12
  - energy cost: 14

from pickedup import butterfly_knife
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 7

from pickedup import coated_blade
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 12
- bleed()
  - effect: bleed enemy by 2 over 3000
  - energy cost: 10

from pickedup import common_sword
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 10

from pickedup import crossbow
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 9

from pickedup import cursed_wand
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 10
- bleed()
  - effect: bleed enemy by 2 over 3000
  - energy cost: 10

from pickedup import dagger
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 7

from pickedup import diamond_staff
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 10
- damage()
  - effect: damage enemy by 7
  - energy cost: 10

from pickedup import duskblade
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 11
- damage()
  - effect: damage enemy by 12
  - energy cost: 14
- bleed()
  - effect: bleed enemy by 3 over 4000
  - energy cost: 14

from pickedup import elbrauns_blade
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 14
- damage()
  - effect: damage enemy by 12
  - energy cost: 14
- stun()
  - effect: stun enemy for 1000
  - energy cost: 14

from pickedup import elven_bow
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 11
- heal()
  - effect: heal player by 5
  - energy cost: 10

from pickedup import fire_drake_wand
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 10
- damage()
  - effect: damage enemy by 7
  - energy cost: 10

from pickedup import fire_fang
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 9
- damage()
  - effect: damage enemy by 7
  - energy cost: 10

from pickedup import floyds_sage_wand
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 12
- heal()
  - effect: heal player by 9
  - energy cost: 14
- damage()
  - effect: damage enemy by 12
  - energy cost: 14

from pickedup import galaxies_tear
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 14
- damage()
  - effect: damage enemy by 18
  - energy cost: 18
- heal()
  - effect: heal player by 14
  - energy cost: 18
- stun()
  - effect: stun enemy for 1300
  - energy cost: 18

from pickedup import great_forests_wand
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 10
- heal()
  - effect: heal player by 5
  - energy cost: 10

from pickedup import heavenly_sword
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 14
- heal()
  - effect: heal player by 9
  - energy cost: 14
- damage()
  - effect: damage enemy by 12
  - energy cost: 14

from pickedup import hells_bane
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 13
- damage()
  - effect: damage enemy by 12
  - energy cost: 14
- bleed()
  - effect: bleed enemy by 3 over 4000
  - energy cost: 14

from pickedup import lantiers_hidden_blade
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 11
- stun()
  - effect: stun enemy for 1000
  - energy cost: 14
- bleed()
  - effect: bleed enemy by 3 over 4000
  - energy cost: 14

from pickedup import last_whisper
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 13
- damage()
  - effect: damage enemy by 18
  - energy cost: 18
- stun()
  - effect: stun enemy for 1300
  - energy cost: 18
- bleed()
  - effect: bleed enemy by 4 over 5000
  - energy cost: 18

from pickedup import lightning_bow
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 11
- stun()
  - effect: stun enemy for 700
  - energy cost: 10

from pickedup import lightning_dagger
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 9
- stun()
  - effect: stun enemy for 700
  - energy cost: 10

from pickedup import lightning_spear
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 12
- stun()
  - effect: stun enemy for 700
  - energy cost: 10

from pickedup import lightning_staff
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 10
- stun()
  - effect: stun enemy for 700
  - energy cost: 10

from pickedup import lunar_promise
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 15
- damage()
  - effect: damage enemy by 18
  - energy cost: 18
- stun()
  - effect: stun enemy for 1300
  - energy cost: 18
- heal()
  - effect: heal player by 14
  - energy cost: 18

from pickedup import multishot_bow
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 11
- damage()
  - effect: damage enemy by 7
  - energy cost: 10

from pickedup import old_compound_bow
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 9

from pickedup import old_staff
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 8

from pickedup import poisoned_throwing_knives
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 9
- bleed()
  - effect: bleed enemy by 2 over 3000
  - energy cost: 10

from pickedup import quickblade
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 7

from pickedup import rapier
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 10

from pickedup import rusted_kukri
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 7

from pickedup import rusty_axe
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 10

from pickedup import seasons_blessing
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 12
- heal()
  - effect: heal player by 9
  - energy cost: 14
- damage()
  - effect: damage enemy by 12
  - energy cost: 14

from pickedup import serrated_dirk
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 9
- bleed()
  - effect: bleed enemy by 2 over 3000
  - energy cost: 10

from pickedup import shadow_glaive
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 14
- bleed()
  - effect: bleed enemy by 3 over 4000
  - energy cost: 14
- damage()
  - effect: damage enemy by 12
  - energy cost: 14

from pickedup import slingshot
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 9

from pickedup import sorbets_great_bow
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 13
- damage()
  - effect: damage enemy by 12
  - energy cost: 14
- stun()
  - effect: stun enemy for 1000
  - energy cost: 14

from pickedup import spear
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 10

from pickedup import staff_of_ages
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 12
- damage()
  - effect: damage enemy by 12
  - energy cost: 14
- heal()
  - effect: heal player by 9
  - energy cost: 14

from pickedup import steel_axe
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 12
- damage()
  - effect: damage enemy by 7
  - energy cost: 10

from pickedup import steel_crossbow
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 11
- damage()
  - effect: damage enemy by 7
  - energy cost: 10

from pickedup import steel_kukri
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 9
- damage()
  - effect: damage enemy by 7
  - energy cost: 10

from pickedup import steel_sword
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 12
- damage()
  - effect: damage enemy by 7
  - energy cost: 10

from pickedup import stiletto
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 7

from pickedup import training_sword
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 10

from pickedup import vampire_fans
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 11
- heal()
  - effect: heal player by 9
  - energy cost: 14
- bleed()
  - effect: bleed enemy by 3 over 4000
  - energy cost: 14

from pickedup import volcanic_bow
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 11
- damage()
  - effect: damage enemy by 7
  - energy cost: 10

from pickedup import wilted_bow
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 9

from pickedup import wilted_wand
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 8

from pickedup import wooden_bow
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 9

from pickedup import wooden_wand
- strike()
  - effect: base attack using item stats; applies weapon inflictions if present
  - energy cost: 8

## Armors

from pickedup import academy_hat
- activate()
  - effect: gain base def 2; modifiers: bonus energy 8
  - energy cost: 0

from pickedup import aegis_helmet
- activate()
  - effect: gain base def 12; modifiers: bonus def 5; bonus evasion 0.07; bonus energy 26; bonus dmg 5; bonus atkSpeed 220; bonus health 48; bonus dmgReduction 0.06
  - energy cost: 0

from pickedup import apprentice_hat
- activate()
  - effect: gain base def 2; modifiers: bonus health 12
  - energy cost: 0

from pickedup import apprentice_robe
- activate()
  - effect: gain base def 3; modifiers: bonus energy 8
  - energy cost: 0

from pickedup import archer_hood
- activate()
  - effect: gain base def 2; modifiers: bonus evasion 0.02
  - energy cost: 0

from pickedup import archers_garb
- activate()
  - effect: gain base def 3; modifiers: bonus dmg 1
  - energy cost: 0

from pickedup import ashen_helm
- activate()
  - effect: gain base def 4; modifiers: bonus dmg 2; penalty def 1
  - energy cost: 0

from pickedup import ashen_plate
- activate()
  - effect: gain base def 6; modifiers: bonus dmg 2; penalty def 1
  - energy cost: 0

from pickedup import bastion_mail
- activate()
  - effect: gain base def 6; modifiers: bonus energy 12; penalty def 1
  - energy cost: 0

from pickedup import blackthorn_mask
- activate()
  - effect: gain base def 4; modifiers: bonus health 20; penalty evasion 0.015
  - energy cost: 0

from pickedup import blackweave_tunic
- activate()
  - effect: gain base def 6; modifiers: bonus health 20; penalty evasion 0.015
  - energy cost: 0

from pickedup import bulwark_great_helmet
- activate()
  - effect: gain base def 7; modifiers: bonus dmgReduction 0.04; bonus def 3; penalty energy 10
  - energy cost: 0

from pickedup import chainmail_armor
- activate()
  - effect: gain base def 3; modifiers: bonus def 1
  - energy cost: 0

from pickedup import chosen_eclipse
- activate()
  - effect: gain base def 12; modifiers: bonus def 5; bonus evasion 0.07; bonus energy 26; bonus dmg 5; bonus atkSpeed 220; bonus health 48; bonus dmgReduction 0.06
  - energy cost: 0

from pickedup import cloth_mask
- activate()
  - effect: gain base def 2; modifiers: bonus evasion 0.02
  - energy cost: 0

from pickedup import crown_of_the_seventh_circle
- activate()
  - effect: gain base def 12; modifiers: bonus def 5; bonus evasion 0.07; bonus energy 26; bonus dmg 5; bonus atkSpeed 220; bonus health 48; bonus dmgReduction 0.06
  - energy cost: 0

from pickedup import dawnbreak_visor
- activate()
  - effect: gain base def 7; modifiers: bonus dmg 3; bonus energy 18; penalty def 2
  - energy cost: 0

from pickedup import daybreak_hat
- activate()
  - effect: gain base def 7; modifiers: bonus health 32; bonus dmg 3; penalty atkSpeed 130
  - energy cost: 0

from pickedup import dusk_and_dawn
- activate()
  - effect: gain base def 12; modifiers: bonus def 5; bonus evasion 0.07; bonus energy 26; bonus dmg 5; bonus atkSpeed 220; bonus health 48; bonus dmgReduction 0.06
  - energy cost: 0

from pickedup import duskleather_armor
- activate()
  - effect: gain base def 6; modifiers: bonus dmg 2; penalty dmgReduction 0.01
  - energy cost: 0

from pickedup import duskwrap_mask
- activate()
  - effect: gain base def 4; modifiers: bonus dmg 2; penalty dmgReduction 0.01
  - energy cost: 0

from pickedup import elbrauns_helm
- activate()
  - effect: gain base def 7; modifiers: bonus def 3; bonus health 32; penalty atkSpeed 130
  - energy cost: 0

from pickedup import elbrauns_iron_will
- activate()
  - effect: gain base def 10; modifiers: bonus def 3; bonus health 32; penalty atkSpeed 130
  - energy cost: 0

from pickedup import elven_hood
- activate()
  - effect: gain base def 4; modifiers: bonus evasion 0.03; penalty health 10
  - energy cost: 0

from pickedup import elven_leather
- activate()
  - effect: gain base def 6; modifiers: bonus atkSpeed 110; penalty def 1
  - energy cost: 0

from pickedup import falconhide_vest
- activate()
  - effect: gain base def 6; modifiers: bonus dmg 2; penalty dmgReduction 0.01
  - energy cost: 0

from pickedup import feather_charm
- activate()
  - effect: gain base def 2; modifiers: bonus energy 8
  - energy cost: 0

from pickedup import final_memorial
- activate()
  - effect: gain base def 10; modifiers: bonus dmg 3; bonus dmgReduction 0.04; penalty energy 10
  - energy cost: 0

from pickedup import floyds_big_hat
- activate()
  - effect: gain base def 7; modifiers: bonus energy 18; bonus dmg 3; penalty def 2
  - energy cost: 0

from pickedup import floyds_star_cloak
- activate()
  - effect: gain base def 10; modifiers: bonus energy 18; bonus dmg 3; penalty def 2
  - energy cost: 0

from pickedup import galaxies_heart
- activate()
  - effect: gain base def 16; modifiers: bonus def 5; bonus evasion 0.07; bonus energy 26; bonus dmg 5; bonus atkSpeed 220; bonus health 48; bonus dmgReduction 0.06
  - energy cost: 0

from pickedup import galeforce_amulet
- activate()
  - effect: gain base def 7; modifiers: bonus dmg 3; bonus atkSpeed 150; penalty health 16
  - energy cost: 0

from pickedup import guard_helm
- activate()
  - effect: gain base def 2; modifiers: bonus dmgReduction 0.01
  - energy cost: 0

from pickedup import guard_mail
- activate()
  - effect: gain base def 3; modifiers: bonus energy 8
  - energy cost: 0

from pickedup import hawkeye_band
- activate()
  - effect: gain base def 4; modifiers: bonus dmg 2; penalty dmgReduction 0.01
  - energy cost: 0

from pickedup import heavy_helm
- activate()
  - effect: gain base def 2; modifiers: bonus dmg 1
  - energy cost: 0

from pickedup import high_wizard_hat
- activate()
  - effect: gain base def 4; modifiers: bonus dmg 2; penalty def 1
  - energy cost: 0

from pickedup import high_wizard_robe
- activate()
  - effect: gain base def 6; modifiers: bonus dmg 2; penalty def 1
  - energy cost: 0

from pickedup import horus_mantle
- activate()
  - effect: gain base def 16; modifiers: bonus def 5; bonus evasion 0.07; bonus energy 26; bonus dmg 5; bonus atkSpeed 220; bonus health 48; bonus dmgReduction 0.06
  - energy cost: 0

from pickedup import hunter_cap
- activate()
  - effect: gain base def 2; modifiers: bonus atkSpeed 70
  - energy cost: 0

from pickedup import hunter_tunic
- activate()
  - effect: gain base def 3; modifiers: bonus evasion 0.02
  - energy cost: 0

from pickedup import iron_cuirass
- activate()
  - effect: gain base def 3; modifiers: bonus health 12
  - energy cost: 0

from pickedup import iron_helm
- activate()
  - effect: gain base def 2; modifiers: bonus def 1
  - energy cost: 0

from pickedup import knight_armor
- activate()
  - effect: gain base def 6; modifiers: bonus health 20; penalty evasion 0.015
  - energy cost: 0

from pickedup import knight_helm
- activate()
  - effect: gain base def 4; modifiers: bonus health 20; penalty evasion 0.015
  - energy cost: 0

from pickedup import lantiers_blessing
- activate()
  - effect: gain base def 10; modifiers: bonus atkSpeed 150; bonus evasion 0.05; penalty def 2
  - energy cost: 0

from pickedup import lantiers_persona
- activate()
  - effect: gain base def 7; modifiers: bonus atkSpeed 150; bonus evasion 0.05; penalty def 2
  - energy cost: 0

from pickedup import last_bastion
- activate()
  - effect: gain base def 16; modifiers: bonus def 5; bonus evasion 0.07; bonus energy 26; bonus dmg 5; bonus atkSpeed 220; bonus health 48; bonus dmgReduction 0.06
  - energy cost: 0

from pickedup import leather_jerkin
- activate()
  - effect: gain base def 3; modifiers: bonus health 12
  - energy cost: 0

from pickedup import leather_mask
- activate()
  - effect: gain base def 2; modifiers: bonus health 12
  - energy cost: 0

from pickedup import leather_vest
- activate()
  - effect: gain base def 3; modifiers: bonus health 12
  - energy cost: 0

from pickedup import light_jerkin
- activate()
  - effect: gain base def 3; modifiers: bonus evasion 0.02
  - energy cost: 0

from pickedup import lost_from_light
- activate()
  - effect: gain base def 16; modifiers: bonus def 5; bonus evasion 0.07; bonus energy 26; bonus dmg 5; bonus atkSpeed 220; bonus health 48; bonus dmgReduction 0.06
  - energy cost: 0

from pickedup import monocle
- activate()
  - effect: gain base def 2; modifiers: bonus atkSpeed 70
  - energy cost: 0

from pickedup import moonthread_hat
- activate()
  - effect: gain base def 4; modifiers: bonus energy 12; penalty def 1
  - energy cost: 0

from pickedup import moonthread_robe
- activate()
  - effect: gain base def 6; modifiers: bonus energy 12; penalty def 1
  - energy cost: 0

from pickedup import mountains_heart
- activate()
  - effect: gain base def 10; modifiers: bonus health 32; bonus dmgReduction 0.04; penalty atkSpeed 130
  - energy cost: 0

from pickedup import nightrunner_garb
- activate()
  - effect: gain base def 6; modifiers: bonus evasion 0.03; penalty health 10
  - energy cost: 0

from pickedup import nightstalker_mask
- activate()
  - effect: gain base def 4; modifiers: bonus evasion 0.03; penalty health 10
  - energy cost: 0

from pickedup import north_wind_armor
- activate()
  - effect: gain base def 10; modifiers: bonus dmg 3; bonus evasion 0.05; penalty health 16
  - energy cost: 0

from pickedup import old_mantle
- activate()
  - effect: gain base def 3; modifiers: bonus dmg 1
  - energy cost: 0

from pickedup import puppeteers_mask
- activate()
  - effect: gain base def 7; modifiers: bonus evasion 0.05; bonus dmg 3; penalty health 16
  - energy cost: 0

from pickedup import ranger_amulet
- activate()
  - effect: gain base def 4; modifiers: bonus atkSpeed 110; penalty def 1
  - energy cost: 0

from pickedup import ranger_jerkin
- activate()
  - effect: gain base def 6; modifiers: bonus evasion 0.03; penalty health 10
  - energy cost: 0

from pickedup import runed_greathelm
- activate()
  - effect: gain base def 4; modifiers: bonus energy 12; penalty def 1
  - energy cost: 0

from pickedup import runic_monocle
- activate()
  - effect: gain base def 4; modifiers: bonus atkSpeed 110; penalty health 10
  - energy cost: 0

from pickedup import runic_robe
- activate()
  - effect: gain base def 6; modifiers: bonus atkSpeed 110; penalty health 10
  - energy cost: 0

from pickedup import scholars_glasses
- activate()
  - effect: gain base def 2; modifiers: bonus dmg 1
  - energy cost: 0

from pickedup import scout_band
- activate()
  - effect: gain base def 2; modifiers: bonus dmg 1
  - energy cost: 0

from pickedup import scout_vest
- activate()
  - effect: gain base def 3; modifiers: bonus atkSpeed 70
  - energy cost: 0

from pickedup import shade_scarf
- activate()
  - effect: gain base def 2; modifiers: bonus dmg 1
  - energy cost: 0

from pickedup import shadow_realm_mask
- activate()
  - effect: gain base def 7; modifiers: bonus dmg 3; bonus energy 18; penalty health 16
  - energy cost: 0

from pickedup import shadow_tunic
- activate()
  - effect: gain base def 3; modifiers: bonus dmg 1
  - energy cost: 0

from pickedup import shadoweave_cloak
- activate()
  - effect: gain base def 10; modifiers: bonus evasion 0.05; bonus dmg 3; penalty health 16
  - energy cost: 0

from pickedup import shadowthread_cloak
- activate()
  - effect: gain base def 6; modifiers: bonus energy 12; penalty def 1
  - energy cost: 0

from pickedup import shadowveil_hood
- activate()
  - effect: gain base def 4; modifiers: bonus energy 12; penalty def 1
  - energy cost: 0

from pickedup import silent_hood
- activate()
  - effect: gain base def 4; modifiers: bonus atkSpeed 110; penalty def 1
  - energy cost: 0

from pickedup import silentstep_vest
- activate()
  - effect: gain base def 6; modifiers: bonus atkSpeed 110; penalty def 1
  - energy cost: 0

from pickedup import silverweave_cloak
- activate()
  - effect: gain base def 6; modifiers: bonus def 2; penalty atkSpeed 90
  - energy cost: 0

from pickedup import silverweave_hat
- activate()
  - effect: gain base def 4; modifiers: bonus def 2; penalty atkSpeed 90
  - energy cost: 0

from pickedup import simple_cloak
- activate()
  - effect: gain base def 3; modifiers: bonus atkSpeed 70
  - energy cost: 0

from pickedup import skies_blessing
- activate()
  - effect: gain base def 7; modifiers: bonus evasion 0.05; bonus health 32; penalty def 2
  - energy cost: 0

from pickedup import soldier_armor
- activate()
  - effect: gain base def 3; modifiers: bonus dmgReduction 0.01
  - energy cost: 0

from pickedup import soldier_helm
- activate()
  - effect: gain base def 2; modifiers: bonus health 12
  - energy cost: 0

from pickedup import sorbets_wind_amulet
- activate()
  - effect: gain base def 7; modifiers: bonus atkSpeed 150; bonus energy 18; penalty def 2
  - energy cost: 0

from pickedup import sorbets_windbreaker
- activate()
  - effect: gain base def 10; modifiers: bonus atkSpeed 150; bonus evasion 0.05; penalty def 2
  - energy cost: 0

from pickedup import star_shatterer_cloak
- activate()
  - effect: gain base def 10; modifiers: bonus dmg 3; bonus health 32; penalty atkSpeed 130
  - energy cost: 0

from pickedup import starreader_hat
- activate()
  - effect: gain base def 4; modifiers: bonus health 20; penalty evasion 0.015
  - energy cost: 0

from pickedup import starwoven_mantle
- activate()
  - effect: gain base def 6; modifiers: bonus health 20; penalty evasion 0.015
  - energy cost: 0

from pickedup import steel_cuirass
- activate()
  - effect: gain base def 6; modifiers: bonus def 2; penalty atkSpeed 90
  - energy cost: 0

from pickedup import steel_helm
- activate()
  - effect: gain base def 4; modifiers: bonus def 2; penalty atkSpeed 90
  - energy cost: 0

from pickedup import stormwatch_circlet
- activate()
  - effect: gain base def 4; modifiers: bonus health 20; penalty evasion 0.015
  - energy cost: 0

from pickedup import stormweave_tunic
- activate()
  - effect: gain base def 6; modifiers: bonus health 20; penalty evasion 0.015
  - energy cost: 0

from pickedup import street_hood
- activate()
  - effect: gain base def 2; modifiers: bonus atkSpeed 70
  - energy cost: 0

from pickedup import student_robe
- activate()
  - effect: gain base def 3; modifiers: bonus health 12
  - energy cost: 0

from pickedup import sulgatas_shadow
- activate()
  - effect: gain base def 10; modifiers: bonus dmg 3; bonus energy 18; penalty health 16
  - energy cost: 0

from pickedup import tempestveil_cloak
- activate()
  - effect: gain base def 10; modifiers: bonus atkSpeed 150; bonus evasion 0.05; penalty health 16
  - energy cost: 0

from pickedup import thiefs_garb
- activate()
  - effect: gain base def 3; modifiers: bonus atkSpeed 70
  - energy cost: 0

from pickedup import trail_amulet
- activate()
  - effect: gain base def 2; modifiers: bonus health 12
  - energy cost: 0

from pickedup import travelers_coat
- activate()
  - effect: gain base def 3; modifiers: bonus energy 8
  - energy cost: 0

from pickedup import vanguard_armor
- activate()
  - effect: gain base def 6; modifiers: bonus dmgReduction 0.02; penalty atkSpeed 90
  - energy cost: 0

from pickedup import vanguard_helm
- activate()
  - effect: gain base def 4; modifiers: bonus dmgReduction 0.02; penalty atkSpeed 90
  - energy cost: 0

from pickedup import voidpetal_hat
- activate()
  - effect: gain base def 7; modifiers: bonus atkSpeed 150; bonus evasion 0.05; penalty health 16
  - energy cost: 0

from pickedup import windcall_charm
- activate()
  - effect: gain base def 4; modifiers: bonus energy 12; penalty def 1
  - energy cost: 0

from pickedup import windrunner_coat
- activate()
  - effect: gain base def 6; modifiers: bonus energy 12; penalty def 1
  - energy cost: 0

from pickedup import worn_cloak
- activate()
  - effect: gain base def 3; modifiers: bonus energy 8
  - energy cost: 0

from pickedup import worn_greathelm
- activate()
  - effect: gain base def 2; modifiers: bonus energy 8
  - energy cost: 0

from pickedup import worn_plate
- activate()
  - effect: gain base def 3; modifiers: bonus dmg 1
  - energy cost: 0

from pickedup import worn_veil
- activate()
  - effect: gain base def 2; modifiers: bonus energy 8
  - energy cost: 0

from pickedup import woven_hat
- activate()
  - effect: gain base def 2; modifiers: bonus def 1
  - energy cost: 0

from pickedup import woven_robe
- activate()
  - effect: gain base def 3; modifiers: bonus def 1
  - energy cost: 0

from pickedup import yggdrasil_shroud
- activate()
  - effect: gain base def 10; modifiers: bonus health 32; bonus energy 18; penalty atkSpeed 130
  - energy cost: 0

