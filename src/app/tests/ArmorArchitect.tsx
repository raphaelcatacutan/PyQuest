import React, { useState } from 'react';
import { Armor } from '@/src/game/types/armor.types';

type ArmorStat = 'def' | 'evasion' | 'dmg' | 'energy' | 'atkSpeed' | 'health' | 'dmgReduction';
type ModifierNature = 'bonus' | 'penalty';

const INITIAL_ARMOR: Armor = {
  id: "",
  filename: "",
  name: "",
  description: "",
  armorImg: "",
  class: "",
  rarity: "Common",
  slotType: "",
  
  baseDef: 0,
  durability: 100,
  modifiers: [],
  
  dropRate: 0.1,
  sellCost: 0,
  buyCost: 0,
};

const INITIAL_MODIFIER = {
  stat: 'def' as ArmorStat,
  nature: 'bonus' as ModifierNature,
  value: 0,
};

export default function ArmorArchitect() {
  const [item, setItem] = useState<Armor>(INITIAL_ARMOR);
  const [modifierInput, setModifierInput] = useState(INITIAL_MODIFIER);

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
      modifiers: [...prev.modifiers, modifierInput],
    }));
    setModifierInput(INITIAL_MODIFIER);
  };

  const removeModifier = (index: number) => {
    setItem(prev => ({
      ...prev,
      modifiers: prev.modifiers.filter((_, i) => i !== index),
    }));
  };

  const saveToDisk = async (data: Armor) => {
    if (!data.id) return alert("ID is required!");
    try {
      const response = await fetch('http://localhost:5000/api/save-armor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) alert(`Armor ${data.name} saved!`);
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
        <h1 style={styles.title}>Armor Architect</h1>

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
          <input style={styles.input} name="armorImg" placeholder="/src/assets/armors/__.png" value={item.armorImg} onChange={handleChange} />
        </section>

        {/* 2. CLASSIFICATION */}
        <section style={styles.section}>
          <h3 style={styles.sectionLabel}>2. Classification</h3>
          <div style={styles.grid}>
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
            <div>
              <label style={styles.fieldLabel}>Slot Type</label>
              <select style={styles.selectInput} name="slotType" value={item.slotType} onChange={handleChange}>
                <option value="">-- Select Slot --</option>
                <option value="head">Head</option>
                <option value="body">Body</option>
              </select>
            </div>
          </div>
        </section>

        {/* 3. BASE STATS */}
        <section style={styles.section}>
          <h3 style={styles.sectionLabel}>3. Base Stats</h3>
          <div style={styles.grid}>
            <label style={styles.gridItem}>Base DEF <input type="text" inputMode="numeric" pattern="[0-9]*" style={styles.smallInput} value={item.baseDef || ''} onChange={e => setItem({...item, baseDef: Number(e.target.value) || 0})} /></label>
            <label style={styles.gridItem}>Durability <input type="text" inputMode="numeric" pattern="[0-9]*" style={styles.smallInput} value={item.durability || ''} onChange={e => setItem({...item, durability: Number(e.target.value) || 0})} /></label>
          </div>
        </section>

        {/* 4. STAT MODIFIERS */}
        <section style={styles.section}>
          <h3 style={styles.sectionLabel}>4. Stat Modifiers (Bonuses & Penalties)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select style={{...styles.input, flex: 1}} value={modifierInput.stat} onChange={e => setModifierInput({...modifierInput, stat: e.target.value as ArmorStat})}>
                <option value="" disabled>-- Select Stat --</option>
                <option value="def">Defense (def)</option>
                <option value="evasion">Evasion</option>
                <option value="dmg">Damage (dmg)</option>
                <option value="energy">Energy</option>
                <option value="atkSpeed">Attack Speed (atkSpeed)</option>
                <option value="health">Health</option>
                <option value="dmgReduction">Damage Reduction (dmgReduction)</option>
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

        {/* 5. ECONOMY */}
        <section style={styles.section}>
          <h3 style={styles.sectionLabel}>5. Economy & Spawning</h3>
          <div style={styles.grid}>
            <label style={styles.gridItem}>Drop Rate <input type="text" inputMode="numeric" pattern="[0-9.]*" style={styles.smallInput} value={item.dropRate || ''} onChange={e => setItem({...item, dropRate: Number(e.target.value) || 0})} /></label>
            <label style={styles.gridItem}>Buy Cost <input type="text" inputMode="numeric" pattern="[0-9]*" style={styles.smallInput} value={item.buyCost || ''} onChange={e => setItem({...item, buyCost: Number(e.target.value) || 0})} /></label>
            <label style={styles.gridItem}>Sell Cost <input type="text" inputMode="numeric" pattern="[0-9]*" style={styles.smallInput} value={item.sellCost || ''} onChange={e => setItem({...item, sellCost: Number(e.target.value) || 0})} /></label>
          </div>
        </section>

        <button style={styles.saveButton} onClick={() => saveToDisk(item)}>
          SAVE TO ARMORS.JSON
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
