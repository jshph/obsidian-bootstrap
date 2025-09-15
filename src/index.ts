#!/usr/bin/env bun
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  ListToolsRequestSchema,
  PromptArgument,
  PromptMessage,
  TextContent,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import * as fs from "fs/promises";
import * as path from "path";
import { existsSync } from "fs";
import * as os from "os";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const execAsync = promisify(exec);

// Helper to find template directory
function findTemplatesRoot(): string {
  // Check common locations for templates
  const possiblePaths = [
    // Development: templates are in project root
    path.join(__dirname, '..', 'templates'),
    // Built executable: templates might be in same directory as executable
    path.join(process.cwd(), 'templates'),
    // Built executable: templates might be next to the executable
    path.join(path.dirname(process.execPath), 'templates'),
    // Fallback to current working directory
    path.join('.', 'templates')
  ];
  
  for (const templatePath of possiblePaths) {
    if (existsSync(templatePath)) {
      return path.dirname(templatePath);
    }
  }
  
  // If no templates found, return a path that will cause clear errors
  console.error('Warning: Could not find templates directory');
  return process.cwd();
}

const PROJECT_ROOT = findTemplatesRoot();

// Helper to fetch .obsidian config from a git repo
async function fetchObsidianConfig(repoUrl: string): Promise<{
  config: any;
  hotkeys: any;
  plugins: string[];
  themes: string[];
  snippets: string[];
  error?: string;
}> {
  const tempDir = path.join(os.tmpdir(), `obsidian-config-${Date.now()}`);

  try {
    // Clone the repo (shallow clone for speed)
    await execAsync(`git clone --depth 1 "${repoUrl}" "${tempDir}"`);

    const obsidianPath = path.join(tempDir, '.obsidian');

    if (!existsSync(obsidianPath)) {
      throw new Error('No .obsidian folder found in the repository');
    }

    // Read various config files
    const config: any = {};
    const configFiles = [
      'app.json',
      'appearance.json',
      'core-plugins.json',
      'community-plugins.json',
      'hotkeys.json',
      'workspace.json'
    ];

    for (const file of configFiles) {
      const filePath = path.join(obsidianPath, file);
      if (existsSync(filePath)) {
        const content = await fs.readFile(filePath, 'utf-8');
        config[file.replace('.json', '')] = JSON.parse(content);
      }
    }

    // Get list of installed plugins
    const pluginsPath = path.join(obsidianPath, 'plugins');
    let plugins: string[] = [];
    if (existsSync(pluginsPath)) {
      plugins = await fs.readdir(pluginsPath);
    }

    // Get themes
    const themesPath = path.join(obsidianPath, 'themes');
    let themes: string[] = [];
    if (existsSync(themesPath)) {
      const themeFiles = await fs.readdir(themesPath);
      themes = themeFiles.filter(f => f.endsWith('.css')).map(f => f.replace('.css', ''));
    }

    // Get snippets
    const snippetsPath = path.join(obsidianPath, 'snippets');
    let snippets: string[] = [];
    if (existsSync(snippetsPath)) {
      snippets = await fs.readdir(snippetsPath);
    }

    // Clean up temp directory
    await fs.rm(tempDir, { recursive: true, force: true });

    return {
      config,
      hotkeys: config.hotkeys || {},
      plugins,
      themes,
      snippets
    };
  } catch (error: any) {
    // Clean up temp directory on error
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {}

    return {
      config: {},
      hotkeys: {},
      plugins: [],
      themes: [],
      snippets: [],
      error: error.message
    };
  }
}

// Analyze hotkeys and workflows from a config
function analyzeHotkeysAndWorkflows(config: any): {
  hotkeys: Array<{ command: string; keys: string; description: string }>;
  workflows: Array<{ name: string; description: string; steps: string[] }>;
  recommendations: string[];
} {
  const hotkeys: Array<{ command: string; keys: string; description: string }> = [];
  const workflows: Array<{ name: string; description: string; steps: string[] }> = [];
  const recommendations: string[] = [];

  // Analyze hotkeys
  if (config.hotkeys) {
    for (const [command, settings] of Object.entries(config.hotkeys)) {
      if (settings && typeof settings === 'object') {
        const hotkeySettings = settings as any;
        if (hotkeySettings.length > 0) {
          const modifiers = hotkeySettings[0].modifiers || [];
          const key = hotkeySettings[0].key || '';
          const keys = [...modifiers, key].join('+');

          // Generate human-readable description
          let description = command.replace(/:/g, ' - ').replace(/-/g, ' ');
          hotkeys.push({ command, keys, description });
        }
      }
    }
  }

  // Detect common workflows based on plugins and settings
  const plugins = config['community-plugins'] || [];
  const corePlugins = config['core-plugins'] || {};

  // Daily notes workflow
  if (corePlugins['daily-notes']) {
    workflows.push({
      name: 'Daily Notes Workflow',
      description: 'Daily journaling and task management',
      steps: [
        'Create daily note with configured template',
        'Review yesterday\'s tasks',
        'Plan today\'s activities',
        'Link to relevant projects/notes'
      ]
    });
  }

  // Zettelkasten workflow
  if (plugins.includes('obsidian-zettelkasten-plugin') ||
      plugins.includes('obsidian-citation-plugin')) {
    workflows.push({
      name: 'Zettelkasten Workflow',
      description: 'Academic note-taking with atomic notes',
      steps: [
        'Create atomic notes with unique IDs',
        'Link notes bidirectionally',
        'Build index/structure notes',
        'Regular review for emergence'
      ]
    });
  }

  // Task management workflow
  if (plugins.includes('obsidian-tasks-plugin') ||
      plugins.includes('obsidian-kanban')) {
    workflows.push({
      name: 'Task Management Workflow',
      description: 'GTD-style task and project management',
      steps: [
        'Capture tasks in daily notes',
        'Process into project files',
        'Review in kanban boards',
        'Archive completed items'
      ]
    });
  }

  // Generate recommendations
  if (hotkeys.length < 5) {
    recommendations.push('Consider setting up more hotkeys for frequently used commands');
  }

  if (!plugins.includes('templater-obsidian') && !plugins.includes('quickadd')) {
    recommendations.push('Install Templater or QuickAdd for powerful note templates');
  }

  if (!corePlugins['graph']) {
    recommendations.push('Enable the Graph view to visualize note connections');
  }

  return { hotkeys, workflows, recommendations };
}

// Merge external config with base template
async function mergeConfigWithTemplate(
  externalConfig: any,
  baseTemplate: string,
  vaultPath: string
): Promise<void> {
  const obsidianPath = path.join(vaultPath, '.obsidian');

  // Start with base template config
  await createObsidianConfig(obsidianPath, baseTemplate);

  // Merge hotkeys
  if (externalConfig.hotkeys) {
    const hotkeysPath = path.join(obsidianPath, 'hotkeys.json');
    let existingHotkeys = {};

    if (existsSync(hotkeysPath)) {
      const content = await fs.readFile(hotkeysPath, 'utf-8');
      existingHotkeys = JSON.parse(content);
    }

    // Merge external hotkeys with existing ones
    const mergedHotkeys = { ...existingHotkeys, ...externalConfig.hotkeys };
    await fs.writeFile(hotkeysPath, JSON.stringify(mergedHotkeys, null, 2));
  }

  // Merge app settings
  if (externalConfig.app) {
    const appPath = path.join(obsidianPath, 'app.json');
    let existingApp = {};

    if (existsSync(appPath)) {
      const content = await fs.readFile(appPath, 'utf-8');
      existingApp = JSON.parse(content);
    }

    // Selective merge of app settings
    const mergedApp: any = {
      ...existingApp,
      ...externalConfig.app,
      // Preserve local paths
      attachmentFolderPath: (existingApp as any).attachmentFolderPath || externalConfig.app.attachmentFolderPath
    };

    await fs.writeFile(appPath, JSON.stringify(mergedApp, null, 2));
  }

  // Add community plugins list (but don't copy plugin data)
  if (externalConfig['community-plugins']) {
    await fs.writeFile(
      path.join(obsidianPath, 'community-plugins.json'),
      JSON.stringify(externalConfig['community-plugins'], null, 2)
    );
  }
}

// Vault template definitions
const VAULT_TEMPLATES: Record<string, any> = {
  minimal: {
    name: "Minimal Starter",
    description: "Clean start with basic folder structure",
    folders: ["notes", "daily", "attachments", "Readwise"],
    features: ["Simple daily notes", "Basic folder organization", "Readwise integration"],
  },
  pkm: {
    name: "Personal Knowledge Management",
    description: "PARA method with MOCs and linked notes",
    folders: ["1-Projects", "2-Areas", "3-Resources", "4-Archive", "daily-notes", "templates", "attachments", "Readwise/Books", "Readwise/Articles", "Readwise/Podcasts"],
    features: ["PARA method", "Maps of Content", "Daily notes", "Weekly reviews", "Readwise sync"],
  },
  research: {
    name: "Academic Research",
    description: "Literature notes, citations, and thesis management",
    folders: ["literature-notes", "permanent-notes", "projects", "bibliography", "drafts", "attachments"],
    features: ["Zettelkasten-style notes", "Citation management", "Literature reviews", "Academic writing"],
  },
  zettelkasten: {
    name: "Zettelkasten",
    description: "Atomic notes with unique IDs and emergence tracking",
    folders: ["fleeting", "literature", "permanent", "index", "attachments"],
    features: ["Unique note IDs", "Atomic notes", "Strict linking", "Emergence patterns"],
  },
  project: {
    name: "Project Management",
    description: "Tasks, sprints, and team collaboration",
    folders: ["projects", "tasks", "meetings", "documentation", "reviews", "templates", "attachments"],
    features: ["Kanban boards", "Sprint planning", "Meeting notes", "Project dashboards"],
  },
  journaling: {
    name: "Daily Journaling",
    description: "Reflection, gratitude, and personal growth",
    folders: ["journal", "gratitude", "goals", "reflections", "dreams", "attachments"],
    features: ["Daily prompts", "Mood tracking", "Goal setting", "Weekly reviews"],
  },
  technical: {
    name: "Technical Documentation",
    description: "API docs, architecture, and code snippets",
    folders: ["apis", "architecture", "guides", "troubleshooting", "changelog", "snippets", "diagrams", "attachments"],
    features: ["Code blocks", "Mermaid diagrams", "API references", "Architecture decisions"],
  },
  creative: {
    name: "Creative Writing",
    description: "Characters, worldbuilding, and story drafts",
    folders: ["characters", "worldbuilding", "scenes", "drafts", "research", "ideas", "attachments"],
    features: ["Character sheets", "World maps", "Scene tracking", "Story structure"],
  },
  gtd: {
    name: "Getting Things Done",
    description: "GTD methodology with contexts and reviews",
    folders: ["inbox", "next-actions", "projects", "waiting-for", "someday-maybe", "reference", "attachments"],
    features: ["GTD workflow", "Context tags", "Weekly reviews", "Quick capture"],
  },
  business: {
    name: "Business/Startup",
    description: "Strategy, customers, and metrics tracking",
    folders: ["strategy", "customers", "competitors", "metrics", "meetings", "ideas", "attachments"],
    features: ["Business model canvas", "Customer interviews", "KPI tracking", "Competitive analysis"],
  },
  content: {
    name: "Content Creation",
    description: "Blog posts, videos, and content calendar",
    folders: ["ideas", "drafts", "published", "research", "assets", "calendar", "attachments"],
    features: ["Content pipeline", "Editorial calendar", "SEO optimization", "Publishing workflow"],
  },
  learning: {
    name: "Learning & Study",
    description: "Courses, flashcards, and knowledge testing",
    folders: ["courses", "flashcards", "practice", "resources", "progress", "notes", "attachments"],
    features: ["Spaced repetition", "Course notes", "Practice problems", "Progress tracking"],
  },
};

// Template starter notes
const TEMPLATE_NOTES: Record<string, Record<string, string>> = {
  minimal: {
    "README.md": `# My Obsidian Vault

Welcome to your new Obsidian vault!

## Getting Started
- Create new notes in the \`notes\` folder
- Daily notes will be saved in \`daily\`
- Attachments go in the \`attachments\` folder

## Tips
- Use \`[[double brackets]]\` to link between notes
- Tags help organize: #example
- Press Cmd/Ctrl+P for command palette`,
  },
  pkm: {
    "1-Projects/README.md": `# Projects
Active projects with defined outcomes and deadlines.`,
    "2-Areas/README.md": `# Areas
Ongoing responsibilities to maintain over time.`,
    "3-Resources/README.md": `# Resources
Topics of ongoing interest for future reference.`,
    "4-Archive/README.md": `# Archive
Inactive items from the other categories.`,
    "templates/daily-note.md": `# {{date}}

## Today's Focus
- 

## Tasks
- [ ] 

## Notes


## Reflection
`,
  },
  research: {
    "literature-notes/README.md": `# Literature Notes
Notes from books, papers, and articles. One source per note.`,
    "permanent-notes/README.md": `# Permanent Notes
Your own insights, written in your own words, atomic and self-contained.`,
    "templates/literature-note.md": `# {{title}}

**Source:** 
**Authors:** 
**Year:** 
**Type:** 

## Summary

## Key Points
- 

## Quotes

## My Thoughts

## Related Notes
- [[]]`,
  },
  // Add more template notes for each type...
};

// Initialize MCP server
const server = new Server(
  {
    name: "obsidian-vault-bootstrap",
    version: "1.0.0",
  },
  {
    capabilities: {
      prompts: {},
      tools: {},
    },
  }
);

// Helper function to create directory structure
async function createDirectoryStructure(basePath: string, folders: string[]) {
  for (const folder of folders) {
    const folderPath = path.join(basePath, folder);
    await fs.mkdir(folderPath, { recursive: true });
  }
}

// Helper function to create starter notes
async function createStarterNotes(basePath: string, notes: Record<string, string>) {
  for (const [notePath, content] of Object.entries(notes)) {
    const fullPath = path.join(basePath, notePath);
    const dir = path.dirname(fullPath);
    await fs.mkdir(dir, { recursive: true });
    
    // Process template variables
    const processedContent = content.replace(/{{date}}/g, new Date().toISOString().split('T')[0]);
    await fs.writeFile(fullPath, processedContent, 'utf-8');
  }
}

// Helper function to copy plugin manifests for auto-installation
async function copyPluginManifests(obsidianPath: string, selectedPlugins: string[]) {
  const pluginsPath = path.join(obsidianPath, "plugins");
  const templatePluginsPath = path.join(PROJECT_ROOT, "templates/plugins");
  
  
  for (const pluginId of selectedPlugins) {
    const pluginPath = path.join(pluginsPath, pluginId);
    const templatePluginPath = path.join(templatePluginsPath, pluginId);
    
    // Create plugin directory
    await fs.mkdir(pluginPath, { recursive: true });
    
    // Check if we have a manifest for this plugin
    const manifestPath = path.join(templatePluginPath, "manifest.json");
    
    if (existsSync(manifestPath)) {
      try {
        // Copy manifest.json
        const manifest = await fs.readFile(manifestPath, 'utf-8');
        await fs.writeFile(path.join(pluginPath, "manifest.json"), manifest);
        
        // Copy other files if they exist (main.js, styles.css, data.json)
        const filesToCopy = ['main.js', 'styles.css', 'data.json'];
        for (const file of filesToCopy) {
          const sourcePath = path.join(templatePluginPath, file);
          if (existsSync(sourcePath)) {
            const content = await fs.readFile(sourcePath, 'utf-8');
            await fs.writeFile(path.join(pluginPath, file), content);
          }
        }
      } catch (error) {
        // Silently fall back to embedded manifest
      }
    } else {
      // Fallback: Create basic manifests for known plugins
      const fallbackManifests: Record<string, any> = {
        "templater-obsidian": {
          id: "templater-obsidian",
          name: "Templater",
          version: "2.14.0",
          description: "Create and use templates",
          minAppVersion: "1.5.0",
          author: "SilentVoid",
          authorUrl: "https://github.com/SilentVoid13",
          helpUrl: "https://silentvoid13.github.io/Templater/",
          isDesktopOnly: false
        },
        "dataview": {
          id: "dataview",
          name: "Dataview",
          version: "0.5.68",
          minAppVersion: "0.13.11",
          description: "Complex data views for the data-obsessed.",
          author: "Michael Brenan <blacksmithgu@gmail.com>",
          authorUrl: "https://github.com/blacksmithgu",
          helpUrl: "https://blacksmithgu.github.io/obsidian-dataview/",
          isDesktopOnly: false
        },
        "quickadd": {
          id: "quickadd",
          name: "QuickAdd",
          version: "1.14.0",
          minAppVersion: "0.13.19",
          description: "Quickly add content to your vault",
          author: "Christian B. B. Houmann",
          authorUrl: "https://github.com/chhoumann",
          helpUrl: "https://github.com/chhoumann/quickadd",
          isDesktopOnly: false
        },
        "readwise-official": {
          id: "readwise-official",
          name: "Readwise Official",
          version: "2.0.1",
          minAppVersion: "0.13.19",
          description: "Official Readwise plugin for syncing highlights",
          author: "Readwise",
          authorUrl: "https://readwise.io",
          helpUrl: "https://help.readwise.io",
          isDesktopOnly: false
        },
        "obsidian-tasks-plugin": {
          id: "obsidian-tasks-plugin",
          name: "Tasks",
          version: "7.14.0",
          minAppVersion: "1.1.1",
          description: "Task management for Obsidian",
          author: "Clare Macrae and others",
          authorUrl: "https://github.com/obsidian-tasks-group/obsidian-tasks",
          helpUrl: "https://publish.obsidian.md/tasks/",
          isDesktopOnly: false
        },
        "calendar": {
          id: "calendar",
          name: "Calendar",
          version: "1.5.10",
          minAppVersion: "0.9.11",
          description: "Calendar view of your daily notes",
          author: "Liam Cain",
          authorUrl: "https://github.com/liamcain",
          helpUrl: "https://github.com/liamcain/obsidian-calendar-plugin",
          isDesktopOnly: false
        }
      };
      
      if (fallbackManifests[pluginId]) {
        try {
          await fs.writeFile(
            path.join(pluginPath, "manifest.json"),
            JSON.stringify(fallbackManifests[pluginId], null, 2)
          );
        } catch (error) {
          // Silent fail
        }
      }
    }
  }
}

// Helper function to create Obsidian config
async function createObsidianConfig(vaultPath: string, template: string): Promise<string[]> {
  const obsidianPath = path.join(vaultPath, ".obsidian");
  await fs.mkdir(obsidianPath, { recursive: true });
  
  // Create plugins directory
  const pluginsPath = path.join(obsidianPath, "plugins");
  await fs.mkdir(pluginsPath, { recursive: true });
  
  // Load base configurations
  const appConfigPath = path.join(PROJECT_ROOT, "templates/configs/base-app.json");
  const pluginsConfigPath = path.join(PROJECT_ROOT, "templates/configs/base-plugins.json");
  
  // Create app.json (with community plugins enabled)
  let appConfig;
  try {
    appConfig = JSON.parse(await fs.readFile(appConfigPath, 'utf-8'));
  } catch (error) {
    console.error(`Failed to read app config from ${appConfigPath}:`, error);
    // Fallback to embedded config
    appConfig = {
      "attachmentFolderPath": "attachments",
      "alwaysUpdateLinks": true,
      "showLineNumber": true,
      "showFrontmatter": true,
      "defaultViewMode": "source",
      "readableLineLength": false,
      "promptDelete": false
    };
  }
  await fs.writeFile(
    path.join(obsidianPath, "app.json"),
    JSON.stringify(appConfig, null, 2)
  );
  
  // Create core-plugins.json
  const corePluginsPath = path.join(PROJECT_ROOT, "templates/configs/core-plugins.json");
  let corePlugins;
  try {
    if (existsSync(corePluginsPath)) {
      corePlugins = JSON.parse(await fs.readFile(corePluginsPath, 'utf-8'));
    } else {
      throw new Error('Core plugins config not found');
    }
  } catch (error) {
    // Fallback to embedded config
    corePlugins = {
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
      "slash-command": false,
      "editor-status": true,
      "bookmarks": true,
      "markdown-importer": false,
      "zk-prefixer": false,
      "random-note": false,
      "outline": true,
      "word-count": true,
      "slides": false,
      "audio-recorder": false,
      "workspaces": false,
      "file-recovery": true,
      "publish": false,
      "sync": false
    };
  }
  await fs.writeFile(
    path.join(obsidianPath, "core-plugins.json"),
    JSON.stringify(corePlugins, null, 2)
  );
  
  // Create community-plugins.json
  // Note: The mere presence of this file with plugins disables restricted mode in Obsidian
  let pluginsConfig;
  try {
    pluginsConfig = JSON.parse(await fs.readFile(pluginsConfigPath, 'utf-8'));
  } catch (error) {
    console.error(`Failed to read plugins config from ${pluginsConfigPath}:`, error);
    // Fallback to embedded config
    pluginsConfig = {
      "minimal": ["templater-obsidian", "readwise-official"],
      "pkm": ["templater-obsidian", "dataview", "tasks-obsidian", "quickadd", "readwise-official"],
      "research": ["templater-obsidian", "citations", "pdf-plus", "readwise-official", "dataview"],
      "zettelkasten": ["templater-obsidian", "unique-note-id", "dataview", "readwise-official"],
      "project": ["templater-obsidian", "tasks-obsidian", "kanban", "quickadd"],
      "journaling": ["templater-obsidian", "calendar", "periodic-notes", "tracker"],
      "technical": ["templater-obsidian", "code-block-copy", "mermaid", "dataview"],
      "creative": ["templater-obsidian", "longform", "word-count", "writing-goals"],
      "gtd": ["templater-obsidian", "tasks-obsidian", "quickadd", "periodic-notes"],
      "business": ["templater-obsidian", "dataview", "kanban", "charts"],
      "content": ["templater-obsidian", "calendar", "tasks-obsidian", "tag-wrangler"],
      "learning": ["templater-obsidian", "spaced-repetition", "flashcards-obsidian", "tracker"]
    };
  }
  const selectedPlugins = pluginsConfig[template] || [];
  
  // Always include templater for template functionality
  if (!selectedPlugins.includes("templater-obsidian")) {
    selectedPlugins.push("templater-obsidian");
  }
  
  await fs.writeFile(
    path.join(obsidianPath, "community-plugins.json"),
    JSON.stringify(selectedPlugins, null, 2)
  );
  
  // Copy plugin manifests for auto-installation
  await copyPluginManifests(obsidianPath, selectedPlugins);
  
  // Create workspace.json
  const workspace = {
    main: {
      id: "main",
      type: "split",
      children: [{
        id: "leaf",
        type: "leaf",
        state: {
          type: "markdown",
          state: {
            file: "README.md",
            mode: "source",
            source: false
          }
        }
      }],
      direction: "vertical"
    },
    left: {
      id: "left",
      type: "split",
      children: [{
        id: "file-explorer",
        type: "leaf",
        state: {
          type: "file-explorer",
          state: { sortOrder: "alphabetical" }
        }
      }],
      direction: "horizontal",
      width: 300
    },
    active: "leaf"
  };
  
  await fs.writeFile(
    path.join(obsidianPath, "workspace.json"),
    JSON.stringify(workspace, null, 2)
  );
  
  // Create hotkeys configuration
  await createHotkeysConfig(obsidianPath, template);
  
  // Return the selected plugins for the success message
  return selectedPlugins;
}

// DEPRECATED: Plugin configuration functions
// Plugins must be installed through Obsidian's interface first
/*
// Helper function to configure Templater
async function configureTemplater(vaultPath: string, template: string) {
  const templaterPath = path.join(vaultPath, ".obsidian/plugins/templater-obsidian");
  await fs.mkdir(templaterPath, { recursive: true });
  
  // Copy Templater templates
  const templatesPath = path.join(vaultPath, "templates");
  await fs.mkdir(templatesPath, { recursive: true });
  
  // Copy template files based on vault type
  const sourceTemplatesPath = path.join(PROJECT_ROOT, "templates/templater");
  const templateFiles = ["daily-note.md", "meeting.md", "project.md"];
  
  for (const file of templateFiles) {
    const sourcePath = path.join(sourceTemplatesPath, file);
    try {
      if (existsSync(sourcePath)) {
        const content = await fs.readFile(sourcePath, 'utf-8');
        await fs.writeFile(path.join(templatesPath, file), content);
      } else {
        // Fallback to embedded templates
        let content = '';
        if (file === 'daily-note.md') {
          content = `# {{date:YYYY-MM-DD}} - {{date:dddd}}

## Tasks
- [ ] 

## Notes

## Journal
`;
        } else if (file === 'meeting.md') {
          content = `# Meeting: {{title}}
Date: {{date:YYYY-MM-DD HH:mm}}
Attendees: 

## Agenda
- 

## Notes

## Action Items
- [ ] 
`;
        } else if (file === 'project.md') {
          content = `# Project: {{title}}
Created: {{date:YYYY-MM-DD}}
Status: Active

## Goals
- 

## Tasks
- [ ] 

## Resources
- 
`;
        }
        if (content) {
          await fs.writeFile(path.join(templatesPath, file), content);
        }
      }
    } catch (error) {
      console.error(`Failed to copy template ${file}:`, error);
    }
  }
  
  // Create Templater configuration
  const templaterConfig = {
    "command_timeout": 5,
    "templates_folder": "templates",
    "templates_pairs": [
      ["", ""],
      ["daily-notes", "templates/daily-note.md"],
      ["meetings", "templates/meeting.md"],
      ["projects", "templates/project.md"]
    ],
    "trigger_on_file_creation": true,
    "auto_jump_to_cursor": true,
    "enable_system_commands": false,
    "shell_path": "",
    "user_scripts_folder": "templates/scripts",
    "enable_folder_templates": true,
    "folder_templates": [
      {
        "folder": "daily-notes",
        "template": "templates/daily-note.md"
      },
      {
        "folder": "meetings",
        "template": "templates/meeting.md"
      },
      {
        "folder": "projects",
        "template": "templates/project.md"
      }
    ],
    "syntax_highlighting": true,
    "startup_templates": [""]
  };
  
  await fs.writeFile(
    path.join(templaterPath, "data.json"),
    JSON.stringify(templaterConfig, null, 2)
  );
}

// Helper function to configure QuickAdd for ribbon buttons
async function configureQuickAdd(vaultPath: string, template: string) {
  const quickAddPath = path.join(vaultPath, ".obsidian/plugins/quickadd");
  await fs.mkdir(quickAddPath, { recursive: true });
  
  // Create QuickAdd macros for common actions
  const quickAddConfig = {
    "choices": [
      {
        "id": "daily-note",
        "name": "📅 Daily Note",
        "type": "Template",
        "command": true,
        "templatePath": "templates/daily-note.md",
        "folder": "daily-notes",
        "appendLink": false,
        "openFile": true
      },
      {
        "id": "new-meeting",
        "name": "👥 New Meeting",
        "type": "Template",
        "command": true,
        "templatePath": "templates/meeting.md",
        "folder": "meetings",
        "appendLink": false,
        "openFile": true
      },
      {
        "id": "new-project",
        "name": "🚀 New Project",
        "type": "Template",
        "command": true,
        "templatePath": "templates/project.md",
        "folder": "projects",
        "appendLink": false,
        "openFile": true
      },
      {
        "id": "quick-capture",
        "name": "💡 Quick Capture",
        "type": "Capture",
        "command": true,
        "appendLink": false,
        "captureTo": "inbox/quick-capture.md",
        "captureToActiveFile": false,
        "createFileIfItDoesntExist": true,
        "format": "- {{VALUE}}\n",
        "insertAfter": "## Captures",
        "openFile": false,
        "prepend": false
      }
    ],
    "macros": [],
    "inputPrompt": "single-line",
    "devMode": false,
    "version": "0.14.0"
  };
  
  await fs.writeFile(
    path.join(quickAddPath, "data.json"),
    JSON.stringify(quickAddConfig, null, 2)
  );
}

// Helper function to configure Readwise
async function configureReadwise(vaultPath: string, template: string) {
  const readwisePath = path.join(vaultPath, ".obsidian/plugins/readwise-official");
  await fs.mkdir(readwisePath, { recursive: true });
  
  // Create Readwise folders
  const readwiseFolders = [
    "Readwise",
    "Readwise/Books", 
    "Readwise/Articles",
    "Readwise/Podcasts",
    "Readwise/Tweets",
    "Readwise/Supplementals"
  ];
  
  for (const folder of readwiseFolders) {
    await fs.mkdir(path.join(vaultPath, folder), { recursive: true });
  }
  
  // Load and customize Readwise config based on template
  const configPath = path.join(PROJECT_ROOT, "templates/readwise/readwise-config.json");
  let readwiseConfig;
  try {
    readwiseConfig = JSON.parse(await fs.readFile(configPath, 'utf-8'));
  } catch (error) {
    console.error(`Failed to read Readwise config from ${configPath}:`, error);
    // Fallback to embedded config
    readwiseConfig = {
      "token": "",
      "readwiseDir": "Readwise",
      "frequency": "60",
      "triggerOnLoad": true,
      "isSyncing": false,
      "lastSyncFailed": false,
      "lastSavedStatusID": 0,
      "currentSyncStatusID": 0,
      "refreshBooks": true,
      "booksToRefresh": [],
      "booksIDsMap": {},
      "articleIDsMap": {},
      "newFormatPathBooks": "Readwise/Books/{{title}}.md",
      "newFormatPathArticles": "Readwise/Articles/{{title}}.md"
    };
  }
  
  // Customize paths based on template type
  if (template === "zettelkasten") {
    readwiseConfig.newFormatPathBooks = "literature/books/{{title}}.md";
    readwiseConfig.newFormatPathArticles = "literature/articles/{{title}}.md";
  } else if (template === "research") {
    readwiseConfig.newFormatPathBooks = "literature-notes/books/{{title}}.md";
    readwiseConfig.newFormatPathArticles = "literature-notes/articles/{{title}}.md";
  } else if (template === "pkm") {
    readwiseConfig.newFormatPathBooks = "3-Resources/Books/{{title}}.md";
    readwiseConfig.newFormatPathArticles = "3-Resources/Articles/{{title}}.md";
  }
  
  await fs.writeFile(
    path.join(readwisePath, "data.json"),
    JSON.stringify(readwiseConfig, null, 2)
  );
  
  // Copy Readwise templates
  const readwiseTemplates = [
    "book-template.md",
    "article-template.md",
    "podcast-template.md"
  ];
  
  const templatesPath = path.join(vaultPath, "templates/readwise");
  await fs.mkdir(templatesPath, { recursive: true });
  
  for (const templateFile of readwiseTemplates) {
    const sourcePath = path.join(PROJECT_ROOT, "templates/readwise", templateFile);
    try {
      if (existsSync(sourcePath)) {
        const content = await fs.readFile(sourcePath, 'utf-8');
        await fs.writeFile(path.join(templatesPath, templateFile), content);
      } else {
        // Fallback to embedded templates
        let content = '';
        if (templateFile === 'book-template.md') {
          content = `# {{title}}

## Metadata
- Author: {{author}}
- Category: {{category}}

## Highlights
{{highlights}}

## Summary
{{summary}}`;
        } else if (templateFile === 'article-template.md') {
          content = `# {{title}}

## Metadata
- Author: {{author}}
- URL: {{url}}

## Highlights
{{highlights}}

## Summary
{{summary}}`;
        } else if (templateFile === 'podcast-template.md') {
          content = `# {{title}}

## Metadata
- Show: {{show}}
- Episode: {{episode}}

## Notes
{{highlights}}

## Key Takeaways
{{summary}}`;
        }
        if (content) {
          await fs.writeFile(path.join(templatesPath, templateFile), content);
        }
      }
    } catch (error) {
      console.error(`Failed to copy Readwise template ${templateFile}:`, error);
    }
  }
  
  // Create Readwise README
  const readwiseReadme = `# Readwise Integration

## Setup Instructions

1. Get your Readwise API token from: https://readwise.io/access_token
2. Open Obsidian Settings → Community Plugins → Readwise Official
3. Enter your API token
4. Click "Initiate Sync" to import your highlights

## Folder Structure

- **Readwise/Books/** - Book highlights and notes
- **Readwise/Articles/** - Article highlights
- **Readwise/Podcasts/** - Podcast notes
- **Readwise/Tweets/** - Saved tweets
- **Readwise/Supplementals/** - Additional notes

## Features

- Auto-sync every 60 minutes
- Custom templates for each content type
- Automatic tagging and categorization
- Metadata preservation
- Cross-linking with your other notes

## Templates

Custom templates are located in \`templates/readwise/\`:
- Book Template: Full book notes with highlights
- Article Template: Web articles and blog posts
- Podcast Template: Episode notes and takeaways

## Tips

- Use tags like #readwise/book or #readwise/article to filter
- Create MOCs (Maps of Content) for your reading lists
- Link book notes to project notes for research
- Use Dataview to create reading dashboards
`;
  
  await fs.writeFile(
    path.join(vaultPath, "Readwise/README.md"),
    readwiseReadme
  );
}
*/

// Helper function to create hotkeys configuration
async function createHotkeysConfig(obsidianPath: string, template: string) {
  const hotkeys = {
    "app:toggle-left-sidebar": [
      {
        "modifiers": ["Mod", "Shift"],
        "key": "L"
      }
    ],
    "app:toggle-right-sidebar": [
      {
        "modifiers": ["Mod", "Shift"],
        "key": "R"
      }
    ],
    "templater-obsidian:insert-templater": [
      {
        "modifiers": ["Mod"],
        "key": "T"
      }
    ],
    "templater-obsidian:create-new-note-from-template": [
      {
        "modifiers": ["Mod", "Alt"],
        "key": "N"
      }
    ],
    "quickadd:runQuickAdd": [
      {
        "modifiers": ["Mod"],
        "key": "Q"
      }
    ],
    "daily-notes:goto-daily-note": [
      {
        "modifiers": ["Mod", "Shift"],
        "key": "D"
      }
    ]
  };
  
  await fs.writeFile(
    path.join(obsidianPath, "hotkeys.json"),
    JSON.stringify(hotkeys, null, 2)
  );
}

// Tool: Create vault
const createVaultTool: Tool = {
  name: "create_vault",
  description: "Create a new Obsidian vault with selected template",
  inputSchema: {
    type: "object",
    properties: {
      path: {
        type: "string",
        description: "Path where the vault should be created (optional, defaults to ~/Documents/Obsidian)",
      },
      template: {
        type: "string",
        enum: Object.keys(VAULT_TEMPLATES),
        description: "Template type to use",
      },
      name: {
        type: "string",
        description: "Name of the vault",
      },
    },
    required: ["template", "name"],
  },
};

// Tool: List templates
const listTemplatesTool: Tool = {
  name: "list_templates",
  description: "List all available vault templates",
  inputSchema: {
    type: "object",
    properties: {},
  },
};

// Tool: Analyze external config
const analyzeConfigTool: Tool = {
  name: "analyze_config",
  description: "Analyze an Obsidian config from a git repository URL",
  inputSchema: {
    type: "object",
    properties: {
      url: {
        type: "string",
        description: "Git repository URL containing .obsidian folder",
      },
    },
    required: ["url"],
  },
};

// Tool: Adopt external config
const adoptConfigTool: Tool = {
  name: "adopt_config",
  description: "Create a vault adopting config from a git repository",
  inputSchema: {
    type: "object",
    properties: {
      url: {
        type: "string",
        description: "Git repository URL containing .obsidian folder",
      },
      name: {
        type: "string",
        description: "Name for the new vault",
      },
      path: {
        type: "string",
        description: "Path where the vault should be created (optional)",
      },
      baseTemplate: {
        type: "string",
        enum: Object.keys(VAULT_TEMPLATES),
        description: "Base template to merge with (optional, defaults to minimal)",
      },
    },
    required: ["url", "name"],
  },
};

// Register tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [createVaultTool, listTemplatesTool, analyzeConfigTool, adoptConfigTool],
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  switch (name) {
    case "create_vault": {
      const { path: vaultPath, template, name: vaultName } = args as any;
      
      // Expand and validate the path
      let expandedPath = vaultPath;
      
      // If no path provided, use default
      if (!expandedPath || expandedPath === '') {
        expandedPath = path.join(os.homedir(), 'Documents', 'Obsidian');
      }
      
      // Handle common path shortcuts
      if (expandedPath.startsWith('~')) {
        expandedPath = expandedPath.replace(/^~/, os.homedir());
      }
      
      // Handle relative paths like "Documents" or "Desktop"
      if (!expandedPath.startsWith('/') && !expandedPath.startsWith('C:') && !expandedPath.includes(':')) {
        // It's a relative path, prepend home directory
        expandedPath = path.join(os.homedir(), expandedPath);
      }
      
      // If path starts with /Users/Documents without username, add current user
      if (expandedPath === '/Users/Documents' || expandedPath.startsWith('/Users/Documents/')) {
        const homeDir = os.homedir();
        expandedPath = expandedPath.replace('/Users/Documents', `${homeDir}/Documents`);
      }
      
      // Default to Documents folder if path is invalid
      if (expandedPath === '/Users' || expandedPath === '/' || expandedPath === 'C:\\') {
        expandedPath = path.join(os.homedir(), 'Documents', 'Obsidian');
      }
      
      // Ensure parent directory exists
      try {
        await fs.mkdir(expandedPath, { recursive: true });
      } catch (error) {
        console.error(`Failed to create parent directory: ${expandedPath}`);
      }
      
      const fullPath = path.join(expandedPath, vaultName);
      
      // Check if directory already exists
      if (existsSync(fullPath)) {
        return {
          content: [
            {
              type: "text",
              text: `Error: Directory ${fullPath} already exists`,
            },
          ],
        };
      }
      
      try {
        // Create vault directory
        await fs.mkdir(fullPath, { recursive: true });
        
        // Create folder structure
        const templateConfig = VAULT_TEMPLATES[template as keyof typeof VAULT_TEMPLATES];
        await createDirectoryStructure(fullPath, templateConfig.folders);
        
        // Create starter notes
        const starterNotes = TEMPLATE_NOTES[template as keyof typeof TEMPLATE_NOTES] || {};
        await createStarterNotes(fullPath, starterNotes);
        
        // Create Obsidian configuration and get selected plugins
        const selectedPlugins = await createObsidianConfig(fullPath, template);
        
        return {
          content: [
            {
              type: "text",
              text: `✅ **Vault Created Successfully!**

📁 **Location:** ${fullPath}
🎨 **Template:** ${templateConfig.name}

## What I've Set Up For You:

### 📂 Folder Structure
${templateConfig.folders.map((f: string) => `- ${f}/`).join('\n')}

### 🔌 Plugins Configured
The following plugins will auto-install when you open the vault:
${selectedPlugins.map((p: string) => `- ${p}`).join('\n')}

### ⌨️ Hotkeys Set Up
- **Cmd+Shift+D** → Daily Note
- **Cmd+Shift+M** → New Meeting
- **Cmd+T** → Insert Template
- **Cmd+Q** → Quick Capture

## 🚀 Quick Start Guide

### Step 1: Open Your Vault
1. Open Obsidian
2. Click "Open folder as vault"
3. Select: ${fullPath}

### Step 2: Enable Community Plugins
1. When prompted about restricted mode, click "Turn off restricted mode"
2. Plugins will auto-download and install
3. You may need to reload Obsidian once for all plugins to activate

### Step 3: Your Daily Workflow
${template === 'pkm' ? 
`1. **Morning**: Create daily note (Cmd+Shift+D)
2. **During day**: Quick capture ideas (Cmd+Q)
3. **Reading**: Highlights sync via Readwise
4. **Evening**: Process inbox, create permanent notes
5. **Weekly**: Review and organize` :
template === 'research' ?
`1. **New source**: Create literature note
2. **While reading**: Highlight in Readwise
3. **After reading**: Process into permanent notes
4. **Writing**: Link notes in your drafts
5. **Weekly**: Update bibliography` :
`1. Start with daily note
2. Capture ideas as they come
3. Review and organize weekly`}

### Step 4: First Actions
- [ ] Create your first daily note
- [ ] Set up Readwise integration
- [ ] Explore the templates folder
- [ ] Customize your first template
- [ ] Create a test note with Cmd+T

## 💡 Pro Tips
- Start simple, add complexity over time
- Use templates for everything repetitive
- Let Readwise handle your reading highlights
- Review and refactor regularly

Your vault is ready! Open it in Obsidian to start building your knowledge system. 🎉`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error creating vault: ${error}`,
            },
          ],
        };
      }
    }
    
    case "list_templates": {
      const templateList = Object.entries(VAULT_TEMPLATES)
        .map(([key, template]) => {
          return `**${template.name}** (${key})\n${template.description}\nFeatures: ${template.features.join(", ")}`;
        })
        .join("\n\n");

      return {
        content: [
          {
            type: "text",
            text: `Available Vault Templates:\n\n${templateList}`,
          },
        ],
      };
    }

    case "analyze_config": {
      const { url } = args as any;
      const result = await fetchObsidianConfig(url);

      if (result.error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching config: ${result.error}`,
            },
          ],
        };
      }

      const analysis = analyzeHotkeysAndWorkflows(result.config);

      let output = `# Obsidian Config Analysis\n\n`;
      output += `## Plugins\n`;
      output += `- **Community Plugins:** ${result.plugins.join(', ') || 'None'}\n`;
      output += `- **Themes:** ${result.themes.join(', ') || 'None'}\n`;
      output += `- **Snippets:** ${result.snippets.join(', ') || 'None'}\n\n`;

      output += `## Key Hotkeys\n`;
      if (analysis.hotkeys.length > 0) {
        analysis.hotkeys.slice(0, 10).forEach(h => {
          output += `- **${h.keys}**: ${h.description}\n`;
        });
      } else {
        output += `No custom hotkeys configured\n`;
      }

      output += `\n## Detected Workflows\n`;
      analysis.workflows.forEach(w => {
        output += `### ${w.name}\n${w.description}\n`;
        w.steps.forEach(s => output += `- ${s}\n`);
      });

      if (analysis.recommendations.length > 0) {
        output += `\n## Recommendations\n`;
        analysis.recommendations.forEach(r => output += `- ${r}\n`);
      }

      return {
        content: [
          {
            type: "text",
            text: output,
          },
        ],
      };
    }

    case "adopt_config": {
      const { url, name: vaultName, path: vaultPath, baseTemplate = "minimal" } = args as any;

      // Fetch external config
      const result = await fetchObsidianConfig(url);
      if (result.error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching config: ${result.error}`,
            },
          ],
        };
      }

      // Determine vault path
      let expandedPath = vaultPath;
      if (!expandedPath || expandedPath === '') {
        expandedPath = path.join(os.homedir(), 'Documents', 'Obsidian');
      }
      if (expandedPath.startsWith('~')) {
        expandedPath = expandedPath.replace(/^~/, os.homedir());
      }
      if (!expandedPath.startsWith('/') && !expandedPath.startsWith('C:') && !expandedPath.includes(':')) {
        expandedPath = path.join(os.homedir(), expandedPath);
      }

      const finalPath = path.join(expandedPath, vaultName);

      // Create vault with base template
      await fs.mkdir(finalPath, { recursive: true });
      const template = VAULT_TEMPLATES[baseTemplate];
      for (const folder of template.folders) {
        await fs.mkdir(path.join(finalPath, folder), { recursive: true });
      }

      // Merge configurations
      await mergeConfigWithTemplate(result.config, baseTemplate, finalPath);

      return {
        content: [
          {
            type: "text",
            text: `Vault "${vaultName}" created at ${finalPath} with config adopted from ${url}`,
          },
        ],
      };
    }

    default:
      return {
        content: [
          {
            type: "text",
            text: `Unknown tool: ${name}`,
          },
        ],
      };
  }
});

// Register prompts
server.setRequestHandler(ListPromptsRequestSchema, async () => ({
  prompts: [
    {
      name: "bootstrap_vault",
      description: "Interactive Obsidian vault creation wizard",
      arguments: [
        {
          name: "location",
          description: "Where to create the vault (optional)",
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
    
    const messages: PromptMessage[] = [
      {
        role: "assistant",
        content: {
          type: "text",
          text: `# 🎯 Obsidian Vault Bootstrap Wizard

Welcome! I'll help you create a perfectly configured Obsidian vault. Let me show you the available templates and guide you through the setup.

## Available Vault Templates:

${Object.entries(VAULT_TEMPLATES).map(([key, template]) => 
  `### ${template.name} (\`${key}\`)
${template.description}
**Features:** ${template.features.join(", ")}
`).join("\n")}

## Let's Create Your Vault!

To get started, I need to know:
1. **Which template would you like?** (or we can combine features from multiple templates)
2. **What will you name your vault?**
3. **Where should I create it?** (default: ${location})

### Quick Start Examples:

**For a research vault:**
\`\`\`
Create a research vault called "PhD-Research" in ~/Documents/Obsidian
\`\`\`

**For a personal knowledge management system:**
\`\`\`
Set up a PKM vault named "Second-Brain" with Zettelkasten features
\`\`\`

**For a minimal start:**
\`\`\`
Create a minimal vault called "Notes" on my Desktop
\`\`\`

### Advanced Customization:

I can also:
- Combine features from multiple templates
- Add custom folder structures
- Configure specific plugins
- Create custom templates for your notes
- Set up automation with Templater
- Configure hotkeys for your workflow

**Tip:** After creation, I can help you:
- Import existing notes
- Set up sync with Git
- Configure advanced plugins
- Create custom CSS snippets
- Build dataview queries

What kind of Obsidian vault would you like to create today?`,
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