import express from 'express';
import Stripe from 'stripe';
import Booking from '../models/Booking.js';
import Vehicle from '../models/Vehicle.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Initialize Stripe (only if key is provided)
let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-11-20.acacia',
  });
}

// Create Stripe checkout session for booking
router.post('/create-checkout-session', protect, async (req, res) => {
  if (!stripe) {
    return res.status(503).json({
      success: false,
      message: 'Payment processing is not configured. Please set STRIPE_SECRET_KEY in environment variables.'
    });
  }

  try {
    const { bookingId } = req.body;

    // Get booking
    const booking = await Booking.findById(bookingId)
      .populate('vehicleId')
      .populate('userId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify user owns this booking
    if (booking.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Check if already paid
    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Booking already paid'
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${booking.vehicleName} - Rental Booking`,
              description: `Rental from ${new Date(booking.pickupDate).toLocaleDateString()} to ${new Date(booking.returnDate).toLocaleDateString()} (${booking.rentalDays} days)`,
            },
            unit_amount: Math.round(booking.totalPrice * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3001'}/payment/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3001'}/payment/cancel?booking_id=${bookingId}`,
      metadata: {
        bookingId: bookingId.toString(),
        userId: req.user._id.toString(),
      },
      customer_email: booking.userEmail,
    });

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create checkout session'
    });
  }
});

// Verify payment status from Stripe session
router.get('/verify-session/:sessionId', protect, async (req, res) => {
  if (!stripe) {
    return res.status(503).json({
      success: false,
      message: 'Payment processing is not configured.'
    });
  }

  try {
    const { sessionId } = req.params;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      const bookingId = session.metadata.bookingId;
      const booking = await Booking.findById(bookingId);

      if (booking) {
        booking.paymentStatus = 'paid';
        booking.status = 'confirmed'; // Auto-confirm when paid
        await booking.save();

        return res.json({
          success: true,
          paid: true,
          booking: booking
        });
      }
    }

    res.json({
      success: true,
      paid: false,
      paymentStatus: session.payment_status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to verify payment'
    });
  }
});

// Stripe webhook handler (for production - handles payment confirmations)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ received: false, message: 'Stripe not configured' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const bookingId = session.metadata?.bookingId;

    if (bookingId) {
      try {
        const booking = await Booking.findById(bookingId);
        if (booking && booking.paymentStatus !== 'paid') {
          booking.paymentStatus = 'paid';
          booking.status = 'confirmed';
          await booking.save();
          
          console.log(`Booking ${bookingId} payment confirmed via webhook`);
        }
      } catch (error) {
        console.error('Error updating booking from webhook:', error);
      }
    }
  }

  res.json({ received: true });
});

export default router;

