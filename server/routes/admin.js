import express from 'express';
import Booking from '../models/Booking.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = express.Router();

// Get all commissions (admin only)
router.get('/commissions', protect, admin, async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;
    
    // Build query
    const query = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    if (status) {
      query.status = status;
    }

    // Get all bookings with commissions
    const bookings = await Booking.find(query)
      .populate('userId', 'firstName lastName email')
      .populate('ownerId', 'firstName lastName email')
      .populate('vehicleId', 'name')
      .sort({ createdAt: -1 });

    // Calculate totals
    const totalCommission = bookings.reduce((sum, booking) => sum + (booking.commission || 0), 0);
    const totalBookings = bookings.length;
    const completedBookings = bookings.filter(b => b.status === 'completed').length;
    const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);

    res.json({
      success: true,
      summary: {
        totalCommission,
        totalBookings,
        completedBookings,
        totalRevenue,
        averageCommission: totalBookings > 0 ? totalCommission / totalBookings : 0
      },
      bookings: bookings.map(booking => ({
        _id: booking._id,
        bookingDate: booking.createdAt,
        renter: {
          name: booking.userName,
          email: booking.userEmail
        },
        owner: {
          name: booking.ownerName,
          email: booking.ownerId?.email
        },
        vehicle: booking.vehicleName,
        subtotal: booking.subtotal,
        commission: booking.commission,
        commissionRate: booking.commissionRate,
        ownerEarnings: booking.ownerEarnings,
        totalPrice: booking.totalPrice,
        status: booking.status,
        paymentStatus: booking.paymentStatus
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get commission statistics (admin only)
router.get('/commissions/stats', protect, admin, async (req, res) => {
  try {
    const { period = 'month' } = req.query; // day, week, month, year
    
    const now = new Date();
    let startDate;
    
    switch (period) {
      case 'day':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    const bookings = await Booking.find({
      createdAt: { $gte: startDate },
      status: { $in: ['confirmed', 'active', 'completed'] }
    });

    const stats = {
      period,
      startDate,
      endDate: new Date(),
      totalCommission: bookings.reduce((sum, b) => sum + (b.commission || 0), 0),
      totalBookings: bookings.length,
      totalRevenue: bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0),
      averageCommission: bookings.length > 0 
        ? bookings.reduce((sum, b) => sum + (b.commission || 0), 0) / bookings.length 
        : 0
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;

