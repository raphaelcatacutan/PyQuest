import React, { useState } from 'react';
import { Weapon } from '@/src/game/types/weapon.types';

const INITIAL_WEAPON: Weapon = {
  id: "",
  filename: "",
  name: "",
  description: "",
  weaponImg: "",
  wieldType: "",
  class: "",
  rarity: "Common",
  
  dmg: 0,
  critDmg: 0,
  critChance: 0,
  durability: 100,
  
  energyCost: 0,

  dmgBonus: 0,
  atkSpeedBonus: 0,

  dropRate: 0.1,
  sellCost: 0,
  buyCost: 0,
};

export default function WeaponArchitect() {
  const [item, setItem] = useState<Weapon>(INITIAL_WEAPON);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'number' ? Number(value) : value;

    setItem((prev) => {
      const next = { ...prev, [name]: finalValue };
      // Sync filename with id automatically for convenience
      if (name === 'id') next.filename = value;
      return next;
    });
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = e.target.value.replace(/[^a-zA-Z0-9_]/g, '');
    setItem(prev => ({ ...prev, id: sanitized, filename: sanitized }));
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
              <label style={styles.fieldLabel}>Wield Type</label>
              <select style={styles.selectInput} name="wieldType" value={item.wieldType} onChange={handleChange}>
                <option value="">None</option>
                <option value="one">One-Handed</option>
                <option value="dual">Dual-Wield</option>
              </select>
            </div>
            <div>
              <label style={styles.fieldLabel}>Class</label>
              <select style={styles.selectInput} name="class" value={item.class} onChange={handleChange}>
                <option value="">None</option>
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

        {/* 3. DAMAGE STATS */}
        <section style={styles.section}>
          <h3 style={styles.sectionLabel}>3. Damage Stats</h3>
          <div style={styles.grid}>
            <label style={styles.gridItem}>Damage <input type="number" name="dmg" style={styles.smallInput} value={item.dmg} onChange={handleChange} /></label>
            <label style={styles.gridItem}>Crit Damage <input type="number" step="0.01" name="critDmg" style={styles.smallInput} value={item.critDmg} onChange={handleChange} /></label>
            <label style={styles.gridItem}>Crit Chance <input type="number" step="0.01" name="critChance" style={styles.smallInput} value={item.critChance} onChange={handleChange} /></label>
            <label style={styles.gridItem}>Durability <input type="number" name="durability" style={styles.smallInput} value={item.durability} onChange={handleChange} /></label>
          </div>
        </section>

        {/* 4. MECHANICS */}
        <section style={styles.section}>
          <h3 style={styles.sectionLabel}>4. Mechanics</h3>
          <div style={styles.grid}>
            <label style={styles.gridItem}>Energy Cost <input type="number" name="energyCost" style={styles.smallInput} value={item.energyCost} onChange={handleChange} /></label>
          </div>
        </section>

        {/* 5. BONUSES */}
        <section style={styles.section}>
          <h3 style={styles.sectionLabel}>5. Stat Bonuses</h3>
          <div style={styles.grid}>
            <label style={styles.gridItem}>DMG Bonus <input type="number" step="0.01" name="dmgBonus" style={styles.smallInput} value={item.dmgBonus} onChange={handleChange} /></label>
            <label style={styles.gridItem}>Atk Spd Bonus <input type="number" step="0.01" name="atkSpeedBonus" style={styles.smallInput} value={item.atkSpeedBonus} onChange={handleChange} /></label>
          </div>
        </section>

        {/* 6. ECONOMY */}
        <section style={styles.section}>
          <h3 style={styles.sectionLabel}>6. Economy & Spawning</h3>
          <div style={styles.grid}>
            <label style={styles.gridItem}>Drop Rate <input type="number" step="0.01" name="dropRate" style={styles.smallInput} value={item.dropRate} onChange={handleChange} /></label>
            <label style={styles.gridItem}>Buy Cost <input type="number" name="buyCost" style={styles.smallInput} value={item.buyCost} onChange={handleChange} /></label>
            <label style={styles.gridItem}>Sell Cost <input type="number" name="sellCost" style={styles.smallInput} value={item.sellCost} onChange={handleChange} /></label>
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
  saveButton: { width: '100%', padding: '20px', backgroundColor: '#00d4ff', color: 'black', fontWeight: 'bold', border: 'none', cursor: 'pointer' },
  codeBlock: { color: '#00d4ff', fontSize: '12px', lineHeight: '1.4' }
};
