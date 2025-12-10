# 🔄 How to Update to MongoDB Atlas

## Current Configuration
Your `server/.env` currently has:
```
MONGODB_URI=mongodb://localhost:27017/rideshare
```

## Steps to Use MongoDB Atlas

### 1. Get Atlas Connection String

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up or log in
3. Create a free cluster (M0)
4. Click "Connect" → "Connect your application"
5. Copy the connection string

### 2. Update .env File

Replace the MONGODB_URI in `server/.env`:

**From:**
```
MONGODB_URI=mongodb://localhost:27017/rideshare
```

**To:**
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/rideshare?retryWrites=true&w=majority
```

**Important:** Replace:
- `username` with your Atlas database username
- `password` with your Atlas database password
- `cluster0.xxxxx` with your actual cluster address

### 3. Restart Backend

The backend will automatically connect to Atlas!

```bash
# Backend is already running, it will reconnect automatically
# Or restart it:
cd server
npm run dev
```

### 4. Verify Connection

Check backend logs - you should see:
```
✅ MongoDB Connected
```

---

**That's it! Your app will now use cloud MongoDB! ☁️**

