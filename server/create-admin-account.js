import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('✅ MongoDB Connected');
  createAdminAccount();
})
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err.message);
  process.exit(1);
});

async function createAdminAccount() {
  try {
    // Admin account details
    const adminEmail = 'admin@rideshare.com';
    const adminPassword = 'Admin@1234';
    const adminFirstName = 'Admin';
    const adminLastName = 'User';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() });

    if (existingAdmin) {
      console.log('⚠️  Admin account already exists!');
      console.log(`📧 Email: ${adminEmail}`);
      console.log(`🔑 Resetting password and making account admin...`);
      
      // Update existing account - make admin and reset password
      // Set password directly (will be hashed by pre-save hook)
      existingAdmin.role = 'admin';
      existingAdmin.isAdmin = true;
      existingAdmin.password = adminPassword; // Let the pre-save hook hash it
      existingAdmin.markModified('password'); // Force save to trigger pre-save hook
      await existingAdmin.save();
      
      console.log('✅ Existing user is now an admin with updated password!');
      console.log('\n📋 Login Credentials:');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
      console.log('\n🔐 Please change the password after first login for security!');
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    const admin = await User.create({
      email: adminEmail.toLowerCase(),
      password: hashedPassword,
      firstName: adminFirstName,
      lastName: adminLastName,
      phone: '+855 12 345 678',
      accountType: 'both',
      role: 'admin',
      isAdmin: true,
      emailVerified: true,
      idVerified: false,
      idVerificationStatus: 'skipped'
    });

    console.log('✅ Admin account created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log('\n🔐 Please change the password after first login for security!');
    console.log('\n🚀 You can now:');
    console.log('   1. Log in at http://localhost:3001/auth');
    console.log('   2. Click "Admin" in the header to access admin panel');
    console.log('   3. Review ID verifications at /admin/verifications');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin account:', error.message);
    process.exit(1);
  }
}

