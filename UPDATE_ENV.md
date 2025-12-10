# 🔄 Update Your server/.env File

## Your MongoDB Atlas Connection String

**Format:**
```
MONGODB_URI=mongodb+srv://rideshare-dbvong:YOUR_PASSWORD@cluster0.poonc1p.mongodb.net/rideshare?retryWrites=true&w=majority
```

## Steps to Update

1. **Open:** `server/.env` file

2. **Find this line:**
   ```
   MONGODB_URI=mongodb://localhost:27017/rideshare
   ```

3. **Replace with:**
   ```
   MONGODB_URI=mongodb+srv://rideshare-dbvong:YOUR_PASSWORD@cluster0.poonc1p.mongodb.net/rideshare?retryWrites=true&w=majority
   ```

4. **Replace `YOUR_PASSWORD`** with your actual Atlas database password

5. **Save the file**

6. **Restart backend** (it will auto-connect to Atlas!)

## Example (if password is "mypassword123"):
```
MONGODB_URI=mongodb+srv://rideshare-dbvong:mypassword123@cluster0.poonc1p.mongodb.net/rideshare?retryWrites=true&w=majority
```

---

**After updating, your backend will connect to MongoDB Atlas! ☁️**

