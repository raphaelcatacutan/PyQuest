/**
 * Example: How to use the Python variable watcher system
 */

import { 
    runPython, 
    watchVariable, 
    clearWatchers, 
    getTrackedValue,
    getAllTrackedValues 
} from './parser';

/**
 * Example 1: Watch Player.Health changes
 */
export async function exampleHealthWatcher() {
    // Clear any previous watchers
    clearWatchers();

    // Register a watcher for Player.Health
    watchVariable('Player.Health', (newValue, oldValue) => {
        console.log(`Health changed: ${oldValue} → ${newValue}`);
        
        if (newValue <= 0) {
            console.log('Player died!');
            // Trigger game over logic here
        } else if (newValue < 20) {
            console.log('Low health warning!');
            // Show low health UI warning
        }
    });

    // Run Python code that modifies Player.Health
    const pythonCode = `
Player.Health = 100
print(f"Initial health: {Player.Health}")

Player.Health = 50
print(f"After damage: {Player.Health}")

Player.Health = 10
print(f"Critical: {Player.Health}")

Player.Health = 0
print(f"Dead: {Player.Health}")
    `;

    const output = await runPython(pythonCode);
    console.log('Python output:', output);
    console.log('Final health value:', getTrackedValue('Player.Health'));
}

/**
 * Example 2: Watch multiple variables
 */
export async function exampleMultipleWatchers() {
    clearWatchers();

    // Watch Player stats
    watchVariable('Player.Health', (newValue, oldValue) => {
        console.log(`HP: ${oldValue} → ${newValue}`);
    });

    watchVariable('Player.Mana', (newValue, oldValue) => {
        console.log(`MP: ${oldValue} → ${newValue}`);
    });

    watchVariable('Player.Level', (newValue, oldValue) => {
        console.log(`Level up! ${oldValue} → ${newValue}`);
        // Trigger level up effects
    });

    watchVariable('Game.Score', (newValue, oldValue) => {
        const diff = newValue - (oldValue || 0);
        console.log(`Score +${diff} (Total: ${newValue})`);
    });

    const pythonCode = `
# Initialize player
Player.Health = 100
Player.Mana = 50
Player.Level = 1

# Game events
Game.Score = 0
Game.Score = 100
Game.Score = 250

# Player takes damage and uses mana
Player.Health = 75
Player.Mana = 30

# Level up!
Player.Level = 2
Player.Health = 100  # Full heal on level up
Player.Mana = 60
    `;

    await runPython(pythonCode);
    
    // Get all tracked values at once
    console.log('\nFinal state:');
    const allValues = getAllTrackedValues();
    allValues.forEach((value, key) => {
        console.log(`  ${key}: ${value}`);
    });
}

/**
 * Example 3: Enemy health tracking
 */
export async function exampleEnemyTracking() {
    clearWatchers();

    watchVariable('Enemy.Health', (newValue, oldValue) => {
        if (newValue <= 0 && oldValue > 0) {
            console.log('🎯 Enemy defeated! Dropping loot...');
            // Trigger loot drop
        }
    });

    const pythonCode = `
Enemy.Health = 50
print("Enemy spawned")

# Combat
Enemy.Health = 30
Enemy.Health = 15
Enemy.Health = 0
print("Enemy defeated!")
    `;

    await runPython(pythonCode);
}

/**
 * Example 4: Real-time synchronization with Game UI
 */
export function setupGameWatchers(updateUI: (state: any) => void) {
    clearWatchers();

    // Create a game state object
    const gameState = {
        playerHealth: 100,
        playerMana: 50,
        score: 0,
    };

    // Watch and sync to game state
    watchVariable('Player.Health', (newValue) => {
        gameState.playerHealth = newValue;
        updateUI(gameState);
    });

    watchVariable('Player.Mana', (newValue) => {
        gameState.playerMana = newValue;
        updateUI(gameState);
    });

    watchVariable('Game.Score', (newValue) => {
        gameState.score = newValue;
        updateUI(gameState);
    });

    return gameState;
}

// Example usage in a React component:
/*
function GameComponent() {
    const [gameState, setGameState] = useState({ 
        playerHealth: 100, 
        playerMana: 50, 
        score: 0 
    });

    useEffect(() => {
        setupGameWatchers(setGameState);
    }, []);

    const runPlayerScript = async () => {
        const code = `
Player.Health = 75
Player.Mana = 30
Game.Score = 100
        `;
        await runPython(code);
    };

    return (
        <div>
            <div>Health: {gameState.playerHealth}</div>
            <div>Mana: {gameState.playerMana}</div>
            <div>Score: {gameState.score}</div>
            <button onClick={runPlayerScript}>Run Script</button>
        </div>
    );
}
*/
