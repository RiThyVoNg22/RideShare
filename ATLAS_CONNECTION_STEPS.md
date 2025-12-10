# 🔗 MongoDB Atlas Connection Steps

## Step 1: Get Connection String for Backend

**Click: "Connect to your application" (Drivers option)**

This will give you the connection string you need for:
- ✅ Your backend server (`server/.env`)
- ✅ MongoDB Compass (you can use this same string)

## Step 2: What You'll Get

After clicking "Connect to your application":
1. You'll see a connection string like:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/
   ```
2. Copy this connection string
3. Add `/rideshare` at the end for your database name

## Step 3: Use the Connection String

### For Backend (server/.env):
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/rideshare?retryWrites=true&w=majority
```

### For MongoDB Compass:
- Edit your "RideShare" connection
- Paste the same connection string
- Add `/rideshare` at the end

## Optional: Also Connect Compass

After getting the connection string, you can also:
- Click "Compass" option to connect via GUI
- But you can also just use the connection string in Compass directly

---

**Choose "Connect to your application" first to get the connection string! 🚀**

