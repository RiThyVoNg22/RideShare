# 🔧 Fix MongoDB Compass Connection

## ❌ Current Problem
Compass is trying to connect to `localhost:27017` but MongoDB server isn't running.

## ✅ Solution: Update Compass to Use Atlas

### Step 1: Edit Your Connection in Compass

1. **In MongoDB Compass**, find your "RideShare" connection
2. **Click the three dots (⋯)** next to "RideShare"
3. **Click "Edit"** or **"Edit Connection"**

### Step 2: Update Connection String

**Replace the current URI:**
```
mongodb://localhost:27017/rideshare
```

**With your Atlas connection string:**
```
mongodb+srv://rideshare-dbvong:YOUR_PASSWORD@cluster0.poonc1p.mongodb.net/rideshare?retryWrites=true&w=majority
```

**Important:** Replace `YOUR_PASSWORD` with your actual Atlas database password!

### Step 3: Save and Connect

1. **Click "Save"** or **"Save & Connect"**
2. Compass will connect to Atlas! ✅

## 🔍 Alternative: Create New Connection

If editing doesn't work:

1. **Click "New Connection"** (green + button)
2. **Paste your Atlas connection string:**
   ```
   mongodb+srv://rideshare-dbvong:YOUR_PASSWORD@cluster0.poonc1p.mongodb.net/rideshare?retryWrites=true&w=majority
   ```
3. **Name it:** "RideShare Atlas"
4. **Click "Save & Connect"**

## ✅ Verify Backend is Also Updated

Make sure `server/.env` also has the Atlas connection string:

```bash
cd "/Users/macbookpro/Desktop/RideShare MJP2/server"
cat .env | grep MONGODB_URI
```

Should show:
```
MONGODB_URI=mongodb+srv://rideshare-dbvong:YOUR_PASSWORD@cluster0.poonc1p.mongodb.net/rideshare?retryWrites=true&w=majority
```

---

**Update Compass to use Atlas connection string - no local MongoDB needed! ☁️**

