# 🚀 Quick Start Guide

## Step-by-Step Setup

### 1. Install All Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd server
npm install
cd ..
```

### 2. Setup MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB if not installed
# Then start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Use it in server/.env

### 3. Create Environment Files

**Create `server/.env`:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rideshare
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d
NODE_ENV=development
```

**Create `.env` in root:**
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start Backend Server

```bash
cd server
npm run dev
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on port 5000
📡 API available at http://localhost:5000/api
```

### 5. Start Frontend (in new terminal)

```bash
# From project root
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
```

### 6. Test the Application

1. Open http://localhost:3000
2. Register a new account
3. Browse vehicles
4. List a vehicle
5. Create a booking

## ✅ Verification Checklist

- [ ] MongoDB is running
- [ ] Backend server is running on port 5000
- [ ] Frontend is running on port 3000
- [ ] Can register new user
- [ ] Can login
- [ ] Can browse vehicles
- [ ] Can list vehicle
- [ ] Can create booking

## 🐛 Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check MONGODB_URI in server/.env
- Try: `mongosh` to test MongoDB connection

### Port Already in Use
- Change PORT in server/.env
- Change port in vite.config.ts

### CORS Errors
- Make sure backend is running
- Check VITE_API_URL in .env

### Images Not Loading
- Make sure uploads folder exists: `server/uploads/`
- Check file permissions

## 📚 Next Steps

1. Test all features
2. Add more vehicles
3. Test booking flow
4. Test chat functionality
5. Customize as needed

