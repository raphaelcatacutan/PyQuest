import React, { useState } from 'react';

type Difficulty = 'easy' | 'medium' | 'hard';

interface ItemDrop {
  itemId: string;
  dropRate: number;
  quantity?: number;
}

interface TrialReward {
  xpDropMin: number;
  xpDropMax: number;
  coinDropMin: number;
  coinDropMax: number;
  weapons: ItemDrop[];
  armors: ItemDrop[];
  consumables: ItemDrop[];
}

interface Trial {
  difficulty: Difficulty;
  incorrectCode: string;
  correctCode: string;
  expectedOutput: string;
  reward: TrialReward;
}

const INITIAL_REWARD: TrialReward = {
  xpDropMin: 0,
  xpDropMax: 0,
  coinDropMin: 0,
  coinDropMax: 0,
  weapons: [],
  armors: [],
  consumables: [],
};

const INITIAL_TRIAL: Trial = {
  difficulty: 'easy',
  incorrectCode: '',
  correctCode: '',
  expectedOutput: '',
  reward: INITIAL_REWARD,
};

const INITIAL_ITEM_DROP: ItemDrop = {
  itemId: '',
  dropRate: 0,
  quantity: 1,
};

export default function TrialsArchitect() {
  const [trials, setTrials] = useState<Trial[]>([]);
  const [currentTrial, setCurrentTrial] = useState<Trial>(INITIAL_TRIAL);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [dropType, setDropType] = useState<'weapons' | 'armors' | 'consumables'>('weapons');
  const [itemDropInput, setItemDropInput] = useState<ItemDrop>(INITIAL_ITEM_DROP);

  const handleTrialChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'number' ? Number(value) : value;

    setCurrentTrial(prev => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const handleRewardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentTrial(prev => ({
      ...prev,
      reward: {
        ...prev.reward,
        [name]: Number(value),
      },
    }));
  };

  const addItemDrop = () => {
    if (!itemDropInput.itemId) {
      alert('Item ID is required!');
      return;
    }
    setCurrentTrial(prev => ({
      ...prev,
      reward: {
        ...prev.reward,
        [dropType]: [...prev.reward[dropType], itemDropInput],
      },
    }));
    setItemDropInput(INITIAL_ITEM_DROP);
  };

  const removeItemDrop = (type: 'weapons' | 'armors' | 'consumables', index: number) => {
    setCurrentTrial(prev => ({
      ...prev,
      reward: {
        ...prev.reward,
        [type]: prev.reward[type].filter((_, i) => i !== index),
      },
    }));
  };

  const addTrial = () => {
    if (!currentTrial.incorrectCode || !currentTrial.correctCode) {
      alert('Incorrect code and correct code are required!');
      return;
    }

    if (editIndex !== null) {
      const updated = [...trials];
      updated[editIndex] = currentTrial;
      setTrials(updated);
      setEditIndex(null);
    } else {
      setTrials([...trials, currentTrial]);
    }
    setCurrentTrial(INITIAL_TRIAL);
  };

  const editTrial = (index: number) => {
    setCurrentTrial(trials[index]);
    setEditIndex(index);
  };

  const removeTrial = (index: number) => {
    setTrials(trials.filter((_, i) => i !== index));
  };

  const saveToDisk = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/save-trials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trials),
      });
      if (response.ok) alert(`${trials.length} trials saved!`);
    } catch (err) {
      alert("Server error. Is dev-server running?");
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
        input::placeholder, textarea::placeholder {
          color: #666;
          opacity: 1;
        }
        input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
          color: #666;
          opacity: 1;
        }
      `}</style>
      <div style={styles.formSection}>
        <h1 style={styles.title}>Trials Architect</h1>

        {/* TRIAL EDITOR */}
        <section style={styles.section}>
          <h3 style={styles.sectionLabel}>{editIndex !== null ? 'Edit Trial' : 'Create New Trial'}</h3>

          <label style={styles.fieldLabel}>Difficulty</label>
          <select style={styles.input} name="difficulty" value={currentTrial.difficulty} onChange={handleTrialChange}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <label style={styles.fieldLabel}>Incorrect Code (Buggy)</label>
          <textarea
            style={{...styles.textarea, height: '100px'}}
            name="incorrectCode"
            placeholder="function example() {\n  return true;\n}"
            value={currentTrial.incorrectCode}
            onChange={handleTrialChange}
          />

          <label style={styles.fieldLabel}>Correct Code (Fixed)</label>
          <textarea
            style={{...styles.textarea, height: '100px'}}
            name="correctCode"
            placeholder="function example() {\n  return false;\n}"
            value={currentTrial.correctCode}
            onChange={handleTrialChange}
          />

          <label style={styles.fieldLabel}>Expected Output</label>
          <input
            style={styles.input}
            type="text"
            name="expectedOutput"
            placeholder="Expected output"
            value={currentTrial.expectedOutput}
            onChange={handleTrialChange}
          />
        </section>

        {/* REWARDS */}
        <section style={styles.section}>
          <h3 style={styles.sectionLabel}>Rewards</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={styles.fieldLabel}>XP Drop Min</label>
              <input type="text" inputMode="numeric" style={styles.input} name="xpDropMin" value={currentTrial.reward.xpDropMin || ''} onChange={handleRewardChange} />
            </div>
            <div>
              <label style={styles.fieldLabel}>XP Drop Max</label>
              <input type="text" inputMode="numeric" style={styles.input} name="xpDropMax" value={currentTrial.reward.xpDropMax || ''} onChange={handleRewardChange} />
            </div>
            <div>
              <label style={styles.fieldLabel}>Coin Drop Min</label>
              <input type="text" inputMode="numeric" style={styles.input} name="coinDropMin" value={currentTrial.reward.coinDropMin || ''} onChange={handleRewardChange} />
            </div>
            <div>
              <label style={styles.fieldLabel}>Coin Drop Max</label>
              <input type="text" inputMode="numeric" style={styles.input} name="coinDropMax" value={currentTrial.reward.coinDropMax || ''} onChange={handleRewardChange} />
            </div>
          </div>

          {/* Item Drops */}
          <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #333' }}>
            <label style={styles.fieldLabel}>Add Item Drop</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <select style={{...styles.input, flex: 0.8}} value={dropType} onChange={e => setDropType(e.target.value as any)}>
                <option value="weapons">Weapons</option>
                <option value="armors">Armors</option>
                <option value="consumables">Consumables</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Item ID"
                style={{...styles.input, flex: 1}}
                value={itemDropInput.itemId}
                onChange={e => setItemDropInput({...itemDropInput, itemId: e.target.value})}
              />
              <input
                type="text"
                inputMode="numeric"
                placeholder="Drop Rate (0-1)"
                style={{...styles.input, flex: 0.6}}
                value={itemDropInput.dropRate || ''}
                onChange={e => setItemDropInput({...itemDropInput, dropRate: Number(e.target.value) || 0})}
              />
              <input
                type="text"
                inputMode="numeric"
                placeholder="Qty"
                style={{...styles.input, flex: 0.4}}
                value={itemDropInput.quantity || ''}
                onChange={e => setItemDropInput({...itemDropInput, quantity: Number(e.target.value) || 1})}
              />
              <button style={styles.addButton} onClick={addItemDrop}>+</button>
            </div>

            {/* Current item drops display */}
            {['weapons', 'armors', 'consumables'].map(type => (
              currentTrial.reward[type as 'weapons' | 'armors' | 'consumables'].length > 0 && (
                <div key={type} style={{ marginTop: '10px' }}>
                  <div style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', marginBottom: '6px' }}>
                    {type}
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {currentTrial.reward[type as 'weapons' | 'armors' | 'consumables'].map((item, i) => (
                      <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', backgroundColor: '#0a0a0a', marginBottom: '4px', borderRadius: '3px' }}>
                        <span><strong>{item.itemId}</strong> | {(item.dropRate * 100).toFixed(0)}%{item.quantity && ` x${item.quantity}`}</span>
                        <button style={{...styles.addButton, padding: '0 8px', fontSize: '10px'}} onClick={() => removeItemDrop(type as any, i)}>×</button>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            ))}
          </div>
        </section>

        <div style={{ display: 'flex', gap: '8px', marginTop: '15px' }}>
          <button style={styles.addButton} onClick={addTrial}>
            {editIndex !== null ? 'UPDATE TRIAL' : 'ADD TRIAL'}
          </button>
          {editIndex !== null && (
            <button
              style={{...styles.addButton, backgroundColor: '#666'}}
              onClick={() => {
                setCurrentTrial(INITIAL_TRIAL);
                setEditIndex(null);
              }}
            >
              CANCEL
            </button>
          )}
        </div>

        {/* TRIALS LIST */}
        <section style={{...styles.section, marginTop: '20px'}}>
          <h3 style={styles.sectionLabel}>Trials ({trials.length})</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {trials.map((trial, i) => (
              <li key={i} style={styles.listItem}>
                <div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{
                      fontSize: '10px',
                      padding: '2px 8px',
                      backgroundColor: trial.difficulty === 'easy' ? '#00ff88' : trial.difficulty === 'medium' ? '#ffcc00' : '#ff6b6b',
                      color: '#000',
                      borderRadius: '3px',
                      fontWeight: 'bold',
                    }}>
                      {trial.difficulty.toUpperCase()}
                    </span>
                    <strong>XP: {trial.reward.xpDropMin}-{trial.reward.xpDropMax}</strong>
                    <strong style={{ color: '#ffcc00' }}>Gold: {trial.reward.coinDropMin}-{trial.reward.coinDropMax}</strong>
                  </div>
                  <div style={{ fontSize: '11px', color: '#888' }}>
                    Output: {trial.expectedOutput.substring(0, 40)}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button style={{...styles.addButton, padding: '0 12px', fontSize: '10px'}} onClick={() => editTrial(i)}>Edit</button>
                  <button style={{...styles.addButton, padding: '0 12px', fontSize: '10px', backgroundColor: '#666'}} onClick={() => removeTrial(i)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <button style={styles.saveButton} onClick={saveToDisk}>
          SAVE TO TRIALS.JSON
        </button>
      </div>

      <div style={styles.previewSection}>
        <h3 style={{ color: '#444' }}>Live Trials JSON</h3>
        <pre style={styles.codeBlock}>{JSON.stringify(trials, null, 2)}</pre>
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
  fieldLabel: { fontSize: '10px', color: '#888', display: 'block', marginBottom: '4px', marginTop: '12px' },
  input: { width: '100%', padding: '10px', marginBottom: '12px', backgroundColor: '#1a1a1a', border: '1px solid #333', color: 'white' },
  textarea: { width: '100%', padding: '10px', marginBottom: '12px', backgroundColor: '#1a1a1a', border: '1px solid #333', color: 'white', fontFamily: 'monospace' },
  addButton: { padding: '8px 20px', backgroundColor: '#333', color: 'white', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' },
  saveButton: { width: '100%', padding: '20px', backgroundColor: '#00d4ff', color: 'black', fontWeight: 'bold', border: 'none', cursor: 'pointer' },
  listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', padding: '12px', backgroundColor: '#0a0a0a', borderRadius: '4px' },
  codeBlock: { color: '#00d4ff', fontSize: '12px', lineHeight: '1.4', margin: 0 }
};
