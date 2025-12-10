# 🔧 Fix CORS Error - Step by Step

## ✅ Problem Found:
Your `.env` file has the wrong port (5000 instead of 5001)

## 🚀 Quick Fix:

### Step 1: Update .env File

Open `.env` file in the root directory and change:
```
VITE_API_URL=http://127.0.0.1:5000/api
```

To:
```
VITE_API_URL=http://localhost:5001/api
```

Or delete the `.env` file entirely - the code will default to port 5001.

### Step 2: Restart Frontend Server

**IMPORTANT:** After changing `.env`, you MUST restart the frontend:

```bash
# Stop the frontend (press Ctrl+C)
# Then restart:
npm run dev
```

### Step 3: Make Sure Backend is Running

```bash
cd server
PORT=5001 npm run dev
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on port 5001
```

### Step 4: Test

1. Refresh your browser
2. Try logging in again
3. CORS error should be gone!

## 📝 Alternative: Quick Terminal Fix

Run this command to update the .env file:

```bash
cd "/Users/macbookpro/Desktop/RideShare MJP2"
echo "VITE_API_URL=http://localhost:5001/api" > .env
```

Then restart your frontend server.

