import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userEmail: { type: String, required: true },
  userName: { type: String, required: true },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  vehicleName: { type: String, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ownerName: { type: String },
  pickupDate: { type: Date, required: true },
  returnDate: { type: Date, required: true },
  rentalDays: { type: Number, required: true },
  dailyRate: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  serviceFee: { type: Number, default: 0 },
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  notes: { type: String },
  review: {
    rating: { type: Number },
    comment: { type: String },
    createdAt: { type: Date }
  },
  reviewed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Indexes
bookingSchema.index({ userId: 1 });
bookingSchema.index({ ownerId: 1 });
bookingSchema.index({ vehicleId: 1 });
bookingSchema.index({ status: 1 });

export default mongoose.model('Booking', bookingSchema);

