# Vault Registration

Obsidian maintains a vault registry separate from the `.obsidian` folder inside each vault. To make a newly created vault appear in Obsidian's vault switcher without manual "Open folder as vault", we need to register it in the application-level config.

## Scripts

Three Python scripts in `scripts/` handle cross-platform vault registration:

| Script | Purpose | Exit Codes |
|--------|---------|------------|
| `check_obsidian.py` | Check if Obsidian is installed | 0=installed, 1=not installed, 2=unknown platform |
| `register_vault.py` | Register a vault in Obsidian's config | 0=success, 1=Obsidian not installed, 2=invalid args, 3=path not found |
| `restart_obsidian.py` | Restart Obsidian (required after registration) | 0=success, 1=failed, 2=unknown platform |

## Usage

```bash
# 1. Check if Obsidian is installed
python scripts/check_obsidian.py
# Output: "Obsidian is installed" or "Obsidian is not installed"

# 2. Register the vault
python scripts/register_vault.py /absolute/path/to/vault
# Output:
#   registered
#   vault_id=39b1279d7741260d
#   vault_path=/absolute/path/to/vault

# 3. Restart Obsidian to pick up new vault
python scripts/restart_obsidian.py

# 4. Open the vault (after Obsidian restarts)
sleep 3
open "obsidian://open?vault=39b1279d7741260d&file=Getting-Started"
```

## Config Locations

| Platform | Config Directory |
|----------|-----------------|
| **macOS** | `~/Library/Application Support/obsidian/` |
| **Windows** | `%APPDATA%\obsidian\` |
| **Linux** | `~/.config/obsidian/` |

## Registry Structure

The vault registry is stored in `obsidian.json`:

```json
{
  "vaults": {
    "<16-char-hex-id>": {
      "path": "/absolute/path/to/vault",
      "ts": 1767719315077,
      "open": true
    }
  }
}
```

Each vault also has a window config file `<vault-id>.json`:

```json
{
  "x": 100,
  "y": 100,
  "width": 1200,
  "height": 800,
  "isMaximized": false,
  "devTools": false,
  "zoom": 0
}
```

## Full Registration Flow

1. Check if Obsidian is installed (`check_obsidian.py`)
2. If not installed, prompt user to download from https://obsidian.md/download
3. Create vault folder structure with `.obsidian`
4. Register vault (`register_vault.py`) - adds to `obsidian.json`
5. Restart Obsidian (`restart_obsidian.py`)
6. Open vault using `obsidian://open?vault=<vault-id>`

## Fallback

If registration fails or Obsidian isn't installed, use path-based URI (triggers "Trust vault?" prompt):

```bash
open "obsidian://open?path=/path/to/vault/Getting-Started.md"
```

## Notes

- **Obsidian must be installed** for the config directory to exist
- **Restart required** - Obsidian reads the vault registry on startup
- **Vault ID is stable** - Once registered, the ID persists across sessions
- **Safe to re-run** - Scripts check for existing registration before adding
- **Cross-platform** - Scripts detect OS and use appropriate paths/commands
