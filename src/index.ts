#!/usr/bin/env bun
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import type {
  PromptMessage,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import * as fs from "fs/promises";
import * as path from "path";
import { existsSync } from "fs";
import * as os from "os";

// Vault template definitions
const VAULT_TEMPLATES: Record<string, any> = {
  minimal: {
    name: "Minimal Starter",
    description: "Clean start with basic folder structure",
    folders: ["notes", "daily", "attachments"],
    features: ["Simple daily notes", "Basic folder organization"],
  },
  para: {
    name: "PARA Method",
    description: "Projects, Areas, Resources, Archive - for productivity",
    folders: ["1-Projects", "2-Areas", "3-Resources", "4-Archive", "daily-notes", "templates", "attachments"],
    features: ["PARA organization", "Project tracking", "Daily notes", "Weekly reviews"],
  },
  pkm: {
    name: "Personal Knowledge Management",
    description: "Learning-focused with MOCs and progressive summarization",
    folders: ["MOCs", "Sources", "Ideas", "Projects", "daily-notes", "templates", "attachments"],
    features: ["Maps of Content", "Progressive summarization", "Daily notes", "Idea development"],
  },
  zettelkasten: {
    name: "Zettelkasten",
    description: "Atomic notes with unique IDs for academic research",
    folders: ["fleeting", "literature", "permanent", "index", "attachments"],
    features: ["Unique note IDs", "Atomic notes", "Strict linking", "Emergence patterns"],
  },
};

// Initialize MCP server
const server = new Server(
  {
    name: "obsidian-vault-bootstrap",
    version: "1.0.0",
  },
  {
    capabilities: {
      prompts: {},
      tools: {},
    },
  }
);


const createVaultTool: Tool = {
  name: "create_vault",
  description: "Create a new Obsidian vault with selected template",
  inputSchema: {
    type: "object",
    properties: {
      path: {
        type: "string",
        description: "Path where the vault should be created (optional, defaults to ~/Documents/Obsidian)",
      },
      template: {
        type: "string",
        enum: Object.keys(VAULT_TEMPLATES),
        description: "Template type to use",
      },
      name: {
        type: "string",
        description: "Name of the vault",
      },
    },
    required: ["template", "name"],
  },
};

// Tool: List templates
const listTemplatesTool: Tool = {
  name: "list_templates",
  description: "List all available vault templates",
  inputSchema: {
    type: "object",
    properties: {},
  },
};

// Register tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [createVaultTool, listTemplatesTool],
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  switch (name) {
    case "create_vault": {
      const { path: vaultPath, template, name: vaultName } = args as any;
      
      // Expand and validate the path
      let expandedPath = vaultPath;
      
      // If no path provided, use default
      if (!expandedPath || expandedPath === '') {
        expandedPath = path.join(os.homedir(), 'Documents', 'Obsidian');
      }
      
      // Handle common path shortcuts
      if (expandedPath.startsWith('~')) {
        expandedPath = expandedPath.replace(/^~/, os.homedir());
      }
      
      // Handle relative paths like "Documents" or "Desktop"
      if (!expandedPath.startsWith('/') && !expandedPath.startsWith('C:') && !expandedPath.includes(':')) {
        // It's a relative path, prepend home directory
        expandedPath = path.join(os.homedir(), expandedPath);
      }
      
      // If path starts with /Users/Documents without username, add current user
      if (expandedPath === '/Users/Documents' || expandedPath.startsWith('/Users/Documents/')) {
        const homeDir = os.homedir();
        expandedPath = expandedPath.replace('/Users/Documents', `${homeDir}/Documents`);
      }
      
      // Default to Documents folder if path is invalid
      if (expandedPath === '/Users' || expandedPath === '/' || expandedPath === 'C:\\') {
        expandedPath = path.join(os.homedir(), 'Documents', 'Obsidian');
      }
      
      // Ensure parent directory exists
      try {
        await fs.mkdir(expandedPath, { recursive: true });
      } catch (error) {
        console.error(`Failed to create parent directory: ${expandedPath}`);
      }
      
      const fullPath = path.join(expandedPath, vaultName);
      
      // Check if directory already exists
      if (existsSync(fullPath)) {
        return {
          content: [
            {
              type: "text",
              text: `Error: Directory ${fullPath} already exists`,
            },
          ],
        };
      }
      
      try {
        // Get template config
        const templateConfig = VAULT_TEMPLATES[template as keyof typeof VAULT_TEMPLATES];
        if (!templateConfig) {
          return {
            content: [
              {
                type: "text",
                text: `Error: Unknown template "${template}"`,
              },
            ],
          };
        }

        // Create vault directory
        await fs.mkdir(fullPath, { recursive: true });

        // Create folder structure
        for (const folder of templateConfig.folders) {
          await fs.mkdir(path.join(fullPath, folder), { recursive: true });
        }

        // Create basic .obsidian folder
        await fs.mkdir(path.join(fullPath, '.obsidian'), { recursive: true });
        
        return {
          content: [
            {
              type: "text",
              text: `✅ **Vault Created Successfully!**

📁 **Location:** ${fullPath}
🎨 **Template:** ${templateConfig.name}

## What I've Set Up For You:

### 📂 Folder Structure
${templateConfig.folders.map((f: string) => `- ${f}/`).join('\n')}

## 🚀 Quick Start Guide

### Step 1: Open Your Vault
1. Open Obsidian
2. Click "Open folder as vault"
3. Select: ${fullPath}

### Step 2: Enable Community Plugins
1. When prompted about restricted mode, click "Turn off restricted mode"
2. Plugins will auto-download and install
3. You may need to reload Obsidian once for all plugins to activate

### Step 3: Your Daily Workflow
${template === 'pkm' ? 
`1. **Morning**: Create daily note (Cmd+Shift+D)
2. **During day**: Quick capture ideas (Cmd+Q)
3. **Reading**: Highlights sync via Readwise
4. **Evening**: Process inbox, create permanent notes
5. **Weekly**: Review and organize` :
template === 'research' ?
`1. **New source**: Create literature note
2. **While reading**: Highlight in Readwise
3. **After reading**: Process into permanent notes
4. **Writing**: Link notes in your drafts
5. **Weekly**: Update bibliography` :
`1. Start with daily note
2. Capture ideas as they come
3. Review and organize weekly`}

### Step 4: First Actions
- [ ] Create your first daily note
- [ ] Set up Readwise integration
- [ ] Explore the templates folder
- [ ] Customize your first template
- [ ] Create a test note with Cmd+T

## 💡 Pro Tips
- Start simple, add complexity over time
- Use templates for everything repetitive
- Let Readwise handle your reading highlights
- Review and refactor regularly

Your vault is ready! Open it in Obsidian to start building your knowledge system. 🎉`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error creating vault: ${error}`,
            },
          ],
        };
      }
    }
    
    case "list_templates": {
      const templateList = Object.entries(VAULT_TEMPLATES)
        .map(([key, template]) => {
          return `**${template.name}** (${key})\n${template.description}\nFeatures: ${template.features.join(", ")}`;
        })
        .join("\n\n");

      return {
        content: [
          {
            type: "text",
            text: `Available Vault Templates:\n\n${templateList}`,
          },
        ],
      };
    }

    default:
      return {
        content: [
          {
            type: "text",
            text: `Unknown tool: ${name}`,
          },
        ],
      };
  }
});

// Register prompts
server.setRequestHandler(ListPromptsRequestSchema, async () => ({
  prompts: [
    {
      name: "bootstrap_vault",
      description: "Interactive Obsidian vault creation wizard",
      arguments: [
        {
          name: "location",
          description: "Where to create the vault (optional)",
          required: false,
        },
      ],
    },
  ],
}));

// Handle prompt requests
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "bootstrap_vault") {
    // Get the actual user's Documents path
    const defaultLocation = path.join(os.homedir(), 'Documents', 'Obsidian');
    const location = args?.location || defaultLocation;

    const messages: PromptMessage[] = [
      {
        role: "assistant",
        content: {
          type: "text",
          text: `# 🎯 Obsidian Vault Bootstrap & Migration Assistant

I'll help you create a new Obsidian vault or migrate an existing configuration.

## Option 1: Fresh Start with Templates 📚

**Quick Presets:**
- **minimal** - Clean start with basic folders
- **para** - Projects, Areas, Resources, Archive method
- **pkm** - Personal Knowledge Management with MOCs
- **zettelkasten** - Academic note-taking with atomic notes

**Example:** "Create a PKM vault called Second-Brain"

## Option 2: Migrate from GitHub Repo 🔄

**Share a GitHub URL with a .obsidian folder and I'll:**
1. Clone and analyze the configuration
2. Explain the key hotkeys and workflows
3. Guide you through recreating the setup
4. Help you understand the system

**Example:** "Help me migrate from https://github.com/kepano/obsidian-minimal"

---

## For AI Agent: Migration Instructions

When user provides a GitHub URL:

### 1. Clone and Analyze
\`\`\`bash
# Clone the repo to temp directory
git clone --depth 1 [REPO_URL] /tmp/obsidian-analysis

# Check for .obsidian folder
ls -la /tmp/obsidian-analysis/.obsidian/

# List plugins
ls /tmp/obsidian-analysis/.obsidian/plugins/

# Check key config files
cat /tmp/obsidian-analysis/.obsidian/app.json
cat /tmp/obsidian-analysis/.obsidian/hotkeys.json
cat /tmp/obsidian-analysis/.obsidian/community-plugins.json
\`\`\`

### 2. Create New Vault
\`\`\`bash
# Use create_vault tool for base structure
# Then manually copy configs

# Copy .obsidian folder (excluding plugins data)
cp -r /tmp/obsidian-analysis/.obsidian [NEW_VAULT_PATH]/
rm -rf [NEW_VAULT_PATH]/.obsidian/plugins/*/

# Just keep plugin manifests
find /tmp/obsidian-analysis/.obsidian/plugins -name "manifest.json" -exec sh -c 'mkdir -p [NEW_VAULT_PATH]/.obsidian/plugins/$(basename $(dirname {})) && cp {} [NEW_VAULT_PATH]/.obsidian/plugins/$(basename $(dirname {}))/' \\;
\`\`\`

### 3. Explain Key Features
- Parse hotkeys.json and explain important shortcuts
- List community plugins and their purposes
- Identify workflow patterns (daily notes, zettelkasten, etc.)
- Note any custom CSS or themes

### 4. Guide Setup
- List plugins to install from Obsidian Community Plugins
- Explain folder structure and organization system
- Highlight important settings to configure
- Suggest starting points for the user

### For Fresh Vaults with Templates:

When creating from scratch:
1. Use create_vault tool to make directories
2. Create basic config files if needed:

\`\`\`bash
# Create basic app.json
cat > [VAULT_PATH]/.obsidian/app.json << 'EOF'
{
  "attachmentFolderPath": "attachments",
  "alwaysUpdateLinks": true,
  "showLineNumber": true,
  "defaultViewMode": "source"
}
EOF

# Create core-plugins.json (enable useful defaults)
cat > [VAULT_PATH]/.obsidian/core-plugins.json << 'EOF'
{
  "file-explorer": true,
  "global-search": true,
  "switcher": true,
  "graph": true,
  "backlink": true,
  "canvas": true,
  "outgoing-link": true,
  "tag-pane": true,
  "properties": true,
  "page-preview": true,
  "daily-notes": true,
  "templates": true,
  "note-composer": true,
  "command-palette": true,
  "outline": true,
  "word-count": true,
  "file-recovery": true
}
EOF

# For specific templates, suggest plugins:
# PARA: templater, tasks, kanban
# PKM: templater, dataview, quickadd
# Zettelkasten: templater, unique-note-id
\`\`\`

Remember: Keep it simple! The user will configure details in Obsidian.`,
        },
      },
    ];
    
    return { messages };
  }
  
  return { messages: [] };
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Obsidian Vault Bootstrap MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});