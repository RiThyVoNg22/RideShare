# 🔐 Admin Account Information

## Admin Login Credentials

**Email:** `admin@rideshare.com`  
**Password:** `Admin@1234`

## ⚠️ Security Note

**Please change the password after first login for security!**

## 🚀 How to Use

1. **Start the servers:**
   ```bash
   # Terminal 1 - Backend
   cd server
   PORT=5001 npm run dev

   # Terminal 2 - Frontend
   npm run dev
   ```

2. **Log in:**
   - Go to: http://localhost:3001/auth
   - Enter the email and password above
   - Click "Log In"

3. **Access Admin Panel:**
   - After logging in, you'll see an "Admin" link in the header
   - Click it or go to: http://localhost:3001/admin/verifications
   - Review and approve/reject ID verifications

## 📝 To Create Another Admin Account

Run this command with your desired email:
```bash
cd server
node make-admin.js your-email@example.com
```

## 🔄 To Reset Admin Account

If you need to recreate the admin account:
```bash
cd server
node create-admin-account.js
```

This will create the admin account or update an existing one.

