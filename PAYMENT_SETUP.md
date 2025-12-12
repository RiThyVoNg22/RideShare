# Payment System Setup (Stripe)

## Overview
The platform now uses **Stripe** for secure payment processing. When users book a vehicle, they are redirected to Stripe Checkout to complete payment.

## Setup Instructions

### 1. Get Stripe API Keys

1. Go to [https://stripe.com](https://stripe.com) and create an account
2. Navigate to **Developers > API keys**
3. Copy your **Publishable key** and **Secret key**
   - Use **Test keys** for development
   - Use **Live keys** for production

### 2. Configure Backend

Add to your `server/.env` file:

```env
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_...  # Your Stripe Secret Key
STRIPE_WEBHOOK_SECRET=whsec_... # Optional: For production webhooks

# Frontend URL (for redirect URLs)
FRONTEND_URL=http://localhost:3001
```

### 3. Configure Frontend

The frontend automatically uses `VITE_API_URL` from your root `.env` file.

**Optional:** If you want to show Stripe checkout elements on the frontend, you can add:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

(Currently not needed - we use backend-only checkout)

## How It Works

1. **User Books Vehicle**: User clicks "Book Now" on a vehicle
2. **Booking Created**: Backend creates a booking with `paymentStatus: 'pending'`
3. **Stripe Session Created**: Backend creates a Stripe Checkout session
4. **Redirect to Stripe**: User is redirected to Stripe's secure payment page
5. **Payment Processing**: User enters card details and pays on Stripe
6. **Success Redirect**: After payment, user is redirected to `/payment/success`
7. **Payment Verification**: Frontend verifies payment status
8. **Booking Confirmed**: Booking status updated to `'confirmed'` and `paymentStatus: 'paid'`

## Payment Flow

```
User clicks "Book Now"
    ↓
Create Booking (status: pending, paymentStatus: pending)
    ↓
Create Stripe Checkout Session
    ↓
Redirect to Stripe Payment Page
    ↓
User Completes Payment
    ↓
Redirect to /payment/success
    ↓
Verify Payment Status
    ↓
Update Booking (status: confirmed, paymentStatus: paid)
```

## Testing with Stripe Test Cards

Use these test card numbers in Stripe checkout:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0027 6000 3184`

Use any:
- Future expiry date (e.g., 12/25)
- Any 3-digit CVC
- Any ZIP code (US) or postal code

## Webhooks (Production)

For production, set up Stripe webhooks:

1. Go to **Stripe Dashboard > Developers > Webhooks**
2. Add endpoint: `https://yourdomain.com/api/payments/webhook`
3. Select event: `checkout.session.completed`
4. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET` in `.env`

Webhooks ensure payment confirmation even if user closes browser before redirect.

## Commission Handling

When payment is completed:
- **Total Amount**: Charged to customer via Stripe
- **Platform Commission**: Tracked in booking (default 10%)
- **Owner Earnings**: Calculated and tracked (subtotal - commission)

Actual fund distribution would be handled through:
- Stripe Connect (for marketplace payouts)
- Manual transfers
- Scheduled payouts

## Security Notes

- ✅ Payments processed securely through Stripe
- ✅ Card details never touch your server
- ✅ Payment verification on both frontend and backend
- ✅ Webhook signature verification (production)
- ✅ User authorization checks on all payment endpoints

## Troubleshooting

### Payment session creation fails
- Check `STRIPE_SECRET_KEY` is set correctly
- Verify API key is for correct environment (test/live)
- Check backend logs for detailed error

### Payment not verifying
- Ensure `session_id` is passed correctly in URL
- Check payment status in Stripe Dashboard
- Verify booking ID matches

### Webhook not working
- Ensure webhook secret is correct
- Check webhook endpoint is accessible
- Verify Stripe can reach your server (use ngrok for local testing)

## Next Steps

To handle actual fund distribution to vehicle owners:
1. Set up Stripe Connect for marketplace payouts
2. Add owner bank account collection
3. Implement scheduled payouts after rental completion
4. Handle refunds for cancellations

