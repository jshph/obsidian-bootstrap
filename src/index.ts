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

I'll now clone and analyze the repository to understand its workflow philosophy and set up your new vault.

---

## For AI Agent: Migration Instructions

Migrate from ${githubRepo} to ${location}:

### 1. Clone and Analyze
\`\`\`bash
# Clone the repo to a local temp directory (in current working directory)
git clone --depth 1 ${githubRepo} ./temp-obsidian-analysis

# Check for OBSIDIAN.md to understand vault structure and philosophy
if [ -f "./temp-obsidian-analysis/OBSIDIAN.md" ]; then
    echo "📋 Found OBSIDIAN.md - analyzing vault philosophy and structure..."
    cat ./temp-obsidian-analysis/OBSIDIAN.md
    echo ""
    echo "🔍 OBSIDIAN.md found - agent should read this to understand vault philosophy"
    echo ""
    echo "🎯 Agent Instructions:"
    echo "- Read OBSIDIAN.md completely to understand the knowledge management approach"
    echo "- Analyze tag patterns in markdown files to identify conceptual vocabulary"
    echo "- Examine link usage to understand knowledge connection patterns"
    echo "- Review plugin configurations to understand workflow automation"
    echo "- Create personalized Getting Started guide based on discovered patterns"
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
# IMPORTANT: Agent must replace this template with content extracted from OBSIDIAN.md
# DO NOT use this generic template - analyze the vault and create personalized content
cat > ${location}/[VAULT_NAME]/Getting-Started.md << 'EOF'
# Getting Started with Your Vault

This vault was migrated from: ${githubRepo}

## Workflow Philosophy

[AGENT: Extract and present the workflow philosophy from OBSIDIAN.md here. Use the actual language and principles from the documentation. Include key workflow patterns, tool usage, and organizational approach.]

## Your Configuration

[AGENT: List the specific plugins, folders, and features discovered in this vault. Explain their purpose based on OBSIDIAN.md or inferred from configuration.]

## Next Steps

[AGENT: Provide specific next steps based on the discovered workflow. Reference actual hotkeys, templates, and workflows from the migrated configuration.]

---

[AGENT: If OBSIDIAN.md references external documentation or blog posts, link them here.]

Happy thinking! 🧠✨
EOF

# Clean up the temporary directory when done
rm -rf ./temp-obsidian-analysis
\`\`\``;
    } else {
      // No custom repo - use default
      messageContent = `# 🎯 Obsidian Vault Bootstrap Assistant

I'll help you create a new Obsidian vault based on a proven configuration.

**Default config:** ${defaultGithubRepo}
**Target location:** ${location}

I'll clone and analyze the configuration to understand its workflow philosophy, then set up your vault.

---

**To get started, say:** "Create a vault called [VaultName]"

**To migrate from your own GitHub repo:** "Migrate from https://github.com/username/repo"

---

## For AI Agent: Instructions

When user wants to create a vault (doesn't provide github_repo):
- Use ${defaultGithubRepo} as the source
- Follow migration instructions below

When user provides a GitHub URL:
- Use the provided URL as the source
- Follow migration instructions below

### 1. Clone and Analyze
\`\`\`bash
# Clone the repo to a local temp directory (in current working directory)
git clone --depth 1 [REPO_URL] ./temp-obsidian-analysis

# Check for OBSIDIAN.md to understand vault structure and philosophy
if [ -f "./temp-obsidian-analysis/OBSIDIAN.md" ]; then
    echo "📋 Found OBSIDIAN.md - analyzing vault philosophy and structure..."
    cat ./temp-obsidian-analysis/OBSIDIAN.md
    echo ""
    echo "🔍 OBSIDIAN.md found - agent should read this to understand vault philosophy"
    echo ""
    echo "🎯 Agent Instructions:"
    echo "- Read OBSIDIAN.md completely to understand the knowledge management approach"
    echo "- Analyze tag patterns in markdown files to identify conceptual vocabulary"
    echo "- Examine link usage to understand knowledge connection patterns"
    echo "- Review plugin configurations to understand workflow automation"
    echo "- Create personalized Getting Started guide based on discovered patterns"
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
# IMPORTANT: Agent must replace this template with content extracted from OBSIDIAN.md
# DO NOT use this generic template - analyze the vault and create personalized content
cat > [NEW_VAULT_PATH]/Getting-Started.md << 'EOF'
# Getting Started with Your Vault

This vault was migrated from a GitHub repository.

## Workflow Philosophy

[AGENT: Extract and present the workflow philosophy from OBSIDIAN.md here. Use the actual language and principles from the documentation. Include key workflow patterns, tool usage, and organizational approach.]

## Your Configuration

[AGENT: List the specific plugins, folders, and features discovered in this vault. Explain their purpose based on OBSIDIAN.md or inferred from configuration.]

## Next Steps

[AGENT: Provide specific next steps based on the discovered workflow. Reference actual hotkeys, templates, and workflows from the migrated configuration.]

---

[AGENT: If OBSIDIAN.md references external documentation or blog posts, link them here.]

Happy thinking! 🧠✨
EOF

# Clean up the temporary directory when done
rm -rf ./temp-obsidian-analysis
\`\`\`

### 3. Agent Instructions for Understanding and Onboarding

**CRITICAL**: After completing the technical migration steps above, you must analyze and articulate the vault's philosophy:

1. **Read OBSIDIAN.md First**:
   - Look in ./temp-obsidian-analysis/OBSIDIAN.md
   - If found: Extract the complete workflow philosophy, principles, and approach
   - If not found: Analyze vault structure, plugins, templates to infer organizational patterns

2. **Extract Key Philosophy Elements**:
   - **Workflow approach**: How does this vault handle capture, organization, synthesis?
   - **Tool usage**: What plugins are essential and why? (QuickAdd, Readwise, Templater, etc.)
   - **Folder philosophy**: What do folders represent? (stages, types, areas?)
   - **Tag/link strategy**: How are connections made? Aspirational tags? Wiki links?
   - **Friction reduction**: What automation exists? What decisions are eliminated?

3. **Present the Philosophy to User**:
   - After vault setup, explain the discovered approach in 3-5 bullet points
   - Use the actual language/terminology from OBSIDIAN.md
   - Quote key principles if they exist
   - Link to any external documentation (blog posts, articles)
   - Don't invent philosophy - present what you found

4. **Create Personalized Getting Started Guide**:
   - Replace the template with content based on discovered OBSIDIAN.md philosophy
   - Use discovered vocabulary and principles
   - Explain the specific workflow this vault enables
   - Show how plugins support the stated approach
   - Reference the folder structure purpose
   - Keep it concise - trust they'll explore

5. **For Missing OBSIDIAN.md**:
   - Analyze plugin configurations to infer purpose
   - Note folder structure patterns
   - Identify templates and their workflows
   - Present findings neutrally: "This vault appears to use..."
   - Suggest they document their approach

**Goal**: Be a neutral analyst that extracts and presents the vault's existing philosophy, not an opinionated system that imposes one.

### 4. Guide Setup
- List the plugins discovered and their purpose based on OBSIDIAN.md
- Explain the workflow as described in the vault's documentation
- Highlight key folders and their role in the system
- Show how tools connect to support the stated philosophy
- Reference any external documentation or articles`;
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