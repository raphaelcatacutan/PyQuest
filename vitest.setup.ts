// Vitest setup file - Mock Skulpt for Node.js testing

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
  importMainWithBody: (name: string, dumpJS: boolean, code: string) => {
    const config = (global as any).Sk._config;
    
    // Handle simple print statements
    const printRegex = /print\((.*)\)/g;
    let match;
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
  }
};
