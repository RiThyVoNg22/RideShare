# 🔧 MongoDB Connection Issues - Fix Guide

## Problem: MongoDB operations are timing out

This usually means:
1. **Backend server is not running**
2. **MongoDB connection string is incorrect**
3. **MongoDB Atlas IP whitelist doesn't include your IP**
4. **Network/firewall blocking connection**

## ✅ Quick Fixes:

### 1. **Check Backend Server is Running**

```bash
cd server
PORT=5001 npm run dev
```

You should see:
```
✅ MongoDB Connected
📊 Database: rideshare
🚀 Server running on port 5001
```

### 2. **Test MongoDB Connection**

```bash
cd server
node test-mongodb.js
```

This will show:
- If MongoDB is connected
- How many verifications exist
- Admin user status

### 3. **Check MongoDB Atlas Settings**

If using MongoDB Atlas:
1. Go to MongoDB Atlas Dashboard
2. Click **Network Access**
3. Make sure your IP is whitelisted (or use `0.0.0.0/0` for development)
4. Click **Database Access** - verify your user has read/write permissions

### 4. **Verify .env File**

Make sure `server/.env` has:
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.poonc1p.mongodb.net/rideshare?retryWrites=true&w=majority
JWT_SECRET=your-secret-key
PORT=5001
```

### 5. **Common Issues:**

#### Issue: "Operation buffering timed out"
**Solution:** Backend server is not running or MongoDB is not connected. Start the backend!

#### Issue: "MongoServerError: Authentication failed"
**Solution:** Check your MongoDB username and password in the connection string.

#### Issue: "IP not whitelisted"
**Solution:** Add your IP to MongoDB Atlas Network Access whitelist.

#### Issue: Backend starts but admin routes don't work
**Solution:** 
- Make sure you're logged in as admin
- Check backend console for errors
- Test routes with curl or check browser console

## 🧪 Testing Steps:

1. **Start Backend:**
   ```bash
   cd server
   PORT=5001 npm run dev
   ```

2. **Check Connection:**
   ```bash
   node test-mongodb.js
   ```

3. **Test Admin Login:**
   - Go to frontend
   - Login with: `admin@rideshare.com` / `Admin@1234`
   - Check if "Admin" link appears in header

4. **Test Admin Panel:**
   - Go to `/admin/verifications`
   - Should see pending verifications
   - Try approving/rejecting one

5. **Check MongoDB Compass:**
   - Refresh the verification document
   - Status should change after approve/reject

## 📝 What Was Fixed:

- ✅ Added `{ new: true }` to User.findByIdAndUpdate calls
- ✅ Created test script to diagnose MongoDB connection
- ✅ Routes are properly configured

## 🔍 Still Not Working?

1. **Check backend logs** - Look for MongoDB connection errors
2. **Check browser console** - Look for API errors
3. **Test with curl** - Test API routes directly
4. **Verify MongoDB Atlas** - Check network access and database access settings

