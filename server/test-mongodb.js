import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Verification from './models/Verification.js';
import User from './models/User.js';

dotenv.config();

console.log('🔍 Testing MongoDB Connection...\n');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
})
.then(async () => {
  console.log('✅ MongoDB Connected');
  console.log('📊 Database:', mongoose.connection.db.databaseName);
  
  try {
    // Test Verification collection
    const verificationCount = await Verification.countDocuments();
    console.log(`\n📋 Verifications in database: ${verificationCount}`);
    
    const pendingCount = await Verification.countDocuments({ status: 'pending' });
    console.log(`   - Pending: ${pendingCount}`);
    
    const approvedCount = await Verification.countDocuments({ status: 'approved' });
    console.log(`   - Approved: ${approvedCount}`);
    
    const rejectedCount = await Verification.countDocuments({ status: 'rejected' });
    console.log(`   - Rejected: ${rejectedCount}`);
    
    // Get a sample verification
    const sample = await Verification.findOne({ status: 'pending' });
    if (sample) {
      console.log(`\n📄 Sample Pending Verification:`);
      console.log(`   - ID: ${sample._id}`);
      console.log(`   - User ID: ${sample.userId}`);
      console.log(`   - Status: ${sample.status}`);
      console.log(`   - Document Type: ${sample.documentType}`);
    }
    
    // Test User collection
    const adminUser = await User.findOne({ email: 'admin@rideshare.com' });
    if (adminUser) {
      console.log(`\n👤 Admin User Found:`);
      console.log(`   - Email: ${adminUser.email}`);
      console.log(`   - Role: ${adminUser.role}`);
      console.log(`   - isAdmin: ${adminUser.isAdmin}`);
    } else {
      console.log('\n⚠️  Admin user not found!');
    }
    
    console.log('\n✅ All tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error testing collections:', error.message);
    process.exit(1);
  }
})
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err.message);
  console.error('\n💡 Check your MONGODB_URI in .env file');
  console.error('   Make sure MongoDB Atlas allows connections from your IP');
  process.exit(1);
});

