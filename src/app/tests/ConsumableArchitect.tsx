import React, { useState } from 'react';
import { Consumable } from '@/src/game/types/consumable.types';

const INITIAL_CONSUMABLE: Consumable = {
  id: "",
  filename: "",
  name: "",
  description: "",
  consumableImg: "",
  cooldown: 5000,
  heal: 0,
  dmgIncrease: 0,
  defIncrease: 0,
  energyIncrease: 0,
  atkSpeedIncrease: 0,
  healthInflict: 0,
  dmgInflict: 0,
  defInflict: 0,
  energyInflict: 0,
  atkSpeedInflict: 0,
  duration: 0,
  dropRate: 0.1,
  sellCost: 0,
  buyCost: 0,
};

export default function ConsumableArchitect() {
  const [item, setItem] = useState<Consumable>(INITIAL_CONSUMABLE);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'number' ? Number(value) : value;

    setItem((prev) => {
      const next = { ...prev, [name]: finalValue };
      // Sync filename with id automatically for convenience
      if (name === 'id') next.filename = value;
      return next;
    });
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
      <div style={styles.formSection}>
        <h1 style={styles.title}>Consumable Architect</h1>

        {/* 1. IDENTITY */}
        <section style={styles.section}>
          <h3 style={styles.sectionLabel}>1. Identity</h3>
          <label style={styles.fieldLabel}>ID</label>
          <input style={styles.input} name="id" placeholder="id" value={item.id} onChange={handleChange} />
          
          <label style={styles.fieldLabel}>Filename (Auto-syncs with ID)</label>
          <input style={styles.input} name="filename" placeholder="filename" value={item.filename} onChange={handleChange} />
          
          <label style={styles.fieldLabel}>Display Name</label>
          <input style={styles.input} name="name" placeholder="name" value={item.name} onChange={handleChange} />
          
          <label style={styles.fieldLabel}>Description</label>
          <textarea style={styles.textarea} name="description" placeholder="description" value={item.description} onChange={handleChange} />
          
          <label style={styles.fieldLabel}>Image Path</label>
          <input style={styles.input} name="consumableImg" placeholder="consumableImg path (Don't forget to upload the png to its respective folder in /src/assets" value={item.consumableImg} onChange={handleChange} />
        </section>

        {/* 2. BASE MECHANICS */}
        <section style={styles.section}>
          <h3 style={styles.sectionLabel}>2. Mechanics & Vitals</h3>
          <div style={styles.grid}>
            <label style={styles.gridItem}>Cooldown (ms) <input type="number" name="cooldown" style={styles.smallInput} value={item.cooldown} onChange={handleChange} /></label>
            <label style={styles.gridItem}>Heal Amount <input type="number" name="heal" style={styles.smallInput} value={item.heal} onChange={handleChange} /></label>
            <label style={styles.gridItem}>Duration (ms) <input type="number" name="duration" style={styles.smallInput} value={item.duration} onChange={handleChange} /></label>
          </div>
        </section>

        {/* 3. BUFFS (Self Increases) */}
        <section style={styles.section}>
          <h3 style={styles.sectionLabel}>3. Stat Increases (Buffs)</h3>
          <div style={styles.grid}>
            <label style={styles.gridItem}>DMG Inc <input type="number" name="dmgIncrease" style={styles.smallInput} value={item.dmgIncrease} onChange={handleChange} /></label>
            <label style={styles.gridItem}>DEF Inc <input type="number" name="defIncrease" style={styles.smallInput} value={item.defIncrease} onChange={handleChange} /></label>
            <label style={styles.gridItem}>Energy Inc <input type="number" name="energyIncrease" style={styles.smallInput} value={item.energyIncrease} onChange={handleChange} /></label>
            <label style={styles.gridItem}>Atk Spd Inc <input type="number" name="atkSpeedIncrease" style={styles.smallInput} value={item.atkSpeedIncrease} onChange={handleChange} /></label>
          </div>
        </section>

        {/* 4. DEBUFFS (Target Infliction) */}
        <section style={styles.section}>
          <h3 style={styles.sectionLabel}>4. Stat Infliction (Debuffs)</h3>
          <div style={styles.grid}>
            <label style={styles.gridItem}>HP Inflict <input type="number" name="healthInflict" style={styles.smallInput} value={item.healthInflict} onChange={handleChange} /></label>
            <label style={styles.gridItem}>DMG Inflict <input type="number" name="dmgInflict" style={styles.smallInput} value={item.dmgInflict} onChange={handleChange} /></label>
            <label style={styles.gridItem}>DEF Inflict <input type="number" name="defInflict" style={styles.smallInput} value={item.defInflict} onChange={handleChange} /></label>
            <label style={styles.gridItem}>Energy Infl <input type="number" name="energyInflict" style={styles.smallInput} value={item.energyInflict} onChange={handleChange} /></label>
            <label style={styles.gridItem}>Atk Spd Infl <input type="number" name="atkSpeedInflict" style={styles.smallInput} value={item.atkSpeedInflict} onChange={handleChange} /></label>
          </div>
        </section>

        {/* 5. ECONOMY */}
        <section style={styles.section}>
          <h3 style={styles.sectionLabel}>5. Economy & Spawning</h3>
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
  saveButton: { width: '100%', padding: '20px', backgroundColor: '#00d4ff', color: 'black', fontWeight: 'bold', border: 'none', cursor: 'pointer' },
  codeBlock: { color: '#00d4ff', fontSize: '12px', lineHeight: '1.4' }
};