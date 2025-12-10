# 📋 How to Use Admin Panel - Understanding MongoDB Updates

## ⚠️ Important: MongoDB Collections vs Tables

**MongoDB uses "Collections" not "Tables"**

When you approve or reject a verification:
- ❌ **No new collection/table is created**
- ✅ **The existing document is UPDATED in the `verifications` collection**
- The `status` field changes from `"pending"` → `"approved"` or `"rejected"`

## 📍 Where to See Changes in MongoDB Compass:

### Step 1: Open the `verifications` Collection
- In MongoDB Compass, click on `rideshare` database
- Click on `verifications` collection

### Step 2: View the Document
You should see your verification document with:
- `_id`: ObjectId
- `userId`: ObjectId  
- `status`: `"pending"` (before approval)
- `documentType`: `"national_id"`

### Step 3: Approve/Reject from Admin Panel
1. Go to your frontend: `http://localhost:3001/admin/verifications`
2. Click "Approve" or "Reject" on a verification
3. Wait for success message

### Step 4: Refresh MongoDB Compass
1. **Click the refresh button** in MongoDB Compass (circular arrow icon)
2. **Or click "Find" button** to reload documents
3. The document should now show:
   - `status`: `"approved"` (or `"rejected"`)
   - `reviewedAt`: Current date/time
   - `reviewedBy`: Admin user's ObjectId

## 🔍 What Changes in MongoDB:

### Before Approval:
```json
{
  "_id": "6938f8e53f126f392ce5738b",
  "userId": "6938108cead9ee3d9c515986",
  "status": "pending",
  "documentType": "national_id",
  ...
}
```

### After Approval:
```json
{
  "_id": "6938f8e53f126f392ce5738b",  // Same ID - same document!
  "userId": "6938108cead9ee3d9c515986",
  "status": "approved",  // ✅ Changed!
  "reviewedAt": "2024-12-10T...",  // ✅ Added!
  "reviewedBy": "6938...",  // ✅ Added!
  "documentType": "national_id",
  ...
}
```

## 🧪 Testing Steps:

1. **Start Backend:**
   ```bash
   cd server
   PORT=5001 npm run dev
   ```

2. **Open Admin Panel:**
   - Login as admin
   - Go to `/admin/verifications`
   - You should see the pending verification

3. **Approve the Verification:**
   - Click "Approve" button
   - Wait for success message

4. **Check Backend Console:**
   You should see logs like:
   ```
   ✅ Admin approve endpoint called
   📝 Verification ID: 6938f8e53f126f392ce5738b
   💾 Saving verification update...
   ✅ Verification saved successfully
   ✅ User profile updated successfully
   🎉 Verification approval completed successfully
   ```

5. **Refresh MongoDB Compass:**
   - Click refresh button
   - Check the document - status should be `"approved"`

## 🐛 Troubleshooting:

### Issue: Status doesn't change in MongoDB Compass
**Solutions:**
1. **Refresh MongoDB Compass** - Click the refresh button!
2. **Check backend console** - Look for errors
3. **Check browser console** - Look for API errors
4. **Verify backend is running** - `curl http://localhost:5001/api/health`

### Issue: "Access denied" error
**Solution:** Make sure you're logged in as admin:
- Email: `admin@rideshare.com`
- Password: `Admin@1234`

### Issue: "Verification not found"
**Solution:** Check the verification ID is correct. Copy the `_id` from MongoDB Compass.

### Issue: Backend not responding
**Solution:** 
```bash
cd server
PORT=5001 npm run dev
```

## 📝 Summary:

- ✅ Same collection (`verifications`)
- ✅ Same document (same `_id`)
- ✅ Only the `status` field changes
- ✅ Additional fields added: `reviewedAt`, `reviewedBy`
- ✅ User document also updated: `idVerificationStatus`, `idVerified`

**Remember to refresh MongoDB Compass to see the changes!**

