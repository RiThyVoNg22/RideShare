import { protect } from './auth.js';

// Admin middleware - must be used after protect middleware
export const admin = async (req, res, next) => {
  // Check if user is admin
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized'
    });
  }

  // Check if user has admin role or isAdmin flag
  if (req.user.role !== 'admin' && !req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }

  next();
};

// Combined middleware: protect + admin
export const protectAdmin = [protect, admin];

