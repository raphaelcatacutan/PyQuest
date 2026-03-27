// Vitest setup file - Mock Skulpt for Node.js testing

// Storage for builtins
const builtins: any = {};

// Create a global Sk object for testing
(global as any).Sk = {
  configure: (config: any) => {
    (global as any).Sk._config = config;
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
    const config = (global as any).Sk._config;
    
    // Execute variable assignments (Player.Health = 100, etc)
    const assignmentRegex = /(\w+)\.(\w+)\s*=\s*([^\n]+)/g;
    let match;
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
    
    // Handle simple print statements
    const printRegex = /print\((.*)\)/g;
    while ((match = printRegex.exec(code)) !== null) {
      try {
        let value = match[1].trim();
        // Remove quotes if it's a string
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        } else {
          // Try to evaluate as expression (numbers, arithmetic, etc)
          try {
            value = String(eval(value));
          } catch {
            // If eval fails, it's an undefined variable
            throw new Error(`NameError: name '${value}' is not defined`);
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
