#!/bin/bash
echo "🚀 Starting MongoDB Server..."

# Try common MongoDB locations
MONGO_PATHS=(
    "/usr/local/bin/mongod"
    "/opt/homebrew/bin/mongod"
    "/Applications/MongoDB.app/Contents/Resources/mongod"
)

MONGOD=""
for path in "${MONGO_PATHS[@]}"; do
    if [ -f "$path" ]; then
        MONGOD="$path"
        break
    fi
done

if [ -z "$MONGOD" ]; then
    echo "❌ MongoDB not found. Installing..."
    echo ""
    echo "Please run:"
    echo "  brew tap mongodb/brew"
    echo "  brew install mongodb-community@7.0"
    echo "  brew services start mongodb-community@7.0"
    exit 1
fi

# Create data directory
mkdir -p ~/data/db

# Start MongoDB
echo "✅ Found MongoDB at: $MONGOD"
echo "🚀 Starting MongoDB server..."
$MONGOD --dbpath ~/data/db --fork --logpath ~/data/mongod.log

sleep 3

if lsof -i :27017 > /dev/null 2>&1; then
    echo "✅ MongoDB started successfully!"
    echo "✅ You can now connect in MongoDB Compass!"
else
    echo "⚠️ MongoDB may have failed to start"
    echo "Check logs: ~/data/mongod.log"
fi
