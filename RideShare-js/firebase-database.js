// firebase-database.js - Firebase Firestore Database Service

// ===============================
// User Profile Management
// ===============================

/**
 * Create user profile in Firestore
 * @param {string} userId - Firebase user ID
 * @param {Object} profileData - User profile data
 */
async function createUserProfile(userId, profileData) {
    try {
        await db.collection('users').doc(userId).set(profileData);
        console.log('User profile created successfully');
    } catch (error) {
        console.error('Error creating user profile:', error);
        throw error;
    }
}

/**
 * Get user profile from Firestore
 * @param {string} userId - Firebase user ID
 * @returns {Promise<Object>} User profile data
 */
async function getUserProfile(userId) {
    try {
        const doc = await db.collection('users').doc(userId).get();
        if (doc.exists) {
            return { id: doc.id, ...doc.data() };
        }
        return null;
    } catch (error) {
        console.error('Error getting user profile:', error);
        throw error;
    }
}

/**
 * Update user profile
 * @param {string} userId - Firebase user ID
 * @param {Object} updates - Fields to update
 */
async function updateUserProfile(userId, updates) {
    try {
        await db.collection('users').doc(userId).update({
            ...updates,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log('User profile updated successfully');
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
}

/**
 * Delete user profile
 * @param {string} userId - Firebase user ID
 */
async function deleteUserProfile(userId) {
    try {
        // Delete user's vehicles first
        const vehicles = await db.collection('vehicles')
            .where('ownerId', '==', userId)
            .get();
        
        const batch = db.batch();
        vehicles.forEach(doc => {
            batch.delete(doc.ref);
        });
        
        // Delete user profile
        batch.delete(db.collection('users').doc(userId));
        await batch.commit();
        
        console.log('User profile and associated data deleted');
    } catch (error) {
        console.error('Error deleting user profile:', error);
        throw error;
    }
}

// ===============================
// Vehicle Management
// ===============================

/**
 * Add a new vehicle listing
 * @param {Object} vehicleData - Vehicle information
 * @returns {Promise<string>} Vehicle document ID
 */
async function addVehicle(vehicleData) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User must be logged in to add vehicle');
        
        const vehicle = {
            ...vehicleData,
            ownerId: user.uid,
            ownerName: user.displayName || user.email,
            status: 'pending', // pending, approved, rejected
            available: true,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            views: 0,
            totalRentals: 0,
            rating: 0,
            reviews: []
        };
        
        const docRef = await db.collection('vehicles').add(vehicle);
        console.log('Vehicle added with ID:', docRef.id);
        if (typeof showMessage === 'function') {
            showMessage('Vehicle listing created successfully!', 'success');
        }
        return docRef.id;
    } catch (error) {
        console.error('Error adding vehicle:', error);
        if (typeof showMessage === 'function') {
            showMessage('Error creating vehicle listing', 'error');
        }
        throw error;
    }
}

/**
 * Get all vehicles with optional filters
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} Array of vehicles
 */
async function getVehicles(filters = {}) {
    try {
        let query = db.collection('vehicles').where('status', '==', 'approved');
        
        // Apply filters
        if (filters.type) {
            query = query.where('type', '==', filters.type);
        }
        if (filters.location) {
            query = query.where('location', '==', filters.location);
        }
        if (filters.available !== undefined) {
            query = query.where('available', '==', filters.available);
        }
        if (filters.minPrice) {
            query = query.where('pricePerDay', '>=', filters.minPrice);
        }
        if (filters.maxPrice) {
            query = query.where('pricePerDay', '<=', filters.maxPrice);
        }
        
        // Add sorting
        if (filters.sortBy === 'price-low') {
            query = query.orderBy('pricePerDay', 'asc');
        } else if (filters.sortBy === 'price-high') {
            query = query.orderBy('pricePerDay', 'desc');
        } else if (filters.sortBy === 'rating') {
            query = query.orderBy('rating', 'desc');
        } else {
            query = query.orderBy('createdAt', 'desc');
        }
        
        // Add limit
        if (filters.limit) {
            query = query.limit(filters.limit);
        }
        
        const snapshot = await query.get();
        const vehicles = [];
        snapshot.forEach(doc => {
            vehicles.push({ id: doc.id, ...doc.data() });
        });
        
        return vehicles;
    } catch (error) {
        console.error('Error getting vehicles:', error);
        throw error;
    }
}

/**
 * Get single vehicle by ID (with view increment)
 * @param {string} vehicleId - Vehicle document ID
 * @returns {Promise<Object>} Vehicle data
 */
async function getVehicle(vehicleId) {
    try {
        const doc = await db.collection('vehicles').doc(vehicleId).get();
        if (doc.exists) {
            // Increment view count
            await db.collection('vehicles').doc(vehicleId).update({
                views: firebase.firestore.FieldValue.increment(1)
            });
            return { id: doc.id, ...doc.data() };
        }
        return null;
    } catch (error) {
        console.error('Error getting vehicle:', error);
        throw error;
    }
}

/**
 * Get vehicle data without incrementing views (for ownership verification)
 * @param {string} vehicleId - Vehicle document ID
 * @returns {Promise<Object>} Vehicle data
 */
async function getVehicleData(vehicleId) {
    try {
        const doc = await db.collection('vehicles').doc(vehicleId).get();
        if (doc.exists) {
            return { id: doc.id, ...doc.data() };
        }
        return null;
    } catch (error) {
        console.error('Error getting vehicle data:', error);
        throw error;
    }
}

/**
 * Get user's vehicles
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of user's vehicles
 */
async function getUserVehicles(userId) {
    try {
        const snapshot = await db.collection('vehicles')
            .where('ownerId', '==', userId)
            .orderBy('createdAt', 'desc')
            .get();
        
        const vehicles = [];
        snapshot.forEach(doc => {
            vehicles.push({ id: doc.id, ...doc.data() });
        });
        
        return vehicles;
    } catch (error) {
        console.error('Error getting user vehicles:', error);
        throw error;
    }
}

/**
 * Update vehicle information
 * @param {string} vehicleId - Vehicle document ID
 * @param {Object} updates - Fields to update
 */
async function updateVehicle(vehicleId, updates) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User must be logged in to update vehicle');
        
        // Verify ownership - use getVehicleData instead of getVehicle to avoid view increment
        const vehicle = await getVehicleData(vehicleId);
        if (!vehicle) {
            throw new Error('Vehicle not found');
        }
        if (vehicle.ownerId !== user.uid) {
            throw new Error('You can only update your own vehicles');
        }
        
        await db.collection('vehicles').doc(vehicleId).update({
            ...updates,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        console.log('Vehicle updated successfully');
        if (typeof showMessage === 'function') {
            showMessage('Vehicle updated successfully!', 'success');
        }
    } catch (error) {
        console.error('Error updating vehicle:', error);
        if (typeof showMessage === 'function') {
            showMessage(error.message || 'Error updating vehicle', 'error');
        }
        throw error;
    }
}

/**
 * Delete vehicle listing
 * @param {string} vehicleId - Vehicle document ID
 */
async function deleteVehicle(vehicleId) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User must be logged in to delete vehicle');
        
        // Verify ownership - use getVehicleData instead of getVehicle
        const vehicle = await getVehicleData(vehicleId);
        if (!vehicle) {
            throw new Error('Vehicle not found');
        }
        if (vehicle.ownerId !== user.uid) {
            throw new Error('You can only delete your own vehicles');
        }
        
        // Check for active rentals
        const activeRentals = await db.collection('rentals')
            .where('vehicleId', '==', vehicleId)
            .where('status', 'in', ['pending', 'active'])
            .get();
        
        if (!activeRentals.empty) {
            throw new Error('Cannot delete vehicle with active rentals');
        }
        
        await db.collection('vehicles').doc(vehicleId).delete();
        console.log('Vehicle deleted successfully');
        if (typeof showMessage === 'function') {
            showMessage('Vehicle deleted successfully!', 'success');
        }
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        if (typeof showMessage === 'function') {
            showMessage(error.message || 'Error deleting vehicle', 'error');
        }
        throw error;
    }
}

// ===============================
// Rental Management
// ===============================

/**
 * Create a rental request
 * @param {Object} rentalData - Rental information
 * @returns {Promise<string>} Rental document ID
 */
async function createRental(rentalData) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User must be logged in to rent vehicle');
        
        // Check if vehicle is available - use getVehicleData
        const vehicle = await getVehicleData(rentalData.vehicleId);
        if (!vehicle.available) {
            throw new Error('Vehicle is not available for rent');
        }
        
        const rental = {
            ...rentalData,
            renterId: user.uid,
            renterName: user.displayName || user.email,
            ownerId: vehicle.ownerId,
            ownerName: vehicle.ownerName,
            vehicleName: vehicle.name,
            status: 'pending', // pending, approved, active, completed, cancelled
            totalCost: calculateRentalCost(rentalData.startDate, rentalData.endDate, vehicle.pricePerDay),
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        const docRef = await db.collection('rentals').add(rental);
        
        // Send notification to owner
        await createNotification({
            userId: vehicle.ownerId,
            type: 'rental_request',
            title: 'New Rental Request',
            message: `${user.displayName || user.email} wants to rent your ${vehicle.name}`,
            data: { rentalId: docRef.id, vehicleId: vehicle.id }
        });
        
        if (typeof showMessage === 'function') {
            showMessage('Rental request sent successfully!', 'success');
        }
        return docRef.id;
    } catch (error) {
        console.error('Error creating rental:', error);
        if (typeof showMessage === 'function') {
            showMessage(error.message || 'Error creating rental request', 'error');
        }
        throw error;
    }
}

/**
 * Get user's rentals (as renter)
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of rentals
 */
async function getUserRentals(userId) {
    try {
        const snapshot = await db.collection('rentals')
            .where('renterId', '==', userId)
            .orderBy('createdAt', 'desc')
            .get();
        
        const rentals = [];
        snapshot.forEach(doc => {
            rentals.push({ id: doc.id, ...doc.data() });
        });
        
        return rentals;
    } catch (error) {
        console.error('Error getting user rentals:', error);
        throw error;
    }
}

/**
 * Get rental requests for owner
 * @param {string} ownerId - Owner user ID
 * @returns {Promise<Array>} Array of rental requests
 */
async function getOwnerRentalRequests(ownerId) {
    try {
        const snapshot = await db.collection('rentals')
            .where('ownerId', '==', ownerId)
            .orderBy('createdAt', 'desc')
            .get();
        
        const rentals = [];
        snapshot.forEach(doc => {
            rentals.push({ id: doc.id, ...doc.data() });
        });
        
        return rentals;
    } catch (error) {
        console.error('Error getting rental requests:', error);
        throw error;
    }
}

/**
 * Update rental status
 * @param {string} rentalId - Rental document ID
 * @param {string} status - New status
 */
async function updateRentalStatus(rentalId, status) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User must be logged in');
        
        const rental = await db.collection('rentals').doc(rentalId).get();
        const rentalData = rental.data();
        
        // Verify permissions
        if (status === 'approved' || status === 'rejected') {
            if (rentalData.ownerId !== user.uid) {
                throw new Error('Only owner can approve or reject rentals');
            }
        }
        
        await db.collection('rentals').doc(rentalId).update({
            status: status,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Update vehicle availability if approved
        if (status === 'approved') {
            await updateVehicle(rentalData.vehicleId, { available: false });
        } else if (status === 'completed' || status === 'cancelled') {
            await updateVehicle(rentalData.vehicleId, { available: true });
        }
        
        // Send notification
        const targetUserId = rentalData.ownerId === user.uid ? rentalData.renterId : rentalData.ownerId;
        await createNotification({
            userId: targetUserId,
            type: 'rental_status',
            title: 'Rental Status Updated',
            message: `Your rental request has been ${status}`,
            data: { rentalId: rentalId }
        });
        
        if (typeof showMessage === 'function') {
            showMessage(`Rental ${status} successfully!`, 'success');
        }
    } catch (error) {
        console.error('Error updating rental status:', error);
        if (typeof showMessage === 'function') {
            showMessage(error.message || 'Error updating rental', 'error');
        }
        throw error;
    }
}

/**
 * Calculate rental cost
 * @param {Date} startDate - Rental start date
 * @param {Date} endDate - Rental end date
 * @param {number} pricePerDay - Daily rental price
 * @returns {number} Total cost
 */
function calculateRentalCost(startDate, endDate, pricePerDay) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return days * pricePerDay;
}

// ===============================
// Reviews and Ratings
// ===============================

/**
 * Add review for a rental
 * @param {Object} reviewData - Review information
 */
async function addReview(reviewData) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User must be logged in to add review');
        
        const review = {
            ...reviewData,
            reviewerId: user.uid,
            reviewerName: user.displayName || user.email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        // Add review to rental
        await db.collection('rentals').doc(reviewData.rentalId).update({
            review: review,
            reviewed: true
        });
        
        // Update vehicle rating
        const rental = await db.collection('rentals').doc(reviewData.rentalId).get();
        const rentalData = rental.data();
        
        // Get all reviews for this vehicle
        const reviews = await db.collection('rentals')
            .where('vehicleId', '==', rentalData.vehicleId)
            .where('reviewed', '==', true)
            .get();
        
        let totalRating = 0;
        let reviewCount = 0;
        reviews.forEach(doc => {
            const data = doc.data();
            if (data.review && data.review.rating) {
                totalRating += data.review.rating;
                reviewCount++;
            }
        });
        
        const avgRating = reviewCount > 0 ? totalRating / reviewCount : 0;
        
        // Update vehicle with new rating
        await db.collection('vehicles').doc(rentalData.vehicleId).update({
            rating: avgRating,
            reviewCount: reviewCount
        });
        
        if (typeof showMessage === 'function') {
            showMessage('Review submitted successfully!', 'success');
        }
    } catch (error) {
        console.error('Error adding review:', error);
        if (typeof showMessage === 'function') {
            showMessage('Error submitting review', 'error');
        }
        throw error;
    }
}

// ===============================
// Notifications
// ===============================

/**
 * Create notification for user
 * @param {Object} notificationData - Notification information
 */
async function createNotification(notificationData) {
    try {
        await db.collection('notifications').add({
            ...notificationData,
            read: false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
        console.error('Error creating notification:', error);
    }
}

/**
 * Get user notifications
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of notifications
 */
async function getUserNotifications(userId) {
    try {
        const snapshot = await db.collection('notifications')
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc')
            .limit(20)
            .get();
        
        const notifications = [];
        snapshot.forEach(doc => {
            notifications.push({ id: doc.id, ...doc.data() });
        });
        
        return notifications;
    } catch (error) {
        console.error('Error getting notifications:', error);
        throw error;
    }
}

/**
 * Mark notification as read
 * @param {string} notificationId - Notification ID
 */
async function markNotificationRead(notificationId) {
    try {
        await db.collection('notifications').doc(notificationId).update({
            read: true,
            readAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
        console.error('Error marking notification as read:', error);
    }
}

// ===============================
// Search and Filters
// ===============================

/**
 * Search vehicles by location (with geohash for nearby search)
 * @param {Object} location - Location coordinates
 * @param {number} radius - Search radius in km
 * @returns {Promise<Array>} Array of nearby vehicles
 */
async function searchNearbyVehicles(location, radius = 5) {
    try {
        // For simplicity, using city-based search
        // In production, implement geohash for precise location search
        const vehicles = await getVehicles({
            location: location.city,
            available: true
        });
        
        return vehicles;
    } catch (error) {
        console.error('Error searching nearby vehicles:', error);
        throw error;
    }
}

/**
 * Advanced vehicle search
 * @param {Object} searchParams - Search parameters
 * @returns {Promise<Array>} Array of vehicles matching search
 */
async function searchVehicles(searchParams) {
    try {
        let query = db.collection('vehicles').where('status', '==', 'approved');
        
        // Text search (would need full-text search in production)
        if (searchParams.searchText) {
            // For now, filter client-side
            const allVehicles = await getVehicles();
            return allVehicles.filter(v => 
                v.name.toLowerCase().includes(searchParams.searchText.toLowerCase()) ||
                v.description?.toLowerCase().includes(searchParams.searchText.toLowerCase())
            );
        }
        
        // Apply all other filters
        const vehicles = await getVehicles(searchParams);
        return vehicles;
    } catch (error) {
        console.error('Error searching vehicles:', error);
        throw error;
    }
}

// ===============================
// Real-time Updates
// ===============================

/**
 * Subscribe to vehicle updates
 * @param {Function} callback - Callback function for updates
 * @returns {Function} Unsubscribe function
 */
function subscribeToVehicles(callback) {
    return db.collection('vehicles')
        .where('status', '==', 'approved')
        .where('available', '==', true)
        .onSnapshot((snapshot) => {
            const vehicles = [];
            snapshot.forEach(doc => {
                vehicles.push({ id: doc.id, ...doc.data() });
            });
            callback(vehicles);
        }, (error) => {
            console.error('Error subscribing to vehicles:', error);
        });
}

/**
 * Subscribe to user's rental updates
 * @param {string} userId - User ID
 * @param {Function} callback - Callback function
 * @returns {Function} Unsubscribe function
 */
function subscribeToUserRentals(userId, callback) {
    return db.collection('rentals')
        .where('renterId', '==', userId)
        .onSnapshot((snapshot) => {
            const rentals = [];
            snapshot.forEach(doc => {
                rentals.push({ id: doc.id, ...doc.data() });
            });
            callback(rentals);
        }, (error) => {
            console.error('Error subscribing to rentals:', error);
        });
}

/**
 * Subscribe to notifications
 * @param {string} userId - User ID
 * @param {Function} callback - Callback function
 * @returns {Function} Unsubscribe function
 */
function subscribeToNotifications(userId, callback) {
    return db.collection('notifications')
        .where('userId', '==', userId)
        .where('read', '==', false)
        .onSnapshot((snapshot) => {
            const notifications = [];
            snapshot.forEach(doc => {
                notifications.push({ id: doc.id, ...doc.data() });
            });
            callback(notifications);
        }, (error) => {
            console.error('Error subscribing to notifications:', error);
        });
}

// Make functions available globally for profile-modal.js
if (typeof window !== 'undefined') {
    window.updateVehicle = updateVehicle;
    window.deleteVehicle = deleteVehicle;
    window.getVehicleData = getVehicleData;
}