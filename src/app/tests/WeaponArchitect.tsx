import React, { useState } from 'react';
import { Weapon } from '@/src/game/types/weapon.types';

type WeaponStat = 'dmg' | 'atkSpeed' | 'critDmg' | 'critChance' | 'energyMax';
type ModifierNature = 'bonus' | 'penalty';
type SkillEffectType = 'damage' | 'stun' | 'heal' | 'bleed';
type InflictionType = 'poison' | 'bleed' | 'stun' | 'burn';

const INITIAL_WEAPON: Weapon = {
  id: "",
  filename: "",
  name: "",
  description: "",
  weaponImg: "",
  wieldType: "",
  weaponType: "sword",
  class: "",
  rarity: "Common",
  
  baseDmg: 0,
  baseCritDmg: 0,
  baseCritChance: 0,
  durability: 100,
  energyCostPerSwing: 0,

  modifiers: [],
  skills: [],
  inflictions: [],

  dropRate: 0.1,
  sellCost: 0,
  buyCost: 0,
};

const INITIAL_MODIFIER = {
  stat: 'dmg' as WeaponStat,
  nature: 'bonus' as ModifierNature,
  value: 0,
};

const INITIAL_SKILL = {
  name: "",
  description: "",
  energyCost: 0,
  effectType: 'damage' as SkillEffectType,
  effectValue: 0,
  effectDuration: 0,
};

const INITIAL_INFLICTION = {
  type: 'poison' as InflictionType,
  chance: 0,
  duration: 0,
};

export default function WeaponArchitect() {
  const [item, setItem] = useState<Weapon>(INITIAL_WEAPON);
  const [modifierInput, setModifierInput] = useState(INITIAL_MODIFIER);
  const [skillInput, setSkillInput] = useState(INITIAL_SKILL);
  const [inflictionInput, setInflictionInput] = useState(INITIAL_INFLICTION);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'number' ? Number(value) : value;

    setItem((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = e.target.value.replace(/[^a-z_]/g, '');
    setItem(prev => ({ ...prev, id: sanitized, filename: sanitized }));
  };

  const addModifier = () => {
    if (!modifierInput.stat) return;
    setItem(prev => ({
      ...prev,
      modifiers: [...prev.modifiers, { stat: modifierInput.stat, nature: modifierInput.nature, value: modifierInput.value }],
    }));
    setModifierInput(INITIAL_MODIFIER);
  };

  const removeModifier = (index: number) => {
    setItem(prev => ({
      ...prev,
      modifiers: prev.modifiers.filter((_, i) => i !== index),
    }));
  };

  const addSkill = () => {
    if (!skillInput.name || skillInput.energyCost < 0) return;
    const newSkill = {
      name: skillInput.name,
      description: skillInput.description,
      energyCost: skillInput.energyCost,
      effect: {
        type: skillInput.effectType,
        value: skillInput.effectValue,
        ...(skillInput.effectDuration > 0 && { duration: skillInput.effectDuration }),
      },
    };
    setItem(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }));
    setSkillInput(INITIAL_SKILL);
  };

  const removeSkill = (index: number) => {
    setItem(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const addInfliction = () => {
    if (!inflictionInput.type || inflictionInput.chance < 0 || inflictionInput.chance > 1) return;
    setItem(prev => ({
      ...prev,
      inflictions: [...prev.inflictions, { type: inflictionInput.type, chance: inflictionInput.chance, duration: inflictionInput.duration }],
    }));
    setInflictionInput(INITIAL_INFLICTION);
  };

  const removeInfliction = (index: number) => {
    setItem(prev => ({
      ...prev,
      inflictions: prev.inflictions.filter((_, i) => i !== index),
    }));
  };

  const saveToDisk = async (data: Weapon) => {
    if (!data.id) return alert("ID is required!");
    try {
      const response = await fetch('http://localhost:5000/api/save-weapon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) alert(`Weapon ${data.name} saved!`);
    } catch (err) {
      alert("Server error. Is dev-server running?");
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
        input::placeholder {
          color: #666;
          opacity: 1;
        }
        input::-webkit-input-placeholder {
          color: #666;
          opacity: 1;
        }
        select option:first-child {
          color: #666;
        }
      `}</style>
      <div style={styles.formSection}>
        <h1 style={styles.title}>Weapon Architect</h1>

        {/* 1. IDENTITY */}
        <section style={styles.section}>
          <h3 style={styles.sectionLabel}>1. Identity</h3>
          <label style={styles.fieldLabel}>ID</label>
          <input style={styles.input} name="id" placeholder="id" value={item.id} onChange={handleIdChange} />
          
          <label style={styles.fieldLabel}>Filename (Auto-syncs with ID)</label>
          <input style={styles.input} name="filename" placeholder="filename" value={item.filename} onChange={handleChange} />
          
          <label style={styles.fieldLabel}>Display Name</label>
          <input style={styles.input} name="name" placeholder="name" value={item.name} onChange={handleChange} />
          
          <label style={styles.fieldLabel}>Description</label>
          <textarea style={styles.textarea} name="description" placeholder="description" value={item.description} onChange={handleChange} />
          
          <label style={styles.fieldLabel}>Image Path</label>
          <input style={styles.input} name="weaponImg" placeholder="weaponImg path (Don't forget to upload the png to its respective folder in /src/assets" value={item.weaponImg} onChange={handleChange} />
        </section>

        {/* 2. CLASSIFICATION */}
        <section style={styles.section}>
          <h3 style={styles.sectionLabel}>2. Classification</h3>
          <div style={styles.grid}>
            <div>
              <label style={styles.fieldLabel}>Weapon Type</label>
              <select style={styles.selectInput} name="weaponType" value={item.weaponType} onChange={handleChange}>
                <option value="">-- Select Type --</option>
                <option value="sword">Sword</option>
                <option value="wand">Wand</option>
                <option value="bow">Bow</option>
                <option value="dagger">Dagger</option>
                <option value="shield">Shield</option>
              </select>
            </div>
            <div>
              <label style={styles.fieldLabel}>Wield Type</label>
              <select style={styles.selectInput} name="wieldType" value={item.wieldType} onChange={handleChange}>
                <option value="">-- Select Wield --</option>
                <option value="one">One-Handed</option>
                <option value="dual">Dual-Wield</option>
              </select>
            </div>
            <div>
              <label style={styles.fieldLabel}>Class</label>
              <select style={styles.selectInput} name="class" value={item.class} onChange={handleChange}>
                <option value="">-- Select Class --</option>
                <option value="Warrior">Warrior</option>
                <option value="Wizard">Wizard</option>
                <option value="Archer">Archer</option>
                <option value="Rogue">Rogue</option>
              </select>
            </div>
            <div>
              <label style={styles.fieldLabel}>Rarity</label>
              <select style={styles.selectInput} name="rarity" value={item.rarity} onChange={handleChange}>
                <option value="Common">Common</option>
                <option value="Rare">Rare</option>
                <option value="Epic">Epic</option>
                <option value="Legendary">Legendary</option>
              </select>
            </div>
          </div>
        </section>

        {/* 3. BASE STATS */}
        <section style={styles.section}>
          <h3 style={styles.sectionLabel}>3. Base Stats</h3>
          <div style={styles.grid}>
            <label style={styles.gridItem}>Base DMG <input type="text" inputMode="numeric" pattern="[0-9]*" style={styles.smallInput} value={item.baseDmg || ''} onChange={e => setItem({...item, baseDmg: Number(e.target.value) || 0})} /></label>
            <label style={styles.gridItem}>Base Crit DMG <input type="text" inputMode="numeric" pattern="[0-9.]*" style={styles.smallInput} value={item.baseCritDmg || ''} onChange={e => setItem({...item, baseCritDmg: Number(e.target.value) || 0})} /></label>
            <label style={styles.gridItem}>Base Crit Chance <input type="text" inputMode="numeric" pattern="[0-9.]*" style={styles.smallInput} value={item.baseCritChance || ''} onChange={e => setItem({...item, baseCritChance: Number(e.target.value) || 0})} /></label>
            <label style={styles.gridItem}>Durability <input type="text" inputMode="numeric" pattern="[0-9]*" style={styles.smallInput} value={item.durability || ''} onChange={e => setItem({...item, durability: Number(e.target.value) || 0})} /></label>
          </div>
        </section>

        {/* 4. MECHANICS */}
        <section style={styles.section}>
          <h3 style={styles.sectionLabel}>4. Mechanics</h3>
          <div style={styles.grid}>
            <label style={styles.gridItem}>Energy Cost/Swing <input type="text" inputMode="numeric" pattern="[0-9]*" style={styles.smallInput} value={item.energyCostPerSwing || ''} onChange={e => setItem({...item, energyCostPerSwing: Number(e.target.value) || 0})} /></label>
          </div>
        </section>

        {/* 5. STAT MODIFIERS */}
        <section style={styles.section}>
          <h3 style={styles.sectionLabel}>5. Stat Modifiers (Bonuses & Penalties)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select style={{...styles.input, flex: 1}} value={modifierInput.stat} onChange={e => setModifierInput({...modifierInput, stat: e.target.value as WeaponStat})}>
                <option value="" disabled>-- Select Stat --</option>
                <option value="dmg">Damage (dmg)</option>
                <option value="atkSpeed">Attack Speed (atkSpeed)</option>
                <option value="critDmg">Crit Damage (critDmg)</option>
                <option value="critChance">Crit Chance (critChance)</option>
                <option value="energyMax">Max Energy (energyMax)</option>
              </select>
              <select style={{...styles.input, flex: 0.6}} value={modifierInput.nature} onChange={e => setModifierInput({...modifierInput, nature: e.target.value as ModifierNature})}>
                <option value="bonus">Bonus</option>
                <option value="penalty">Penalty</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="text" inputMode="numeric" pattern="[0-9.]*" placeholder="Value (always positive)" style={{...styles.input, flex: 1}} value={modifierInput.value || ''} onChange={e => setModifierInput({...modifierInput, value: Number(e.target.value) || 0})} />
              <button style={styles.addButton} onClick={addModifier}>ADD</button>
            </div>
          </div>
          <ul style={{ color: '#00d4ff', fontSize: '12px' }}>
            {item.modifiers.map((mod, i) => (
              <li key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', padding: '8px', backgroundColor: '#0a0a0a', borderRadius: '4px' }}>
                <div>
                  <div><strong>{mod.stat}</strong></div>
                  <div style={{ fontSize: '11px', color: mod.nature === 'bonus' ? '#00d4ff' : '#ff6b6b' }}>{mod.nature} +{mod.value}</div>
                </div>
                <button style={{ ...styles.addButton, padding: '0 10px', fontSize: '10px' }} onClick={() => removeModifier(i)}>Remove</button>
              </li>
            ))}
          </ul>
        </section>

        {/* 6. WEAPON SKILLS */}
        <section style={styles.section}>
          <h3 style={styles.sectionLabel}>6. Weapon Skills (Active Abilities)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
            <input type="text" placeholder="Skill Name" style={styles.input} value={skillInput.name} onChange={e => setSkillInput({...skillInput, name: e.target.value})} />
            <textarea placeholder="Description" style={{...styles.textarea, height: '40px'}} value={skillInput.description} onChange={e => setSkillInput({...skillInput, description: e.target.value})} />
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="text" inputMode="numeric" pattern="[0-9]*" placeholder="Energy Cost" style={{...styles.input, flex: 0.5}} value={skillInput.energyCost || ''} onChange={e => setSkillInput({...skillInput, energyCost: Number(e.target.value) || 0})} />
              <select style={{...styles.input, flex: 1}} value={skillInput.effectType} onChange={e => setSkillInput({...skillInput, effectType: e.target.value as SkillEffectType})}>
                <option value="damage">Damage</option>
                <option value="stun">Stun</option>
                <option value="heal">Heal</option>
                <option value="bleed">Bleed</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="text" inputMode="numeric" pattern="[0-9.]*" placeholder="Effect Value" style={{...styles.input, flex: 1}} value={skillInput.effectValue || ''} onChange={e => setSkillInput({...skillInput, effectValue: Number(e.target.value) || 0})} />
              <input type="text" inputMode="numeric" pattern="[0-9]*" placeholder="Duration" style={{...styles.input, flex: 1}} value={skillInput.effectDuration || ''} onChange={e => setSkillInput({...skillInput, effectDuration: Number(e.target.value) || 0})} />
              <button style={styles.addButton} onClick={addSkill}>ADD</button>
            </div>
          </div>
          <ul style={{ color: '#00d4ff', fontSize: '12px' }}>
            {item.skills.map((skill, i) => (
              <li key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', padding: '8px', backgroundColor: '#0a0a0a', borderRadius: '4px' }}>
                <div>
                  <div><strong>{skill.name}</strong></div>
                  <div style={{ fontSize: '11px', color: '#888' }}>{skill.effect.type} | Cost: {skill.energyCost}</div>
                </div>
                <button style={{ ...styles.addButton, padding: '0 10px', fontSize: '10px' }} onClick={() => removeSkill(i)}>Remove</button>
              </li>
            ))}
          </ul>
        </section>

        {/* 7. INFLICTIONS */}
        <section style={styles.section}>
          <h3 style={styles.sectionLabel}>7. Inflictions (On-Hit Status Effects)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
            <select style={styles.input} value={inflictionInput.type} onChange={e => setInflictionInput({...inflictionInput, type: e.target.value as InflictionType})}>
              <option value="poison">Poison</option>
              <option value="bleed">Bleed</option>
              <option value="stun">Stun</option>
              <option value="burn">Burn</option>
            </select>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="text" inputMode="numeric" pattern="[0-9.]*" placeholder="Chance (0.0-1.0)" style={{...styles.input, flex: 1}} value={inflictionInput.chance || ''} onChange={e => setInflictionInput({...inflictionInput, chance: Number(e.target.value) || 0})} />
              <input type="text" inputMode="numeric" pattern="[0-9]*" placeholder="Duration" style={{...styles.input, flex: 1}} value={inflictionInput.duration || ''} onChange={e => setInflictionInput({...inflictionInput, duration: Number(e.target.value) || 0})} />
              <button style={styles.addButton} onClick={addInfliction}>ADD</button>
            </div>
          </div>
          <ul style={{ color: '#00d4ff', fontSize: '12px' }}>
            {item.inflictions.map((inf, i) => (
              <li key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', padding: '8px', backgroundColor: '#0a0a0a', borderRadius: '4px' }}>
                <div>
                  <div><strong>{inf.type}</strong></div>
                  <div style={{ fontSize: '11px', color: '#888' }}>Chance: {(inf.chance * 100).toFixed(0)}% | Duration: {inf.duration}</div>
                </div>
                <button style={{ ...styles.addButton, padding: '0 10px', fontSize: '10px' }} onClick={() => removeInfliction(i)}>Remove</button>
              </li>
            ))}
          </ul>
        </section>

        {/* 8. ECONOMY */}
        <section style={styles.section}>
          <h3 style={styles.sectionLabel}>8. Economy & Spawning</h3>
          <div style={styles.grid}>
            <label style={styles.gridItem}>Drop Rate <input type="text" inputMode="numeric" pattern="[0-9.]*" style={styles.smallInput} value={item.dropRate || ''} onChange={e => setItem({...item, dropRate: Number(e.target.value) || 0})} /></label>
            <label style={styles.gridItem}>Buy Cost <input type="text" inputMode="numeric" pattern="[0-9]*" style={styles.smallInput} value={item.buyCost || ''} onChange={e => setItem({...item, buyCost: Number(e.target.value) || 0})} /></label>
            <label style={styles.gridItem}>Sell Cost <input type="text" inputMode="numeric" pattern="[0-9]*" style={styles.smallInput} value={item.sellCost || ''} onChange={e => setItem({...item, sellCost: Number(e.target.value) || 0})} /></label>
          </div>
        </section>

        <button style={styles.saveButton} onClick={() => saveToDisk(item)}>
          SAVE TO WEAPONS.JSON
        </button>
      </div>

      <div style={styles.previewSection}>
        <h3 style={{ color: '#444' }}>Live Item JSON</h3>
        <pre style={styles.codeBlock}>{JSON.stringify(item, null, 2)}</pre>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', height: '100vh', backgroundColor: '#080808', color: '#ccc', fontFamily: 'monospace' },
  formSection: { flex: 1.2, padding: '40px', overflowY: 'auto', borderRight: '1px solid #222' },
  previewSection: { flex: 0.8, padding: '40px', backgroundColor: '#000', overflowY: 'auto' },
  title: { color: '#00d4ff', marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '10px' },
  section: { marginBottom: '25px', padding: '20px', backgroundColor: '#111', borderRadius: '8px' },
  sectionLabel: { marginTop: 0, fontSize: '11px', color: '#666', textTransform: 'uppercase', marginBottom: '15px' },
  fieldLabel: { fontSize: '10px', color: '#888', display: 'block', marginBottom: '4px' },
  input: { width: '100%', padding: '10px', marginBottom: '12px', backgroundColor: '#1a1a1a', border: '1px solid #333', color: 'white' },
  textarea: { width: '100%', height: '60px', padding: '10px', marginBottom: '12px', backgroundColor: '#1a1a1a', border: '1px solid #333', color: 'white' },
  selectInput: { width: '100%', padding: '10px', marginBottom: '12px', backgroundColor: '#1a1a1a', border: '1px solid #333', color: 'white' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  gridItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' },
  smallInput: { width: '80px', padding: '6px', backgroundColor: '#1a1a1a', border: '1px solid #333', color: '#00d4ff', textAlign: 'right' },
  addButton: { padding: '0 20px', backgroundColor: '#333', color: 'white', border: 'none', cursor: 'pointer' },
  saveButton: { width: '100%', padding: '20px', backgroundColor: '#00d4ff', color: 'black', fontWeight: 'bold', border: 'none', cursor: 'pointer' },
  codeBlock: { color: '#00d4ff', fontSize: '12px', lineHeight: '1.4' }
};
