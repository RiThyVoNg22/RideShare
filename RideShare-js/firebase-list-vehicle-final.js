// firebase-list-vehicle-final.js - Complete vehicle listing with map validation

/**
 * Safe message display helper
 */
function safeShowMessage(message, type = 'info') {
    if (typeof showMessage === 'function') {
        showMessage(message, type);
    } else {
        const prefix = type === 'error' ? 'âŒ ' : type === 'success' ? 'âœ… ' : 'â„¹ï¸ ';
        alert(prefix + message);
    }
}

/**
 * Handle vehicle listing form submission
 */
document.getElementById('listVehicleForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    console.log('Form submitted - starting validation...');
    
    // Check authentication
    const user = auth.currentUser;
    if (!user) {
        safeShowMessage('Please log in to list your vehicle', 'error');
        setTimeout(() => {
            window.location.href = 'auth.html';
        }, 1500);
        return;
    }
    
    // Validate pickup location was selected from map
    if (typeof validatePickupLocation === 'function' && !validatePickupLocation()) {
        console.log('Location validation failed');
        return;
    }
    
    // Get location data
    const locationData = typeof getPickupLocationData === 'function' ? 
        getPickupLocationData() : null;
    
    if (!locationData || !locationData.coordinates) {
        safeShowMessage('Please select pickup location using the map', 'error');
        return;
    }
    
    console.log('Location validated:', locationData);
    
    // Get form data
    const formData = new FormData(this);
    
    // Get available days
    const availableDays = [];
    document.querySelectorAll('input[name="availableDays[]"]:checked').forEach(checkbox => {
        availableDays.push(checkbox.value);
    });
    
    if (availableDays.length === 0) {
        safeShowMessage('Please select at least one available day', 'error');
        document.querySelector('input[name="availableDays[]"]')?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        return;
    }
    
    // Get features
    const features = [];
    document.querySelectorAll('input[name="features[]"]:checked').forEach(checkbox => {
        features.push(checkbox.value);
    });
    
    // Show loading state
    showLoading(true);
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Listing...';
    
    try {
        console.log('Starting photo upload...');
        
        // Upload photos
        const photoUrls = await uploadVehiclePhotos();
        
        if (photoUrls.length < 3) {
            throw new Error('Please upload at least 3 photos of your vehicle');
        }
        
        console.log('Photos uploaded:', photoUrls.length);
        
        // Get user profile for additional info
        let userProfile = null;
        try {
            userProfile = await getUserProfile(user.uid);
        } catch (error) {
            console.log('Could not get user profile, using basic info');
        }
        
        // Create vehicle data object
        const vehicleData = {
            // Basic Info
            name: formData.get('vehicleTitle')?.trim(),
            type: formData.get('vehicleType'),
            brand: formData.get('vehicleBrand')?.trim(),
            model: formData.get('vehicleModel')?.trim(),
            year: formData.get('vehicleYear'),
            condition: formData.get('vehicleCondition'),
            description: formData.get('vehicleDescription')?.trim(),
            
            // Pricing
            pricePerDay: parseFloat(formData.get('dailyPrice')),
            depositAmount: parseFloat(formData.get('depositAmount')),
            currency: 'USD',
            
            // Location with full data from map
            location: {
                address: locationData.address,
                city: formData.get('vehicleCity'),
                district: formData.get('vehicleDistrict')?.trim(),
                coordinates: {
                    latitude: locationData.coordinates.latitude,
                    longitude: locationData.coordinates.longitude,
                    // Store as GeoPoint for Firestore geoqueries
                    geopoint: new firebase.firestore.GeoPoint(
                        locationData.coordinates.latitude,
                        locationData.coordinates.longitude
                    )
                },
                placeId: locationData.placeId || null,
                province: locationData.province || null,
                country: locationData.country || 'Cambodia'
            },
            
            // Availability
            availability: {
                days: availableDays,
                timeFrom: formData.get('availableFrom'),
                timeTo: formData.get('availableTo'),
                isAvailableNow: true
            },
            
            // Contact Information
            contact: {
                name: formData.get('ownerName')?.trim(),
                phone: formData.get('contactNumber')?.trim(),
                email: formData.get('contactEmail')?.trim().toLowerCase()
            },
            
            // Owner Info
            ownerId: user.uid,
            ownerName: userProfile?.firstName || user.displayName || formData.get('ownerName'),
            ownerEmail: user.email,
            ownerPhone: formData.get('contactNumber'),
            
            // Features and Photos
            features: features,
            photos: photoUrls,
            mainPhoto: photoUrls[0], // First photo as main
            
            // Metadata
            status: 'pending', // pending, approved, rejected, suspended
            available: true,
            verified: false,
            featured: false,
            
            // Stats
            views: 0,
            totalRentals: 0,
            rating: 0,
            reviewCount: 0,
            
            // Timestamps
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastActive: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        console.log('Vehicle data prepared:', vehicleData);
        
        // Add vehicle to database
        const vehicleId = await addVehicle(vehicleData);
        
        console.log('Vehicle added with ID:', vehicleId);
        
        // Success message
        safeShowMessage('ðŸŽ‰ Vehicle listed successfully! Your listing will be reviewed within 24 hours.', 'success');
        
        // Create notification for admin review
        try {
            await createNotification({
                userId: user.uid,
                type: 'listing_submitted',
                title: 'Vehicle Listing Submitted',
                message: 'Your vehicle listing has been submitted for review. We\'ll notify you once it\'s approved!',
                data: { vehicleId: vehicleId }
            });
        } catch (error) {
            console.error('Could not create notification:', error);
        }
        
        // Reset form
        this.reset();
        document.getElementById('photoPreview').innerHTML = '';
        
        // Remove location data
        const pickupField = document.getElementById('pickupLocation');
        if (pickupField) {
            pickupField.removeAttribute('data-lat');
            pickupField.removeAttribute('data-lng');
            pickupField.removeAttribute('data-place-id');
        }
        
        // Redirect after delay
        setTimeout(() => {
            // Try to open profile modal, otherwise go to rent page
            if (typeof openProfileModal === 'function') {
                window.location.href = 'rent.html';
                setTimeout(() => openProfileModal(), 500);
            } else {
                window.location.href = 'rent.html';
            }
        }, 2000);
        
    } catch (error) {
        console.error('Error listing vehicle:', error);
        safeShowMessage(error.message || 'Failed to list vehicle. Please try again.', 'error');
    } finally {
        showLoading(false);
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
});

/**
 * Upload vehicle photos to Firebase Storage
 */
async function uploadVehiclePhotos() {
    const photoInput = document.getElementById('vehiclePhotos');
    const files = photoInput?.files;
    
    if (!files || files.length === 0) {
        throw new Error('Please upload at least 3 photos');
    }
    
    if (files.length < 3) {
        throw new Error('Please upload at least 3 photos of your vehicle');
    }
    
    if (files.length > 10) {
        throw new Error('Maximum 10 photos allowed');
    }
    
    const photoUrls = [];
    const user = auth.currentUser;
    
    for (let i = 0; i < files.length; i++) {
        try {
            const file = files[i];
            
            // Validate file
            if (!file.type.startsWith('image/')) {
                throw new Error(`File ${i + 1} is not an image`);
            }
            
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                throw new Error(`Photo ${i + 1} is too large (max 5MB)`);
            }
            
            safeShowMessage(`Uploading photo ${i + 1} of ${files.length}...`, 'info');
            
            const fileName = `vehicles/${user.uid}/${Date.now()}_${i}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
            const storageRef = storage.ref(fileName);
            
            // Upload with metadata
            const metadata = {
                contentType: file.type,
                customMetadata: {
                    uploadedBy: user.uid,
                    uploadedAt: new Date().toISOString()
                }
            };
            
            const snapshot = await storageRef.put(file, metadata);
            const downloadURL = await snapshot.ref.getDownloadURL();
            
            photoUrls.push(downloadURL);
            
        } catch (error) {
            console.error(`Error uploading photo ${i + 1}:`, error);
            throw new Error(`Failed to upload photo ${i + 1}: ${error.message}`);
        }
    }
    
    return photoUrls;
}

/**
 * Calculate earnings in the calculator
 */
function updateCalculator() {
    const dailyRate = parseFloat(document.getElementById('calcDailyRate')?.value) || 0;
    const daysPerMonth = parseInt(document.getElementById('calcDaysPerMonth')?.value) || 0;
    
    // Platform commission
    const commission = 0.10;
    const netDailyRate = dailyRate * (1 - commission);
    
    // Calculate earnings
    const dailyEarning = netDailyRate;
    const monthlyEarning = netDailyRate * daysPerMonth;
    const yearlyEarning = monthlyEarning * 12;
    
    // Update display
    const dailyEl = document.getElementById('dailyEarning');
    const monthlyEl = document.getElementById('monthlyEarning');
    const yearlyEl = document.getElementById('yearlyEarning');
    
    if (dailyEl) dailyEl.textContent = `$${dailyEarning.toFixed(2)}`;
    if (monthlyEl) monthlyEl.textContent = `$${monthlyEarning.toFixed(2)}`;
    if (yearlyEl) yearlyEl.textContent = `$${yearlyEarning.toFixed(2)}`;
}

// Initialize calculator
if (document.getElementById('calcVehicleType')) {
    updateCalculator();
    
    document.getElementById('calcDailyRate')?.addEventListener('input', updateCalculator);
    document.getElementById('calcDaysPerMonth')?.addEventListener('input', updateCalculator);
}

/**
 * Show/hide vehicle-specific features based on type
 */
document.getElementById('vehicleType')?.addEventListener('change', function() {
    const type = this.value;
    
    // Hide all feature categories
    const carFeatures = document.getElementById('carFeatures');
    const motorbikeFeatures = document.getElementById('motorbikeFeatures');
    const bicycleFeatures = document.getElementById('bicycleFeatures');
    
    if (carFeatures) carFeatures.style.display = 'none';
    if (motorbikeFeatures) motorbikeFeatures.style.display = 'none';
    if (bicycleFeatures) bicycleFeatures.style.display = 'none';
    
    // Show relevant features
    if (type === 'car' && carFeatures) {
        carFeatures.style.display = 'block';
    } else if (type === 'motorbike' && motorbikeFeatures) {
        motorbikeFeatures.style.display = 'block';
    } else if (type === 'bicycle' && bicycleFeatures) {
        bicycleFeatures.style.display = 'block';
    }
    
    // Update pricing suggestions
    updatePricingSuggestions(type);
});

/**
 * Update pricing suggestions based on vehicle type
 */
function updatePricingSuggestions(type) {
    const dailyPriceInput = document.getElementById('dailyPrice');
    const depositInput = document.getElementById('depositAmount');
    
    if (!dailyPriceInput || !depositInput) return;
    
    if (type === 'car') {
        dailyPriceInput.placeholder = '25-50';
        depositInput.placeholder = '150-300';
        if (!dailyPriceInput.value) dailyPriceInput.value = '35';
        if (!depositInput.value) depositInput.value = '200';
    } else if (type === 'motorbike') {
        dailyPriceInput.placeholder = '6-12';
        depositInput.placeholder = '30-80';
        if (!dailyPriceInput.value) dailyPriceInput.value = '9';
        if (!depositInput.value) depositInput.value = '50';
    } else if (type === 'bicycle') {
        dailyPriceInput.placeholder = '3-8';
        depositInput.placeholder = '15-40';
        if (!dailyPriceInput.value) dailyPriceInput.value = '5';
        if (!depositInput.value) depositInput.value = '25';
    }
}


/**
 * Preview uploaded photos
 */
function previewPhotos(files) {
    if (!photoPreview) return;
    
    photoPreview.innerHTML = '';
    
    if (!files || files.length === 0) return;
    
    if (files.length > 10) {
        safeShowMessage('Maximum 10 photos allowed', 'error');
        return;
    }
    
    Array.from(files).forEach((file, index) => {
        if (!file.type.startsWith('image/')) {
            console.warn('Skipping non-image file:', file.name);
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.createElement('div');
            preview.className = 'photo-preview-item';
            preview.innerHTML = `
                <img src="${e.target.result}" alt="Preview ${index + 1}">
                <button type="button" class="remove-photo" onclick="removePhoto(${index})" title="Remove photo">
                    <i class="fas fa-times"></i>
                </button>
                <span class="photo-number">${index + 1}</span>
                ${index === 0 ? '<span class="main-photo-badge">Main</span>' : ''}
            `;
            photoPreview.appendChild(preview);
        };
        reader.readAsDataURL(file);
    });
}

/**
 * Remove photo from selection
 */
function removePhoto(index) {
    const photoInput = document.getElementById('vehiclePhotos');
    if (!photoInput) return;
    
    const dt = new DataTransfer();
    const files = Array.from(photoInput.files);
    
    files.splice(index, 1);
    files.forEach(file => dt.items.add(file));
    
    photoInput.files = dt.files;
    previewPhotos(photoInput.files);
}

// Make removePhoto globally accessible
window.removePhoto = removePhoto;