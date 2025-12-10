# 🔗 Your MongoDB Atlas Connection String

## From Atlas (C# Example)
```
mongodb+srv://rideshare-dbvong:<db_password>@cluster0.poonc1p.mongodb.net/?appName=Cluster0
```

## ✅ For Your Backend (server/.env)

**Replace `<db_password>` with your actual password:**

```
MONGODB_URI=mongodb+srv://rideshare-dbvong:Vong$2212@cluster0.poonc1p.mongodb.net/rideshare?retryWrites=true&w=majority
```

**Important:**
- Replace `Vong$2212` with your actual database password
- Added `/rideshare` for your database name
- Added `?retryWrites=true&w=majority` for connection options

## ✅ For MongoDB Compass

Use the same connection string:
```
mongodb+srv://rideshare-dbvong:YOUR_PASSWORD@cluster0.poonc1p.mongodb.net/rideshare?retryWrites=true&w=majority
```

## 📝 Steps

1. **Get your password** (the one you set when creating the database user)
2. **Update server/.env** with the connection string above
3. **Update MongoDB Compass** connection with the same string
4. **Restart backend** - it will connect automatically!

---

**Your cluster: cluster0.poonc1p.mongodb.net**
**Your username: rideshare-dbvong**
**Database: rideshare**

