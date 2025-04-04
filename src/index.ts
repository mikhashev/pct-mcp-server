import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadContext, saveContext } from "./storage/contextStorage.js";
import { applyInstructions } from "./utils/instructionHandler.js";
import express from "express";
import { z } from "zod";

// Create Express app
const app = express();

// Create MCP server
const server = new McpServer({
  name: "Personal Context Server",
  version: "1.0.0"
});

// Add a resource for the complete context
server.resource(
  "fullContext",
  new ResourceTemplate("personal-context://full", { 
    list: async () => {
      return {
        resources: [{
          uri: "personal-context://full",
          name: "Complete Context"
        }]
      };
    } 
  }),
  async (uri) => {
    try {
      // Load the raw context data
      const rawContext = await loadContext();
      
      // Apply instructions to filter/process the context
      const processedContext = applyInstructions(rawContext);
      
      return {
        contents: [
          { 
            uri: uri.href,
            text: JSON.stringify(processedContext, null, 2) 
          }
        ]
      };
    } catch (error) {
      console.error("Error serving context:", error);
      throw error;
    }
  }
);

// Keep the original section-based resource
server.resource(
  "personalContext",
  new ResourceTemplate("personal-context://{section}", { 
    list: async () => {
      const context = await loadContext();
      
      // Return both the full context option and individual sections
      return {
        resources: [
          // First item is the "All" option
          {
            uri: "personal-context://all",
            name: "All Sections"
          },
          // Then list all individual sections
          ...Object.keys(context).map(section => ({
            uri: `personal-context://${section}`,
            name: section
          }))
        ]
      };
    } 
  }),
  async (uri, params) => {
    try {
      // Load the raw context data
      const rawContext = await loadContext();
      
      // Apply instructions to filter/process the context
      const processedContext = applyInstructions(rawContext);
      
      // Check if this is the "all" special case
      const section = params.section as string;
      
      // If "all" is selected, return the full context
      if (section === "all") {
        return {
          contents: [
            { 
              uri: uri.href,
              text: JSON.stringify(processedContext, null, 2) 
            }
          ]
        };
      }
      
      // Otherwise return just the requested section
      if (section && typeof section === 'string' && processedContext[section]) {
        return {
          contents: [
            { 
              uri: uri.href,
              text: JSON.stringify({ [section]: processedContext[section] }, null, 2) 
            }
          ]
        };
      }
      
      // Fallback if section doesn't exist
      return {
        contents: [
          { 
            uri: uri.href,
            text: JSON.stringify({ error: "Section not found" }, null, 2) 
          }
        ]
      };
    } catch (error) {
      console.error("Error serving context:", error);
      throw error;
    }
  }
);

// Add updateContext tool (keeping the existing implementation)
server.tool(
  "updateContext",
  {
    path: z.string().describe("Path to the field to update (e.g., 'preferences.learning_style')"),
    value: z.string().describe("New value for the field"),
    reason: z.string().describe("Reason for the update")
  },
  async ({ path, value, reason }) => {
    try {
      // Load current context
      const context = await loadContext();
      
      // Update the specified path
      const pathParts = path.split(".");
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
      const previousValue = current[finalKey];
      current[finalKey] = value;
      
      // Update metadata
      context.metadata.last_updated = new Date().toISOString();
      
      // Add to change history if it exists
      if (!context.metadata.change_history) {
        context.metadata.change_history = [];
      }
      
      context.metadata.change_history.unshift({
        path,
        previous_value: previousValue,
        new_value: value,
        reason,
        timestamp: new Date().toISOString()
      });
      
      // Save updated context
      await saveContext(context);
      
      return {
        content: [
          {
            type: "text",
            text: `Successfully updated ${path} to "${value}"`
          }
        ]
      };
    } catch (error) {
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
);

// Create and attach transport
// For development, use StdioServerTransport
const transport = new StdioServerTransport();
await server.connect(transport);

console.log("Personal Context MCP server running on stdio");