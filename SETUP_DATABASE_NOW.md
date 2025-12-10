# 🚀 Setup MongoDB Database - Quick Guide

## Your MongoDB Atlas Details
- **Username:** `rideshare-dbvong`
- **Cluster:** `cluster0.poonc1p.mongodb.net` (number 1, not letter l)
- **Database:** `rideshare`

## ✅ Option 1: Automatic Setup (Recommended)

**Run this command in the server directory:**

```bash
cd "/Users/macbookpro/Desktop/RideShare MJP2/server"
./setup-atlas.sh YOUR_PASSWORD
```

Replace `YOUR_PASSWORD` with your actual MongoDB Atlas password.

**Example:**
```bash
./setup-atlas.sh mypassword123
```

This will:
- ✅ Update `server/.env` with Atlas connection
- ✅ Test the connection
- ✅ Verify everything works

## ✅ Option 2: Manual Setup

1. **Open:** `/Users/macbookpro/Desktop/RideShare MJP2/server/.env`

2. **Find this line:**
   ```
   MONGODB_URI=mongodb://localhost:27017/rideshare
   ```

3. **Replace with:**
   ```
   MONGODB_URI=mongodb+srv://rideshare-dbvong:YOUR_PASSWORD@cluster0.poonc1p.mongodb.net/rideshare?retryWrites=true&w=majority
   ```

4. **Replace `YOUR_PASSWORD`** with your actual Atlas password

5. **Save the file**

6. **Test connection:**
   ```bash
   cd "/Users/macbookpro/Desktop/RideShare MJP2/server"
   node -e "const mongoose = require('mongoose'); require('dotenv').config(); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('✅ Connected!')).catch(e => console.log('❌', e.message));"
   ```

## ✅ After Setup

1. **Backend will auto-connect** to Atlas
2. **MongoDB Compass** - use same connection string
3. **Your app will work!** 🎉

## 🔍 Verify Connection

```bash
# Check backend is running
curl http://localhost:5000/api/health

# Check backend logs for MongoDB connection
tail -f /tmp/rideshare-backend.log
```

---

**Run the setup script or manually update .env - both will work! 🚀**

