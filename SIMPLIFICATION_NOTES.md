# Obsidian Bootstrap Vault - Simplification Notes

## Current State
The codebase has been partially simplified but has broken code that needs fixing.

## What Was Done
1. **Removed complex helper functions** including:
   - `fetchObsidianConfig` - for cloning and analyzing git repos
   - `mergeConfigWithTemplate` - for merging external configs
   - `createObsidianConfig` - for creating config files
   - `createDirectoryStructure` - for creating folders
   - `copyPluginManifests` - for copying plugin files
   - All the template file dependencies

2. **Updated the prompt** to include:
   - Detailed folder structure for each template
   - Bash commands for creating vaults manually
   - Instructions for cloning and analyzing repos
   - Config file creation using cat with heredocs

## Current Problem
The tool handler code is partially deleted, leaving broken syntax. Lines 66-246 contain remnants of the old `create_vault` and `list_templates` tool handlers that need to be completely removed.

## How to Fix

### Step 1: Remove the broken tool handler
Delete everything from line 66 to line 246 (the old switch statement for handling tools).

### Step 2: Clean up imports
Remove unused imports:
- Remove `CallToolRequestSchema`
- Remove `ListToolsRequestSchema`
- Remove `Tool` type import

Change the imports to:
```typescript
import {
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import type {
  PromptMessage,
} from "@modelcontextprotocol/sdk/types.js";
```

### Step 3: Update server capabilities
The server should only advertise prompts, not tools:
```typescript
const server = new Server(
  {
    name: "obsidian-vault-bootstrap",
    version: "1.0.0",
  },
  {
    capabilities: {
      prompts: {},
      // tools: {}, // Remove this line
    },
  }
);
```

### Step 4: Ensure the prompt is complete
The prompt at line ~270 should include:
1. Template descriptions with folder lists
2. Bash commands for creating vaults:
   ```bash
   # Create vault
   VAULT_PATH=~/Documents/Obsidian/MyVault
   mkdir -p "$VAULT_PATH/.obsidian"
   mkdir -p "$VAULT_PATH"/{folders,for,template}
   ```
3. Config file creation examples
4. Migration instructions for GitHub repos

## Final Architecture
After fixes, the system should:
- Have NO tools (no create_vault, no list_templates)
- Have ONE prompt: `bootstrap_vault`
- The prompt guides the AI agent to use bash commands
- Everything is done with `mkdir`, `cat`, `cp`, `git clone`

## Benefits of This Approach
1. **Simpler**: No complex TypeScript code to maintain
2. **Transparent**: User can see exactly what commands are being run
3. **Flexible**: AI agent can adapt to any repo structure
4. **Debuggable**: Just bash commands, easy to troubleshoot

## Testing
After fixing, test with:
1. "Create a PKM vault called TestVault"
2. "Help me migrate from https://github.com/kepano/obsidian-minimal"

The AI should use bash commands directly, not try to call any tools.