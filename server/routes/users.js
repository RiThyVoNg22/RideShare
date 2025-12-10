import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Add/remove favorite
router.post('/favorites/:vehicleId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const vehicleId = req.params.vehicleId;

    if (user.favorites.includes(vehicleId)) {
      user.favorites = user.favorites.filter(id => id.toString() !== vehicleId);
    } else {
      user.favorites.push(vehicleId);
    }

    await user.save();

    res.json({
      success: true,
      favorites: user.favorites
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

export default router;

