# 🔐 Admin Verification System - Setup Guide

## ✅ What's Been Created:

1. **Admin Role System**
   - Added `role` and `isAdmin` fields to User model
   - Created admin middleware to protect admin routes
   - Added admin routes for reviewing verifications

2. **Admin Routes** (Backend):
   - `GET /api/verification/admin/pending` - Get all pending verifications
   - `GET /api/verification/admin/all` - Get all verifications (with optional status filter)
   - `GET /api/verification/admin/:id` - Get single verification details
   - `PUT /api/verification/admin/:id/approve` - Approve a verification
   - `PUT /api/verification/admin/:id/reject` - Reject a verification

3. **Admin Page** (Frontend):
   - Route: `/admin/verifications`
   - Full interface to review, approve, and reject ID verifications
   - Shows user info, document images, and verification history

## 🚀 How to Make a User an Admin:

### Option 1: Using the Script (Recommended)

1. Make sure your server `.env` file has the correct `MONGODB_URI`
2. Run the script with the user's email:

```bash
cd server
node make-admin.js user@example.com
```

Example:
```bash
node make-admin.js admin@rideshare.com
```

### Option 2: Manually in MongoDB

1. Connect to your MongoDB database
2. Find the user document:
```javascript
db.users.findOne({ email: "user@example.com" })
```

3. Update the user:
```javascript
db.users.updateOne(
  { email: "user@example.com" },
  { 
    $set: { 
      role: "admin",
      isAdmin: true
    }
  }
)
```

## 📋 How to Use:

1. **Make yourself admin** (use one of the methods above)

2. **Log in** with your admin account

3. **Access Admin Panel**:
   - Click the "Admin" link in the header (only visible to admins)
   - Or navigate to: `http://localhost:3001/admin/verifications`

4. **Review Verifications**:
   - View all pending verifications
   - Click "View Details" to see full verification info and images
   - Click "Approve" to approve a verification
   - Click "Reject" to reject (requires a rejection reason)

5. **Filter Verifications**:
   - Use the filter buttons: Pending, Approved, Rejected, or All
   - See counts for each status

## 🔒 Security:

- Admin routes are protected with authentication middleware
- Only users with `role: 'admin'` or `isAdmin: true` can access admin routes
- Admin panel is hidden from non-admin users in the UI

## 📝 Notes:

- When you approve a verification:
  - Verification status changes to 'approved'
  - User's `idVerificationStatus` is set to 'approved'
  - User's `idVerified` is set to `true`

- When you reject a verification:
  - Verification status changes to 'rejected'
  - Rejection reason is stored (shown to user)
  - User's `idVerificationStatus` is set to 'rejected'
  - User's `idVerified` remains `false`

- All admin actions are logged with:
  - Who reviewed it (`reviewedBy`)
  - When it was reviewed (`reviewedAt`)
  - Optional notes for internal use

