# 🚀 How to Start Both Servers

## ⚠️ Important: You Need BOTH Servers Running!

### 1. Start Backend Server (Terminal 1)

```bash
cd server
PORT=5001 npm run dev
```

**You should see:**
```
✅ MongoDB Connected
📊 Database: rideshare
✅ Verification routes loaded
🚀 Server running on port 5001
📡 API available at http://127.0.0.1:5001/api
```

**If you see MongoDB connection errors:**
- Check your `server/.env` file has the correct `MONGODB_URI`
- Make sure MongoDB Atlas allows your IP address

### 2. Start Frontend Server (Terminal 2)

**Open a NEW terminal window** and run:

```bash
cd "/Users/macbookpro/Desktop/RideShare MJP2"
npm run dev
```

**You should see:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3001/
  ➜  Network: use --host to expose
```

### 3. Verify Everything is Working

1. **Check Backend:**
   ```bash
   curl http://localhost:5001/api/health
   ```
   Should return: `{"status":"OK","message":"RideShare API is running"}`

2. **Check Frontend:**
   - Open browser: `http://localhost:3001`
   - Should see the homepage

3. **Try Login:**
   - Go to: `http://localhost:3001/auth`
   - Email: `admin@rideshare.com`
   - Password: `Admin@1234`
   - Should work without CORS errors!

## 🔍 Troubleshooting:

### Backend won't start:
- Check MongoDB connection string in `server/.env`
- Make sure port 5001 is not in use: `lsof -ti:5001`
- Check for errors in terminal

### Frontend shows CORS error:
- Make sure backend is running on port 5001
- Check `.env` file has: `VITE_API_URL=http://localhost:5001/api`
- Restart frontend after changing `.env`

### MongoDB connection fails:
- Check `server/.env` has correct `MONGODB_URI`
- Verify MongoDB Atlas Network Access allows your IP
- Check MongoDB Atlas Database Access has correct user

## 📝 Quick Check Commands:

```bash
# Check if backend is running
curl http://localhost:5001/api/health

# Check what's on port 5001
lsof -ti:5001

# Check MongoDB connection
cd server
node test-mongodb.js
```

