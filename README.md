[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/mikhashev-pct-mcp-server-badge.png)](https://mseep.ai/app/mikhashev-pct-mcp-server)

# Personal Context Technology MCP Server

This repository implements a server for [Personal Context Technology (PCT)](https://github.com/mikhashev/personal-context-manager) using the Model Context Protocol (MCP). It enables AI assistants like Claude to access and update your personalized context data, creating persistent memory between sessions.

## What is Personal Context Technology?

Personal Context Technology allows you to structure and manage personal data that AI assistants can use to provide more personalized and relevant responses. With PCT:

- Your context is preserved between AI sessions
- You control where your data is stored (locally, cloud, etc.)
- You define explicit instructions for how AI systems should use your data
- You can update context as your preferences and situation change

## Features

- **Persistent Context Storage**: Store your preferences, goals, learning style, and other personal information
- **Privacy Controls**: Instruction block defines which information is private/public
- **Section-based Access**: Access full context or individual sections
- **Context Updates**: Update specific fields via the updateContext tool
- **Version Tracking**: Maintain history of context changes

## Demo

Watch the Personal Context Technology MCP Server in action:

[![PCT MCP Server Demo](https://img.youtube.com/vi/qzCC5EKUkbc/0.jpg)](https://youtu.be/qzCC5EKUkbc?si=4ppw8s3wj2cuanB8)

The demo shows how to:
- Access personal context data using the MCP tool
- Update context information using the updateContext tool
- See how Claude's responses improve with personalized context

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- npm (included with Node.js)

### Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/mikhashev/pct-mcp-server.git
cd pct-mcp-server
```

2. **Install dependencies**

```bash
npm install
```

3. **Build the server**

```bash
npm run build
```

4. **Start the server**

```bash
npm start
```

## Connecting to Claude Desktop

To use this server with Claude Desktop:

### Windows

1. Open Claude Desktop
2. Navigate to Settings > Developer > Edit Config
3. This will open `%AppData%\Claude Desktop\` directory
4. Create or edit `claude_desktop_config.json` with the following content:

```json
{
  "mcpServers": {
    "personal-context-server": {
      "command": "node",
      "args": ["PATH_TO_YOUR_PROJECT/pct-mcp-server/dist/index.js"],
      "env": {}
    }
  }
}
```

Replace `PATH_TO_YOUR_PROJECT` with the actual path to your project.

### macOS

1. Open Claude Desktop
2. Navigate to Settings > Developer > Edit Config
3. This will open `~/Library/Application Support/Claude Desktop/` directory
4. Create or edit `claude_desktop_config.json` with the following content:

```json
{
  "mcpServers": {
    "personal-context-server": {
      "command": "node",
      "args": ["/path/to/your/project/pct-mcp-server/dist/index.js"],
      "env": {}
    }
  }
}
```

### Linux

1. Open Claude Desktop
2. Navigate to Settings > Developer > Edit Config
3. This will open `~/.config/Claude Desktop/` directory
4. Create or edit `claude_desktop_config.json` with the following content:

```json
{
  "mcpServers": {
    "personal-context-server": {
      "command": "node",
      "args": ["/path/to/your/project/pct-mcp-server/dist/index.js"],
      "env": {}
    }
  }
}
```

## Using the Personal Context Server

### With Claude Desktop

1. Start your PCT MCP server using `npm start`
2. Restart Claude Desktop (if needed)
3. In Claude, click the MCP tool icon (wrench/tool icon) in the input field
4. You'll see "personal-context-server" with available tools and resources:
   - **Resources**: Access your context data (full context or by section)
   - **Tools**: Update specific fields in your context

### Accessing Context Data

Claude can access your personal context data in two ways:

1. **Full Context**: Select "All Sections" to give Claude access to your entire personal context
2. **Section-based**: Select specific sections (basic_info, preferences, etc.) to share only certain parts of your context

Example prompt: "Using my context data, recommend some learning resources that would match my learning style."

### Updating Context Data

You can update your personal context using the updateContext tool:

Example prompt: "Update my learning_style in preferences to 'visual and hands-on' because I've found I learn better with practical examples."

## Customizing Your Context

The default personal context includes:

- **basic_info**: Name, location, etc.
- **preferences**: Communication style, learning preferences, etc.
- **instruction**: Rules for how AI should use and update your context
- **metadata**: Version tracking, update history

You can modify the default structure by editing the `DEFAULT_CONTEXT` object in `src/storage/contextStorage.ts`.
Or just replace update file data [PATH_TO_YOUR_PROJECT/pct-mcp-server/data/personal_context.json] from template data in repo (https://github.com/mikhashev/personal-context-manager/blob/main/use-cases/self-education/personal_context_self_education_template.json) or another one.

## Project Structure

```
pct-mcp-server/
├── .git/                      # Git repository data
├── .gitignore                 # Git ignore rules
├── LICENSE                    # License file
├── README.md                  # Project documentation
├── package-lock.json          # Lock file for npm dependencies 
├── package.json               # Project configuration and dependencies
├── tsconfig.json              # TypeScript configuration
└── src/                       # Source code
    ├── index.ts               # Main application entry point
    ├── resources/             # MCP resources implementation
    │   └── personalContext.ts # Personal context resource
    ├── storage/               # Storage implementation
    │   └── contextStorage.ts  # Context storage functionality
    ├── tools/                 # MCP tools implementation
    │   ├── contextSuggestion.ts  # Context suggestion tool
    │   └── updateContext.ts   # Update context tool
    └── utils/                 # Utility functions
        └── instructionHandler.ts  # Instruction handling logic

# Generated directories (not in repository)
# ----------------------------------------
# dist/                        # Compiled JavaScript files (gitignored)
# node_modules/                # Dependencies (gitignored)
# data/                        # User data (gitignored or contains only samples)
#   └── personal_context.json  # Personal context data (sample only) (don't change filename personal_context.json, update data if need)
```

## Advanced Configuration

### Using HTTP Transport

The default implementation uses stdio transport for development. For production use, you can switch to HTTP transport:

1. Edit `src/index.ts`
2. Uncomment the HTTP transport section
3. Configure your desired port and CORS settings
4. Rebuild and restart the server

! I reccomend use stdio transport for development locally on your machine always.

### Multi-User Support

To support multiple users, modify the `contextStorage.js` file to store contexts in user-specific files based on user IDs.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is released under the MIT License - See [LICENSE](LICENSE) that covers the project.

## Acknowledgments

This project is based on the Personal Context Technology concept and implements the Model Context Protocol (MCP) developed by Anthropic to enable AI systems to access external context.