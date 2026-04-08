import { useState } from 'react';
import { runPython } from '../../backend/mechanics/parser';

export default function WatcherTestPage() {
    const [pythonOutput, setPythonOutput] = useState<string>('');
    const [code, setCode] = useState<string>(`from user.weapons import spear

goTo("village")
print("Buy")

spear.attack()
spear.thrust()`);

    const runCode = async () => {
        try {
            const output = await runPython(code);
            setPythonOutput(output);
        } catch (error) {
            setPythonOutput(`Error: ${error}`);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '1200px', margin: '0 auto' }}>
            <h1>Python Module Test</h1>
            <p style={{ color: '#666' }}>Run Python code against the built-in module registry</p>
            
            <div style={{ margin: '20px 0' }}>
                <h3>Python Code:</h3>
                <textarea 
                    style={{ 
                        width: '100%', 
                        height: '200px', 
                        fontFamily: 'monospace',
                        padding: '10px',
                        fontSize: '14px'
                    }}
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
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
