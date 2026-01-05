# QuickAdd Configuration

This document details how to generate QuickAdd choices and templates based on the user's disclosed activities.

## Choice Mapping

Based on what the user said they do, create these QuickAdd choices and templates:

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

## QuickAdd JSON Structure

Generate the QuickAdd config dynamically based on user selections. Here's an example for a user who selected meetings, tasks, and ideas:

```json
{
  "choices": [
    {
      "id": "quick-capture",
      "name": "📥 Quick Capture",
      "type": "Capture",
      "command": true,
      "captureTo": "inbox/{{DATE:YYYY-MM-DD}}-thoughts.md",
      "captureToActiveFile": false,
      "createFileIfItDoesntExist": {
        "enabled": true,
        "createWithTemplate": false,
        "template": ""
      },
      "format": {
        "enabled": true,
        "format": "- {{VALUE}}"
      },
      "insertAfter": {
        "enabled": false,
        "after": ""
      },
      "prepend": false,
      "appendLink": false,
      "openFileInNewTab": {
        "enabled": false,
        "direction": "vertical",
        "focus": true
      },
      "openFile": false,
      "openFileInMode": "default"
    },
    {
      "id": "quick-task",
      "name": "✅ Quick Task",
      "type": "Capture",
      "command": true,
      "captureTo": "inbox/{{DATE:YYYY-MM-DD}}-thoughts.md",
      "captureToActiveFile": false,
      "createFileIfItDoesntExist": {
        "enabled": true,
        "createWithTemplate": false,
        "template": ""
      },
      "format": {
        "enabled": true,
        "format": "- [ ] {{VALUE}}"
      },
      "insertAfter": {
        "enabled": false,
        "after": ""
      },
      "prepend": false,
      "appendLink": false,
      "openFileInNewTab": {
        "enabled": false,
        "direction": "vertical",
        "focus": true
      },
      "openFile": false,
      "openFileInMode": "default"
    },
    {
      "id": "new-meeting",
      "name": "🗓️ New Meeting",
      "type": "Template",
      "command": true,
      "templatePath": "templates/meeting.md",
      "fileNameFormat": {
        "enabled": true,
        "format": "{{DATE:YYYY-MM-DD}}-{{VALUE}}"
      },
      "folder": {
        "enabled": true,
        "folders": ["inbox"],
        "chooseWhenCreatingNote": false,
        "createInSameFolderAsActiveFile": false
      },
      "appendLink": false,
      "openFileInNewTab": {
        "enabled": false,
        "direction": "vertical",
        "focus": true
      },
      "openFile": true,
      "openFileInMode": "default"
    },
    {
      "id": "quick-idea",
      "name": "💡 Quick Idea",
      "type": "Capture",
      "command": true,
      "captureTo": "inbox/{{DATE:YYYY-MM-DD}}-thoughts.md",
      "captureToActiveFile": false,
      "createFileIfItDoesntExist": {
        "enabled": true,
        "createWithTemplate": false,
        "template": ""
      },
      "format": {
        "enabled": true,
        "format": "- 💡 {{VALUE}}"
      },
      "insertAfter": {
        "enabled": false,
        "after": ""
      },
      "prepend": false,
      "appendLink": false,
      "openFileInNewTab": {
        "enabled": false,
        "direction": "vertical",
        "focus": true
      },
      "openFile": false,
      "openFileInMode": "default"
    }
  ],
  "macros": [],
  "inputPrompt": "single-line"
}
```

## Hotkey Configuration

Add entries to `hotkeys.json` for each QuickAdd choice:

```json
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
  ],
  "quickadd:choice:study-note": [
    { "modifiers": ["Mod", "Shift"], "key": "U" }
  ]
}
```

**Note:** The `"Mod"` modifier is automatically translated by Obsidian to `Cmd` on Mac and `Ctrl` on Windows/Linux.

## Hotkey Assignment Table

| QuickAdd Choice | Hotkey | When to include |
|-----------------|--------|-----------------|
| 📥 Quick Capture | `Cmd/Ctrl + Shift + C` | Always |
| ✅ Quick Task | `Cmd/Ctrl + Shift + T` | If tracks tasks |
| 🗓️ New Meeting | `Cmd/Ctrl + Shift + M` | If has meetings |
| 📝 Journal Entry | `Cmd/Ctrl + Shift + J` | If journals |
| 💡 Quick Idea | `Cmd/Ctrl + Shift + I` | If brainstorms |
| 📚 Reading Note | `Cmd/Ctrl + Shift + R` | If researches |
| 📖 Study Note | `Cmd/Ctrl + Shift + U` | If studies |

## Template Creation

For each Template-type choice, create a corresponding template in the `templates/` folder. See the [assets/templates](assets/templates) folder for starter templates that can be copied to the vault.

Document the configured hotkeys in the Getting Started guide so users know their shortcuts immediately.
