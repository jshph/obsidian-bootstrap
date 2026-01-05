# Plugin Catalog

Reference for available plugins (13 total). Use this to help users choose what to install.

## Core Plugins (Recommended)

### dataview
**Purpose**: Query your notes like a database. Create tables, lists, and task views.
**Use when**: User wants to see all notes with a tag, track tasks across files, or create dashboards.
**Example**: `dataview TABLE file.mtime FROM "projects" WHERE status = "active"`

### templater-obsidian
**Purpose**: Advanced templates with dynamic content, dates, prompts, and JavaScript.
**Use when**: User wants templates that auto-fill dates, prompt for input, or have logic.
**Setup needed**: Set templates folder in settings.

## Productivity Plugins

### quickadd
**Purpose**: Quick capture, templates, and macros from a single hotkey.
**Use when**: User wants fast note creation without navigating folders.
**Setup needed**: User must create their own capture commands/macros.
**Note**: Installed with empty config - user defines their own workflows.

### obsidian-tasks-plugin
**Purpose**: Track tasks across your vault with due dates, priorities, and recurrence.
**Use when**: User wants GTD-style task management or project tracking.
**Example**: `- [ ] Review PR 📅 2024-01-15 ⏫`

## Reading & Research Plugins

### pdf-plus
**Purpose**: Enhanced PDF viewing with annotations and highlights.
**Use when**: User reads PDFs in Obsidian or does academic research.

### readwise-official
**Purpose**: Sync highlights from Kindle, articles, podcasts into Obsidian.
**Use when**: User has Readwise account and wants highlights in their vault.
**Setup needed**: Requires Readwise API token (user must configure).

### obsidian-annotator
**Purpose**: Annotate PDFs and EPUBs directly in Obsidian.
**Use when**: User wants to highlight and annotate documents.

### media-extended
**Purpose**: Enhanced media player for audio/video files.
**Use when**: User embeds media in notes.

## Utility Plugins

### obsidian-advanced-uri
**Purpose**: Deep linking to specific notes, headings, or blocks.
**Use when**: User wants to link to Obsidian from other apps.

### actions-uri
**Purpose**: Trigger actions via URI schemes.
**Use when**: User wants automation from external tools.

### obsidian42-brat
**Purpose**: Install beta plugins not in community store.
**Use when**: User wants bleeding-edge plugins.

### obsidian-fullscreen-plugin
**Purpose**: Toggle fullscreen mode.
**Use when**: User wants immersive reading/writing.

### obsidian-style-settings
**Purpose**: Customize theme CSS variables without editing code.
**Use when**: User wants to tweak theme colors/fonts.

---

## Plugin Categories for Wizard

| Category | Plugins | Question |
|----------|---------|----------|
| **Essential** | dataview, templater | "Do you want smart templates and note querying?" |
| **Task Management** | obsidian-tasks-plugin | "Do you track tasks and todos?" |
| **Quick Capture** | quickadd | "Do you want fast note creation hotkeys?" |
| **Reading/Research** | pdf-plus, readwise-official, obsidian-annotator, media-extended | "Do you read PDFs, use Readwise, or work with media?" |
| **Advanced** | obsidian-advanced-uri, actions-uri, obsidian42-brat | "Do you need automation/integration with other apps?" |
| **Appearance** | obsidian-style-settings, obsidian-fullscreen-plugin | "Do you want to customize appearance?" |

---

## Documentation Snippets for Getting Started Guide

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

Your configured shortcuts:
[GENERATE TABLE BASED ON CONFIGURED CHOICES]
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
