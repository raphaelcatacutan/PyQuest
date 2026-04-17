import React, { useState } from 'react';
import { Consumable } from '@/src/game/types/consumable.types';

const INITIAL_CONSUMABLE: Consumable = {
  id: "",
  name: "",
  description: "",
  consumableImg: "",
  cooldown: 5,
  effects: [],
  dropRate: 0.1,
  sellCost: 0,
  buyCost: 0,
};

type EffectType = 'restore' | 'buff' | 'debuff';

const INITIAL_EFFECT_INPUT = {
  type: 'restore' as EffectType,
  restoreStat: 'hp' as 'hp' | 'energy' | 'def',
  restoreAmount: 0,
  buffStat: 'dmg' as 'dmg' | 'def' | 'speed',
  buffMultiplier: 1,
  buffDuration: 0,
  debuffStat: 'hp' as 'hp' | 'energy' | 'speed',
  debuffAmount: 0,
  debuffDuration: 0,
};

export default function ConsumableArchitect() {
  const [item, setItem] = useState<Consumable>(INITIAL_CONSUMABLE);
  const [effectInput, setEffectInput] = useState(INITIAL_EFFECT_INPUT);
  const [effectType, setEffectType] = useState<EffectType>('restore');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'number' ? Number(value) : value;

    setItem((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = e.target.value.replace(/[^a-z_]/g, '');
    setItem(prev => ({ ...prev, id: sanitized }));
  };

  const buildEffect = (type: EffectType): any => {
    switch (type) {
      case 'restore':
        return {
          type: 'restore',
          stat: effectInput.restoreStat,
          amount: effectInput.restoreAmount,
        };
      case 'buff':
        return {
          type: 'buff',
          stat: effectInput.buffStat,
          multiplier: effectInput.buffMultiplier,
          duration: effectInput.buffDuration,
        };
      case 'debuff':
        return {
          type: 'debuff',
          stat: effectInput.debuffStat,
          amount: effectInput.debuffAmount,
          duration: effectInput.debuffDuration,
        };
      default:
        return null;
    }
  };

  const addEffect = () => {
    const newEffect = buildEffect(effectType);
    if (!newEffect) return;
    setItem(prev => ({
      ...prev,
      effects: [...prev.effects, newEffect],
    }));
    setEffectInput(INITIAL_EFFECT_INPUT);
    setEffectType('restore');
  };

  const removeEffect = (index: number) => {
    setItem(prev => ({
      ...prev,
      effects: prev.effects.filter((_, i) => i !== index),
    }));
  };

  const saveToDisk = async (data: Consumable) => {
    if (!data.id) return alert("ID is required!");
    try {
      const response = await fetch('http://localhost:5000/api/save-consumable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) alert(`Consumable ${data.name} saved!`);
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
        <h1 style={styles.title}>Consumable Architect</h1>

        {/* 1. IDENTITY */}
        <section style={styles.section}>
          <h3 style={styles.sectionLabel}>1. Identity</h3>
          <label style={styles.fieldLabel}>ID</label>
          <input style={styles.input} name="id" placeholder="id" value={item.id} onChange={handleIdChange} />
          
          <label style={styles.fieldLabel}>Display Name</label>
          <input style={styles.input} name="name" placeholder="name" value={item.name} onChange={handleChange} />
          
          <label style={styles.fieldLabel}>Description</label>
          <textarea style={styles.textarea} name="description" placeholder="description" value={item.description} onChange={handleChange} />
          
          <label style={styles.fieldLabel}>Image Path</label>
          <input style={styles.input} name="consumableImg" placeholder="/src/assets/consumables/__.png" value={item.consumableImg} onChange={handleChange} />
        </section>

        {/* 2. BASE MECHANICS */}
        <section style={styles.section}>
          <h3 style={styles.sectionLabel}>2. Base Settings</h3>
          <div style={styles.grid}>
            <label style={styles.gridItem}>Cooldown (s) <input type="number" name="cooldown" style={styles.smallInput} value={item.cooldown} onChange={handleChange} /></label>
          </div>
        </section>

        {/* 3. EFFECTS */}
        <section style={styles.section}>
          <h3 style={styles.sectionLabel}>3. Effects</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
            <select style={styles.input} value={effectType} onChange={e => {
              setEffectType(e.target.value as EffectType);
              setEffectInput(INITIAL_EFFECT_INPUT);
            }}>
              <option value="" disabled>-- Select Effect Type --</option>
              <option value="restore">Restore (HP/Energy/Def)</option>
              <option value="buff">Buff (Dmg/Def/Speed)</option>
              <option value="debuff">Debuff (HP/Energy/Speed)</option>
            </select>

            {effectType === 'restore' && (
              <>
                <select style={styles.input} value={effectInput.restoreStat} onChange={e => setEffectInput({...effectInput, restoreStat: e.target.value as any})}>
                  <option value="hp">HP</option>
                  <option value="energy">Energy</option>
                  <option value="def">Defense</option>
                </select>
                <input type="text" inputMode="numeric" pattern="[0-9]*" placeholder="Restore Amount" style={styles.input} value={effectInput.restoreAmount || ''} onChange={e => setEffectInput({...effectInput, restoreAmount: Number(e.target.value) || 0})} />
              </>
            )}

            {effectType === 'buff' && (
              <>
                <select style={styles.input} value={effectInput.buffStat} onChange={e => setEffectInput({...effectInput, buffStat: e.target.value as any})}>
                  <option value="dmg">Damage</option>
                  <option value="def">Defense</option>
                  <option value="speed">Speed</option>
                </select>
                <input type="text" inputMode="numeric" pattern="[0-9.]*" placeholder="Multiplier (e.g. 1.5)" style={styles.input} value={effectInput.buffMultiplier || ''} onChange={e => setEffectInput({...effectInput, buffMultiplier: Number(e.target.value) || 1})} />
                <input type="text" inputMode="numeric" pattern="[0-9]*" placeholder="Duration (s)" style={styles.input} value={effectInput.buffDuration || ''} onChange={e => setEffectInput({...effectInput, buffDuration: Number(e.target.value) || 0})} />
              </>
            )}

            {effectType === 'debuff' && (
              <>
                <select style={styles.input} value={effectInput.debuffStat} onChange={e => setEffectInput({...effectInput, debuffStat: e.target.value as any})}>
                  <option value="hp">HP</option>
                  <option value="energy">Energy</option>
                  <option value="speed">Speed</option>
                </select>
                <input type="text" inputMode="numeric" pattern="[0-9]*" placeholder="Damage Amount" style={styles.input} value={effectInput.debuffAmount || ''} onChange={e => setEffectInput({...effectInput, debuffAmount: Number(e.target.value) || 0})} />
                <input type="text" inputMode="numeric" pattern="[0-9]*" placeholder="Duration (s)" style={styles.input} value={effectInput.debuffDuration || ''} onChange={e => setEffectInput({...effectInput, debuffDuration: Number(e.target.value) || 0})} />
              </>
            )}

            <button style={styles.addButton} onClick={addEffect}>ADD EFFECT</button>
          </div>

          <ul style={{ color: '#00d4ff', fontSize: '12px' }}>
            {item.effects.map((effect, i) => (
              <li key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', padding: '8px', backgroundColor: '#0a0a0a', borderRadius: '4px' }}>
                <div>
                  <div><strong>{(effect as any).type.toUpperCase()}</strong></div>
                  <div style={{ fontSize: '11px', color: '#888' }}>
                    {(effect as any).type === 'restore' && `${(effect as any).stat}: +${(effect as any).amount}`}
                    {(effect as any).type === 'buff' && `${(effect as any).stat}: x${(effect as any).multiplier} for ${(effect as any).duration}s`}
                    {(effect as any).type === 'debuff' && `${(effect as any).stat}: -${(effect as any).amount} for ${(effect as any).duration}s`}
                  </div>
                </div>
                <button style={{ ...styles.addButton, padding: '0 10px', fontSize: '10px' }} onClick={() => removeEffect(i)}>Remove</button>
              </li>
            ))}
          </ul>
        </section>

        {/* 4. ECONOMY */}
        <section style={styles.section}>
          <h3 style={styles.sectionLabel}>4. Economy & Spawning</h3>
          <div style={styles.grid}>
            <label style={styles.gridItem}>Drop Rate <input type="number" step="0.01" name="dropRate" style={styles.smallInput} value={item.dropRate} onChange={handleChange} /></label>
            <label style={styles.gridItem}>Buy Cost <input type="number" name="buyCost" style={styles.smallInput} value={item.buyCost} onChange={handleChange} /></label>
            <label style={styles.gridItem}>Sell Cost <input type="number" name="sellCost" style={styles.smallInput} value={item.sellCost} onChange={handleChange} /></label>
          </div>
        </section>

        <button style={styles.saveButton} onClick={() => saveToDisk(item)}>
          SAVE TO CONSUMABLES.JSON
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
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  gridItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' },
  smallInput: { width: '80px', padding: '6px', backgroundColor: '#1a1a1a', border: '1px solid #333', color: '#00d4ff', textAlign: 'right' },
  addButton: { padding: '0 20px', backgroundColor: '#333', color: 'white', border: 'none', cursor: 'pointer' },
  saveButton: { width: '100%', padding: '20px', backgroundColor: '#00d4ff', color: 'black', fontWeight: 'bold', border: 'none', cursor: 'pointer' },
  codeBlock: { color: '#00d4ff', fontSize: '12px', lineHeight: '1.4' }
};
