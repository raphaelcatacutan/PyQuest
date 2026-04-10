import React, { useState } from 'react';

type Difficulty = 'easy' | 'medium' | 'hard';

interface DungeonChallenge {
  difficulty: Difficulty;
  problem: string;
  correct_code: string;
  expected_output: string;
  reward: Record<string, unknown>;
}

const INITIAL_CHALLENGE: DungeonChallenge = {
  difficulty: 'easy',
  problem: '',
  correct_code: '',
  expected_output: '',
  reward: {},
};

export default function DungeonArchitect() {
  const [challenges, setChallenges] = useState<DungeonChallenge[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState<DungeonChallenge>(INITIAL_CHALLENGE);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentChallenge(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const addChallenge = () => {
    if (!currentChallenge.problem || !currentChallenge.correct_code) {
      alert('Problem and correct code are required!');
      return;
    }

    if (editIndex !== null) {
      const updated = [...challenges];
      updated[editIndex] = currentChallenge;
      setChallenges(updated);
      setEditIndex(null);
    } else {
      setChallenges([...challenges, currentChallenge]);
    }
    setCurrentChallenge(INITIAL_CHALLENGE);
  };

  const editChallenge = (index: number) => {
    setCurrentChallenge(challenges[index]);
    setEditIndex(index);
  };

  const removeChallenge = (index: number) => {
    setChallenges(challenges.filter((_, i) => i !== index));
  };

  const saveToDisk = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/save-dungeon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(challenges),
      });
      if (response.ok) alert(`${challenges.length} challenges saved!`);
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
        <h1 style={styles.title}>Dungeon Challenges Architect</h1>

        {/* CHALLENGE EDITOR */}
        <section style={styles.section}>
          <h3 style={styles.sectionLabel}>{editIndex !== null ? 'Edit Challenge' : 'Create New Challenge'}</h3>

          <label style={styles.fieldLabel}>Difficulty</label>
          <select style={styles.input} name="difficulty" value={currentChallenge.difficulty} onChange={handleChange}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <label style={styles.fieldLabel}>Problem Description</label>
          <textarea
            style={{...styles.textarea, height: '80px'}}
            name="problem"
            placeholder="Describe the programming challenge..."
            value={currentChallenge.problem}
            onChange={handleChange}
          />

          <label style={styles.fieldLabel}>Correct Code</label>
          <textarea
            style={{...styles.textarea, height: '100px', fontFamily: 'monospace'}}
            name="correct_code"
            placeholder="def example():\n    return True"
            value={currentChallenge.correct_code}
            onChange={handleChange}
          />

          <label style={styles.fieldLabel}>Expected Output</label>
          <input
            style={styles.input}
            type="text"
            name="expected_output"
            placeholder="Expected output after running the code"
            value={currentChallenge.expected_output}
            onChange={handleChange}
          />

          <div style={{ display: 'flex', gap: '8px', marginTop: '15px' }}>
            <button style={styles.addButton} onClick={addChallenge}>
              {editIndex !== null ? 'UPDATE' : 'ADD CHALLENGE'}
            </button>
            {editIndex !== null && (
              <button
                style={{...styles.addButton, backgroundColor: '#666'}}
                onClick={() => {
                  setCurrentChallenge(INITIAL_CHALLENGE);
                  setEditIndex(null);
                }}
              >
                CANCEL
              </button>
            )}
          </div>
        </section>

        {/* CHALLENGES LIST */}
        <section style={styles.section}>
          <h3 style={styles.sectionLabel}>Challenges ({challenges.length})</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {challenges.map((challenge, i) => (
              <li key={i} style={styles.listItem}>
                <div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{
                      fontSize: '10px',
                      padding: '2px 8px',
                      backgroundColor: challenge.difficulty === 'easy' ? '#00ff88' : challenge.difficulty === 'medium' ? '#ffcc00' : '#ff6b6b',
                      color: '#000',
                      borderRadius: '3px',
                      fontWeight: 'bold',
                    }}>
                      {challenge.difficulty.toUpperCase()}
                    </span>
                    <strong>{challenge.problem.substring(0, 50)}...</strong>
                  </div>
                  <div style={{ fontSize: '11px', color: '#888', marginLeft: '4px' }}>
                    Output: {challenge.expected_output.substring(0, 40)}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button style={{...styles.addButton, padding: '0 12px', fontSize: '10px'}} onClick={() => editChallenge(i)}>Edit</button>
                  <button style={{...styles.addButton, padding: '0 12px', fontSize: '10px', backgroundColor: '#666'}} onClick={() => removeChallenge(i)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <button style={styles.saveButton} onClick={saveToDisk}>
          SAVE TO DUNGEON.JSON
        </button>
      </div>

      <div style={styles.previewSection}>
        <h3 style={{ color: '#444' }}>Live Challenges JSON</h3>
        <pre style={styles.codeBlock}>{JSON.stringify(challenges, null, 2)}</pre>
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
