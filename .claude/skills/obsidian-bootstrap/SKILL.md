---
name: obsidian-bootstrap
description: Create and configure personalized Obsidian vaults through an interactive wizard. Use when the user wants to set up Obsidian, create a new vault, continue setting up an existing vault, customize their vault configuration, add plugins or workflows, or needs help with their note-taking setup.
allowed-tools: Read, Bash, Glob, Grep, Write, AskUserQuestion
---

# Obsidian Vault Bootstrap

An interactive wizard for creating and configuring personalized Obsidian vaults. Supports both fresh starts and resuming/enhancing existing setups.

## Reference Documents

- [VAULT-EVALUATION.md](VAULT-EVALUATION.md) - How to evaluate vault state and resume from the right step
- [VAULT-REGISTRATION.md](VAULT-REGISTRATION.md) - Cross-platform vault registration in Obsidian's app config
- [QUICKADD-CONFIG.md](QUICKADD-CONFIG.md) - QuickAdd choice/template configuration details
- [KNOWLEDGE-GROWTH.md](KNOWLEDGE-GROWTH.md) - Knowledge growth discovery questions and concept mapping
- [HOTKEYS.md](HOTKEYS.md) - Pre-configured keyboard shortcuts
- [PLUGINS.md](PLUGINS.md) - Plugin catalog and documentation snippets
- [GETTING-STARTED-TEMPLATE.md](GETTING-STARTED-TEMPLATE.md) - Template for generating the user's guide

## Wizard Flow

**Always start with Step 0** to evaluate the current state and determine where to resume.

### Step 0: Vault State Evaluation

Before starting the wizard, evaluate the current state to determine which steps are complete.

1. **Identify the vault**: User-specified path, or check working directories for `.obsidian` folder
2. **Run evaluation script**: See [VAULT-EVALUATION.md](VAULT-EVALUATION.md) for the full script
3. **Present findings**: Show ✓/✗ status for each step
4. **Determine resume point**: Jump to the first incomplete step

If no vault found, proceed to Step 1 (fresh start).

### Step 1: Basic Setup

Ask for:
- **Vault name** (required)
- **Location** (default: `~/Documents/Obsidian`)

### Step 2: Inspect Existing Structure

Check if the target path exists and analyze patterns:

```bash
VAULT_PATH="[LOCATION]/[VAULT_NAME]"

if [ -d "$VAULT_PATH" ]; then
    # Check for .obsidian, PARA folders, daily notes, Readwise, tasks, dataview
    # See VAULT-EVALUATION.md for full pattern detection
fi
```

Present findings and pre-select options based on existing structure. See [VAULT-EVALUATION.md](VAULT-EVALUATION.md) for the pattern inference table.

### Step 3: Workflow Discovery

Use `AskUserQuestion` with **beginner-friendly language**. Avoid jargon.

**Questions to ask:**
1. "When a thought hits you, where should it go?" (inbox vs folders vs minimal)
2. "Where do your tasks live?" (in notes vs external app vs none)
3. "Beyond text notes, what might you add?" (Readwise, PDFs, media, just text)
4. "What situations will you use this in?" (meetings, research, projects, journaling, learning, creative)

Use answers to customize the "Day in the Life" scenarios in the Getting Started guide.

**Reassure the user:**
```
Don't worry about getting this "right" - Obsidian is flexible.
You can always reorganize later. The goal for now is just to
start capturing thoughts without friction.
```

### Step 4: Plugin Selection

Based on answers, select plugins from the catalog. See [PLUGINS.md](PLUGINS.md) for details.

| User Need | Plugins to Install |
|-----------|-------------------|
| Any vault | `dataview`, `templater-obsidian` (essentials) |
| Task tracking | `obsidian-tasks-plugin` |
| Quick capture | `quickadd` |
| PDFs | `pdf-plus`, `obsidian-annotator` |
| Readwise | `readwise-official` |
| Media files | `media-extended` |

### Step 5: Generate QuickAdd Choices & Templates

Based on disclosed activities, create custom QuickAdd choices and templates. See [QUICKADD-CONFIG.md](QUICKADD-CONFIG.md) for:
- Choice-to-activity mapping table
- Full QuickAdd JSON structure
- Hotkey configuration
- Template creation guidelines

**Always include:**
- "📥 Quick Capture" → captures to `inbox/{{DATE}}-thoughts.md`

### Step 5.5: Knowledge Growth Discovery

Conversationally gauge interest in advanced knowledge management habits. See [KNOWLEDGE-GROWTH.md](KNOWLEDGE-GROWTH.md) for:
- Discovery questions with beginner-friendly framing
- Response-to-guide-section mapping
- Concept translation table (jargon → plain language)

**Key question:** "Are you interested in building connections between your ideas?"

Options:
- Yes, that sounds exciting → Include full "Growing Your Knowledge" section
- Maybe later → Include brief teaser with tutorial links
- Keep it simple → Omit advanced sections

### Step 6: Other Plugin Configuration

**If Readwise was selected**, prompt for API token:
- "Do you have your Readwise API token? (Get it from https://readwise.io/access_token)"
- If yes, write token to `readwise-official/data.json`

**Other plugins**: Document configuration steps in Getting Started guide.

### Step 7: Create Vault

```bash
VAULT_PATH="[LOCATION]/[VAULT_NAME]"
SKILL_ASSETS="[PATH_TO_THIS_SKILL]/assets"

# Create structure
mkdir -p "$VAULT_PATH"/.obsidian/plugins
mkdir -p "$VAULT_PATH"/{inbox,projects,areas,resources,archive,templates}

# Copy base settings
cp "$SKILL_ASSETS"/{app,appearance,hotkeys,core-plugins}.json "$VAULT_PATH/.obsidian/"

# Copy selected plugins
for plugin in [SELECTED_PLUGINS]; do
    cp -r "$SKILL_ASSETS/plugins/$plugin" "$VAULT_PATH/.obsidian/plugins/"
done

# Create community-plugins.json
echo '["plugin1", "plugin2", ...]' > "$VAULT_PATH/.obsidian/community-plugins.json"

# Copy themes, snippets, templates
cp -r "$SKILL_ASSETS/themes" "$VAULT_PATH/.obsidian/"
cp -r "$SKILL_ASSETS/snippets" "$VAULT_PATH/.obsidian/"
cp -r "$SKILL_ASSETS/templates" "$VAULT_PATH/"
```

### Step 8: Generate Getting Started Guide

Create personalized `Getting-Started.md`. See [GETTING-STARTED-TEMPLATE.md](GETTING-STARTED-TEMPLATE.md) for the full template.

Include:
1. Vault overview - folder structure and purpose
2. Keyboard shortcuts - see [HOTKEYS.md](HOTKEYS.md)
3. Installed plugins - see [PLUGINS.md](PLUGINS.md) for doc snippets
4. Workflows - based on their answers
5. Knowledge growth sections - based on Step 5.5 responses
6. Next steps - specific to their setup

**When resuming/enhancing existing vaults:**

If `Getting-Started.md` exists, **update rather than regenerate**:
1. Read existing guide
2. Identify insertion points for new content
3. Preserve personalized content
4. Ask user before major changes

### Step 9: Register and Open Vault in Obsidian

Use the scripts in `scripts/` for cross-platform vault registration. See [VAULT-REGISTRATION.md](VAULT-REGISTRATION.md) for details.

**1. Check if Obsidian is installed:**

```bash
python scripts/check_obsidian.py
```

Exit code 0 = installed, 1 = not installed.

**If NOT installed**, use `AskUserQuestion`:

```
Your vault is ready at [VAULT_PATH], but I couldn't detect Obsidian on your system.

Would you like to:
1. Download Obsidian (opens obsidian.md/download)
2. I already have it installed (continue with registration)
3. Skip for now (I'll open it manually later)
```

**2. Register the vault:**

```bash
python scripts/register_vault.py "$VAULT_PATH"
```

Outputs `vault_id=<id>` on success. Captures the ID for opening.

**3. Restart Obsidian** (required for new registrations):

```bash
python scripts/restart_obsidian.py
```

**4. Open the vault:**

```bash
sleep 3  # Wait for Obsidian to start
open "obsidian://open?vault=[VAULT_ID]&file=Getting-Started"
```

**Fallback**: If registration fails or Obsidian isn't installed, use path-based URI:

```bash
open "obsidian://open?path=$VAULT_PATH/Getting-Started.md"
```

### Step 10: Offer Enzyme (Optional)

After setup is complete, offer to install [Enzyme](https://enzyme.garden) — a tool that helps users explore their notes through conversation and find threads in their thinking.

**Use `AskUserQuestion` with this framing:**
```
Your vault is ready. Would you like to install Enzyme?

Enzyme helps you explore your notes conversationally — it finds connections
in your captures and shows you which threads to pull. Your files stay local;
AI just helps you navigate them.

Learn more: https://enzyme.garden
```

**Options:**
1. Yes, install Enzyme (recommended)
2. Tell me more (opens enzyme.garden)
3. Maybe later

**If they choose to install:**

**Privacy notice:**

Before running Enzyme, explain the data usage to the user:

```
Enzyme sends your note content to AI services for analysis:

• Initialization — Anthropic Claude analyzes your vault structure
• Catalyst generation — AI (via OpenRouter) processes notes for summaries

Your files stay local; only content is sent for processing.
Privacy policy: https://enzyme.garden/privacy
```

Use `AskUserQuestion` to confirm they want to proceed.

**If they agree, initialize the vault:**

```bash
cd "$VAULT_PATH"
source ~/Hacks/enzyme-python/venv/bin/activate && enzyme init --accept-data-usage
```

This activates the local Enzyme development environment and runs initialization.
The `--accept-data-usage` flag acknowledges the privacy notice so Enzyme
runs non-interactively.

**After init completes, offer MCP setup for Claude Code:**

Use `AskUserQuestion` with this framing:
```
Would you like to add Enzyme as an MCP server for Claude Code?

This adds Enzyme to this vault's project settings, so when you're working
in this vault with Claude Code, it can search and reference your notes.
```

If yes (run from the vault directory):
```bash
cd "$VAULT_PATH"
claude mcp add enzyme --scope project enzyme-mcp
```

**Reassure the user:**
```
Even if your vault is mostly empty right now, Enzyme will grow with you.
Your half-tagged notes, scattered captures — they're all enough. Enzyme
treats incomplete systems as intent, not failure.
```

## Key Principles

1. **No jargon** - Avoid "PARA", "Zettelkasten", "PKM" - use plain language
2. **Habits over systems** - Help them capture first, organize later
3. **Reassure repeatedly** - "You can't mess this up", "Reorganize anytime"
4. **Start small** - Don't overwhelm with options or features
5. **Trust emerges** - The goal is a trusted place to think, not a perfect system
6. **Install minimal plugins** - Only what they need right now
7. **Progressive disclosure** - Basics first, advanced features later
8. **Meet them where they are** - Evaluate existing vault state and resume from there
9. **Respect prior work** - Don't redo completed steps; build on what exists
