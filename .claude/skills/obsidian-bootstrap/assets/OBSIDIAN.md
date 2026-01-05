# Obsidian Vault Configuration Guide

This guide helps AI agents understand and replicate the essential configuration of this Obsidian vault.

## Core Philosophy

> "Trust that pattern emerges from clutter. You don't need to organize upfront—you need to think and connect."

This is a Personal Knowledge Management (PKM) vault focused on **capture → synthesis**:

- **Easy capture over upfront organization**: Quick capture templates file notes automatically—no thinking required
- **Trust the clutter**: Tags and structure develop naturally from active thinking, not predetermined categories
- **Bottom-up synthesis**: Connect ideas through use, not upfront taxonomy
- **Readwise as source of truth**: Sync highlights from books, articles, podcasts for lasting retention
- **Inbox → Daily notes → MOCs**: Natural progression from quick capture to daily reflection to synthesized understanding

The vault supports:
- Daily note-taking and reflection
- Knowledge synthesis and connection
- Task management and productivity
- Reading and research integration

**Read more about the philosophy**: https://jphorism.substack.com/p/how-books-inspire-me-months-later

### Tag and Link Usage Philosophy

**Tags and links are used aspirationally, not organizationally.**

This vault typically maintains 15-20 rotating tags that capture different formulations of evolving ideas. These function as:

- **Breadcrumbs to future self**: Tags help rediscover thinking patterns and intellectual threads across time
- **Conceptual exploration markers**: Links between notes trace how ideas develop and connect
- **Thematic clustering**: Tags group related explorations without rigid categorization
- **NOT task organization**: Tags are not used as GTD-style organizational primitives or action items

**Common tag patterns:**
- Conceptual themes that cycle in and out of focus
- Questions or tensions being explored over time
- Intellectual interests that span multiple notes
- Cross-cutting themes that emerge from daily reflection

**Link philosophy:**
- Bidirectional discovery: Links help find unexpected connections
- Temporal continuity: Link chains show how thinking evolves
- Serendipitous navigation: Links enable non-linear knowledge exploration

When analyzing an existing vault, agents should identify these aspirational patterns rather than seeking traditional organizational structures.

### Readwise Integration Philosophy

**Readwise serves as the external annotation layer for this knowledge system.**

- **Tag consistency**: Items in Readwise are tagged with the same 15-20 rotating tags used in the vault
- **Cross-platform continuity**: Tags bridge reading (Readwise) and reflection (Obsidian)
- **Seamless import**: Readwise highlights sync directly into the vault with existing tag structure
- **Reading as exploration**: Readwise tags help identify which conceptual themes are active during different reading periods

This creates a unified tagging ecosystem where:
- External reading connects to internal reflection
- Tag frequency patterns span both platforms
- Intellectual themes persist across reading and writing
- Serendipitous connections emerge between books and personal thoughts

## Knowledge Management System Principles

This vault operates on several core principles that reduce friction and encourage exploration:

### 1. **Minimize Decision Friction**
- QuickAdd macros automatically title notes, eliminating the "where does this go?" decision
- Inbox-first workflow: capture ideas immediately, organize later (if at all)
- Aspirational tagging: tags emerge from content, not predetermined categories

### 2. **Enable Serendipitous Discovery**
- Bidirectional links create unexpected connection pathways
- Tag-based exploration rather than hierarchical navigation
- Daily notes as temporal entry points into the knowledge graph

### 3. **Embrace Intellectual Evolution**
- Tags rotate in and out as thinking evolves
- Links trace how ideas develop and transform over time
- Notes serve as snapshots of thinking at specific moments

### 4. **Reduce Cognitive Overhead**
- Minimal folder structure (most content flows through inbox)
- Templates eliminate formatting decisions
- Consistent tagging vocabulary across platforms (Obsidian + Readwise)

### 5. **Support Long-term Thinking**
- Tags function as breadcrumbs for future rediscovery
- Cross-temporal connections through consistent vocabulary
- Knowledge accumulates organically rather than through rigid systems

## Essential Plugins

These plugins are critical for the vault's core functionality and should be installed when replicating:

### 1. **templater-obsidian** (REQUIRED)
- Powers template system for daily notes and quick captures
- Configuration stored in: `plugins/templater-obsidian/data.json`
- Templates folder: `templates/`

### 2. **quickadd** (REQUIRED)
- Enables quick note creation workflows
- Particularly the "Personal Reflection" choice for timestamped notes
- Configuration: `plugins/quickadd/data.json`

### 3. **dataview** (REQUIRED)
- Provides database-like queries across notes
- Essential for MOCs and dynamic content aggregation
- Configuration: `plugins/dataview/data.json`

### 4. **obsidian-tasks-plugin** (RECOMMENDED)
- Task management with due dates and queries
- Integrates with daily notes workflow
- Configuration: `plugins/obsidian-tasks-plugin/data.json`

### 5. **calendar** (RECOMMENDED)
- Visual daily notes navigation
- Quick access to past/future daily notes
- Configuration: `plugins/calendar/data.json`

### 6. **readwise-official** (OPTIONAL - if user uses Readwise)
- Syncs highlights from books and articles
- Only needed if migrating Readwise integration
- Configuration: `plugins/readwise-official/data.json`

### 7. **obsidian-excalidraw-plugin** (OPTIONAL)
- Visual thinking and diagramming
- Install if user needs drawing capabilities
- Configuration: `plugins/obsidian-excalidraw-plugin/data.json`

## Plugins to SKIP

These plugins are installed but not essential for core functionality:

- **obsidian-bible-reference** - Domain-specific, skip unless needed
- **obsidian-canvas-conversation** - Experimental feature
- **obsidian-caterpillage** - Niche use case
- **reason** - Not essential for PKM workflow
- **obsidian-annotation-context-menu** - Minor enhancement
- **chat-stream** - Deprecated/experimental
- **obsidian-annotator** - Only if PDF annotation is critical
- **media-extended** - Only if heavy media usage
- **ghost-fade-focus** - Cosmetic enhancement
- **obsidian-focus-mode** - Cosmetic enhancement
- **obsidian-fullscreen-plugin** - Cosmetic enhancement

## Folder Structure

```
vault/                  # Vault root directory
├── .obsidian/          # Configuration directory (git tracked)
├── inbox/              # Quick captures and new notes (timestamped)
├── daily/              # Daily notes
├── templates/          # Note templates
├── attachments/        # Images and files
├── MOCs/              # Maps of Content
├── projects/          # Active projects
└── archive/           # Archived content
```

**Note:** The `templates/` folder in the vault root should be synced from `.obsidian/templates/` (which is tracked in git) to ensure templates are accessible to Obsidian's template features.

## Key Configurations

### Core Settings (app.json)
```json
{
  "attachmentFolderPath": "attachments",
  "alwaysUpdateLinks": true,
  "showLineNumber": true,
  "defaultViewMode": "source",
  "promptDelete": false
}
```

### Daily Notes
- Folder: `daily/`
- Format: `YYYY-MM-DD`
- Template: `templates/daily-note.md`

### Quick Add Workflow
The `new-note.sh` script triggers QuickAdd to create timestamped notes in `inbox/`.

## Migration Instructions for AI Agents

### Step 1: Create Vault Structure
```bash
VAULT_PATH="[target_path]"
mkdir -p "$VAULT_PATH/.obsidian"
mkdir -p "$VAULT_PATH"/{inbox,daily,templates,attachments,MOCs,projects,archive}
```

### Step 2: Copy Core Configurations
```bash
# Copy essential config files
cp app.json "$VAULT_PATH/.obsidian/"
cp core-plugins.json "$VAULT_PATH/.obsidian/"
cp hotkeys.json "$VAULT_PATH/.obsidian/"
# Note: workspace.json is user-specific and should not be copied

# Copy templates from .obsidian to vault root
cp -r .obsidian/templates "$VAULT_PATH/templates"
```

### Step 3: Install Essential Plugins
1. Copy plugin manifests and data:
```bash
# For each essential plugin
PLUGINS="templater-obsidian quickadd dataview obsidian-tasks-plugin calendar"
for plugin in $PLUGINS; do
  mkdir -p "$VAULT_PATH/.obsidian/plugins/$plugin"
  cp "plugins/$plugin/manifest.json" "$VAULT_PATH/.obsidian/plugins/$plugin/"
  cp "plugins/$plugin/data.json" "$VAULT_PATH/.obsidian/plugins/$plugin/" 2>/dev/null || true
done
```

2. Create community-plugins.json with essentials:
```bash
cat > "$VAULT_PATH/.obsidian/community-plugins.json" << 'EOF'
[
  "templater-obsidian",
  "quickadd",
  "dataview",
  "obsidian-tasks-plugin",
  "calendar"
]
EOF
```

### Step 4: User Instructions
After creating the vault structure:

1. Open the vault in Obsidian
2. Go to Settings → Community Plugins
3. Enable community plugins
4. Install the plugins listed in community-plugins.json
5. Restart Obsidian to apply configurations

## Hotkey Highlights

Key shortcuts configured in this vault:
- `Cmd+Shift+N`: QuickAdd - New note
- `Cmd+T`: Create new note from template
- `Cmd+P`: Command palette
- `Cmd+Shift+F`: Search in all files

## Custom Scripts

- `scripts/new-note.sh`: Creates timestamped note via QuickAdd automation

## Notes for Agents

- Focus on core PKM functionality, not cosmetic plugins
- Preserve folder structure and naming conventions
- Template system is critical - ensure templates folder exists
- Daily notes workflow is central to the vault's use
- Plugin data.json files contain user-specific settings that should be preserved when possible