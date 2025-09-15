# Obsidian Vault Bootstrap MCP Server

An MCP (Model Context Protocol) server that exposes a single prompt to help you bootstrap new Obsidian vaults or migrate from existing GitHub repos using simple, transparent bash commands. No tools, no hidden logic — just clear instructions you can run yourself.

## Features

- Prompts-only: One prompt `bootstrap_vault`; no MCP tools
- Transparent: Uses `mkdir`, `cat`, `cp`, and `git clone`
- Template presets: minimal, para, pkm, zettelkasten (folder lists only)
- Migration helper: Analyze a repo’s `.obsidian` and copy configs

## Install

### Pre-built binary

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

### Build from source

```bash
git clone https://github.com/yourusername/bootstrap-vault
cd bootstrap-vault
bun install
bun run build
```

Outputs `dist/obsidian-bootstrap` (no extra template files required).

### Development

Run with Bun:

```json
{
  "mcpServers": {
    "obsidian-bootstrap": {
      "command": "bun",
      "args": ["run", "/path/to/bootstrap-vault/src/index.ts"]
    }
  }
}
```

## Usage

### Direct CLI Invocation (Fastest)

You can directly bootstrap a vault from the command line:

```bash
# Use default configuration (https://github.com/jshph/.obsidian)
claude --prompt obsidian-bootstrap:bootstrap_vault

# Specify custom location
claude --prompt obsidian-bootstrap:bootstrap_vault location="~/Documents/MyVault"

# Use a different GitHub config
claude --prompt obsidian-bootstrap:bootstrap_vault github_repo="https://github.com/kepano/obsidian-minimal"

# Both custom location and repo
claude --prompt obsidian-bootstrap:bootstrap_vault location="~/Vaults/Work" github_repo="https://github.com/your/config"
```

### Connect via Claude (recommended)

Project-scoped (creates `.mcp.json` in your project):

```bash
cd /path/to/bootstrap-vault
claude mcp add obsidian-bootstrap --scope project "bun run src/index.ts"
```

User-scoped (available to all projects on your machine):

```bash
claude mcp add obsidian-bootstrap --scope user "bun run /path/to/bootstrap-vault/src/index.ts"
```

Manual `.mcp.json` option:

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

### How it works

- Use the CLI to invoke the prompt directly, or ask Claude to use the `bootstrap_vault` prompt:
  - "Create a PKM vault called Second-Brain in ~/Documents"
  - "Help me migrate from https://github.com/kepano/obsidian-minimal"
- The server returns a structured prompt; Claude then generates and runs bash commands on your machine (with your confirmation). You can approve/decline each step.

### Example: Create a PKM vault (run by Claude)

```bash
VAULT_PATH=~/Documents/Obsidian/Second-Brain
mkdir -p "$VAULT_PATH/.obsidian"
mkdir -p "$VAULT_PATH"/{MOCs,Sources,Ideas,Projects,daily-notes,templates,attachments}

cat > "$VAULT_PATH/.obsidian/app.json" << 'EOF'
{
  "attachmentFolderPath": "attachments",
  "alwaysUpdateLinks": true,
  "showLineNumber": true,
  "defaultViewMode": "source"
}
EOF
```

### Example: Migrate from a GitHub repo (run by Claude)

```bash
git clone --depth 1 https://github.com/OWNER/REPO /tmp/obsidian-analysis
ls -la /tmp/obsidian-analysis/.obsidian/

# Copy core configs (manifests only for plugins)
NEW_VAULT_PATH=~/Documents/Obsidian/MyMigratedVault
mkdir -p "$NEW_VAULT_PATH/.obsidian/plugins"
cp -r /tmp/obsidian-analysis/.obsidian "$NEW_VAULT_PATH/"
rm -rf "$NEW_VAULT_PATH/.obsidian/plugins"/*/
find /tmp/obsidian-analysis/.obsidian/plugins -name "manifest.json" -exec sh -c \
  'mkdir -p "$NEW_VAULT_PATH/.obsidian/plugins/$(basename $(dirname {}))" && \
   cp {} "$NEW_VAULT_PATH/.obsidian/plugins/$(basename $(dirname {}))"' \;
```

## Notes

- The MCP server itself does not execute commands; Claude runs the bash it generates in your shell with your approval.
- No MCP tools are exposed — only the `bootstrap_vault` prompt.
- Templates define suggested folders only; you choose any plugins inside Obsidian.

## Development

```bash
# Dev (auto-reload)
bun run dev

# Build
bun run build
```

## License

MIT

---
Built with Bun. This project ships a prompts-only MCP server per SIMPLIFICATION_NOTES.md.
