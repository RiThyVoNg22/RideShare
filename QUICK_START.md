# 🚀 Quick Start Guide - RideShare Local

## Prerequisites
- Node.js (v16 or higher)
- npm (comes with Node.js)
- MongoDB (local or Atlas connection)

## Step-by-Step Instructions

### Step 1: Open Terminal
Open your terminal/command prompt and navigate to the project directory:
```bash
cd "/Users/macbookpro/Desktop/RideShare MJP2"
```

### Step 2: Install Dependencies (First Time Only)
If you haven't installed dependencies yet, run these commands:

**Install Frontend Dependencies:**
```bash
npm install
```

**Install Backend Dependencies:**
```bash
cd server
npm install
cd ..
```

### Step 3: Configure Environment Variables

**Backend Configuration:**
1. Navigate to server directory:
   ```bash
   cd server
   ```

2. Check if `.env` file exists:
   ```bash
   ls -la .env
   ```

3. If `.env` doesn't exist, copy from template:
   ```bash
   cp .env.template .env
   ```

4. Edit `.env` file with your MongoDB connection string:
   ```bash
   # Open in your preferred editor or use:
   nano .env
   ```

   Required variables:
   ```
   PORT=5001
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key_here
   ```

**Frontend Configuration:**
1. Go back to root directory:
   ```bash
   cd ..
   ```

2. Check if `.env` file exists:
   ```bash
   ls -la .env
   ```

3. If `.env` doesn't exist, create it:
   ```bash
   echo "VITE_API_URL=http://localhost:5001/api" > .env
   ```

### Step 4: Start the Backend Server

Open **Terminal Window 1** and run:
```bash
cd "/Users/macbookpro/Desktop/RideShare MJP2/server"
npm run dev
```

You should see:
```
🚀 Server running on port 5001
📡 API available at http://localhost:5001/api
✅ MongoDB connected
```

**Keep this terminal window open!**

### Step 5: Start the Frontend Server

Open **Terminal Window 2** (new terminal) and run:
```bash
cd "/Users/macbookpro/Desktop/RideShare MJP2"
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3001/
  ➜  Network: use --host to expose
```

**Keep this terminal window open too!**

### Step 6: Access the Application

Open your web browser and go to:
```
http://localhost:3001
```

## 🎯 Quick Commands Summary

### Start Backend (Terminal 1):
```bash
cd "/Users/macbookpro/Desktop/RideShare MJP2/server"
npm run dev
```

### Start Frontend (Terminal 2):
```bash
cd "/Users/macbookpro/Desktop/RideShare MJP2"
npm run dev
```

## 🔧 Troubleshooting

### Backend won't start?
1. Check if port 5001 is already in use:
   ```bash
   lsof -ti:5001
   ```
   If it shows a process, kill it:
   ```bash
   kill -9 $(lsof -ti:5001)
   ```

2. Check MongoDB connection:
   - Verify your `MONGODB_URI` in `server/.env`
   - Make sure MongoDB is running (if using local)

### Frontend won't start?
1. Check if port 3001 is already in use:
   ```bash
   lsof -ti:3001
   ```
   If it shows a process, kill it:
   ```bash
   kill -9 $(lsof -ti:3001)
   ```

2. Check if backend is running first (frontend needs backend)

### Connection Error?
- Make sure backend is running on port 5001
- Check `VITE_API_URL` in root `.env` file
- Wait a few seconds after starting backend before refreshing browser

## 📝 Notes

- **Two Terminal Windows Required**: One for backend, one for frontend
- **Backend must start first**: Frontend depends on backend API
- **Keep both terminals open**: Closing them will stop the servers
- **To stop servers**: Press `Ctrl + C` in each terminal window

## ✅ Verification

After starting both servers, verify they're running:

**Check Backend:**
```bash
curl http://localhost:5001/api/health
```
Should return: `{"status":"OK","message":"RideShare API is running"}`

**Check Frontend:**
Open browser to: `http://localhost:3001`

---

**That's it! Your RideShare Local application should now be running! 🎉**

