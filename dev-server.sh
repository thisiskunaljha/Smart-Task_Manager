#!/bin/bash

# PWA Installation and Testing Script
# This script helps you set up and test your PWA locally

echo "🚀 Smart Task Manager - PWA Setup & Testing"
echo "============================================"
echo ""

# Check if Python is available
if command -v python3 &> /dev/null; then
    echo "✅ Starting local server with Python 3..."
    echo ""
    echo "📍 Open your browser to: http://localhost:8000"
    echo "📍 For HTTPS testing: https://localhost:8000 (requires trust)"
    echo ""
    echo "💡 Tip: In Chrome DevTools (F12), go to Application → Manifest & Service Workers"
    echo "💡 Use Lighthouse (F12 → Lighthouse) to audit your PWA"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    python3 -m http.server 8000

elif command -v http-server &> /dev/null; then
    echo "✅ Starting local server with http-server..."
    echo ""
    echo "📍 Open your browser to: http://localhost:8080"
    echo ""
    http-server -p 8080

elif command -v ruby &> /dev/null; then
    echo "✅ Starting local server with Ruby..."
    echo ""
    echo "📍 Open your browser to: http://localhost:8000"
    echo ""
    ruby -run -ehttpd . -p8000

elif command -v php &> /dev/null; then
    echo "✅ Starting local server with PHP..."
    echo ""
    echo "📍 Open your browser to: http://localhost:8000"
    echo ""
    php -S localhost:8000

else
    echo "❌ No suitable server found!"
    echo ""
    echo "Please install one of the following:"
    echo "  - Python 3: brew install python3"
    echo "  - Node.js: brew install node (then use: npx http-server)"
    echo "  - Ruby: brew install ruby"
    echo "  - PHP: brew install php"
    exit 1
fi
