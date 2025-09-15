#!/bin/bash

# Build the MCP server executable
echo "Building MCP server..."
bun build src/index.ts --compile --outfile dist/obsidian-bootstrap

# Copy templates to dist directory
echo "Copying templates..."
cp -r templates dist/

echo "Build complete!"
echo ""
echo "The built executable is at: dist/obsidian-bootstrap"
echo "Templates are included at: dist/templates/"
echo ""
echo "To use the MCP server, both files need to be together:"
echo "  - dist/obsidian-bootstrap (executable)"
echo "  - dist/templates/ (directory)"