# Pre-configured Hotkeys

The vault includes these keyboard shortcuts. On Mac use `Cmd`, on Windows/Linux use `Ctrl`.

## Base Hotkeys (always included)

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

## QuickAdd Choice Hotkeys (configured dynamically)

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

## Progress Reporting

Throughout the wizard, update the user on progress. Adapt based on resume point - mark completed steps with ✓ and skip them.

**Fresh start (all steps):**
```
[1/10] Basic setup - vault name and location
[2/10] Inspecting existing structure...
[3/10] Workflow preferences collected
[4/10] Selected plugins for your workflow
[5/10] Generated QuickAdd choices based on your activities
[6/10] Knowledge growth preferences noted
[7/10] Plugin configuration complete
[8/10] Vault created at ~/Documents/Obsidian/MyVault
[9/10] Generated personalized Getting Started guide
[10/10] Opened vault in Obsidian
```

**Resuming from Step 5.5 (example):**
```
✓ Basic setup complete
✓ Structure in place (PARA folders)
✓ Workflow configured
✓ 5 plugins installed
✓ QuickAdd shortcuts ready

Resuming setup...

[1/3] Knowledge growth preferences
[2/3] Updating Getting Started guide
[3/3] Opening vault in Obsidian
```

**Enhancement mode (vault complete):**
```
Your vault is fully configured. Let's make some enhancements.

[1/2] Adding requested features
[2/2] Updating Getting Started guide
```
