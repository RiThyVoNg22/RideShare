# 🔧 Complete Fix: Update Both Compass AND Backend

## ❌ Current Problem
- MongoDB Compass: Trying to connect to `localhost:27017` (not running)
- Backend: Still configured for `localhost:27017`

## ✅ Solution: Update Both to Use Atlas

### Step 1: Update MongoDB Compass

1. **In MongoDB Compass:**
   - Find "RideShare" connection
   - Click **three dots (⋯)** → **"Edit"**
   - **Replace the URI** with:
     ```
     mongodb+srv://rideshare-dbvong:YOUR_PASSWORD@cluster0.poonc1p.mongodb.net/rideshare?retryWrites=true&w=majority
     ```
   - **Replace `YOUR_PASSWORD`** with your actual Atlas password
   - Click **"Save & Connect"**

2. **Should connect successfully! ✅**

### Step 2: Update Backend (server/.env)

**Open:** `/Users/macbookpro/Desktop/RideShare MJP2/server/.env`

**Find this line:**
```
MONGODB_URI=mongodb://localhost:27017/rideshare
```

**Replace with:**
```
MONGODB_URI=mongodb+srv://rideshare-dbvong:YOUR_PASSWORD@cluster0.poonc1p.mongodb.net/rideshare?retryWrites=true&w=majority
```

**Replace `YOUR_PASSWORD`** with your actual Atlas password

**Save the file**

### Step 3: Restart Backend

```bash
cd "/Users/macbookpro/Desktop/RideShare MJP2/server"
# Stop current backend (Ctrl+C if running)
npm run dev
```

Backend will connect to Atlas automatically! ✅

## 📋 Your Atlas Connection Details

- **Username:** `rideshare-dbvong`
- **Cluster:** `cluster0.poonc1p.mongodb.net`
- **Database:** `rideshare`
- **Password:** (the one you set in Atlas)

## ✅ After Both Are Updated

1. **Compass** will connect to Atlas ✅
2. **Backend** will connect to Atlas ✅
3. **Your app** will work! 🎉

---

**Update BOTH Compass and server/.env with the Atlas connection string!**

