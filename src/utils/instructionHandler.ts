export function applyInstructions(context: any): any {
    // Check if instruction block exists
    if (!context.instruction) {
      throw new Error("Context missing required instruction block");
    }
    
    // Make a deep copy to avoid modifying the original
    const processedContext = JSON.parse(JSON.stringify(context));
    
    // Apply privacy instructions if defined
    if (context.instruction.privacy) {
      applyPrivacyFilters(processedContext, context.instruction.privacy);
    }
    
    return processedContext;
  }
  
  function applyPrivacyFilters(context: any, privacyInstructions: any): any {
    // Simple example: if a field is marked private, remove it
    if (typeof privacyInstructions === 'string') {
      // Handle simple string instructions
      if (privacyInstructions.includes('health is private')) {
        delete context.health;
      }
    } else if (typeof privacyInstructions === 'object') {
      // Handle structured privacy instructions
      if (privacyInstructions.private && Array.isArray(privacyInstructions.private)) {
        for (const path of privacyInstructions.private) {
          removeByPath(context, path);
        }
      }
    }
    
    return context;
  }
  
  function removeByPath(obj: any, path: string): void {
    const parts = path.split('.');
    let current = obj;
    
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) return; // Path doesn't exist
      current = current[parts[i]];
    }
    
    const lastPart = parts[parts.length - 1];
    if (current[lastPart] !== undefined) {
      delete current[lastPart];
    }
  }