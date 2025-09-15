# Obsidian Vault Bootstrap MCP Server

An MCP (Model Context Protocol) server that helps you quickly bootstrap new Obsidian vaults with pre-configured templates, folder structures, plugins, and Templater integration.

## Features

- 🎯 **12 Vault Templates**: From minimal to specialized (Research, GTD, Zettelkasten, etc.)
- 📁 **Auto Folder Structure**: Each template includes optimized folder organization
- 🔌 **Plugin Auto-Installation**: Plugins automatically install when you open the vault
- 📝 **Templater Integration**: Pre-configured Templater templates with hotkeys
- 📚 **Readwise Integration**: Automatic import of highlights from books, articles, and podcasts
- 🎨 **Quick Access**: Ribbon buttons for frequently used templates
- 🤖 **Interactive Wizard**: Step-by-step guidance through vault creation

### Included Plugins

The following plugins come pre-installed with full functionality:
- **Templater** - Advanced templating with variables and functions
- **Dataview** - Query and visualize your notes like a database
- **QuickAdd** - Quickly capture notes and apply templates
- **Tasks** - Track tasks across your entire vault
- **Readwise Official** - Sync highlights from books and articles
- **Calendar** - Visual calendar for daily notes (if selected)

## Available Templates

1. **Minimal** - Clean start with basic folders
2. **PKM** - Personal Knowledge Management with PARA method
3. **Research** - Academic research with citations
4. **Zettelkasten** - Atomic notes with unique IDs
5. **Project** - Task and project management
6. **Journaling** - Daily reflection and gratitude
7. **Technical** - Documentation and code snippets
8. **Creative** - Writing and worldbuilding
9. **GTD** - Getting Things Done methodology
10. **Business** - Strategy and metrics tracking
11. **Content** - Blog and content creation
12. **Learning** - Courses and study notes

## Installation

### Using Pre-built Binary (Recommended)

The MCP server is available as a pre-built executable in the `dist` folder. This requires the templates directory to be alongside the executable.

#### Claude Desktop Configuration

Edit your Claude Desktop configuration file:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- Linux: `~/.config/claude/claude_desktop_config.json`

Add the following to the `mcpServers` section:

```json
{
  "mcpServers": {
    "obsidian-bootstrap": {
      "command": "/absolute/path/to/bootstrap-vault/dist/obsidian-bootstrap"
    }
  }
}
```

**Important**: The `dist` folder contains:
- `obsidian-bootstrap` - The executable MCP server
- `templates/` - Required template files (must be in same directory)

### Building from Source

```bash
# Clone the repository
git clone https://github.com/yourusername/obsidian-vault-bootstrap
cd obsidian-vault-bootstrap

# Install dependencies
bun install

# Build the executable
./build.sh
```

This creates:
- `dist/obsidian-bootstrap` - Compiled executable
- `dist/templates/` - Template files with plugin manifests

### Development Mode

For development, you can run directly with Bun:

```json
{
  "mcpServers": {
    "obsidian-bootstrap": {
      "command": "bun",
      "args": ["run", "/path/to/bootstrap-vault/src/index.ts"]
    }
  }
}

## Usage

### With Claude Desktop (Claude Code)

There are two ways to add this MCP server to Claude:

#### Option 1: Project-Scoped (Recommended for sharing)

From your project directory, run:
```bash
cd /path/to/bootstrap-vault
claude mcp add obsidian-bootstrap --scope project "bun run src/index.ts"
```

This creates a `.mcp.json` file in your project root that can be committed to version control.

#### Option 2: User-Scoped (Personal use)

```bash
claude mcp add obsidian-bootstrap --scope user "bun run /path/to/bootstrap-vault/src/index.ts"
```

#### Option 3: Manual Configuration

Create `.mcp.json` in your project root:
```json
{
  "mcpServers": {
    "obsidian-bootstrap": {
      "command": "bun",
      "args": ["run", "src/index.ts"],
      "cwd": "/path/to/bootstrap-vault"
    }
  }
}
```

### Using the MCP Server

Once configured, restart Claude Desktop and you'll see the MCP server is connected.

#### Quick Commands

In Claude Desktop, you can use these commands:

```
Create a PKM vault for personal knowledge management
```

```
Set up a research vault for my PhD thesis
```

```
I need a GTD vault for task management
```

Or use the interactive wizard:
```
Use the bootstrap_vault prompt to help me create a new Obsidian vault
```

Claude will guide you through:
1. Understanding your use case
2. Recommending the best template
3. Creating your vault with plugins pre-installed
4. Setting up folder structure
5. Providing a personalized quick-start guide

#### What Happens Next

After vault creation:
1. Open the vault in Obsidian
2. When prompted about restricted mode, click "Turn off restricted mode"
3. Plugins will be automatically recognized and enabled
4. Start using your pre-configured templates with hotkeys

### Standalone Testing

```bash
bun run src/index.ts
```

## Templater Integration

Each vault comes pre-configured with Templater templates that include:

- **Hotkey Assignments**: Quick access to common templates (e.g., `Cmd+Shift+D` for daily note)
- **Template Syntax**: Variables like `<% tp.date.now() %>` for dynamic content
- **Folder Templates**: Auto-apply templates based on folder location
- **Custom Functions**: Pre-built JavaScript functions for advanced workflows

## Readwise Integration

All templates include Readwise configuration for seamless highlight import:

### Features
- **Auto-sync**: Highlights sync every 60 minutes
- **Custom Templates**: Separate templates for books, articles, podcasts
- **Smart Organization**: Highlights organized by content type
- **Metadata Preservation**: Author, source, tags, and dates preserved
- **Cross-linking**: Automatic linking with your existing notes

### Supported Sources
- 📚 **Books**: Kindle, Apple Books, Google Books
- 📰 **Articles**: Instapaper, Pocket, Reader
- 🎙️ **Podcasts**: Airr, Snipd, Readwise Reader
- 📄 **PDFs**: Via Readwise Reader app
- 🐦 **Tweets**: Twitter highlights
- 💭 **Supplementals**: Your own notes and thoughts

### Folder Structure
```
Readwise/
├── Books/        # Book highlights
├── Articles/     # Web articles
├── Podcasts/     # Podcast notes
├── Tweets/       # Twitter threads
└── Supplementals/ # Additional notes
```

### Ribbon Customization

The bootstrap process configures:
- Quick access buttons in the left ribbon for frequent templates
- Command palette shortcuts for all templates
- Mobile toolbar buttons for iOS/Android usage

## Template Features

### Daily Note Template (All Vaults)
- Auto-dated filename
- Links to previous/next day
- Task rollover from yesterday
- Weather widget (with API key)
- Random quote/prompt
- Mood and habit trackers

### Meeting Template (Business/Project)
- Attendee tracker
- Action item assignments
- Follow-up scheduling
- Meeting timer
- Agenda templates

### Literature Note (Research/Zettelkasten)
- Citation formatting
- Key concepts extraction
- Connection finder
- Bibliography generation
- Readwise integration

### Book/Article Templates (via Readwise)
- Automatic metadata extraction
- Highlight organization
- Reading progress tracking
- Related notes linking
- Action items from reading

## Interactive Setup Wizard

The MCP server uses a conversational approach to:
1. **Understand your needs**: Asks about your use case and workflow
2. **Recommend the best template**: Based on your requirements
3. **Configure step-by-step**: Sets up folders, plugins, and templates
4. **Provide personalized guidance**: Custom quick-start guide for your use case

## Advanced Configuration

The MCP server also supports:
- **Custom CSS Snippets**: Theme modifications per template
- **Workspace Layouts**: Pre-configured pane arrangements
- **Graph View Settings**: Optimized for each vault type
- **Plugin Settings**: Pre-configured plugin options
- **Sync Settings**: Git integration setup
- **Readwise API**: Pre-configured for highlight import

## Development

```bash
# Run in development
bun run dev

# Run tests
bun test

# Build for production
bun run build
```

## Contributing

Contributions welcome! Please read our contributing guidelines before submitting PRs.

## License

MIT

---
This project was created using `bun init` in bun v1.2.4. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
