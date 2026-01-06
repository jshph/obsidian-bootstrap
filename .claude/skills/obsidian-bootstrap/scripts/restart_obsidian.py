#!/usr/bin/env python3
"""
Restart Obsidian application (cross-platform).

Usage:
  python restart_obsidian.py

Exit codes:
  0 - Success
  1 - Failed to restart
  2 - Unknown platform
"""

import platform
import subprocess
import sys
import time


def restart_obsidian():
    """Restart Obsidian on the current platform."""
    system = platform.system()

    if system == "Darwin":
        # macOS
        try:
            # Quit Obsidian gracefully
            subprocess.run(
                ["osascript", "-e", 'tell application "Obsidian" to quit'],
                check=False,
                capture_output=True
            )
            time.sleep(2)

            # Reopen Obsidian
            subprocess.run(["open", "-a", "Obsidian"], check=True)
            return True
        except subprocess.CalledProcessError as e:
            print(f"Error restarting Obsidian: {e}", file=sys.stderr)
            return False

    elif system == "Windows":
        # Windows
        try:
            # Kill Obsidian
            subprocess.run(
                ["taskkill", "/IM", "Obsidian.exe", "/F"],
                check=False,
                capture_output=True
            )
            time.sleep(2)

            # Find and start Obsidian
            import os
            obsidian_path = os.path.join(
                os.environ.get("LOCALAPPDATA", ""),
                "Obsidian",
                "Obsidian.exe"
            )
            if os.path.exists(obsidian_path):
                subprocess.Popen([obsidian_path], shell=True)
                return True
            else:
                print(f"Obsidian not found at: {obsidian_path}", file=sys.stderr)
                return False
        except Exception as e:
            print(f"Error restarting Obsidian: {e}", file=sys.stderr)
            return False

    elif system == "Linux":
        # Linux
        try:
            # Kill Obsidian
            subprocess.run(
                ["pkill", "-x", "obsidian"],
                check=False,
                capture_output=True
            )
            time.sleep(2)

            # Start Obsidian (assumes it's in PATH)
            subprocess.Popen(
                ["obsidian"],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                start_new_session=True
            )
            return True
        except Exception as e:
            print(f"Error restarting Obsidian: {e}", file=sys.stderr)
            return False

    else:
        print(f"Unknown platform: {system}", file=sys.stderr)
        return None


def main():
    print(f"Restarting Obsidian on {platform.system()}...")

    result = restart_obsidian()

    if result is None:
        sys.exit(2)
    elif result:
        print("Obsidian restarted successfully")
        sys.exit(0)
    else:
        print("Failed to restart Obsidian", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
