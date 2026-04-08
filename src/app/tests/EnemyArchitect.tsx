import React, { useState } from 'react';
import { Enemy, Skill } from '../../game/types/enemy.types';
import { SceneTypes } from '../../game/types/scene.types';

const INITIAL_ENEMY: Enemy = {
  id: "",
  name: "",
  description: "",
  enemyImg: "",
  hp: 100,
  maxHp: 100,
  energy: 50,
  maxEnergy: 50,
  def: 1,
  maxDef: 1,
  skills: [],
  dmg: 8,
  atkSpeed: 1,
  critDmg: 0,
  critChance: 0,
  evasion: 0.05,
  location: {},
  lootDrop: {
    coinDropMin: 0,
    coinDropMax: 0,
    xpDropMin: 0,
    xpDropMax: 0,
    weapons: [],
    armors: [],
    consumables: [],
  },
};

export default function EnemyArchitect() {
  const [enemy, setEnemy] = useState<Enemy>(INITIAL_ENEMY);
  const [skillInput, setSkillInput] = useState<Skill>({ name: "", dmg: 0, energyCost: 0 });
  const [locationInput, setLocationInput] = useState<{ scene: SceneTypes; spawnRate: number }>({ scene: '' as SceneTypes, spawnRate: 0.5 });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'number' ? Number(value) : value;

    setEnemy((prev) => {
      const next = { ...prev, [name]: finalValue };
      // Auto-sync logic for Max stats
      if (name === 'hp') next.maxHp = Number(value);
      if (name === 'energy') next.maxEnergy = Number(value);
      if (name === 'def') next.maxDef = Number(value);
      return next;
    });
  };

  const handleLootChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEnemy(prev => ({
      ...prev,
      lootDrop: { ...prev.lootDrop, [name]: Number(value) }
    }));
  };

  const addSkill = () => {
    if (!skillInput.name) return;
    setEnemy(prev => ({ ...prev, skills: [...prev.skills, skillInput] }));
    setSkillInput({ name: "", dmg: 0, energyCost: 0 });
  };

  const removeSkill = (index: number) => {
    setEnemy(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addLocation = () => {
    if (!locationInput.scene) return;
    setEnemy(prev => ({ ...prev, location: { ...prev.location, [locationInput.scene]: locationInput.spawnRate } }));
    setLocationInput({ scene: '' as SceneTypes, spawnRate: 0.5 });
  };

  const removeScene = (scene: SceneTypes) => {
    setEnemy(prev => {
      const newLocation = { ...prev.location };
      delete newLocation[scene];
      return { ...prev, location: newLocation };
    });
  };

  const saveEnemyToDisk = async (data: Enemy) => {
    if (!data.id) return alert("ID is required!");
    const response = await fetch('http://localhost:5000/api/save-enemy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (response.ok) alert(`Saved ${data.name}!`);
  };

  return (
    <div style={styles.container}>
      <div style={styles.formSection}>
        <h1 style={styles.title}>Enemy Architect</h1>

        {/* 1. IDENTITY SECTION */}
        <section style={styles.section}>
          <h3 style={styles.sectionLabel}>1. Identity & Visuals</h3>
          <label style={styles.fieldLabel}>ID</label>
          <input style={styles.input} name="id" placeholder="id" value={enemy.id} onChange={handleChange} />
          
          <label style={styles.fieldLabel}>Name</label>
          <input style={styles.input} name="name" placeholder="name" value={enemy.name} onChange={handleChange} />
          
          <label style={styles.fieldLabel}>Description</label>
          <textarea style={styles.textarea} name="description" placeholder="description" value={enemy.description} onChange={handleChange} />
          
          <label style={styles.fieldLabel}>Enemy Image Asset **Don't forget to upload the png in its respective folder in the assets**</label>
          <input style={styles.input} name="enemyImg" placeholder="/src/assets/enemies/__.png" value={enemy.enemyImg} onChange={handleChange} />
        </section>

        {/* 2. VITALS SECTION (Synchronized) */}
        <section style={styles.section}>
          <h3 style={styles.sectionLabel}>2. Vitals (HP / Energy / Def)</h3>
          <div style={styles.grid}>
            <label style={styles.gridItem}>HP <input type="number" name="hp" style={styles.smallInput} value={enemy.hp} onChange={handleChange} /></label>
            <label style={styles.gridItem}>Max HP <input type="number" name="maxHp" style={styles.readOnlyInput} value={enemy.maxHp} readOnly /></label>
            
            <label style={styles.gridItem}>Energy <input type="number" name="energy" style={styles.smallInput} value={enemy.energy} onChange={handleChange} /></label>
            <label style={styles.gridItem}>Max Energy <input type="number" name="maxEnergy" style={styles.readOnlyInput} value={enemy.maxEnergy} readOnly /></label>
            
            <label style={styles.gridItem}>Def <input type="number" name="def" style={styles.smallInput} value={enemy.def} onChange={handleChange} /></label>
            <label style={styles.gridItem}>Max Def <input type="number" name="maxDef" style={styles.readOnlyInput} value={enemy.maxDef} readOnly /></label>
          </div>
        </section>

        {/* 3. SKILLS SECTION */}
        <section style={styles.section}>
          <h3 style={styles.sectionLabel}>3. Skills List (Skill Name & Skill Damage)</h3>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <input placeholder="Skill Name" style={styles.input} value={skillInput.name} onChange={e => setSkillInput({...skillInput, name: e.target.value})} />
            <input type="number" placeholder="Dmg" style={{ ...styles.input, width: '80px' }} value={skillInput.dmg} onChange={e => setSkillInput({...skillInput, dmg: Number(e.target.value)})} />
            <button style={styles.addButton} onClick={addSkill}>ADD SKILL</button>
          </div>
          <ul style={{ color: '#00ff88', fontSize: '13px' }}>
            {enemy.skills.map((s, i) => (
              <li key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>{s.name} (DMG: {s.dmg})</span>
                <button style={{ ...styles.addButton, padding: '0 10px', fontSize: '10px' }} onClick={() => removeSkill(i)}>Remove</button>
              </li>
            ))}
          </ul>
        </section>

        {/* 4. COMBAT STATS */}
        <section style={styles.section}>
          <h3 style={styles.sectionLabel}>4. Combat Stats</h3>
          <div style={styles.grid}>
            <label style={styles.gridItem}>Damage <input type="number" name="dmg" style={styles.smallInput} value={enemy.dmg} onChange={handleChange} /></label>
            <label style={styles.gridItem}>Atk Speed <input type="number" step="0.1" name="atkSpeed" style={styles.smallInput} value={enemy.atkSpeed} onChange={handleChange} /></label>
            <label style={styles.gridItem}>Crit Dmg <input type="number" step="0.1" name="critDmg" style={styles.smallInput} value={enemy.critDmg} onChange={handleChange} /></label>
            <label style={styles.gridItem}>Crit % <input type="number" step="0.01" name="critChance" style={styles.smallInput} value={enemy.critChance} onChange={handleChange} /></label>
            <label style={styles.gridItem}>Evasion <input type="number" step="0.01" name="evasion" style={styles.smallInput} value={enemy.evasion} onChange={handleChange} /></label>
          </div>
        </section>

        {/* 5. SPAWN LOCATIONS */}
        <section style={styles.section}>
          <h3 style={styles.sectionLabel}>5. Spawn Locations (SPAWN LOCATION & SPAWN RATE)</h3>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <select style={{...styles.input, flex: 1}} value={locationInput.scene} onChange={e => setLocationInput({...locationInput, scene: e.target.value as SceneTypes})}>
              <option value="">-- Select Scene --</option>
              <option value="forest">forest</option>
              <option value="desert">desert</option>
              <option value="swamp">swamp</option>
              <option value="cemetery">cemetery</option>
              <option value="tundra">tundra</option>
              <option value="jungle">jungle</option>
              <option value="temple">temple</option>
            </select>
            <input type="number" step="0.01" placeholder="Spawn Rate" style={{ ...styles.input, width: '100px' }} value={locationInput.spawnRate} onChange={e => setLocationInput({...locationInput, spawnRate: Number(e.target.value)})} />
            <button style={styles.addButton} onClick={addLocation}>ADD LOCATION</button>
          </div>
          <ul style={{ color: '#00ff88', fontSize: '13px' }}>
            {Object.entries(enemy.location).map(([scene, rate]) => (
              <li key={scene} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>{scene} (Rate: {rate})</span>
                <button style={{ ...styles.addButton, padding: '0 10px', fontSize: '10px' }} onClick={() => removeScene(scene as SceneTypes)}>Remove</button>
              </li>
            ))}
          </ul>
        </section>

        {/* 6. LOOT SECTION */}
        <section style={styles.section}>
          <h3 style={styles.sectionLabel}>6. Loot Drop Table</h3>
          <div style={styles.grid}>
            <label style={styles.gridItem}>Coin Min <input type="number" name="coinDropMin" style={styles.smallInput} value={enemy.lootDrop.coinDropMin} onChange={handleLootChange} /></label>
            <label style={styles.gridItem}>Coin Max <input type="number" name="coinDropMax" style={styles.smallInput} value={enemy.lootDrop.coinDropMax} onChange={handleLootChange} /></label>
            <label style={styles.gridItem}>XP Min <input type="number" name="xpDropMin" style={styles.smallInput} value={enemy.lootDrop.xpDropMin} onChange={handleLootChange} /></label>
            <label style={styles.gridItem}>XP Max <input type="number" name="xpDropMax" style={styles.smallInput} value={enemy.lootDrop.xpDropMax} onChange={handleLootChange} /></label>
          </div>
          <p style={{ fontSize: '10px', color: '#555', marginTop: '10px' }}>* Items (Weapons/Armor) currently set to empty arrays.</p>
        </section>

        <button style={styles.saveButton} onClick={() => saveEnemyToDisk(enemy)}>
          SAVE TO ENEMIES.JSON
        </button>
      </div>

      <div style={styles.previewSection}>
        <h3 style={{ color: '#444', marginBottom: '15px' }}>Live JSON Map</h3>
        <pre style={styles.codeBlock}>{JSON.stringify(enemy, null, 2)}</pre>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', height: '100vh', backgroundColor: '#080808', color: '#ccc', fontFamily: 'monospace' },
  formSection: { flex: 1.2, padding: '40px', overflowY: 'auto', borderRight: '1px solid #222' },
  previewSection: { flex: 0.8, padding: '40px', backgroundColor: '#000', overflowY: 'auto' },
  title: { color: '#00ff88', marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '10px' },
  section: { marginBottom: '25px', padding: '20px', backgroundColor: '#111', borderRadius: '8px' },
  sectionLabel: { marginTop: 0, fontSize: '12px', color: '#666', textTransform: 'uppercase', marginBottom: '15px' },
  fieldLabel: { fontSize: '10px', color: '#888', display: 'block', marginBottom: '4px' },
  input: { width: '100%', padding: '10px', marginBottom: '12px', backgroundColor: '#1a1a1a', border: '1px solid #333', color: 'white' },
  textarea: { width: '100%', height: '60px', padding: '10px', marginBottom: '12px', backgroundColor: '#1a1a1a', border: '1px solid #333', color: 'white' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  gridItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' },
  smallInput: { width: '80px', padding: '6px', backgroundColor: '#1a1a1a', border: '1px solid #333', color: '#00ff88', textAlign: 'right' },
  readOnlyInput: { width: '80px', padding: '6px', backgroundColor: '#0a0a0a', border: 'none', color: '#444', textAlign: 'right' },
  addButton: { padding: '0 20px', backgroundColor: '#333', color: 'white', border: 'none', cursor: 'pointer' },
  saveButton: { width: '100%', padding: '20px', backgroundColor: '#00ff88', color: 'black', fontWeight: 'bold', border: 'none', cursor: 'pointer' },
  codeBlock: { color: '#00ff88', fontSize: '12px', lineHeight: '1.4' }
};