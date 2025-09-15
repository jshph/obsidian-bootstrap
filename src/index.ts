#!/usr/bin/env bun
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import type {
  PromptMessage,
} from "@modelcontextprotocol/sdk/types.js";
import * as path from "path";
import * as os from "os";

// Vault templates are described in the prompt; no tool handlers required.

// Initialize MCP server
const server = new Server(
  {
    name: "obsidian-vault-bootstrap",
    version: "1.0.0",
  },
  {
    capabilities: {
      prompts: {},
    },
  }
);

// No tools needed - everything is handled through the prompt!
// The AI agent will use bash commands directly to create vaults.

// We used to have tools here, but removed them for simplicity.
// Everything is now done through the bootstrap_vault prompt.

// (Removed legacy tool handlers; prompts-only server.)

// Register prompts
server.setRequestHandler(ListPromptsRequestSchema, async () => ({
  prompts: [
    {
      name: "bootstrap_vault",
      description: "Interactive Obsidian vault creation wizard",
      arguments: [
        {
          name: "location",
          description: "Where to create the vault (optional, defaults to ~/Documents/Obsidian)",
          required: false,
        },
        {
          name: "github_repo",
          description: "GitHub repo URL with .obsidian config to migrate from (optional, defaults to https://github.com/jshph/.obsidian)",
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
    const defaultGithubRepo = 'https://github.com/jshph/.obsidian';
    const githubRepo = args?.github_repo || defaultGithubRepo;

    // Build the message content based on whether custom repo is provided
    let messageContent;

    if (args?.github_repo) {
      // Custom repo provided - just migration instructions
      messageContent = `# 🎯 Obsidian Vault Migration Assistant

I'll help you migrate your Obsidian configuration from: **${githubRepo}**

Target location: **${location}**

I'll now clone and analyze the repository to set up your new vault with the same configuration.

---

## For AI Agent: Migration Instructions

Migrate from ${githubRepo} to ${location}:

### 1. Clone and Analyze
\`\`\`bash
# Clone the repo to a local temp directory (in current working directory)
git clone --depth 1 ${githubRepo} ./temp-obsidian-analysis

# Check for OBSIDIAN.md to understand vault structure
if [ -f "./temp-obsidian-analysis/OBSIDIAN.md" ]; then
    cat ./temp-obsidian-analysis/OBSIDIAN.md
fi

# Check for .obsidian folder
ls -la ./temp-obsidian-analysis/.obsidian/

# List plugins
ls ./temp-obsidian-analysis/.obsidian/plugins/

# Check key config files
cat ./temp-obsidian-analysis/.obsidian/app.json
cat ./temp-obsidian-analysis/.obsidian/hotkeys.json
cat ./temp-obsidian-analysis/.obsidian/community-plugins.json
\`\`\`

### 2. Create New Vault

**IMPORTANT: FIRST check if the vault already exists before doing anything:**

\`\`\`bash
# ⚠️ CRITICAL: Check if vault directory already exists FIRST
if [ -d "${location}/[VAULT_NAME]" ]; then
    echo "⚠️ STOP! Vault directory already exists at ${location}/[VAULT_NAME]"
    echo "It contains:"
    ls -la ${location}/[VAULT_NAME]/

    # Check for existing .obsidian folder
    if [ -d "${location}/[VAULT_NAME]/.obsidian" ]; then
        echo "🔍 Found existing .obsidian configuration"
        echo "ASK USER before proceeding:"
        echo "1. Merge configs (keep existing, add new plugins)"
        echo "2. Replace configs (backup existing, use new)"
        echo "3. Skip config migration (only copy templates/folders)"
        echo "4. Cancel - do nothing"
        # STOP HERE and wait for user decision
        # DO NOT proceed without user confirmation
    fi
    # DO NOT automatically copy anything to existing vaults!
else
    # Fresh vault - safe to create everything
    echo "Creating new vault at ${location}/[VAULT_NAME]"
    mkdir -p ${location}/[VAULT_NAME]

    # Create folder structure based on OBSIDIAN.md guidance (if found)
    # Common folders from vault templates:
    mkdir -p ${location}/[VAULT_NAME]/{inbox,projects,areas,resources,archive,templates,attachments}

    # Copy entire .obsidian folder with all configurations, plugins, themes, etc.
    echo "📁 Copying complete .obsidian configuration (plugins, themes, settings)..."
    cp -r ./temp-obsidian-analysis/.obsidian ${location}/[VAULT_NAME]/

    # Copy templates folder to vault root if it exists (separate from .obsidian)
    if [ -d "./temp-obsidian-analysis/templates" ]; then
        echo "📄 Copying templates folder..."
        cp -r ./temp-obsidian-analysis/templates ${location}/[VAULT_NAME]/
    fi

    # Copy any other essential folders mentioned in OBSIDIAN.md (but NOT documentation files)
    # Example: inbox, daily-notes, etc. if they exist and contain templates/examples

    # Remove workspace files (they contain user-specific session state)
    rm -f ${location}/[VAULT_NAME]/.obsidian/workspace.json
    rm -f ${location}/[VAULT_NAME]/.obsidian/workspace-mobile.json
    rm -f ${location}/[VAULT_NAME]/.obsidian/workspaces.json

    # Verify what was actually copied
    echo ""
    echo "✅ Vault created successfully at ${location}/[VAULT_NAME]"
    echo ""
    echo "📊 Configuration Summary:"

    # Count plugins
    if [ -d "${location}/[VAULT_NAME]/.obsidian/plugins" ]; then
        PLUGIN_COUNT=$(ls -1 ${location}/[VAULT_NAME]/.obsidian/plugins 2>/dev/null | wc -l)
        echo "  • Plugins installed: $PLUGIN_COUNT"
        ls ${location}/[VAULT_NAME]/.obsidian/plugins/ | head -5 | sed 's/^/    - /'
        if [ $PLUGIN_COUNT -gt 5 ]; then
            echo "    ... and $((PLUGIN_COUNT - 5)) more"
        fi
    fi

    # Count themes
    if [ -d "${location}/[VAULT_NAME]/.obsidian/themes" ]; then
        THEME_COUNT=$(ls -1 ${location}/[VAULT_NAME]/.obsidian/themes 2>/dev/null | wc -l)
        if [ $THEME_COUNT -gt 0 ]; then
            echo "  • Themes available: $THEME_COUNT"
        fi
    fi

    # Check for templates
    if [ -d "${location}/[VAULT_NAME]/templates" ]; then
        TEMPLATE_COUNT=$(find ${location}/[VAULT_NAME]/templates -name "*.md" 2>/dev/null | wc -l)
        if [ $TEMPLATE_COUNT -gt 0 ]; then
            echo "  • Templates available: $TEMPLATE_COUNT"
        fi
    fi

    # List created folders
    echo "  • Folders created:"
    ls -d ${location}/[VAULT_NAME]/*/ 2>/dev/null | grep -v ".obsidian" | head -5 | xargs -n1 basename | sed 's/^/    - /'
fi

# Create a Getting Started guide for the user
cat > ${location}/[VAULT_NAME]/Getting-Started.md << 'EOF'
# Getting Started with Your Migrated Vault

This vault was migrated from: ${githubRepo}

## Folder Structure
- **inbox/** - Quick capture for new notes
- **projects/** - Active projects
- **areas/** - Ongoing responsibilities
- **resources/** - Reference materials
- **archive/** - Completed/inactive items
- **templates/** - Note templates
- **attachments/** - Images and files

## Key Hotkeys
Check Settings > Hotkeys for all configured shortcuts. Common ones:
- Cmd/Ctrl + P: Command palette
- Cmd/Ctrl + O: Quick switcher
- Cmd/Ctrl + N: New note

## Installed Plugins
View Settings > Community Plugins to see what's installed.
You may need to enable plugins and configure API keys.

## Next Steps
1. Review Settings > Options for vault preferences
2. Check Templates folder for available templates
3. Configure Daily Notes if using that workflow
4. Set up any plugin-specific settings

Happy note-taking! 🚀
EOF

# Clean up the temporary directory when done
rm -rf ./temp-obsidian-analysis
\`\`\``;
    } else {
      // No custom repo - show options including default
      messageContent = `# 🎯 Obsidian Vault Bootstrap & Migration Assistant

I'll help you create a new Obsidian vault with a proven configuration.

## Option 1: Use Default Configuration 🎯

**Default config:** ${defaultGithubRepo}
**Target location:** ${location}

Say: **"Create my vault with the default config"** or **"Create a vault called MyVault"**

This will set up your vault with a well-tested configuration including:
- Quick capture inbox workflow
- Daily notes with templates
- Task management
- Essential plugins pre-configured

## Option 2: Fresh Start with Templates 📚

**Quick Presets:**

**minimal** - Clean start with basic folders
- Folders: notes, daily, attachments
- Features: Simple daily notes, Basic folder organization

**para** - Projects, Areas, Resources, Archive method
- Folders: 1-Projects, 2-Areas, 3-Resources, 4-Archive, daily-notes, templates, attachments
- Features: PARA organization, Project tracking, Daily notes, Weekly reviews

**pkm** - Personal Knowledge Management with MOCs
- Folders: MOCs, Sources, Ideas, Projects, daily-notes, templates, attachments
- Features: Maps of Content, Progressive summarization, Daily notes, Idea development

**zettelkasten** - Academic note-taking with atomic notes
- Folders: fleeting, literature, permanent, index, attachments
- Features: Unique note IDs, Atomic notes, Strict linking, Emergence patterns

**Example:** "Create a PKM vault called Second-Brain"

## Option 3: Migrate from Your GitHub Repo 🔄

**Provide your own GitHub URL with a .obsidian folder and I'll:**
1. Clone and analyze the configuration
2. Explain the key hotkeys and workflows
3. Guide you through recreating the setup
4. Help you understand the system

**Example:** "Help me migrate from https://github.com/kepano/obsidian-minimal"

---

## For AI Agent: Instructions

When user wants to use default config or doesn't specify:
- Use ${defaultGithubRepo} as the source
- Follow migration instructions below

When user provides a GitHub URL:
- Use the provided URL as the source
- Follow migration instructions below

### 1. Clone and Analyze
\`\`\`bash
# Clone the repo to a local temp directory (in current working directory)
git clone --depth 1 [REPO_URL] ./temp-obsidian-analysis

# Check for OBSIDIAN.md to understand vault structure
if [ -f "./temp-obsidian-analysis/OBSIDIAN.md" ]; then
    cat ./temp-obsidian-analysis/OBSIDIAN.md
fi

# Check for .obsidian folder
ls -la ./temp-obsidian-analysis/.obsidian/

# List plugins
ls ./temp-obsidian-analysis/.obsidian/plugins/

# Check key config files
cat ./temp-obsidian-analysis/.obsidian/app.json
cat ./temp-obsidian-analysis/.obsidian/hotkeys.json
cat ./temp-obsidian-analysis/.obsidian/community-plugins.json
\`\`\`

### 2. Create New Vault

**IMPORTANT: FIRST check if the vault already exists before doing anything:**

\`\`\`bash
# ⚠️ CRITICAL: Check if vault directory already exists FIRST
if [ -d "[NEW_VAULT_PATH]" ]; then
    echo "⚠️ STOP! Vault directory already exists at [NEW_VAULT_PATH]"
    echo "It contains:"
    ls -la [NEW_VAULT_PATH]/

    # Check for existing .obsidian folder
    if [ -d "[NEW_VAULT_PATH]/.obsidian" ]; then
        echo "🔍 Found existing .obsidian configuration"
        echo "ASK USER before proceeding:"
        echo "1. Merge configs (keep existing, add new plugins)"
        echo "2. Replace configs (backup existing, use new)"
        echo "3. Skip config migration (only copy templates/folders)"
        echo "4. Cancel - do nothing"
        # STOP HERE and wait for user decision
        # DO NOT proceed without user confirmation
    fi
    # DO NOT automatically copy anything to existing vaults!
else
    # Fresh vault - safe to create everything
    echo "Creating new vault at [NEW_VAULT_PATH]"
    mkdir -p [NEW_VAULT_PATH]

    # Create folder structure based on OBSIDIAN.md guidance (if found)
    # Common folders from vault templates:
    mkdir -p [NEW_VAULT_PATH]/{inbox,projects,areas,resources,archive,templates,attachments}

    # Copy entire .obsidian folder with all configurations, plugins, themes, etc.
    echo "📁 Copying complete .obsidian configuration (plugins, themes, settings)..."
    cp -r ./temp-obsidian-analysis/.obsidian [NEW_VAULT_PATH]/

    # Copy templates folder to vault root if it exists (separate from .obsidian)
    if [ -d "./temp-obsidian-analysis/templates" ]; then
        echo "📄 Copying templates folder..."
        cp -r ./temp-obsidian-analysis/templates [NEW_VAULT_PATH]/
    fi

    # Copy any other essential folders mentioned in OBSIDIAN.md (but NOT documentation files)
    # Example: inbox, daily-notes, etc. if they exist and contain templates/examples

    # Remove workspace files (they contain user-specific session state)
    rm -f [NEW_VAULT_PATH]/.obsidian/workspace.json
    rm -f [NEW_VAULT_PATH]/.obsidian/workspace-mobile.json
    rm -f [NEW_VAULT_PATH]/.obsidian/workspaces.json

    # Verify what was actually copied
    echo ""
    echo "✅ Vault created successfully at [NEW_VAULT_PATH]"
    echo ""
    echo "📊 Configuration Summary:"

    # Count plugins
    if [ -d "[NEW_VAULT_PATH]/.obsidian/plugins" ]; then
        PLUGIN_COUNT=$(ls -1 [NEW_VAULT_PATH]/.obsidian/plugins 2>/dev/null | wc -l)
        echo "  • Plugins installed: $PLUGIN_COUNT"
        ls [NEW_VAULT_PATH]/.obsidian/plugins/ | head -5 | sed 's/^/    - /'
        if [ $PLUGIN_COUNT -gt 5 ]; then
            echo "    ... and $((PLUGIN_COUNT - 5)) more"
        fi
    fi

    # Count themes
    if [ -d "[NEW_VAULT_PATH]/.obsidian/themes" ]; then
        THEME_COUNT=$(ls -1 [NEW_VAULT_PATH]/.obsidian/themes 2>/dev/null | wc -l)
        if [ $THEME_COUNT -gt 0 ]; then
            echo "  • Themes available: $THEME_COUNT"
        fi
    fi

    # Check for templates
    if [ -d "[NEW_VAULT_PATH]/templates" ]; then
        TEMPLATE_COUNT=$(find [NEW_VAULT_PATH]/templates -name "*.md" 2>/dev/null | wc -l)
        if [ $TEMPLATE_COUNT -gt 0 ]; then
            echo "  • Templates available: $TEMPLATE_COUNT"
        fi
    fi

    # List created folders
    echo "  • Folders created:"
    ls -d [NEW_VAULT_PATH]/*/ 2>/dev/null | grep -v ".obsidian" | head -5 | xargs -n1 basename | sed 's/^/    - /'
fi

# Create a Getting Started guide for the user
cat > [NEW_VAULT_PATH]/Getting-Started.md << 'EOF'
# Getting Started with Your Migrated Vault

This vault was migrated from a GitHub repository. Here's what you need to know:

## Folder Structure
- **inbox/** - Quick capture for new notes
- **projects/** - Active projects
- **areas/** - Ongoing responsibilities
- **resources/** - Reference materials
- **archive/** - Completed/inactive items
- **templates/** - Note templates
- **attachments/** - Images and files

## Key Hotkeys
Check Settings > Hotkeys for all configured shortcuts. Common ones:
- Cmd/Ctrl + P: Command palette
- Cmd/Ctrl + O: Quick switcher
- Cmd/Ctrl + N: New note

## Installed Plugins
View Settings > Community Plugins to see what's installed.
You may need to enable plugins and configure API keys.

## Next Steps
1. Review Settings > Options for vault preferences
2. Check Templates folder for available templates
3. Configure Daily Notes if using that workflow
4. Set up any plugin-specific settings

Happy note-taking! 🚀
EOF

# Clean up the temporary directory when done
rm -rf ./temp-obsidian-analysis
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

When user asks to create a vault (e.g., "Create a PKM vault called Second-Brain"):

1. Create the vault directory and folders:

\`\`\`bash
# Set vault path (default: ~/Documents/Obsidian/VaultName)
VAULT_PATH=~/Documents/Obsidian/Second-Brain

# Create vault and .obsidian directory
mkdir -p "$VAULT_PATH/.obsidian"

# For PKM template, create these folders:
mkdir -p "$VAULT_PATH"/{MOCs,Sources,Ideas,Projects,daily-notes,templates,attachments}

# For PARA template:
# mkdir -p "$VAULT_PATH"/{1-Projects,2-Areas,3-Resources,4-Archive,daily-notes,templates,attachments}

# For Zettelkasten:
# mkdir -p "$VAULT_PATH"/{fleeting,literature,permanent,index,attachments}

# For Minimal:
# mkdir -p "$VAULT_PATH"/{notes,daily,attachments}
\`\`\`

2. Create basic config files:

\`\`\`bash
# Create basic app.json
cat > "$VAULT_PATH/.obsidian/app.json" << 'EOF'
{
  "attachmentFolderPath": "attachments",
  "alwaysUpdateLinks": true,
  "showLineNumber": true,
  "defaultViewMode": "source"
}
EOF

# Create core-plugins.json (enable useful defaults)
cat > "$VAULT_PATH/.obsidian/core-plugins.json" << 'EOF'
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

Remember: Keep it simple! The user will configure details in Obsidian.`;
    }

    const messages: PromptMessage[] = [
      {
        role: "assistant",
        content: {
          type: "text",
          text: messageContent,
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