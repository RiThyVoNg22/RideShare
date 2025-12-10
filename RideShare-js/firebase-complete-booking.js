// firebase-complete-booking.js - With Beautiful Notifications

let bookingUser = null;

document.addEventListener('DOMContentLoaded', function() {
    firebase.auth().onAuthStateChanged(user => {
        bookingUser = user;
        console.log('Booking auth state:', user ? 'Logged in as ' + user.email : 'Not logged in');
        setupBookingSystem();
        // Remove any email verification warnings on page load
        removeEmailWarnings();
    });
});

// Function to remove email verification warning banners
function removeEmailWarnings() {
    // Remove any existing email verification warnings
    setTimeout(() => {
        const warnings = document.querySelectorAll('[class*="warning"], [class*="alert"]');
        warnings.forEach(warning => {
            if (warning.textContent.includes('verify your email') || 
                warning.textContent.includes('email before renting')) {
                warning.remove();
                console.log('Removed email verification warning');
            }
        });
    }, 100);
}

function setupBookingSystem() {
    const bookBtn = document.getElementById('bookNowBtn');
    if (bookBtn) {
        bookBtn.addEventListener('click', saveBookingToFirestore);
    }
}

async function saveBookingToFirestore() {
    try {
        // 1. Check authentication ONLY (no email verification check)
        if (!bookingUser) {
            showNotification({
                type: 'warning',
                title: 'Login Required',
                message: 'Please log in to book a vehicle. Redirecting...',
                duration: 3000
            });
            setTimeout(() => {
                window.location.href = 'auth.html';
            }, 2000);
            return;
        }

        // Email verification check REMOVED - users can book without verification

        // 2. Get form data
        const pickupDate = document.getElementById('pickupDate')?.value;
        const returnDate = document.getElementById('returnDate')?.value;
        
        if (!pickupDate || !returnDate) {
            showNotification({
                type: 'error',
                title: 'Missing Information',
                message: 'Please select both pickup and return dates',
                duration: 4000
            });
            return;
        }

        // 3. Calculate days
        const days = Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24));
        if (days < 1) {
            showNotification({
                type: 'error',
                title: 'Invalid Dates',
                message: 'Return date must be after pickup date',
                duration: 4000
            });
            return;
        }

        // 4. Get vehicle ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const vehicleId = urlParams.get('id') || '1';

        // 5. Get pricing from page
        const dailyRateText = document.getElementById('dailyRate')?.textContent || '$8';
        const dailyRate = parseFloat(dailyRateText.replace('$', ''));
        const subtotal = dailyRate * days;
        const serviceFee = subtotal * 0.05;
        const total = subtotal + serviceFee;

        // 6. Disable button and show processing
        const bookBtn = document.getElementById('bookNowBtn');
        if (bookBtn) {
            bookBtn.disabled = true;
            bookBtn.textContent = 'Processing...';
        }

        // Show processing notification
        showNotification({
            type: 'info',
            title: 'Processing Booking',
            message: 'Please wait while we process your booking...',
            duration: 2000
        });

        console.log('Creating booking for user:', bookingUser.email);

        // 7. Create booking data
        const bookingData = {
            userId: bookingUser.uid,
            userEmail: bookingUser.email,
            userName: bookingUser.displayName || 'User',
            vehicleId: vehicleId,
            vehicleName: document.getElementById('productTitle')?.textContent || 'Vehicle',
            pickupDate: pickupDate,
            returnDate: returnDate,
            rentalDays: days,
            dailyRate: dailyRate,
            subtotal: subtotal,
            serviceFee: serviceFee,
            totalPrice: total,
            status: 'pending',
            paymentStatus: 'pending',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        // 8. Save to Firestore - bookings collection
        const bookingRef = await firebase.firestore()
            .collection('bookings')
            .add(bookingData);

        console.log('✓ Booking saved! ID:', bookingRef.id);

        // 9. Also save in user's subcollection
        await firebase.firestore()
            .collection('users')
            .doc(bookingUser.uid)
            .collection('bookings')
            .doc(bookingRef.id)
            .set({
                bookingId: bookingRef.id,
                vehicleId: vehicleId,
                pickupDate: pickupDate,
                returnDate: returnDate,
                totalPrice: total,
                status: 'pending',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

        // 10. Show success notification with booking ID
        showNotification({
            type: 'success',
            title: 'Booking Confirmed Successfully!',
            message: `Your booking has been confirmed. Booking ID: ${bookingRef.id}`,
            duration: 7000,
            action: {
                text: 'Copy Booking ID',
                onClick: function() {
                    navigator.clipboard.writeText(bookingRef.id).then(() => {
                        showNotification({
                            type: 'success',
                            title: 'Copied!',
                            message: 'Booking ID copied to clipboard',
                            duration: 2000
                        });
                    });
                }
            }
        });

        // Reset button after a delay
        setTimeout(() => {
            if (bookBtn) {
                bookBtn.disabled = false;
                bookBtn.innerHTML = '<i class="fas fa-calendar-check"></i> Book Now';
            }
        }, 3000);

    } catch (error) {
        console.error('Booking error:', error);
        
        // Show error notification
        showNotification({
            type: 'error',
            title: 'Booking Failed',
            message: error.message || 'An error occurred while processing your booking. Please try again.',
            duration: 6000
        });
        
        // Reset button
        const bookBtn = document.getElementById('bookNowBtn');
        if (bookBtn) {
            bookBtn.disabled = false;
            bookBtn.innerHTML = '<i class="fas fa-calendar-check"></i> Book Now';
        }
    }
}

console.log('✓ Booking system loaded (email verification disabled)');