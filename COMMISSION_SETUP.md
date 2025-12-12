# Commission System Setup

## Overview
The platform automatically calculates and tracks commission from each vehicle booking. By default, the commission rate is **10%** of the rental subtotal.

## Configuration

### Backend Configuration
Add the following to your `server/.env` file:

```env
# Commission Rate (as decimal, e.g., 0.10 = 10%, 0.15 = 15%)
COMMISSION_RATE=0.10
```

If not set, the default is **10% (0.10)**.

### How It Works

1. **Booking Creation**: When a user books a vehicle, the system calculates:
   - **Subtotal**: `pricePerDay × rentalDays`
   - **Commission**: `subtotal × COMMISSION_RATE` (default 10%)
   - **Owner Earnings**: `subtotal - commission` (what the owner receives)
   - **Service Fee**: `subtotal × 0.05` (5% - optional, can be removed)
   - **Total Price**: `subtotal + serviceFee` (what the renter pays)

2. **Commission Tracking**: Each booking stores:
   - `commission`: The platform's commission amount
   - `commissionRate`: The percentage used (for records)
   - `ownerEarnings`: Amount owner receives after commission

## Admin Dashboard

Access the commission dashboard at: `/admin/commissions`

Features:
- **Total Commission**: Sum of all commissions earned
- **Total Bookings**: Number of bookings
- **Period Statistics**: View commissions by day/week/month/year
- **Detailed List**: See all bookings with commission breakdown
- **Filtering**: Filter by booking status

## Example Calculation

If a vehicle costs **$100/day** and is rented for **3 days**:

- Subtotal: $100 × 3 = **$300**
- Commission (10%): $300 × 0.10 = **$30** ← Platform earns this
- Owner Earnings: $300 - $30 = **$270** ← Owner receives this
- Service Fee (5%): $300 × 0.05 = **$15**
- Total (paid by renter): $300 + $15 = **$315**

## Changing Commission Rate

1. Update `COMMISSION_RATE` in `server/.env`
2. Restart the backend server
3. New bookings will use the new rate
4. Old bookings keep their original commission rate

## Notes

- Commission is calculated from the **subtotal** (before service fees)
- Commission is automatically tracked for all bookings
- Only admins can view the commission dashboard
- Commission is stored per booking for historical accuracy

