# 🎯 Complete Setup Instructions

## ✅ Everything is Ready!

Your RideShare project has been completely modernized with:
- ✅ React + TypeScript frontend
- ✅ Node.js + Express + MongoDB backend
- ✅ All features from old code implemented
- ✅ Professional code structure

## 📋 Setup Checklist

### Step 1: Install Dependencies

**Terminal 1 - Frontend:**
```bash
cd "/Users/macbookpro/Desktop/RideShare MJP2"
npm install
```

**Terminal 2 - Backend:**
```bash
cd "/Users/macbookpro/Desktop/RideShare MJP2/server"
npm install
```

### Step 2: Setup MongoDB

**Option A: Install Local MongoDB**
```bash
# macOS
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

**Option B: Use MongoDB Atlas (Free Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free
3. Create a cluster
4. Get connection string
5. Use it in server/.env

### Step 3: Create Environment Files

**Create `server/.env`:**
```bash
cd server
cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rideshare
JWT_SECRET=rideshare-secret-key-2025-change-in-production
JWT_EXPIRE=7d
NODE_ENV=development
EOF
```

**Create `.env` in project root:**
```bash
cd ..
cat > .env << EOF
VITE_API_URL=http://localhost:5000/api
EOF
```

### Step 4: Start Backend Server

```bash
cd server
npm run dev
```

**Expected output:**
```
✅ MongoDB Connected
🚀 Server running on port 5000
📡 API available at http://localhost:5000/api
```

### Step 5: Start Frontend (New Terminal)

```bash
cd "/Users/macbookpro/Desktop/RideShare MJP2"
npm run dev
```

**Expected output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### Step 6: Open Application

Open browser: **http://localhost:3000**

## 🧪 Test Features

1. **Register Account**
   - Click "Sign Up / Log In"
   - Fill registration form
   - Submit

2. **Browse Vehicles**
   - Go to "Rent" page
   - Use filters
   - Click on a vehicle

3. **List Vehicle**
   - Click "List Your Vehicle"
   - Fill form
   - Upload images
   - Submit

4. **Create Booking**
   - Go to vehicle detail page
   - Select dates
   - Click "Book Now"

## 🔧 Troubleshooting

### MongoDB Not Running
```bash
# Check if running
mongosh

# If not, start it
brew services start mongodb-community
# or
mongod
```

### Port Already in Use
- Change `PORT=5000` to `PORT=5001` in `server/.env`
- Update `VITE_API_URL` in `.env` to match

### CORS Errors
- Make sure backend is running first
- Check `VITE_API_URL` matches backend port

### Images Not Uploading
```bash
# Create uploads folder
mkdir -p server/uploads
chmod 755 server/uploads
```

## 📊 What's Different from Old Code

| Old Code | New Code |
|----------|----------|
| Firebase | MongoDB + Express API |
| Vanilla JS | React + TypeScript |
| Multiple HTML files | Single Page App |
| No type safety | Full TypeScript |
| Hard to maintain | Clean structure |

## 🎉 Success Indicators

You'll know it's working when:
- ✅ Backend shows "MongoDB Connected"
- ✅ Frontend loads without errors
- ✅ Can register/login
- ✅ Can see vehicles
- ✅ Can create bookings

## 📞 Need Help?

1. Check `START.md` for quick start
2. Check `README.md` for full docs
3. Check console for errors
4. Verify MongoDB is running
5. Verify both servers are running

---

**Your modern RideShare application is ready! 🚀**

