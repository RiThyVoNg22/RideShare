import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: [
      'booking_request',
      'booking_confirmed',
      'booking_cancelled',
      'booking_completed',
      'message',
      'review',
      'vehicle_approved',
      'vehicle_rejected',
      'payment_received',
      'reminder'
    ],
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  relatedId: { type: mongoose.Schema.Types.ObjectId }, // bookingId, vehicleId, etc.
  relatedType: { type: String }, // 'booking', 'vehicle', 'message', etc.
  read: { type: Boolean, default: false },
  readAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Indexes
notificationSchema.index({ userId: 1, read: 1 });
notificationSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Notification', notificationSchema);

