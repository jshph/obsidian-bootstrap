---
name: obsidian-bootstrap
description: Create personalized Obsidian vaults through an interactive wizard. Use when the user wants to set up Obsidian, create a new vault, start using Obsidian, or needs help getting started with note-taking.
allowed-tools: Read, Bash, Glob, Grep, Write, AskUserQuestion
---

# Obsidian Vault Bootstrap

An interactive wizard for creating personalized Obsidian vaults.

## Wizard Flow

Guide the user through these steps, asking questions to customize their vault:

### Step 1: Basic Setup

Ask for:
- **Vault name** (required)
- **Location** (default: `~/Documents/Obsidian`)

### Step 2: Inspect Existing Structure

Before asking workflow questions, check if the target path already exists and analyze it:

```bash
VAULT_PATH="[LOCATION]/[VAULT_NAME]"

# Check if path exists
if [ -d "$VAULT_PATH" ]; then
    echo "Found existing directory at $VAULT_PATH"

    # Check for .obsidian folder (existing vault)
    [ -d "$VAULT_PATH/.obsidian" ] && echo "This is an existing Obsidian vault"

    # List top-level folders
    ls -d "$VAULT_PATH"/*/ 2>/dev/null

    # Count markdown files
    find "$VAULT_PATH" -name "*.md" -type f | wc -l

    # Look for common organizational patterns
    [ -d "$VAULT_PATH/inbox" ] || [ -d "$VAULT_PATH/Inbox" ] && echo "PATTERN: Has inbox folder"
    [ -d "$VAULT_PATH/projects" ] || [ -d "$VAULT_PATH/Projects" ] && echo "PATTERN: Has projects folder"
    [ -d "$VAULT_PATH/areas" ] || [ -d "$VAULT_PATH/Areas" ] && echo "PATTERN: PARA system detected"
    [ -d "$VAULT_PATH/daily" ] || [ -d "$VAULT_PATH/Daily" ] && echo "PATTERN: Uses daily notes"
    [ -d "$VAULT_PATH/templates" ] || [ -d "$VAULT_PATH/Templates" ] && echo "PATTERN: Has templates"
    [ -d "$VAULT_PATH/Readwise" ] && echo "PATTERN: Uses Readwise"

    # Check for task patterns in files
    grep -r "\- \[ \]" "$VAULT_PATH" --include="*.md" -l 2>/dev/null | head -5 && echo "PATTERN: Uses tasks"

    # Check for dataview queries
    grep -r "dataview" "$VAULT_PATH" --include="*.md" -l 2>/dev/null | head -3 && echo "PATTERN: Uses dataview"
fi
```

**Based on findings, adjust the wizard:**

| Finding | Inference | Action |
|---------|-----------|--------|
| Existing `.obsidian` | Already a vault | Ask: enhance existing or start fresh? |
| PARA folders (inbox/projects/areas/resources/archive) | Uses PARA | Pre-select PARA, skip org question |
| `daily/` or `Daily/` folder | Uses daily notes | Pre-select daily notes plugin |
| `Readwise/` folder | Has Readwise | Pre-select Readwise plugin, ask for token |
| Task checkboxes in files | Tracks tasks | Pre-select Tasks plugin |
| Dataview queries | Uses dataview | Pre-select Dataview (already essential) |
| Empty or no directory | Fresh start | Run full wizard |

**If existing structure found**, present findings to user:

```
I found an existing directory with:
- 47 markdown files
- PARA-style folders (inbox, projects, areas, resources)
- Task checkboxes in 12 files
- No .obsidian configuration yet

Based on this, I'd suggest:
- PARA organization (matches your folders)
- Tasks plugin (you're already using checkboxes)
- Dataview + Templater (essentials)

Does this look right, or would you like to customize?
```

### Step 3: Workflow Discovery

Use `AskUserQuestion` with **beginner-friendly language**. Avoid jargon like "PARA" or "Zettelkasten" - focus on habits and comfort level.

**How do you want to capture notes?**
- "When a thought hits you, where should it go?"
  - One inbox for everything (sort later) - *simplest, recommended for beginners*
  - Separate folders by type (work, personal, ideas)
  - I'll figure it out as I go - *just create a minimal structure*

**Do you track tasks and to-dos?**
- "Where do your tasks live?"
  - I want to track tasks in my notes (checkboxes, due dates)
  - I use another app for tasks (Todoist, Things, Reminders)
  - I don't really track tasks

**What else will you capture?**
- "Beyond text notes, what might you add?" (multi-select)
  - Reading highlights (Kindle, articles via Readwise)
  - PDFs and documents
  - Voice memos or videos
  - Just text notes for now

**What's your day-to-day like?** (for customizing examples)
- "What situations will you use this in?" (multi-select)
  - Meetings and calls (capture notes, action items)
  - Research and reading (articles, books, papers)
  - Projects and work tasks
  - Personal ideas and journaling
  - Learning and studying
  - Creative work (writing, brainstorming)

Use these to **customize the "Day in the Life" scenarios** in the Getting Started guide. Show concrete examples that match their actual workflow.

**Reassure the user:**
```
Don't worry about getting this "right" - Obsidian is flexible.
You can always reorganize later. The goal for now is just to
start capturing thoughts without friction.
```

### Step 4: Plugin Selection

Based on answers (or inferred from existing structure), select plugins from the catalog. See [PLUGINS.md](PLUGINS.md) for details.

| User Need | Plugins to Install |
|-----------|-------------------|
| Any vault | `dataview`, `templater-obsidian` (essentials) |
| Task tracking | `obsidian-tasks-plugin` |
| Quick capture | `quickadd` |
| PDFs | `pdf-plus`, `obsidian-annotator` |
| Readwise | `readwise-official` |
| Media files | `media-extended` |
| Advanced automation | `obsidian-advanced-uri`, `actions-uri` |
| Appearance customization | `obsidian-style-settings`, `obsidian-fullscreen-plugin` |
| Beta plugins | `obsidian42-brat` |

### Step 5: Generate QuickAdd Choices & Templates

**Based on what the user disclosed about their daily activities**, create custom QuickAdd choices and templates.

| User said they do... | Create QuickAdd choice | Create template |
|---------------------|------------------------|-----------------|
| Meetings and calls | "🗓️ New Meeting" (Template) | `templates/meeting.md` |
| Projects and tasks | "✅ Quick Task" (Capture to inbox) | - |
| Research/reading | "📚 Reading Note" (Template) | `templates/reading.md` |
| Personal journaling | "📝 Journal Entry" (Template) | `templates/journal.md` |
| Ideas/brainstorming | "💡 Quick Idea" (Capture to inbox) | - |
| Learning/studying | "📖 Study Note" (Template) | `templates/study.md` |

**Always include a basic capture:**
- "📥 Quick Capture" → captures to `inbox/{{DATE}}-thoughts.md`

**Generate the QuickAdd config dynamically:**

```json
// Example for user who selected: meetings, tasks, ideas
{
  "choices": [
    {
      "id": "quick-capture",
      "name": "📥 Quick Capture",
      "type": "Capture",
      "command": true,
      "captureTo": "inbox/{{DATE:YYYY-MM-DD}}-thoughts",
      "format": { "enabled": true, "format": "- {{VALUE}}" }
    },
    {
      "id": "quick-task",
      "name": "✅ Quick Task",
      "type": "Capture",
      "command": true,
      "captureTo": "inbox/{{DATE:YYYY-MM-DD}}-thoughts",
      "format": { "enabled": true, "format": "- [ ] {{VALUE}}" }
    },
    {
      "id": "new-meeting",
      "name": "🗓️ New Meeting",
      "type": "Template",
      "command": true,
      "templatePath": "templates/meeting.md",
      "folder": { "enabled": true, "folders": ["inbox"] }
    }
  ]
}
```

**Also create corresponding templates** in `templates/` folder for each Template-type choice.

**Configure hotkeys for each QuickAdd choice** by adding entries to `hotkeys.json`:

```json
// Add to hotkeys.json - one entry per QuickAdd choice
{
  "quickadd:choice:quick-capture": [
    { "modifiers": ["Mod", "Shift"], "key": "C" }
  ],
  "quickadd:choice:quick-task": [
    { "modifiers": ["Mod", "Shift"], "key": "T" }
  ],
  "quickadd:choice:new-meeting": [
    { "modifiers": ["Mod", "Shift"], "key": "M" }
  ],
  "quickadd:choice:new-journal": [
    { "modifiers": ["Mod", "Shift"], "key": "J" }
  ],
  "quickadd:choice:quick-idea": [
    { "modifiers": ["Mod", "Shift"], "key": "I" }
  ],
  "quickadd:choice:reading-note": [
    { "modifiers": ["Mod", "Shift"], "key": "R" }
  ]
}
```

**Hotkey assignment based on user's activities:**

| QuickAdd Choice | Hotkey | When to include |
|-----------------|--------|-----------------|
| 📥 Quick Capture | `Cmd/Ctrl + Shift + C` | Always |
| ✅ Quick Task | `Cmd/Ctrl + Shift + T` | If tracks tasks |
| 🗓️ New Meeting | `Cmd/Ctrl + Shift + M` | If has meetings |
| 📝 Journal Entry | `Cmd/Ctrl + Shift + J` | If journals |
| 💡 Quick Idea | `Cmd/Ctrl + Shift + I` | If brainstorms |
| 📚 Reading Note | `Cmd/Ctrl + Shift + R` | If researches |
| 📖 Study Note | `Cmd/Ctrl + Shift + U` | If studies |

**Note:** The hotkey format in `hotkeys.json` uses `"Mod"` which Obsidian automatically translates to `Cmd` on Mac and `Ctrl` on Windows/Linux.

**Document the configured hotkeys** in the Getting Started guide so users know their shortcuts immediately

### Step 6: Other Plugin Configuration

**If Readwise was selected**, prompt the user:
- "Do you have your Readwise API token? (Get it from https://readwise.io/access_token)"
- If yes, ask for the token and write it to `readwise-official/data.json`:

```bash
# Update Readwise token in plugin config
cat > "$VAULT_PATH/.obsidian/plugins/readwise-official/data.json" << EOF
{
  "token": "[USER_TOKEN]",
  "readwiseDir": "Readwise",
  "frequency": "0",
  "triggerOnLoad": false,
  "isSyncing": false,
  "lastSyncFailed": false,
  "lastSavedStatusID": 0,
  "currentSyncStatusID": 0,
  "refreshBooks": false,
  "booksToRefresh": [],
  "booksIDsMap": {},
  "failedBooks": [],
  "reimportShowConfirmation": true
}
EOF
```

**Other plugins needing configuration** (document in Getting Started, user configures later):
- `quickadd`: User creates their own capture commands/macros
- `templater-obsidian`: Templates folder already set to `templates/`

### Step 7: Create Vault

```bash
# Create base structure
VAULT_PATH="[LOCATION]/[VAULT_NAME]"
mkdir -p "$VAULT_PATH"/.obsidian/plugins

# Create folder structure based on organization style
# PARA:
mkdir -p "$VAULT_PATH"/{inbox,projects,areas,resources,archive,templates}
# Zettelkasten:
mkdir -p "$VAULT_PATH"/{inbox,notes,templates}
# Folder-based:
mkdir -p "$VAULT_PATH"/{notes,templates,attachments}
# Flat:
mkdir -p "$VAULT_PATH"/{inbox,templates}

# Copy base settings
SKILL_ASSETS="[PATH_TO_THIS_SKILL]/assets"
cp "$SKILL_ASSETS/app.json" "$VAULT_PATH/.obsidian/"
cp "$SKILL_ASSETS/appearance.json" "$VAULT_PATH/.obsidian/"
cp "$SKILL_ASSETS/hotkeys.json" "$VAULT_PATH/.obsidian/"
cp "$SKILL_ASSETS/core-plugins.json" "$VAULT_PATH/.obsidian/"

# Copy ONLY selected plugins
for plugin in [SELECTED_PLUGINS]; do
    cp -r "$SKILL_ASSETS/plugins/$plugin" "$VAULT_PATH/.obsidian/plugins/"
done

# Create community-plugins.json with only selected plugins
echo '["plugin1", "plugin2", ...]' > "$VAULT_PATH/.obsidian/community-plugins.json"

# Copy themes and snippets
cp -r "$SKILL_ASSETS/themes" "$VAULT_PATH/.obsidian/"
cp -r "$SKILL_ASSETS/snippets" "$VAULT_PATH/.obsidian/"

# Copy starter templates
cp -r "$SKILL_ASSETS/templates" "$VAULT_PATH/"
```

### Step 8: Generate Getting Started Guide

Create a personalized `Getting-Started.md` in the vault. Include:

1. **Vault overview** - folder structure and purpose
2. **Keyboard shortcuts** - pre-configured hotkeys
3. **Installed plugins** - only document what was installed
4. **Workflows** - based on their answers
5. **Next steps** - specific to their setup

See [GETTING-STARTED-TEMPLATE.md](GETTING-STARTED-TEMPLATE.md) for the template.

### Step 9: Open Vault in Obsidian

After setup is complete, open the Getting Started guide directly in Obsidian using the absolute path (works even for new vaults that haven't been opened before):

```bash
# URL-encode the full path (replace spaces with %20)
FILE_PATH="$VAULT_PATH/Getting-Started.md"
PATH_ENCODED=$(echo "$FILE_PATH" | sed 's/ /%20/g')

# Open using absolute path - Obsidian will register the vault automatically
open "obsidian://open?path=$PATH_ENCODED"
```

Using `path` instead of `vault` works for brand new vaults - Obsidian will:
1. Detect the vault folder from the path
2. Prompt the user to "Open folder as vault" if it's new
3. Open the Getting Started guide once the vault is loaded

## Progress Reporting

Throughout the wizard, update the user on progress:

```
[1/9] Basic setup - vault name and location
[2/9] Inspecting existing structure...
[3/9] Workflow preferences collected
[4/9] Selected plugins for your workflow
[5/9] Generated QuickAdd choices based on your activities
[6/9] Plugin configuration complete
[7/9] Vault created at ~/Documents/Obsidian/MyVault
[8/9] Generated personalized Getting Started guide
[9/9] Opened vault in Obsidian
```

## Pre-configured Hotkeys

The vault includes these keyboard shortcuts. On Mac use `Cmd`, on Windows/Linux use `Ctrl`.

### Base Hotkeys (always included)

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + D` | Open/create daily note |
| `Cmd/Ctrl + Shift + D` | Delete current file |
| `Cmd/Ctrl + L` | Rename current file |
| `Cmd/Ctrl + Enter` | Toggle checkbox |
| `Cmd/Ctrl + Shift + Enter` | Toggle task done (Tasks plugin) |
| `Cmd/Ctrl + T` | Insert template (Templater) |
| `Cmd/Ctrl + Shift + N` | QuickAdd menu |
| `Cmd/Ctrl + Shift + K` | Insert wikilink |
| `Cmd/Ctrl + Shift + [` | Toggle left sidebar |
| `Cmd/Ctrl + Shift + ]` | Toggle right sidebar |
| `Ctrl + Tab` | Next tab |
| `Ctrl + Shift + Tab` | Previous tab |
| `Ctrl + G` | Open local graph |
| `Ctrl + B` | Open backlinks |
| `Ctrl + H` | Toggle highlight |
| `Ctrl + Shift + C` | Copy PDF link (PDF Plus) |

### QuickAdd Choice Hotkeys (configured dynamically in Step 5)

These are added based on the user's disclosed activities:

| Shortcut | Action | When to include |
|----------|--------|-----------------|
| `Cmd/Ctrl + Shift + C` | 📥 Quick Capture | Always |
| `Cmd/Ctrl + Shift + T` | ✅ Quick Task | If tracks tasks |
| `Cmd/Ctrl + Shift + M` | 🗓️ New Meeting | If has meetings |
| `Cmd/Ctrl + Shift + J` | 📝 Journal Entry | If journals |
| `Cmd/Ctrl + Shift + I` | 💡 Quick Idea | If brainstorms |
| `Cmd/Ctrl + Shift + R` | 📚 Reading Note | If researches |
| `Cmd/Ctrl + Shift + U` | 📖 Study Note | If studies |

## Key Principles

1. **No jargon** - Avoid "PARA", "Zettelkasten", "PKM" - use plain language
2. **Habits over systems** - Help them capture first, organize later
3. **Reassure repeatedly** - "You can't mess this up", "Reorganize anytime"
4. **Start small** - Don't overwhelm with options or features
5. **Trust emerges** - The goal is a trusted place to think, not a perfect system
6. **Install minimal plugins** - Only what they need right now
7. **Progressive disclosure** - Basics first, advanced features later

## Plugin Documentation Snippets

When generating the Getting Started guide, use these descriptions for installed plugins:

### dataview
```markdown
## Dataview - Query Your Notes

Dataview lets you query notes like a database. Examples:

- List all notes tagged #project: `LIST FROM #project`
- Table of tasks due this week: `TASK WHERE due <= date(today) + dur(7 days)`
- Notes modified today: `LIST WHERE file.mtime >= date(today)`

Learn more: https://blacksmithgu.github.io/obsidian-dataview/
```

### templater-obsidian
```markdown
## Templater - Smart Templates

Create templates with dynamic content. Press `Cmd/Ctrl + T` to insert a template.

- `<% tp.date.now("YYYY-MM-DD") %>` - Today's date
- `<% tp.file.title %>` - Current file name
- `<% tp.system.prompt("Question?") %>` - Ask for input

Templates folder: `templates/`
```

### obsidian-tasks-plugin
```markdown
## Tasks - Task Management

Track tasks across your vault. Press `Cmd/Ctrl + Shift + Enter` to toggle done.

- `- [ ] Task description` - Basic task
- `- [ ] Task 📅 2024-01-15` - With due date
- `- [ ] Task ⏫` - High priority

Query tasks with dataview or the Tasks plugin query blocks.
```

### quickadd
```markdown
## QuickAdd - Fast Capture

Press `Cmd/Ctrl + Shift + N` to open QuickAdd menu.

QuickAdd needs your configuration:
1. Open Settings > QuickAdd
2. Create a "Capture" for quick notes to inbox
3. Create "Templates" for different note types
```

### pdf-plus
```markdown
## PDF Plus - Enhanced PDF Reading

Open any PDF with enhanced features. Press `Ctrl+Shift+C` to copy link to selection.

- Annotations and highlights with colors
- Copy text with page references
- Link to specific pages and selections
```

### readwise-official
```markdown
## Readwise - Sync Your Highlights

[IF TOKEN WAS CONFIGURED]
Your Readwise is connected! Highlights will sync to the `Readwise/` folder.

To sync: Settings > Readwise > Sync now

[IF TOKEN NOT CONFIGURED]
To connect Readwise:
1. Get your token from https://readwise.io/access_token
2. Go to Settings > Readwise
3. Paste your token and sync
```

### media-extended
```markdown
## Media Extended - Audio/Video Player

Enhanced media playback in your vault:

- Embed audio/video files
- Timestamp links for notes
- Playback controls
```

For full plugin documentation, see [PLUGINS.md](PLUGINS.md).
