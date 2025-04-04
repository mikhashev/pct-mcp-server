// src/resources/personalContext.ts
import { loadContext } from "../storage/contextStorage.js";
import { applyInstructions } from "../utils/instructionHandler.js";
// No need to import ResourceImplementation anymore

export async function personalContextResource() {
  // Load the raw context data
  const rawContext = await loadContext();
  
  // Apply instructions to filter/process the context
  const processedContext = applyInstructions(rawContext);
  
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(processedContext, null, 2)
      }
    ]
  };
}