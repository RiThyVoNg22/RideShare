import express from 'express';
import Verification from '../models/Verification.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = express.Router();

// Debug: Log route registration
console.log('✅ Verification routes loaded');

// Test endpoint (remove in production)
router.get('/test', (req, res) => {
  console.log('✅ Test endpoint called');
  res.json({ success: true, message: 'Verification route is working' });
});

// Submit ID verification
router.post('/submit', protect, async (req, res) => {
  console.log('✅ Verification submit endpoint called');
  try {
    const { documentType, frontImage, backImage, selfieImage, drivingLicenseImage } = req.body;
    console.log('📝 Received verification data:', { documentType, hasFrontImage: !!frontImage, hasBackImage: !!backImage, hasSelfie: !!selfieImage });

    if (!documentType || !frontImage) {
      return res.status(400).json({
        success: false,
        message: 'Document type and front image are required'
      });
    }

    if (!backImage) {
      return res.status(400).json({
        success: false,
        message: 'Back image is required'
      });
    }

    if (!selfieImage) {
      return res.status(400).json({
        success: false,
        message: 'Selfie with ID is required'
      });
    }

    // Check if user already has a pending verification
    const existingVerification = await Verification.findOne({
      userId: req.user._id,
      status: 'pending'
    });

    if (existingVerification) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending verification request. Please wait for it to be reviewed.'
      });
    }

    // Create verification
    const verification = await Verification.create({
      userId: req.user._id,
      type: 'id',
      documentType: documentType === 'national-id' ? 'national_id' : 
                    documentType === 'driving-license' ? 'driving_license' : 
                    documentType === 'passport' ? 'passport' : documentType,
      frontImage,
      backImage: backImage || null,
      selfieImage: selfieImage || null,
      drivingLicenseImage: drivingLicenseImage || null,
      status: 'pending'
    });

    // Update user profile
    await User.findByIdAndUpdate(req.user._id, {
      idVerificationStatus: 'pending',
      idVerified: false
    }, { new: true });

    res.status(201).json({
      success: true,
      message: 'Verification submitted successfully. Your documents will be reviewed within 24-48 hours.',
      verification
    });
  } catch (error) {
    console.error('Error submitting verification:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to submit verification'
    });
  }
});

// Get user's verification status
router.get('/my-verification', protect, async (req, res) => {
  try {
    const verification = await Verification.findOne({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      verification: verification || null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Skip verification
router.post('/skip', protect, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      idVerificationStatus: 'skipped'
    });

    res.json({
      success: true,
      message: 'Verification skipped'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// ============ ADMIN ROUTES ============

// Get all pending verifications (Admin only)
router.get('/admin/pending', protect, admin, async (req, res) => {
  try {
    const verifications = await Verification.find({ status: 'pending' })
      .populate('userId', 'firstName lastName email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: verifications.length,
      verifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get all verifications (Admin only)
router.get('/admin/all', protect, admin, async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};

    const verifications = await Verification.find(query)
      .populate('userId', 'firstName lastName email phone')
      .populate('reviewedBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: verifications.length,
      verifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Approve verification (Admin only)
router.put('/admin/:id/approve', protect, admin, async (req, res) => {
  try {
    console.log('✅ Admin approve endpoint called');
    console.log('📝 Verification ID:', req.params.id);
    console.log('👤 Admin User ID:', req.user._id);
    
    const { notes } = req.body;
    const verification = await Verification.findById(req.params.id);

    if (!verification) {
      console.error('❌ Verification not found:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Verification not found'
      });
    }

    console.log('📄 Current verification status:', verification.status);

    if (verification.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Verification is already ${verification.status}`
      });
    }

    // Update verification
    verification.status = 'approved';
    verification.reviewedAt = new Date();
    verification.reviewedBy = req.user._id;
    if (notes) verification.notes = notes;
    
    console.log('💾 Saving verification update...');
    await verification.save();
    console.log('✅ Verification saved successfully');

    // Update user profile
    console.log('👤 Updating user profile for userId:', verification.userId);
    await User.findByIdAndUpdate(verification.userId, {
      idVerificationStatus: 'approved',
      idVerified: true
    }, { new: true });
    console.log('✅ User profile updated successfully');

    console.log('🎉 Verification approval completed successfully');

    res.json({
      success: true,
      message: 'Verification approved successfully',
      verification
    });
  } catch (error) {
    console.error('❌ Error approving verification:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Reject verification (Admin only)
router.put('/admin/:id/reject', protect, admin, async (req, res) => {
  try {
    console.log('✅ Admin reject endpoint called');
    console.log('📝 Verification ID:', req.params.id);
    console.log('👤 Admin User ID:', req.user._id);
    
    const { rejectionReason, notes } = req.body;
    
    if (!rejectionReason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const verification = await Verification.findById(req.params.id);

    if (!verification) {
      console.error('❌ Verification not found:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Verification not found'
      });
    }

    console.log('📄 Current verification status:', verification.status);

    if (verification.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Verification is already ${verification.status}`
      });
    }

    // Update verification
    verification.status = 'rejected';
    verification.reviewedAt = new Date();
    verification.reviewedBy = req.user._id;
    verification.rejectionReason = rejectionReason;
    if (notes) verification.notes = notes;
    
    console.log('💾 Saving verification update...');
    await verification.save();
    console.log('✅ Verification saved successfully');

    // Update user profile
    console.log('👤 Updating user profile for userId:', verification.userId);
    await User.findByIdAndUpdate(verification.userId, {
      idVerificationStatus: 'rejected',
      idVerified: false
    }, { new: true });
    console.log('✅ User profile updated successfully');

    console.log('🎉 Verification rejection completed successfully');

    res.json({
      success: true,
      message: 'Verification rejected',
      verification
    });
  } catch (error) {
    console.error('❌ Error rejecting verification:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get single verification details (Admin only)
router.get('/admin/:id', protect, admin, async (req, res) => {
  try {
    const verification = await Verification.findById(req.params.id)
      .populate('userId', 'firstName lastName email phone createdAt')
      .populate('reviewedBy', 'firstName lastName email');

    if (!verification) {
      return res.status(404).json({
        success: false,
        message: 'Verification not found'
      });
    }

    res.json({
      success: true,
      verification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;

