# ⚡ Quick Update - MongoDB Atlas Connection

## Your Connection Details
- **Username:** `rideshare-dbvong`
- **Cluster:** `cluster0.poonc1p.mongodb.net`
- **Database:** `rideshare`
- **Password:** (the one you set when creating the database user)

## 🔄 Update server/.env

**Open:** `/Users/macbookpro/Desktop/RideShare MJP2/server/.env`

**Change this line:**
```
MONGODB_URI=mongodb://localhost:27017/rideshare
```

**To this (replace YOUR_PASSWORD with your actual password):**
```
MONGODB_URI=mongodb+srv://rideshare-dbvong:YOUR_PASSWORD@cluster0.poonc1p.mongodb.net/rideshare?retryWrites=true&w=majority
```

## 📋 Example

If your password is `mypassword123`, it would be:
```
MONGODB_URI=mongodb+srv://rideshare-dbvong:mypassword123@cluster0.poonc1p.mongodb.net/rideshare?retryWrites=true&w=majority
```

## ✅ After Updating

1. **Save the file**
2. **Backend will auto-reconnect** (if using nodemon) or restart it
3. **Check backend logs** - should see "✅ MongoDB Connected"

## 🔗 For MongoDB Compass

Use the same connection string:
```
mongodb+srv://rideshare-dbvong:YOUR_PASSWORD@cluster0.poonc1p.mongodb.net/rideshare?retryWrites=true&w=majority
```

---

**Just replace YOUR_PASSWORD and you're done! 🚀**

