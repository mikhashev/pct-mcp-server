import * as fs from "fs/promises";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONTEXT_FILE_PATH = path.resolve(__dirname, "../../data/personal_context.json");

// Ensure the data directory exists
async function ensureDataDirectory() {
  const dataDir = path.dirname(CONTEXT_FILE_PATH);
  try {
    await fs.access(dataDir);
  } catch (error) {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Default personal context if none exists
const DEFAULT_CONTEXT = {
  basic_info: {
    name: "Example User",
    location: "Example City"
  },
  preferences: {
    communication_style: "direct",
    learning_style: "visual"
  },
  instruction: {
    primary: "Use this context when responding to my questions",
    context_update: "If you learn new information about me, suggest adding it",
    privacy: "All health information is private, professional information is public"
  },
  metadata: {
    version: "1.0",
    last_updated: new Date().toISOString(),
    change_history: []
  }
};

export async function loadContext(): Promise<any> {
  try {
    await ensureDataDirectory();
    
    try {
      const data = await fs.readFile(CONTEXT_FILE_PATH, "utf-8");
      return JSON.parse(data);
    } catch (error: unknown) {
      // Check if file doesn't exist
      if (error instanceof Error && 'code' in error && error.code === "ENOENT") {
        // Create default context if file doesn't exist
        await saveContext(DEFAULT_CONTEXT);
        return DEFAULT_CONTEXT;
      }
      throw error;
    }
  } catch (error) {
    console.error("Error loading context:", error);
    throw new Error("Failed to load personal context");
  }
}

export async function saveContext(context: any): Promise<boolean> {
  try {
    await ensureDataDirectory();
    await fs.writeFile(
      CONTEXT_FILE_PATH,
      JSON.stringify(context, null, 2),
      "utf-8"
    );
    return true;
  } catch (error) {
    console.error("Error saving context:", error);
    throw new Error("Failed to save personal context");
  }
}