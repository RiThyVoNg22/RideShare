import express from 'express';
import Vehicle from '../models/Vehicle.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get all vehicles (with filters)
router.get('/', async (req, res) => {
  try {
    const { type, location, minPrice, maxPrice, available, status } = req.query;
    
    const query = {};
    
    // Only show approved vehicles by default (unless status filter is specified)
    if (status) {
      query.status = status;
    } else {
      query.status = 'approved'; // Only show approved by default
    }
    
    // Only show available vehicles by default (unless available filter is specified)
    if (available !== undefined) {
      query.available = available === 'true';
    } else {
      query.available = true; // Only show available vehicles by default
    }
    
    if (type) query.type = type;
    if (location) {
      // Support both city and district search
      query.$or = [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.district': { $regex: location, $options: 'i' } }
      ];
    }
    if (minPrice) query.pricePerDay = { ...query.pricePerDay, $gte: parseFloat(minPrice) };
    if (maxPrice) query.pricePerDay = { ...query.pricePerDay, $lte: parseFloat(maxPrice) };

    const vehicles = await Vehicle.find(query)
      .populate('ownerId', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: vehicles.length,
      vehicles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get single vehicle
router.get('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate('ownerId', 'firstName lastName email phone');

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    // Increment views
    vehicle.views += 1;
    await vehicle.save();

    res.json({
      success: true,
      vehicle
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create vehicle (protected)
router.post('/', protect, async (req, res) => {
  try {
    const vehicleData = {
      ...req.body,
      ownerId: req.user._id,
      ownerName: `${req.user.firstName} ${req.user.lastName}`,
      ownerEmail: req.user.email,
      ownerPhone: req.user.phone,
      status: 'approved', // Auto-approve vehicles when listed
      available: true
    };

    const vehicle = await Vehicle.create(vehicleData);

    // Update user's total listings
    req.user.totalListings += 1;
    await req.user.save();

    res.status(201).json({
      success: true,
      vehicle
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Update vehicle (protected - owner only)
router.put('/:id', protect, async (req, res) => {
  try {
    let vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    // Check ownership
    if (vehicle.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this vehicle'
      });
    }

    vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      vehicle
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Delete vehicle (protected - owner only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    // Check ownership
    if (vehicle.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this vehicle'
      });
    }

    await Vehicle.findByIdAndDelete(req.params.id);

    // Update user's total listings
    req.user.totalListings = Math.max(0, req.user.totalListings - 1);
    await req.user.save();

    res.json({
      success: true,
      message: 'Vehicle deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get user's vehicles
router.get('/user/my-vehicles', protect, async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ ownerId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: vehicles.length,
      vehicles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;

