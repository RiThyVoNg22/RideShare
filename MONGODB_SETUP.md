# 🔧 MongoDB Setup Instructions

## Current Status
- ✅ MongoDB Compass is installed and open
- ❌ MongoDB Server is NOT running
- ⚠️ MongoDB Compass is just a GUI client - it doesn't start the server

## 🚀 How to Start MongoDB Server

### Option 1: Install MongoDB Server (Recommended)

**Using Homebrew:**
```bash
# Install MongoDB Community Edition
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

**Verify it's running:**
```bash
lsof -i :27017
# Should show MongoDB process
```

### Option 2: Use MongoDB Atlas (Cloud - Free)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a free cluster
4. Get connection string
5. Update `server/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rideshare
   ```

### Option 3: Download MongoDB Server

1. Go to https://www.mongodb.com/try/download/community
2. Download for macOS
3. Install the .pkg file
4. MongoDB will be installed at: `/usr/local/bin/mongod`
5. Start it:
   ```bash
   /usr/local/bin/mongod --dbpath ~/data/db
   ```

## ✅ Quick Setup (Recommended)

Run these commands:

```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Verify it's running
lsof -i :27017
```

## 🔍 Verify Connection

Once MongoDB is running:

```bash
cd "/Users/macbookpro/Desktop/RideShare MJP2/server"
node -e "const mongoose = require('mongoose'); mongoose.connect('mongodb://localhost:27017/rideshare').then(() => { console.log('✅ Connected!'); process.exit(0); });"
```

## 📝 After MongoDB Starts

1. **Backend will auto-connect** (it's already running)
2. **Check backend logs** - you should see "✅ MongoDB Connected"
3. **Test the API**: http://localhost:5000/api/health
4. **Open frontend**: http://localhost:3000

---

**MongoDB Compass is just a GUI - you need the MongoDB server running!**

