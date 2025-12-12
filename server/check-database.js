import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Vehicle from './models/Vehicle.js';
import Booking from './models/Booking.js';
import Chat from './models/Chat.js';
import Verification from './models/Verification.js';
import Notification from './models/Notification.js';

dotenv.config();

async function checkDatabase() {
  try {
    console.log('🔍 Connecting to MongoDB...\n');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    
    console.log('✅ MongoDB Connected Successfully!');
    console.log('📊 Database Name:', mongoose.connection.db.databaseName);
    console.log('\n📋 Checking Collections (Tables):\n');
    
    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log('⚠️  No collections found. Collections will be created automatically when first document is saved.');
    } else {
      console.log(`Found ${collections.length} collection(s):\n`);
      
      for (const collection of collections) {
        const count = await mongoose.connection.db.collection(collection.name).countDocuments();
        console.log(`  ✓ ${collection.name}: ${count} document(s)`);
      }
    }
    
    console.log('\n📦 Expected Collections:\n');
    const expectedCollections = [
      { name: 'users', model: User },
      { name: 'vehicles', model: Vehicle },
      { name: 'bookings', model: Booking },
      { name: 'chats', model: Chat },
      { name: 'verifications', model: Verification },
      { name: 'notifications', model: Notification },
    ];
    
    for (const { name, model } of expectedCollections) {
      try {
        const count = await model.countDocuments();
        const exists = collections.some(c => c.name === name);
        const status = exists ? '✅' : '⏳';
        console.log(`  ${status} ${name}: ${count} document(s) ${exists ? '(exists)' : '(will be created on first use)'}`);
      } catch (error) {
        console.log(`  ❌ ${name}: Error checking - ${error.message}`);
      }
    }
    
    console.log('\n✅ Database check complete!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database Connection Error:', error.message);
    console.error('\n💡 Make sure:');
    console.error('   1. MONGODB_URI is set in server/.env');
    console.error('   2. MongoDB server is running (or Atlas connection is valid)');
    console.error('   3. Network access is allowed (for Atlas)');
    process.exit(1);
  }
}

checkDatabase();

