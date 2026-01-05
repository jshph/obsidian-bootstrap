# Vault State Evaluation

This document details how to evaluate an existing vault's state to determine which wizard steps are complete and where to resume.

## Evaluation Script

Run this script on an existing vault to check completion status:

```bash
VAULT_PATH="[PATH_TO_VAULT]"

# Check each completion signal
echo "=== VAULT STATE EVALUATION ==="

# Step 1: Basic Setup
[ -d "$VAULT_PATH/.obsidian" ] && echo "STEP1_COMPLETE: .obsidian exists"

# Step 2: Structure exists
[ -d "$VAULT_PATH/inbox" ] || [ -d "$VAULT_PATH/Inbox" ] && echo "STEP2_HAS_INBOX"
[ -d "$VAULT_PATH/templates" ] || [ -d "$VAULT_PATH/Templates" ] && echo "STEP2_HAS_TEMPLATES"

# Step 3: Workflow discovery (check if plugins suggest workflow was discussed)
[ -f "$VAULT_PATH/.obsidian/community-plugins.json" ] && echo "STEP3_COMPLETE: plugins configured"

# Step 4: Plugin selection
PLUGIN_COUNT=$(ls "$VAULT_PATH/.obsidian/plugins" 2>/dev/null | wc -l | tr -d ' ')
echo "STEP4_PLUGINS_INSTALLED: $PLUGIN_COUNT"

# Step 5: QuickAdd configuration
[ -f "$VAULT_PATH/.obsidian/plugins/quickadd/data.json" ] && \
  grep -q '"choices"' "$VAULT_PATH/.obsidian/plugins/quickadd/data.json" 2>/dev/null && \
  echo "STEP5_QUICKADD_CONFIGURED"

# Check for custom templates (not just empty folder)
TEMPLATE_COUNT=$(find "$VAULT_PATH/templates" -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
echo "STEP5_TEMPLATES_CREATED: $TEMPLATE_COUNT"

# Step 5.5: Knowledge growth (check Getting Started for advanced sections)
[ -f "$VAULT_PATH/Getting-Started.md" ] && \
  grep -q "Growing Your Knowledge\|When You're Ready to Go Deeper" "$VAULT_PATH/Getting-Started.md" 2>/dev/null && \
  echo "STEP5_5_KNOWLEDGE_GROWTH_INCLUDED"

# Step 6: Plugin-specific configuration
[ -f "$VAULT_PATH/.obsidian/plugins/readwise-official/data.json" ] && \
  grep -q '"token":' "$VAULT_PATH/.obsidian/plugins/readwise-official/data.json" 2>/dev/null && \
  ! grep -q '"token": ""' "$VAULT_PATH/.obsidian/plugins/readwise-official/data.json" 2>/dev/null && \
  echo "STEP6_READWISE_CONFIGURED"

# Step 7: Vault created (redundant with step 1, but confirms structure)
echo "STEP7_VAULT_EXISTS"

# Step 8: Getting Started guide
[ -f "$VAULT_PATH/Getting-Started.md" ] && echo "STEP8_GETTING_STARTED_EXISTS"

# Check if guide is personalized (not just template)
[ -f "$VAULT_PATH/Getting-Started.md" ] && \
  ! grep -q "\[VAULT_NAME\]\|\[PLUGIN_COUNT\]" "$VAULT_PATH/Getting-Started.md" 2>/dev/null && \
  echo "STEP8_GETTING_STARTED_PERSONALIZED"

# Step 9: Opened (can't verify, assume done if guide exists)
```

## Step Completion Matrix

| Step | Completion Signal | What it means |
|------|-------------------|---------------|
| 1 | `.obsidian` folder exists | Vault initialized |
| 2 | Folder structure exists + patterns detected | Structure in place |
| 3 | `community-plugins.json` exists | Workflow discussed, plugins selected |
| 4 | Plugins in `.obsidian/plugins/` | Plugins installed |
| 5 | `quickadd/data.json` has choices + templates exist | QuickAdd configured |
| 5.5 | Getting Started contains knowledge sections | Knowledge growth discussed |
| 6 | Plugin-specific configs (e.g., Readwise token) | Plugins configured |
| 7 | Vault folder structure complete | Vault created |
| 8 | `Getting-Started.md` exists and personalized | Guide generated |

## Resume Logic

Based on evaluation, determine the resume point:

| State | Resume From | User Message |
|-------|-------------|--------------|
| No vault / no `.obsidian` | Step 1 | "Let's set up a new vault from scratch." |
| `.obsidian` exists, no plugins | Step 3 | "I found your vault. Let's set up your workflow and plugins." |
| Plugins installed, no QuickAdd config | Step 5 | "Your plugins are ready. Let's configure shortcuts and templates." |
| QuickAdd configured, no knowledge growth | Step 5.5 | "Your daily workflow is set up. Want to explore ways to grow your knowledge system?" |
| Knowledge growth done, no Getting Started | Step 8 | "Almost done! Let me generate your personalized Getting Started guide." |
| Everything complete | Offer enhancements | "Your vault is fully set up! Would you like to add more features or adjust anything?" |

## Presenting Findings

**For partially complete vaults:**

```
I found an existing vault at [PATH]:

✓ Basic structure (PARA folders)
✓ 5 plugins installed (dataview, templater, tasks, quickadd, readwise)
✓ QuickAdd shortcuts configured
✗ Knowledge growth habits not discussed yet
✓ Getting Started guide exists

You're almost there! Would you like to:
1. Explore knowledge growth habits (linking, hub notes, etc.)
2. Add more plugins or workflows
3. Regenerate the Getting Started guide with updates
4. Something else
```

**For fully complete vaults:**

```
Your vault is fully set up! Here's what you have:

• PARA organization with inbox, projects, areas, resources, archive
• 5 plugins: dataview, templater, tasks, quickadd, readwise
• QuickAdd shortcuts for capture, tasks, meetings
• Personalized Getting Started guide

Would you like to:
1. Add more plugins (PDFs, media, advanced automation)
2. Add knowledge growth content to your guide
3. Create additional templates
4. Adjust your current setup
5. I'm all set!
```

## Structure Detection Patterns

When analyzing an existing directory (Step 2), look for these patterns:

| Finding | Inference | Action |
|---------|-----------|--------|
| Existing `.obsidian` | Already a vault | Ask: enhance existing or start fresh? |
| PARA folders (inbox/projects/areas/resources/archive) | Uses PARA | Pre-select PARA, skip org question |
| `daily/` or `Daily/` folder | Uses daily notes | Pre-select daily notes plugin |
| `Readwise/` folder | Has Readwise | Pre-select Readwise plugin, ask for token |
| Task checkboxes in files | Tracks tasks | Pre-select Tasks plugin |
| Dataview queries | Uses dataview | Pre-select Dataview (already essential) |
| Empty or no directory | Fresh start | Run full wizard |
