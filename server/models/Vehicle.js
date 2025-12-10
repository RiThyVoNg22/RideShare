import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['car', 'motorbike', 'bicycle'], 
    required: true 
  },
  brand: { type: String },
  model: { type: String },
  year: { type: Number },
  condition: { type: String },
  description: { type: String },
  pricePerDay: { type: Number, required: true },
  depositAmount: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },
  location: {
    address: { type: String },
    city: { type: String },
    district: { type: String },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number }
    },
    placeId: { type: String },
    province: { type: String },
    country: { type: String, default: 'Cambodia' }
  },
  availability: {
    days: [{ type: String }],
    timeFrom: { type: String },
    timeTo: { type: String },
    isAvailableNow: { type: Boolean, default: true }
  },
  contact: {
    name: { type: String },
    phone: { type: String },
    email: { type: String }
  },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ownerName: { type: String },
  ownerEmail: { type: String },
  ownerPhone: { type: String },
  features: [{ type: String }],
  images: [{ type: String }],
  mainPhoto: { type: String },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending'
  },
  available: { type: Boolean, default: true },
  verified: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  totalRentals: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Indexes for better query performance
vehicleSchema.index({ ownerId: 1 });
vehicleSchema.index({ status: 1, available: 1 });
vehicleSchema.index({ type: 1, status: 1 });
vehicleSchema.index({ 'location.city': 1 });

export default mongoose.model('Vehicle', vehicleSchema);

