# Obsidian Vault Bootstrap MCP Server

An MCP (Model Context Protocol) server that helps you bootstrap new Obsidian vaults or migrate from existing GitHub repos using simple, transparent bash commands.

## Features

- Prompts-only: One prompt `bootstrap_vault`; no MCP tools
- Transparent: Uses `mkdir`, `cat`, `cp`, and `git clone`
- Template presets: minimal, para, pkm, zettelkasten (folder lists only)
- Migration helper: Analyze a repo's `.obsidian` and copy configs

## Installation

### Quick Install (Recommended)

Run this one-liner to automatically install the obsidian-bootstrap MCP server:

```bash
curl -fsSL https://raw.githubusercontent.com/jshph/obsidian-bootstrap/master/setup.sh | sh
```

This will:
- Download the prebuilt binary
- Install it to `~/.claude/mcp-servers/obsidian-bootstrap`
- Register it with Claude Code automatically

### Manual Installation

<details>
<summary>Alternative: Install from source or use pre-built binary</summary>

#### Option 1: Pre-built binary

The compiled MCP server is in `dist/obsidian-bootstrap`.

Claude Desktop configuration (paths vary by OS):
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- Linux: `~/.config/claude/claude_desktop_config.json`

Add to `mcpServers`:

```json
{
  "mcpServers": {
    "obsidian-bootstrap": {
      "command": "/absolute/path/to/bootstrap-vault/dist/obsidian-bootstrap"
    }
  }
}
```

#### Option 2: Build from source

```bash
git clone https://github.com/jshph/obsidian-bootstrap
cd obsidian-bootstrap
bun install
bun run build
```

Outputs `dist/obsidian-bootstrap` (no extra template files required).

</details>

## Usage

### Quick Start (Recommended)

1. Open Claude in interactive mode:
   ```bash
   claude
   ```

2. In Claude, type:
   ```
   /obsidian-bootstrap:bootstrap_vault (MCP)
   ```

3. Follow the prompts to:
   - Create a vault with the default configuration
   - Choose from preset templates (minimal, PARA, PKM, Zettelkasten)
   - Migrate from your own GitHub repository

That's it! Claude will handle the rest.
```

## Development

```bash
# Dev (auto-reload)
bun run dev

# Build
bun run build
```

## License

MIT
