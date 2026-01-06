#!/usr/bin/env python3
"""
Check if Obsidian is installed by looking for its config directory.
Exit codes:
  0 - Obsidian is installed
  1 - Obsidian is not installed
  2 - Unknown platform
"""

import os
import platform
import sys


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


def main():
    config_dir = get_obsidian_config_dir()

    if config_dir is None:
        print(f"Unknown platform: {platform.system()}")
        sys.exit(2)

    if os.path.exists(config_dir):
        print(f"Obsidian is installed")
        print(f"Config directory: {config_dir}")
        sys.exit(0)
    else:
        print(f"Obsidian is not installed")
        print(f"Download from: https://obsidian.md/download")
        sys.exit(1)


if __name__ == "__main__":
    main()
