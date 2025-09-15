#!/bin/bash

# Obsidian Vault Bootstrap MCP Server Setup Script

echo "🎯 Setting up Obsidian Vault Bootstrap MCP Server..."

# Check if bun is installed
if ! command -v bun &> /dev/null; then
    echo "❌ Bun is not installed. Please install it first:"
    echo "   curl -fsSL https://bun.sh/install | bash"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
bun install

# Check if claude CLI is installed
if command -v claude &> /dev/null; then
    echo "✅ Claude CLI detected"
    
    # Ask user for installation scope
    echo ""
    echo "How would you like to install the MCP server?"
    echo "1) Project scope (shareable with team)"
    echo "2) User scope (personal use only)"
    echo "3) Skip Claude setup (manual configuration)"
    read -p "Choose option (1-3): " choice
    
    case $choice in
        1)
            echo "📝 Adding MCP server to project scope..."
            claude mcp add obsidian-bootstrap --scope project "bun run $(pwd)/src/index.ts"
            echo "✅ Added to project .mcp.json"
            ;;
        2)
            echo "👤 Adding MCP server to user scope..."
            claude mcp add obsidian-bootstrap --scope user "bun run $(pwd)/src/index.ts"
            echo "✅ Added to user configuration"
            ;;
        3)
            echo "⚠️  Manual setup required. Add this to your .mcp.json:"
            echo ""
            cat .mcp.json
            echo ""
            ;;
    esac
else
    echo "⚠️  Claude CLI not found. Creating .mcp.json for manual configuration..."
    echo ""
    echo "Add this MCP server to Claude Desktop by:"
    echo "1. Creating .mcp.json in your project root"
    echo "2. Or running: claude mcp add obsidian-bootstrap --scope project \"bun run $(pwd)/src/index.ts\""
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📚 To use the MCP server in Claude Desktop:"
echo "   Type: 'Use the bootstrap_vault prompt to create a new Obsidian vault'"
echo ""
echo "🧪 To test locally:"
echo "   Run: bun run src/index.ts"
echo ""
echo "Happy note-taking! 🚀"