# 🚀 Starting MongoDB on macOS

## Quick Start MongoDB

Since you have MongoDB installed, here are ways to start it:

### Option 1: If installed via Homebrew
```bash
brew services start mongodb-community
# or
brew services start mongodb-community@7.0
```

### Option 2: If installed as standalone
```bash
# Find MongoDB installation
/usr/local/bin/mongod --dbpath ~/data/db
# or
/opt/homebrew/bin/mongod --dbpath ~/data/db
```

### Option 3: If using MongoDB App
1. Open MongoDB Compass or MongoDB.app
2. It should start automatically

### Option 4: Check if already running
```bash
# Check if MongoDB is running
lsof -i :27017

# If you see output, MongoDB is already running!
```

## Verify MongoDB is Running

```bash
# Try to connect
mongosh
# or
mongo
```

If you can connect, MongoDB is running! ✅

## Start the Application

Once MongoDB is running:

**Terminal 1 - Backend:**
```bash
cd "/Users/macbookpro/Desktop/RideShare MJP2/server"
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd "/Users/macbookpro/Desktop/RideShare MJP2"
npm run dev
```

## Need Help?

If MongoDB won't start:
1. Check if port 27017 is available
2. Create data directory: `mkdir -p ~/data/db`
3. Check MongoDB logs
4. Try: `mongod --dbpath ~/data/db`

