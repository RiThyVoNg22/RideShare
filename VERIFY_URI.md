# ✅ Verify Your MongoDB URI

## Your Current URI

Check your `server/.env` file - it should have:

```
MONGODB_URI=mongodb+srv://rideshare-dbvong:Vong$2212@cluster0.poonc1p.mongodb.net/rideshare?retryWrites=true&w=majority
```

## ✅ Correct Format Checklist

- ✅ **Protocol:** `mongodb+srv://` (for Atlas)
- ✅ **Username:** `rideshare-dbvong`
- ✅ **Password:** `Vong$2212` (your password)
- ✅ **Cluster:** `cluster0.poonc1p.mongodb.net` (number 1, NOT letter l)
- ✅ **Database:** `/rideshare` at the end
- ✅ **Options:** `?retryWrites=true&w=majority`

## ❌ Common Mistakes

1. **Wrong cluster name:**
   - ❌ `poonclp` (letter l)
   - ✅ `poonc1p` (number 1)

2. **Missing database name:**
   - ❌ `...mongodb.net/`
   - ✅ `...mongodb.net/rideshare`

3. **Using localhost instead of Atlas:**
   - ❌ `mongodb://localhost:27017/rideshare`
   - ✅ `mongodb+srv://...@cluster0.poonc1p.mongodb.net/rideshare`

## 🔍 How to Verify

Run this test:
```bash
cd server
node -e "const mongoose = require('mongoose'); require('dotenv').config(); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('✅ URI is correct!')).catch(e => console.log('❌ Error:', e.message));"
```

---

**Your URI should match the format above exactly!**

