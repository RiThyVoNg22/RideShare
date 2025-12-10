# ⚡ Quick Start - MongoDB Database Setup

## 🎯 What You Need

Your MongoDB Atlas password (the one you set when creating the database user `rideshare-dbvong`)

## ✅ Setup in 30 Seconds

### Method 1: Run Setup Script

```bash
cd "/Users/macbookpro/Desktop/RideShare MJP2/server"
./setup-atlas.sh YOUR_PASSWORD
```

**Example:**
```bash
./setup-atlas.sh mypassword123
```

This will:
- ✅ Update `.env` with Atlas connection
- ✅ Test the connection
- ✅ Verify it works

### Method 2: Tell Me Your Password

Just tell me your MongoDB Atlas password and I'll set it up for you automatically!

### Method 3: Manual (if you prefer)

1. Open `server/.env`
2. Change this line:
   ```
   MONGODB_URI=mongodb://localhost:27017/rideshare
   ```
3. To this (replace YOUR_PASSWORD):
   ```
   MONGODB_URI=mongodb+srv://rideshare-dbvong:YOUR_PASSWORD@cluster0.poonc1p.mongodb.net/rideshare?retryWrites=true&w=majority
   ```
4. Save file

## ✅ After Setup

- Backend will automatically connect to Atlas
- Your database will be ready
- App will work! 🎉

---

**Just run the script with your password or tell me and I'll do it! 🚀**

