// product-detail.js - With Firebase Integration

let currentVehicle = null;
let rentalDays = 0;
let dailyRate = 0;

async function initializeProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const vehicleId = urlParams.get('id');
    
    if (!vehicleId) {
        showNotification({
            type: 'error',
            title: 'Invalid Request',
            message: 'No vehicle ID provided. Redirecting to rent page...',
            duration: 3000
        });
        
        setTimeout(() => {
            window.location.href = 'rent.html';
        }, 2000);
        return;
    }
    
    // Show loading
    showLoadingOverlay(true);
    
    // Load vehicle from Firebase
    await loadVehicleDetails(vehicleId);
    
    // Setup page functionality
    setupDateInputs();
    setupBookingCalculator();
    setupFavoriteButton();
    
    // Hide loading
    showLoadingOverlay(false);
    
    console.log('Product detail page loaded');
}

async function loadVehicleDetails(vehicleId) {
    try {
        console.log('Loading vehicle:', vehicleId);
        
        // Try to get vehicle from Firebase
        if (typeof getVehicleById === 'function') {
            currentVehicle = await getVehicleById(vehicleId);
        } else if (typeof db !== 'undefined') {
            // Fallback: Direct Firebase call
            const doc = await db.collection('vehicles').doc(vehicleId).get();
            if (doc.exists) {
                currentVehicle = {
                    id: doc.id,
                    ...doc.data()
                };
            }
        }
        
        if (!currentVehicle) {
            throw new Error('Vehicle not found');
        }
        
        console.log('Vehicle loaded:', currentVehicle);
        updateVehicleDetails(currentVehicle);
        
    } catch (error) {
        console.error('Error loading vehicle:', error);
        
        showNotification({
            type: 'error',
            title: 'Vehicle Not Found',
            message: 'The requested vehicle could not be found. Redirecting...',
            action: {
                text: 'Browse Vehicles',
                onClick: () => window.location.href = 'rent.html'
            },
            duration: 3000
        });
        
        setTimeout(() => {
            window.location.href = 'rent.html';
        }, 3000);
    }
}

function updateVehicleDetails(vehicle) {
    // Update page title
    document.title = `${vehicle.name} - RideShare Local`;
    
    // Update breadcrumb and main title
    document.getElementById('vehicleName').textContent = vehicle.name;
    document.getElementById('productTitle').textContent = vehicle.name;
    
    // Update main image
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        const imageUrl = (vehicle.images && vehicle.images[0]) || vehicle.image || '/RideShare/imge/placeholder.png';
        mainImage.src = imageUrl;
        mainImage.alt = vehicle.name;
    }
    
    // Update thumbnails
    const thumbnails = document.querySelectorAll('.thumbnail');
    if (vehicle.images && vehicle.images.length > 0) {
        thumbnails.forEach((thumb, index) => {
            if (vehicle.images[index]) {
                thumb.src = vehicle.images[index];
            } else {
                thumb.src = vehicle.images[0];
            }
        });
    } else {
        const fallbackImage = vehicle.image || '/RideShare/imge/placeholder.png';
        thumbnails.forEach(thumb => {
            thumb.src = fallbackImage;
        });
    }
    
    // Update vehicle type
    const vehicleTypeElement = document.querySelector('.vehicle-type');
    if (vehicleTypeElement) {
        vehicleTypeElement.textContent = capitalizeFirst(vehicle.type);
    }
    
    // Update availability status
    const availabilityElement = document.querySelector('.availability');
    if (availabilityElement) {
        availabilityElement.textContent = vehicle.available ? 'Available' : 'Not Available';
        availabilityElement.className = `availability ${vehicle.available ? 'available' : 'unavailable'}`;
        
        if (!vehicle.available) {
            showNotification({
                type: 'warning',
                title: 'Vehicle Currently Unavailable',
                message: 'This vehicle is currently rented. Please check back later or browse other vehicles.',
                duration: 5000
            });
        }
    }
    
    // Update rating
    updateRating(vehicle.rating || 0, vehicle.reviewCount || 0);
    
    // Update location
    const locationElement = document.querySelector('.location span');
    if (locationElement) {
        locationElement.textContent = `${vehicle.district || ''}, ${formatLocation(vehicle.location)}`;
    }
    
    // Update pricing
    document.querySelector('.pricing-card .price-row .price-item:first-child .price').textContent = `$${vehicle.pricePerDay}/day`;
    document.querySelector('.pricing-card .price-row .price-item:last-child .price').textContent = `$${vehicle.deposit || 0}`;
    
    // Update features
    updateFeatures(vehicle);
    
    // Set daily rate for calculations
    dailyRate = vehicle.pricePerDay;
    document.getElementById('dailyRate').textContent = `$${dailyRate}`;
    
    // Update owner info
    updateOwnerInfo(vehicle);
    
    // Update description if available
    if (vehicle.description) {
        const descriptionTab = document.querySelector('#description p');
        if (descriptionTab) {
            descriptionTab.textContent = vehicle.description;
        }
    }
    
    // Load similar vehicles
    loadSimilarVehicles(vehicle);
}

function updateRating(rating, reviewCount) {
    const ratingElements = document.querySelectorAll('.rating');
    ratingElements.forEach(element => {
        const starsContainer = element.querySelector('.stars');
        if (starsContainer) {
            starsContainer.innerHTML = generateStars(rating);
        }
        const ratingText = element.querySelector('span:not(.stars)');
        if (ratingText) {
            ratingText.textContent = `${rating.toFixed(1)} (${reviewCount} reviews)`;
        }
    });
    
    const ratingNumber = document.querySelector('.rating-number');
    if (ratingNumber) {
        ratingNumber.textContent = rating.toFixed(1);
    }
    const reviewCountElement = document.querySelector('.review-count');
    if (reviewCountElement) {
        reviewCountElement.textContent = `Based on ${reviewCount} reviews`;
    }
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHTML = '';
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

function updateFeatures(vehicle) {
    const featuresGrid = document.querySelector('.features-grid');
    if (!featuresGrid) return;
    
    const featureIcons = {
        'Automatic': 'fas fa-cog',
        'automatic': 'fas fa-cog',
        'AC': 'fas fa-snowflake',
        'air-conditioning': 'fas fa-snowflake',
        'GPS': 'fas fa-map',
        'gps': 'fas fa-map',
        'GPS Ready': 'fas fa-map',
        'Fuel Efficient': 'fas fa-gas-pump',
        'fuel-efficient': 'fas fa-gas-pump',
        'Helmet Included': 'fas fa-helmet-safety',
        'helmet-included': 'fas fa-helmet-safety',
        'Storage Box': 'fas fa-box',
        'storage-box': 'fas fa-box',
        'Insurance': 'fas fa-shield-alt',
        'insurance': 'fas fa-shield-alt',
        'Seats': 'fas fa-users',
        'Basket': 'fas fa-shopping-basket',
        'basket': 'fas fa-shopping-basket',
        'Lock Included': 'fas fa-lock',
        'lock-included': 'fas fa-lock',
        'Bluetooth': 'fas fa-bluetooth',
        'bluetooth': 'fas fa-bluetooth',
        'USB Charging': 'fas fa-usb',
        'usb-charging': 'fas fa-usb'
    };
    
    featuresGrid.innerHTML = '';
    
    if (vehicle.features && vehicle.features.length > 0) {
        vehicle.features.forEach(feature => {
            const featureItem = document.createElement('div');
            featureItem.className = 'feature-item';
            
            // Find matching icon
            let icon = 'fas fa-check';
            for (const [key, value] of Object.entries(featureIcons)) {
                if (feature.toLowerCase().includes(key.toLowerCase())) {
                    icon = value;
                    break;
                }
            }
            
            featureItem.innerHTML = `
                <i class="${icon}"></i>
                <span>${feature}</span>
            `;
            featuresGrid.appendChild(featureItem);
        });
    }
}

function updateOwnerInfo(vehicle) {
    const ownerName = document.querySelector('.owner-details h3');
    if (ownerName) {
        ownerName.textContent = vehicle.owner || vehicle.ownerName || 'Vehicle Owner';
    }
}

async function loadSimilarVehicles(currentVehicle) {
    try {
        const similarGrid = document.querySelector('.similar-grid');
        if (!similarGrid) return;
        
        // Get vehicles from Firebase
        let vehicles = [];
        if (typeof db !== 'undefined') {
            const snapshot = await db.collection('vehicles')
                .where('status', '==', 'approved')
                .where('type', '==', currentVehicle.type)
                .limit(6)
                .get();
            
            snapshot.forEach(doc => {
                const vehicleData = { id: doc.id, ...doc.data() };
                if (vehicleData.id !== currentVehicle.id) {
                    vehicles.push(vehicleData);
                }
            });
        }
        
        // If not enough similar vehicles, get any available vehicles
        if (vehicles.length < 3) {
            const snapshot = await db.collection('vehicles')
                .where('status', '==', 'approved')
                .where('available', '==', true)
                .limit(6)
                .get();
            
            const allVehicles = [];
            snapshot.forEach(doc => {
                const vehicleData = { id: doc.id, ...doc.data() };
                if (vehicleData.id !== currentVehicle.id) {
                    allVehicles.push(vehicleData);
                }
            });
            
            vehicles = allVehicles.slice(0, 3);
        }
        
        displaySimilarVehicles(vehicles.slice(0, 3), similarGrid);
        
    } catch (error) {
        console.error('Error loading similar vehicles:', error);
    }
}

function displaySimilarVehicles(vehicles, container) {
    container.innerHTML = vehicles.map(vehicle => {
        const imageUrl = (vehicle.images && vehicle.images[0]) || vehicle.image || '/RideShare/imge/placeholder.png';
        return `
            <div class="vehicle-card">
                <div class="vehicle-image-container">
                    <img src="${imageUrl}" alt="${vehicle.name}" class="vehicle-image">
                    <div class="vehicle-badge">${vehicle.available ? 'Available' : 'Rented'}</div>
                </div>
                <div class="vehicle-details">
                    <h3>${vehicle.name}</h3>
                    <div class="vehicle-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${vehicle.district || formatLocation(vehicle.location)}</span>
                    </div>
                    <div class="vehicle-pricing">
                        <span class="daily-price">$${vehicle.pricePerDay}/day</span>
                        <a href="product-detail.html?id=${vehicle.id}" class="btn btn-primary">View Details</a>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function setupDateInputs() {
    const pickupDate = document.getElementById('pickupDate');
    const returnDate = document.getElementById('returnDate');
    
    if (pickupDate && returnDate) {
        const today = new Date().toISOString().split('T')[0];
        pickupDate.min = today;
        pickupDate.value = today;
        
        pickupDate.addEventListener('change', function() {
            returnDate.min = this.value;
            if (returnDate.value && returnDate.value < this.value) {
                returnDate.value = this.value;
                showNotification({
                    type: 'warning',
                    title: 'Date Adjusted',
                    message: 'Return date has been updated to match your pickup date',
                    duration: 2000
                });
            }
            calculateBookingTotal();
        });
        
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        returnDate.min = today;
        returnDate.value = tomorrow.toISOString().split('T')[0];
        
        returnDate.addEventListener('change', calculateBookingTotal);
    }
}

function setupBookingCalculator() {
    calculateBookingTotal();
}

function calculateBookingTotal() {
    const pickupDate = document.getElementById('pickupDate');
    const returnDate = document.getElementById('returnDate');
    
    if (!pickupDate.value || !returnDate.value) {
        return;
    }
    
    const pickup = new Date(pickupDate.value);
    const returnD = new Date(returnDate.value);
    
    rentalDays = Math.ceil((returnD - pickup) / (1000 * 60 * 60 * 24));
    
    if (rentalDays < 1) {
        rentalDays = 1;
    }
    
    const subtotal = dailyRate * rentalDays;
    const serviceFee = subtotal * 0.05;
    const total = subtotal + serviceFee;
    
    document.getElementById('rentalDays').textContent = rentalDays;
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('serviceFee').textContent = `$${serviceFee.toFixed(2)}`;
    document.getElementById('totalPrice').textContent = `$${total.toFixed(2)}`;
}

function setupFavoriteButton() {
    const favoriteBtn = document.querySelector('.favorite-btn');
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', async function() {
            const user = auth.currentUser;
            
            if (!user) {
                showNotification({
                    type: 'warning',
                    title: 'Login Required',
                    message: 'Please log in to save favorites',
                    duration: 3000
                });
                return;
            }
            
            const icon = this.querySelector('i');
            const isCurrentlyFavorite = this.classList.contains('active');
            
            try {
                if (isCurrentlyFavorite) {
                    // Remove from favorites
                    await db.collection('users').doc(user.uid).update({
                        favorites: firebase.firestore.FieldValue.arrayRemove(currentVehicle.id)
                    });
                    
                    this.classList.remove('active');
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    
                    showNotification({
                        type: 'info',
                        title: 'Removed from Favorites',
                        message: 'Vehicle removed from your favorites list',
                        duration: 2000
                    });
                } else {
                    // Add to favorites
                    await db.collection('users').doc(user.uid).update({
                        favorites: firebase.firestore.FieldValue.arrayUnion(currentVehicle.id)
                    });
                    
                    this.classList.add('active');
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    
                    showNotification({
                        type: 'success',
                        title: 'Added to Favorites',
                        message: `${currentVehicle.name} has been saved to your favorites`,
                        duration: 2000
                    });
                }
            } catch (error) {
                console.error('Error updating favorites:', error);
                showNotification({
                    type: 'error',
                    title: 'Error',
                    message: 'Failed to update favorites',
                    duration: 3000
                });
            }
        });
    }
}

function showLoadingOverlay(show) {
    if (show) {
        const overlay = document.createElement('div');
        overlay.id = 'pageLoadingOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;
        overlay.innerHTML = `
            <div style="text-align: center;">
                <div style="
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid var(--primary-orange);
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 1rem;
                "></div>
                <p style="color: var(--text-dark); font-size: 1.2rem;">Loading vehicle details...</p>
            </div>
        `;
        document.body.appendChild(overlay);
    } else {
        const overlay = document.getElementById('pageLoadingOverlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 300);
        }
    }
}

window.showTab = function(tabName) {
    const tabs = document.querySelectorAll('.tab-pane');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    const activeButton = document.querySelector(`.tab-btn[onclick="showTab('${tabName}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
};

window.changeMainImage = function(thumbnail) {
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.src = thumbnail.src;
    }
    
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    thumbnail.classList.add('active');
};

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatLocation(location) {
    const locationMap = {
        'phnom-penh': 'Phnom Penh',
        'siem-reap': 'Siem Reap',
        'sihanoukville': 'Sihanoukville',
        'battambang': 'Battambang',
        'kampot': 'Kampot'
    };
    return locationMap[location] || location.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait for Firebase to be ready
    if (typeof firebase !== 'undefined' && typeof db !== 'undefined') {
        initializeProductDetail();
    } else {
        // Wait for Firebase
        const waitForFirebase = setInterval(() => {
            if (typeof firebase !== 'undefined' && typeof db !== 'undefined') {
                clearInterval(waitForFirebase);
                initializeProductDetail();
            }
        }, 100);
        
        setTimeout(() => {
            clearInterval(waitForFirebase);
            console.error('Firebase initialization timeout');
        }, 5000);
    }
});

console.log('✓ Product detail with Firebase integration loaded');