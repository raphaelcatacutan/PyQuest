import { useState, useEffect } from 'react';
import { 
    runPython, 
    watchVariable, 
    clearWatchers,
    getAllTrackedValues 
} from '../../backend/mechanics/parser';

export default function WatcherTestPage() {
    const [trackedVars, setTrackedVars] = useState<Record<string, any>>({});
    const [logs, setLogs] = useState<string[]>([]);
    const [pythonOutput, setPythonOutput] = useState<string>('');

    useEffect(() => {
        clearWatchers();

        // Watch all Player properties
        const watchedVars = [
            'Player.Health',
            'Player.Mana', 
            'Player.Level',
            'Player.Experience',
            'Player.Gold',
            'Game.Score',
            'Game.Level',
            'Game.State',
            'Enemy.Health',
            'Enemy.Damage',
            'Enemy.Type'
        ];

        watchedVars.forEach(varName => {
            watchVariable(varName, (newValue, oldValue) => {
                setLogs(prev => [...prev, `${varName}: ${oldValue} → ${newValue}`]);
                setTrackedVars(prev => ({ ...prev, [varName]: newValue }));
            });
        });

        return () => clearWatchers();
    }, []);

    const runCode = async () => {
        const code = (document.getElementById('code') as HTMLTextAreaElement)?.value;
        if (code) {
            try {
                const output = await runPython(code);
                setPythonOutput(output);
                
                // Update all tracked values
                const allValues = getAllTrackedValues();
                const valuesObj: Record<string, any> = {};
                allValues.forEach((value, key) => {
                    valuesObj[key] = value;
                });
                setTrackedVars(valuesObj);
            } catch (error) {
                setPythonOutput(`Error: ${error}`);
            }
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '1200px', margin: '0 auto' }}>
            <h1>Python Variable Watcher Test</h1>
            <p style={{ color: '#666' }}>Test the watcher system by running Python code that modifies variables</p>
            
            <div style={{ margin: '20px 0' }}>
                <h3>Python Code:</h3>
                <textarea 
                    id="code" 
                    style={{ 
                        width: '100%', 
                        height: '200px', 
                        fontFamily: 'monospace',
                        padding: '10px',
                        fontSize: '14px'
                    }}
                    defaultValue={`# Try modifying these variables:
Player.Health = 100
Player.Mana = 50
Player.Level = 1

# Make changes:
Player.Health = 75
Player.Mana = 30

# Game variables:
Game.Score = 1000
Game.Level = 5

# Enemy:
Enemy.Health = 50
Enemy.Type = 1`}
                />
                <div>
                    <button 
                        onClick={runCode}
                        style={{ 
                            margin: '10px 5px 10px 0', 
                            padding: '10px 20px',
                            fontSize: '16px',
                            cursor: 'pointer'
                        }}
                    >
                        Run Code
                    </button>
                    <button 
                        onClick={() => {
                            setLogs([]);
                            setPythonOutput('');
                        }}
                        style={{ 
                            margin: '10px 5px', 
                            padding: '10px 20px',
                            fontSize: '16px',
                            cursor: 'pointer'
                        }}
                    >
                        Clear Logs
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Current Values */}
                <div>
                    <h3>Current Values:</h3>
                    <div style={{ padding: '10px', border: '1px solid black', minHeight: '200px' }}>
                        {Object.keys(trackedVars).length === 0 ? (
                            <p style={{ color: '#999' }}>No values tracked yet. Run some code!</p>
                        ) : (
                            Object.entries(trackedVars).map(([key, value]) => (
                                <div key={key} style={{ marginBottom: '5px' }}>
                                    <strong>{key}:</strong> {String(value)}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Change Log */}
                <div>
                    <h3>Change Log:</h3>
                    <div style={{ 
                        padding: '10px', 
                        border: '1px solid black', 
                        minHeight: '200px',
                        maxHeight: '400px', 
                        overflow: 'auto' 
                    }}>
                        {logs.length === 0 ? (
                            <p style={{ color: '#999' }}>No changes yet</p>
                        ) : (
                            logs.map((log, i) => (
                                <div key={i} style={{ 
                                    marginBottom: '3px',
                                    padding: '2px',
                                    fontSize: '13px'
                                }}>
                                    {log}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Python Output */}
            {pythonOutput && (
                <div style={{ margin: '20px 0' }}>
                    <h3>Python Output:</h3>
                    <div style={{ 
                        padding: '10px', 
                        border: '1px solid #444',
                        backgroundColor: '#1e1e1e',
                        whiteSpace: 'pre-wrap'
                    }}>
                        {pythonOutput}
                    </div>
                </div>
            )}
        </div>
    );
}
