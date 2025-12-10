#!/bin/bash

# MongoDB Startup Script for macOS

echo "🔍 Checking MongoDB installation..."

# Try to find MongoDB
MONGO_PATHS=(
    "/usr/local/bin/mongod"
    "/opt/homebrew/bin/mongod"
    "/Applications/MongoDB.app/Contents/Resources/mongod"
    "$HOME/.mongodb/bin/mongod"
)

MONGOD_FOUND=""

for path in "${MONGO_PATHS[@]}"; do
    if [ -f "$path" ]; then
        MONGOD_FOUND="$path"
        echo "✅ Found MongoDB at: $path"
        break
    fi
done

if [ -z "$MONGOD_FOUND" ]; then
    echo "❌ MongoDB not found in common locations"
    echo ""
    echo "Please start MongoDB manually using one of these methods:"
    echo "1. Open MongoDB Compass app"
    echo "2. Use: brew services start mongodb-community"
    echo "3. Or find your MongoDB installation and run: mongod --dbpath ~/data/db"
    exit 1
fi

# Create data directory if it doesn't exist
mkdir -p ~/data/db

# Check if MongoDB is already running
if lsof -ti:27017 > /dev/null 2>&1; then
    echo "✅ MongoDB is already running on port 27017"
    exit 0
fi

# Start MongoDB
echo "🚀 Starting MongoDB..."
$MONGOD_FOUND --dbpath ~/data/db --fork --logpath ~/data/mongod.log

sleep 2

# Verify it started
if lsof -ti:27017 > /dev/null 2>&1; then
    echo "✅ MongoDB started successfully!"
    echo "📊 Logs: ~/data/mongod.log"
else
    echo "⚠️ MongoDB may have failed to start. Check logs: ~/data/mongod.log"
fi

