# 🚀 Quick MongoDB Setup - Choose One Option

## ⚠️ Current Issue
MongoDB server is not installed. You have MongoDB Compass (GUI) but need the server.

## ✅ Option 1: MongoDB Atlas (Cloud - EASIEST - No Installation!)

**This is the fastest way - no installation needed!**

1. **Go to:** https://www.mongodb.com/cloud/atlas/register
2. **Sign up** (free account)
3. **Create a free cluster** (M0 - Free tier)
4. **Get connection string:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://username:password@cluster.mongodb.net/`

5. **Update `server/.env`:**
   ```bash
   cd "/Users/macbookpro/Desktop/RideShare MJP2/server"
   # Edit .env and replace MONGODB_URI with your Atlas connection string
   ```

6. **Restart backend:**
   ```bash
   # Backend will auto-connect to Atlas
   ```

**✅ Done! No local installation needed!**

---

## ✅ Option 2: Install MongoDB Locally

### Step 1: Update Xcode Command Line Tools
```bash
sudo rm -rf /Library/Developer/CommandLineTools
sudo xcode-select --install
```

### Step 2: Install MongoDB
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
```

### Step 3: Start MongoDB
```bash
brew services start mongodb-community@7.0
```

### Step 4: Verify
```bash
lsof -i :27017
```

---

## 🎯 Recommended: Use MongoDB Atlas

**Why Atlas?**
- ✅ No installation needed
- ✅ Free tier available
- ✅ Works immediately
- ✅ Cloud-based (accessible anywhere)
- ✅ Automatic backups

**Your current setup:**
- Backend: ✅ Running
- Frontend: ✅ Running  
- MongoDB: ⚠️ Need to connect (Atlas or local)

---

## 📝 Quick Atlas Setup (5 minutes)

1. Visit: https://www.mongodb.com/cloud/atlas/register
2. Create account → Create free cluster
3. Create database user (username/password)
4. Get connection string
5. Update `server/.env`:
   ```
   MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/rideshare?retryWrites=true&w=majority
   ```
6. Restart backend - it will connect automatically!

---

**I recommend MongoDB Atlas - it's faster and easier! 🚀**

