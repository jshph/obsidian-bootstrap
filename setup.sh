#!/bin/bash

# Obsidian Bootstrap MCP Server Setup Script
# Automatically installs the obsidian-bootstrap MCP server to Claude Code

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🚀 Obsidian Bootstrap MCP Server Setup"
echo "======================================"
echo ""

# Configuration
BINARY_URL="https://raw.githubusercontent.com/jshph/obsidian-bootstrap/master/dist/obsidian-bootstrap"
INSTALL_DIR="$HOME/.claude/mcp-servers/obsidian-bootstrap"
BINARY_NAME="obsidian-bootstrap"

# Check if claude CLI is installed
if ! command -v claude &> /dev/null; then
    echo -e "${RED}❌ Claude CLI is not installed or not in PATH${NC}"
    echo "Please install Claude Code first: https://claude.ai/download"
    exit 1
fi

echo "📦 Installing Obsidian Bootstrap MCP Server..."

# Create installation directory
mkdir -p "$INSTALL_DIR"

# Download the prebuilt binary
echo "⬇️  Downloading prebuilt binary..."
if command -v curl &> /dev/null; then
    curl -L -o "$INSTALL_DIR/$BINARY_NAME" "$BINARY_URL"
elif command -v wget &> /dev/null; then
    wget -O "$INSTALL_DIR/$BINARY_NAME" "$BINARY_URL"
else
    echo -e "${RED}❌ Neither curl nor wget is installed${NC}"
    exit 1
fi

# Make binary executable
chmod +x "$INSTALL_DIR/$BINARY_NAME"

echo -e "${GREEN}✅ Binary downloaded and installed${NC}"

# Add to Claude Code MCP servers
echo ""
echo "📝 Registering with Claude Code..."

# Use claude mcp add command
claude mcp add obsidian-bootstrap --scope user "$INSTALL_DIR/$BINARY_NAME"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Successfully installed and registered obsidian-bootstrap MCP server!${NC}"
    echo ""
    echo "🎉 Installation complete!"
    echo ""
    echo "Quick Start:"
    echo ""
    echo "Run Bootstrap Vault in Claude Code:"
    echo -e "   ${GREEN}claude \"/obsidian-bootstrap:bootstrap_vault (MCP)\"${NC}"
    echo ""
    echo "────────────────────────────────────────────────"
    echo ""
    echo -e "💡 ${YELLOW}Recommended: Install Enzyme${NC}"
    echo ""
    echo "Transform your vault into Claude's extended memory!"
    echo ""
    echo "Enzyme surfaces the hidden connections in your thinking by analyzing"
    echo "the web of tags and links across your notes, helping Claude understand"
    echo "not just what you've written, but the themes and patterns that emerge"
    echo "from how your ideas connect."
    echo ""
    echo "Install with:"
    echo -e "   ${GREEN}cd /path/to/markdown/vault && bash <(curl -fsSL enzyme.garden/install.sh) && claude \"/enzyme:enzyme (MCP)\"${NC}"
    echo ""
    echo "What Enzyme enables:"
    echo -e "   • ${GREEN}Contextual Intelligence${NC}: Claude grasps the relationships between"
    echo "     scattered ideas through your tag and link structure"
    echo -e "   • ${GREEN}Knowledge Synthesis${NC}: Build on existing notes by understanding their"
    echo "     connections, helping Claude create new insights grounded in your thinking"
    echo -e "   • ${GREEN}Emergent Themes${NC}: Surface patterns you didn't know existed by"
    echo "     analyzing how concepts cluster and connect"
    echo -e "   • ${GREEN}Creative Extension${NC}: Generate new knowledge that naturally extends"
    echo "     your existing ideas, respecting your conceptual framework"
    echo -e "   • ${GREEN}Living Knowledge Graph${NC}: Your vault becomes both a queryable memory"
    echo "     and a foundation for creating coherent new knowledge"
else
    echo -e "${YELLOW}⚠️  Failed to register with Claude Code${NC}"
    echo "You can manually add it to your Claude config with:"
    echo "  claude mcp add obsidian-bootstrap --scope user \"$INSTALL_DIR/$BINARY_NAME\""
fi