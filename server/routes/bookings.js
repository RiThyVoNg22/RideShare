import express from 'express';
import Booking from '../models/Booking.js';
import Vehicle from '../models/Vehicle.js';
import { protect } from '../middleware/auth.js';
import { notifyBookingCreated, notifyBookingConfirmed, notifyBookingCancelled } from '../utils/notifications.js';

const router = express.Router();

// Create booking
router.post('/', protect, async (req, res) => {
  try {
    const { vehicleId, pickupDate, returnDate } = req.body;

    // Get vehicle
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    if (!vehicle.available) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle is not available'
      });
    }

    // Calculate rental days and pricing
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    const rentalDays = Math.ceil((returnD - pickup) / (1000 * 60 * 60 * 24)) || 1;
    const subtotal = vehicle.pricePerDay * rentalDays;
    
    // Commission calculation (configurable via .env, default 10%)
    const commissionRate = parseFloat(process.env.COMMISSION_RATE || '0.10'); // 10% default
    const commission = subtotal * commissionRate;
    const serviceFee = subtotal * 0.05; // Optional service fee (can be removed if you only want commission)
    const ownerEarnings = subtotal - commission; // What the owner receives
    const total = subtotal + serviceFee; // Total paid by renter

    // Create booking
    const booking = await Booking.create({
      userId: req.user._id,
      userEmail: req.user.email,
      userName: `${req.user.firstName} ${req.user.lastName}`,
      vehicleId: vehicle._id,
      vehicleName: vehicle.name,
      ownerId: vehicle.ownerId,
      ownerName: vehicle.ownerName,
      pickupDate: pickup,
      returnDate: returnD,
      rentalDays,
      dailyRate: vehicle.pricePerDay,
      subtotal,
      serviceFee,
      commission,
      commissionRate,
      ownerEarnings,
      totalPrice: total,
      status: 'pending'
    });

    // Update vehicle availability
    vehicle.available = false;
    await vehicle.save();

    // Notify owner about new booking request
    const renterName = `${req.user.firstName} ${req.user.lastName}`;
    await notifyBookingCreated(booking, vehicle.ownerId, renterName, vehicle.name);

    res.status(201).json({
      success: true,
      booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get user's bookings
router.get('/my-bookings', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('vehicleId', 'name images pricePerDay location')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get owner's booking requests
router.get('/owner-requests', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ ownerId: req.user._id })
      .populate('userId', 'firstName lastName email phone idVerified')
      .populate('vehicleId', 'name images pricePerDay location')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get single booking
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('vehicleId')
      .populate('userId', 'firstName lastName email phone')
      .populate('ownerId', 'firstName lastName email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check authorization
    if (booking.userId._id.toString() !== req.user._id.toString() &&
        booking.ownerId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Cancel booking (user can cancel their own booking)
router.delete('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized. You can only cancel your own bookings.'
      });
    }

    // Prevent cancellation if booking is already completed or active
    if (booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed booking'
      });
    }

    if (booking.status === 'active') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel an active booking. Please contact support.'
      });
    }

    // Update booking status to cancelled
    booking.status = 'cancelled';
    booking.updatedAt = new Date();
    
    // If payment was made, mark for refund
    if (booking.paymentStatus === 'paid') {
      booking.paymentStatus = 'refunded';
    }
    
    await booking.save();

    // Update vehicle availability - make it available again
    const vehicle = await Vehicle.findById(booking.vehicleId);
    if (vehicle) {
      vehicle.available = true;
      await vehicle.save();
    }

    // Notify owner about cancellation
    const renterName = `${req.user.firstName} ${req.user.lastName}`;
    await notifyBookingCancelled(booking, booking.ownerId, false, renterName, booking.vehicleName);

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Update booking status (owner only)
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Only owner can update status
    if (booking.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const oldStatus = booking.status;
    booking.status = status;
    booking.updatedAt = new Date();
    await booking.save();

    // Notify renter if booking was confirmed
    if (status === 'confirmed' && oldStatus !== 'confirmed') {
      await notifyBookingConfirmed(booking, booking.userId, booking.ownerName || req.user.firstName, booking.vehicleName);
    }

    // Update vehicle availability
    if (status === 'confirmed' || status === 'active') {
      const vehicle = await Vehicle.findById(booking.vehicleId);
      if (vehicle) {
        vehicle.available = false;
        await vehicle.save();
      }
    } else if (status === 'completed' || status === 'cancelled') {
      const vehicle = await Vehicle.findById(booking.vehicleId);
      if (vehicle) {
        vehicle.available = true;
        vehicle.totalRentals += 1;
        await vehicle.save();
      }
    }

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

export default router;

