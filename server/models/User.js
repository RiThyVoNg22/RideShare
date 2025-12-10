import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, select: false },
  phone: { type: String },
  accountType: { 
    type: String, 
    enum: ['rent', 'list', 'both'], 
    default: 'both' 
  },
  emailVerified: { type: Boolean, default: false },
  idVerified: { type: Boolean, default: false },
  idVerificationStatus: {
    type: String,
    enum: ['not_verified', 'pending', 'approved', 'rejected', 'skipped'],
    default: 'not_verified'
  },
  profileComplete: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  totalRentals: { type: Number, default: 0 },
  totalListings: { type: Number, default: 0 },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' }],
  authProvider: { type: String, enum: ['email', 'google', 'facebook'] },
  profilePicture: { type: String },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLogin: { type: Date }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model('User', userSchema);

