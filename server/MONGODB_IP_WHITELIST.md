# MongoDB Atlas IP Whitelist Setup

## Current Issue
Your MongoDB Atlas cluster is rejecting connections because your IP address is not whitelisted.

## Solution: Add Your IP to MongoDB Atlas Whitelist

### Steps:
1. Go to MongoDB Atlas: https://cloud.mongodb.com/
2. Log in to your account
3. Select your cluster: `cluster0.poonc1p.mongodb.net`
4. Click on "Network Access" in the left sidebar
5. Click "Add IP Address" button
6. Choose one of these options:
   - **Option 1 (Recommended for Development):** Click "Add Current IP Address" button
   - **Option 2 (Allow from anywhere - Less secure):** Enter `0.0.0.0/0` and click "Confirm"
7. Wait 1-2 minutes for the changes to take effect

### Quick Allow All IPs (Development Only):
If you want to allow connections from anywhere (for development):
- IP Address: `0.0.0.0/0`
- Comment: "Development - Allow all"

⚠️ **Warning:** Allowing `0.0.0.0/0` is less secure. Only use for development!

### After Whitelisting:
Once you've added your IP, wait 1-2 minutes, then the connection should work.

### Test Connection:
Run this command to test:
```bash
cd server
node -e "const mongoose = require('mongoose'); require('dotenv').config(); mongoose.connect(process.env.MONGODB_URI, {serverSelectionTimeoutMS: 15000}).then(() => { console.log('✅ Connected!'); process.exit(0); }).catch(e => { console.log('❌ Error:', e.message); process.exit(1); });"
```
