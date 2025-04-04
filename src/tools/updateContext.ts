// src/tools/updateContext.ts
import { loadContext, saveContext } from "../storage/contextStorage.js";
// We no longer need to import ToolImplementation as we're using a different approach

export async function updateContextTool(params: {path: string, value: string, reason: string}) {
  try {
    // Load current context
    const context = await loadContext();
    
    // Update the specified path
    const pathParts = params.path.split(".");
    let current = context;
    
    // Navigate to the parent object
    for (let i = 0; i < pathParts.length - 1; i++) {
      if (!current[pathParts[i]]) {
        current[pathParts[i]] = {};
      }
      current = current[pathParts[i]];
    }
    
    // Update the value
    const finalKey = pathParts[pathParts.length - 1];
    current[finalKey] = params.value;
    
    // Update metadata
    context.metadata.last_updated = new Date().toISOString();
    
    // Add to change history if it exists
    if (!context.metadata.change_history) {
      context.metadata.change_history = [];
    }
    
    context.metadata.change_history.unshift({
      path: params.path,
      previous_value: current[finalKey],
      new_value: params.value,
      reason: params.reason,
      timestamp: new Date().toISOString()
    });
    
    // Save updated context
    await saveContext(context);
    
    return {
      content: [
        {
          type: "text",
          text: `Successfully updated ${params.path} to "${params.value}"`
        }
      ]
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: `Error updating context: ${errorMessage}`
        }
      ]
    };
  }
}