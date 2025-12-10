# 📋 MongoDB Atlas Connection String Format

## After Creating Atlas Cluster

Your connection string will look like this:

```
mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/rideshare?retryWrites=true&w=majority
```

## How to Use It

### In MongoDB Compass:
1. Edit your "RideShare" connection
2. Paste the full connection string above
3. Replace:
   - `YOUR_USERNAME` → Your Atlas database username
   - `YOUR_PASSWORD` → Your Atlas database password
   - `cluster0.xxxxx` → Your actual cluster address
4. Click "Save & Connect"

### In server/.env:
Update the MONGODB_URI line:
```
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/rideshare?retryWrites=true&w=majority
```

## Example:
```
mongodb+srv://rideshareuser:mypassword123@cluster0.abc123.mongodb.net/rideshare?retryWrites=true&w=majority
```

## Important Notes:
- Keep your password secure!
- The `/rideshare` at the end is the database name
- `?retryWrites=true&w=majority` are connection options (keep them)

---

**Once you have this, paste it in Compass and your backend .env file!**

