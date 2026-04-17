// Vitest setup file - Mock Skulpt for Node.js testing

// Storage for builtins
const builtins: any = {};

// Create a global Sk object for testing
(globalThis as any).Sk = {
  configure: (config: any) => {
    (globalThis as any).Sk._config = config;
  },
  misceval: {
    asyncToPromise: (fn: () => any) => {
      try {
        return Promise.resolve(fn());
      } catch (e) {
        return Promise.reject(e);
      }
    }
  },
  builtins: builtins,
  ffi: {
    // Mock proxy function - just return the object as-is
    proxy: (obj: any) => obj
  },
  importMainWithBody: (name: string, dumpJS: boolean, code: string) => {
    const config = (globalThis as any).Sk._config;
    const callbackBridge = typeof builtins.__pyquest_callback === 'function'
      ? builtins.__pyquest_callback
      : undefined;
    const stateBridge = typeof builtins.__pyquest_state === 'function'
      ? builtins.__pyquest_state
      : undefined;

    const parseLiteral = (rawValue: string): any => {
      const normalized = rawValue.trim();

      if ((normalized.startsWith('"') && normalized.endsWith('"')) ||
          (normalized.startsWith("'") && normalized.endsWith("'"))) {
        return normalized.slice(1, -1);
      }

      if (/^-?\d+(\.\d+)?$/.test(normalized)) {
        return Number(normalized);
      }

      return normalized;
    };

    const emitCallback = (eventName: string, payload?: unknown) => {
      callbackBridge?.(eventName, payload);
    };

    let match;

    const tickRegex = /^\s*__pyquest_tick\((\d+),\s*"([A-Za-z0-9_]+)"(?:,\s*([^)]+))?\)\s*$/gm;
    while ((match = tickRegex.exec(code)) !== null) {
      const lineNumber = Number(match[1]);
      const statementType = match[2];
      const delaySeconds = match[3] ? Number(parseLiteral(match[3])) : 0;
      emitCallback('python.statement', {
        lineNumber,
        statementType,
        delaySeconds: Number.isFinite(delaySeconds) ? delaySeconds : 0
      });
    }
    
    // Execute variable assignments (Player.Health = 100, etc)
    const assignmentRegex = /(\w+)\.(\w+)\s*=\s*([^\n]+)/g;
    while ((match = assignmentRegex.exec(code)) !== null) {
      const objName = match[1];
      const propName = match[2];
      let value = match[3].trim();
      
      // Evaluate the value
      try {
        // Remove trailing comments
        value = value.split('#')[0].trim();
        // Eval simple expressions
        const evalValue = eval(value);
        
        // Set the value on the builtin object
        if (builtins[objName]) {
          builtins[objName][propName] = evalValue;
        }
      } catch (e) {
        // Ignore evaluation errors for complex expressions
      }
    }

    const goToRegex = /^\s*goTo\((.*)\)\s*$/gm;
    while ((match = goToRegex.exec(code)) !== null) {
      emitCallback('builtin.goTo', { locationId: parseLiteral(match[1]) });
    }

    const scavengeRegex = /^\s*scavenge\(\)\s*$/gm;
    while ((match = scavengeRegex.exec(code)) !== null) {
      emitCallback('builtin.scavenge', {});
    }

    const exploreRegex = /^\s*explore\(\)\s*$/gm;
    while ((match = exploreRegex.exec(code)) !== null) {
      emitCallback('builtin.explore', {});
    }

    const playerEquipRegex = /^\s*player\.equip\((.*)\)\s*$/gm;
    while ((match = playerEquipRegex.exec(code)) !== null) {
      emitCallback('player.equip', { item: parseLiteral(match[1]) });
    }

    const playerUnequipRegex = /^\s*player\.unequip\(\)\s*$/gm;
    while ((match = playerUnequipRegex.exec(code)) !== null) {
      emitCallback('player.unequip', null);
    }

    const gainHpRegex = /^\s*gain_hp\((.*)\)\s*$/gm;
    while ((match = gainHpRegex.exec(code)) !== null) {
      emitCallback('player.gain_hp', { amount: parseLiteral(match[1]) });
    }

    const takeDamageRegex = /^\s*take_damage\((.*)\)\s*$/gm;
    while ((match = takeDamageRegex.exec(code)) !== null) {
      emitCallback('player.take_damage', { amount: parseLiteral(match[1]) });
    }

    const gainCoinsRegex = /^\s*gain_coins\((.*)\)\s*$/gm;
    while ((match = gainCoinsRegex.exec(code)) !== null) {
      emitCallback('player.gain_coins', { amount: parseLiteral(match[1]) });
    }

    const gainXpRegex = /^\s*gain_xp\((.*)\)\s*$/gm;
    while ((match = gainXpRegex.exec(code)) !== null) {
      emitCallback('player.gain_xp', { amount: parseLiteral(match[1]) });
    }

    const combatRegex = /^\s*combat\((.*)\)\s*$/gm;
    while ((match = combatRegex.exec(code)) !== null) {
      const value = String(parseLiteral(match[1])).toLowerCase() === 'true';
      emitCallback('game.combat', { state: value });
    }

    const targetEnemyRegex = /^\s*target_enemy\((.*)\)\s*$/gm;
    while ((match = targetEnemyRegex.exec(code)) !== null) {
      const value = String(parseLiteral(match[1])).toLowerCase() === 'true';
      emitCallback('game.is_enemy', { state: value });
    }

    const logRegex = /^\s*log\((.*)\)\s*$/gm;
    while ((match = logRegex.exec(code)) !== null) {
      emitCallback('terminal.log', { message: parseLiteral(match[1]) });
    }
    
    // Handle simple print statements
    const printRegex = /^\s*print\((.*)\)\s*$/gm;
    while ((match = printRegex.exec(code)) !== null) {
      try {
        let value = match[1].trim();
        // Remove quotes if it's a string
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        } else {
          const playerPropertyMatch = value.match(/^player\.(\w+)$/);

          if (playerPropertyMatch && stateBridge) {
            const playerKey = playerPropertyMatch[1];
            const pathByKey: Record<string, { path: string; fallback: unknown }> = {
              energy: { path: 'player.energy', fallback: 0 },
              hp: { path: 'player.hp', fallback: 100 },
              maxHP: { path: 'player.maxHP', fallback: 100 },
              def: { path: 'player.def', fallback: 0 },
              maxDef: { path: 'player.maxDef', fallback: 0 },
              coins: { path: 'player.coins', fallback: 0 }
            };
            const resolved = pathByKey[playerKey];

            if (resolved) {
              value = String(stateBridge(resolved.path, resolved.fallback));
            } else {
              throw new Error(`NameError: name '${value}' is not defined`);
            }
          } else {
          // Try to evaluate as expression (numbers, arithmetic, etc)
            try {
              value = String(eval(value));
            } catch {
              // If eval fails, it's an undefined variable
              throw new Error(`NameError: name '${value}' is not defined`);
            }
          }
        }
        if (config.output) {
          config.output(value + '\n');
        }
      } catch (e: any) {
        throw e;
      }
    }
    
    // Handle for loops (simplified)
    const forLoopRegex = /for\s+(\w+)\s+in\s+range\((\d+)\):\s*\n\s+(.+)/g;
    while ((match = forLoopRegex.exec(code)) !== null) {
      const loopVar = match[1];
      const rangeEnd = parseInt(match[2]);
      const loopBody = match[3];
      
      for (let i = 0; i < rangeEnd; i++) {
        // Execute loop body with current value of i
        const bodyWithValue = loopBody.replace(new RegExp(`\\b${loopVar}\\b`, 'g'), String(i));
        const bodyAssignmentRegex = /(\w+)\.(\w+)\s*=\s*([^\n]+)/;
        const bodyMatch = bodyWithValue.match(bodyAssignmentRegex);
        
        if (bodyMatch) {
          const objName = bodyMatch[1];
          const propName = bodyMatch[2];
          const value = eval(bodyMatch[3].trim());
          
          if (builtins[objName]) {
            builtins[objName][propName] = value;
          }
        }
      }
    }
  }
};
