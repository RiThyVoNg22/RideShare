import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('✅ MongoDB Connected');
  makeUserAdmin();
})
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err.message);
  process.exit(1);
});

async function makeUserAdmin() {
  try {
    // Get email from command line argument
    const email = process.argv[2];

    if (!email) {
      console.error('❌ Please provide an email address');
      console.log('Usage: node make-admin.js user@example.com');
      process.exit(1);
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.error(`❌ User with email "${email}" not found`);
      process.exit(1);
    }

    // Update user to admin
    user.role = 'admin';
    user.isAdmin = true;
    await user.save();

    console.log(`✅ User "${user.firstName} ${user.lastName}" (${user.email}) is now an admin!`);
    console.log('🔐 They can now access the admin panel at /admin/verifications');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

