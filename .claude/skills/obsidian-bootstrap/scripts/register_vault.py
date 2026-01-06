#!/usr/bin/env python3
"""
Register a vault in Obsidian's application config.

Usage:
  python register_vault.py /path/to/vault

Exit codes:
  0 - Success (outputs vault ID)
  1 - Obsidian not installed
  2 - Invalid arguments
  3 - Vault path does not exist
"""

import json
import os
import platform
import secrets
import sys
import time


def get_obsidian_config_dir():
    """Get the Obsidian config directory for the current platform."""
    system = platform.system()
    if system == "Darwin":
        return os.path.expanduser("~/Library/Application Support/obsidian")
    elif system == "Windows":
        return os.path.join(os.environ.get("APPDATA", ""), "obsidian")
    elif system == "Linux":
        return os.path.expanduser("~/.config/obsidian")
    return None


def register_vault(vault_path):
    """
    Register a vault in Obsidian's config.
    Returns the vault ID if successful, None if failed.
    """
    config_dir = get_obsidian_config_dir()
    if not config_dir or not os.path.exists(config_dir):
        print(f"Error: Obsidian config directory not found", file=sys.stderr)
        print(f"Expected: {config_dir}", file=sys.stderr)
        print(f"Download Obsidian from: https://obsidian.md/download", file=sys.stderr)
        return None

    obsidian_config_path = os.path.join(config_dir, "obsidian.json")

    # Ensure absolute path
    vault_path = os.path.abspath(vault_path)

    # Verify vault path exists
    if not os.path.exists(vault_path):
        print(f"Error: Vault path does not exist: {vault_path}", file=sys.stderr)
        return None

    # Read current config (or create empty one)
    if os.path.exists(obsidian_config_path):
        with open(obsidian_config_path, 'r') as f:
            config = json.load(f)
    else:
        config = {"vaults": {}}

    # Check if vault already registered
    for vault_id, vault_info in config.get('vaults', {}).items():
        if vault_info.get('path') == vault_path:
            print(f"already_registered")
            print(f"vault_id={vault_id}")
            print(f"vault_path={vault_path}")
            return vault_id

    # Generate a new 16-char hex ID
    new_id = secrets.token_hex(8)

    # Add new vault entry
    config['vaults'][new_id] = {
        'path': vault_path,
        'ts': int(time.time() * 1000),
        'open': True
    }

    # Write updated config
    with open(obsidian_config_path, 'w') as f:
        json.dump(config, f)

    # Create window config for the new vault
    window_config = {
        "x": 100,
        "y": 100,
        "width": 1200,
        "height": 800,
        "isMaximized": False,
        "devTools": False,
        "zoom": 0
    }

    window_config_path = os.path.join(config_dir, f"{new_id}.json")
    with open(window_config_path, 'w') as f:
        json.dump(window_config, f)

    print(f"registered")
    print(f"vault_id={new_id}")
    print(f"vault_path={vault_path}")
    return new_id


def main():
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} /path/to/vault", file=sys.stderr)
        sys.exit(2)

    vault_path = sys.argv[1]

    if not os.path.exists(vault_path):
        print(f"Error: Path does not exist: {vault_path}", file=sys.stderr)
        sys.exit(3)

    result = register_vault(vault_path)

    if result is None:
        sys.exit(1)

    sys.exit(0)


if __name__ == "__main__":
    main()
