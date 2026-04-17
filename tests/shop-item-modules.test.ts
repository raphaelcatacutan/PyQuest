import { describe, expect, it } from 'vitest';
import { buildPickedupModuleCode } from '../src/backend/mechanics/shop-item-modules';

describe('shop-item-modules code generation', () => {
    it('generates valid class declarations for weapon refs with skills', () => {
        const code = buildPickedupModuleCode({
            weaponItemIds: [],
            consumableItemIds: [],
            armorItemIds: []
        });

        expect(code).toContain('class _WeaponRef_great_forests_wand(_WeaponRefBase):');
        expect(code).not.toMatch(/^\s*_WeaponRef_[A-Za-z0-9_]+\(_WeaponRefBase\):$/m);
    });
});
