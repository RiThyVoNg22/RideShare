# 🔧 Fix MongoDB Connection Error

## ❌ Current Error
```
connect ECONNREFUSED 127.0.0.1:27017
```

**This means:** MongoDB server is NOT running on your Mac.

## ✅ Solution: Start MongoDB Server

### Option 1: Install & Start MongoDB (Recommended)

**Step 1: Install MongoDB**
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
```

**Step 2: Start MongoDB**
```bash
brew services start mongodb-community@7.0
```

**Step 3: Verify**
```bash
lsof -i :27017
# Should show MongoDB process
```

**Step 4: Try connecting again in Compass**
- Click "Connect" on your RideShare connection
- Should work now! ✅

---

### Option 2: Use MongoDB Atlas (Cloud - No Installation!)

**This is faster - no installation needed!**

1. **Go to:** https://www.mongodb.com/cloud/atlas/register
2. **Create free account** → **Create free cluster**
3. **Get connection string:**
   - Click "Connect" on cluster
   - Choose "Connect your application"
   - Copy connection string
4. **Update in Compass:**
   - Edit your RideShare connection
   - Replace URI with Atlas connection string
   - Format: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/rideshare`
5. **Connect** - Should work immediately! ✅

---

### Option 3: Manual Start (If MongoDB is installed)

If MongoDB is installed but not running:

```bash
# Find MongoDB
which mongod
# or
/usr/local/bin/mongod --dbpath ~/data/db
# or
/opt/homebrew/bin/mongod --dbpath ~/data/db
```

---

## 🎯 Quick Fix Steps

1. **Check if MongoDB is installed:**
   ```bash
   which mongod
   ```

2. **If installed, start it:**
   ```bash
   brew services start mongodb-community@7.0
   ```

3. **If not installed, use Atlas:**
   - Go to MongoDB Atlas
   - Get connection string
   - Update Compass connection

---

## ✅ After MongoDB Starts

1. **In Compass:** Click "Connect" on RideShare
2. **Backend will auto-connect** (already running)
3. **Test:** http://localhost:5000/api/health
4. **Frontend:** http://localhost:3000

---

**The error happens because MongoDB server isn't running. Start it or use Atlas! 🚀**

