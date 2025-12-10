import mongoose from 'mongoose';

const verificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['id', 'email', 'phone'],
    default: 'id'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  documentType: {
    type: String,
    enum: ['passport', 'national_id', 'driving_license', 'other']
  },
  documentNumber: { type: String },
  frontImage: { type: String, required: true },
  backImage: { type: String },
  selfieImage: { type: String },
  drivingLicenseImage: { type: String },
  submittedAt: { type: Date, default: Date.now },
  reviewedAt: { type: Date },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rejectionReason: { type: String },
  notes: { type: String }
}, {
  timestamps: true
});

// Indexes
verificationSchema.index({ userId: 1 });
verificationSchema.index({ status: 1 });

export default mongoose.model('Verification', verificationSchema);

