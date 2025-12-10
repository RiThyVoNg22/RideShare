// rent.js - Rent Page with Firebase Integration

// Global variables
let allVehicles = [];
let filteredVehicles = [];
let currentFilters = {
    location: '',
    type: '',
    priceRange: '',
    availability: ''
};
let vehiclesUnsubscribe = null;
let currentUserFavorites = [];

// Initialize rent page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Rent page initializing...');
    initializeRentPage();
});

// Initialize the rent page
async function initializeRentPage() {
    showLoading(true);
    
    // Setup UI event listeners
    setupRentPageUI();
    
    // Check authentication state
    auth.onAuthStateChanged(async (user) => {
        console.log('👤 Auth state:', user ? user.email : 'Not logged in');
        
        if (user) {
            // Load user's favorites
            await loadUserFavorites(user.uid);
        }
        
        // Load vehicles from Firebase
        await loadVehiclesFromFirebase();
        
        // Load URL parameters if any
        loadURLParameters();
        
        showLoading(false);
    });
}

// Setup UI event listeners
function setupRentPageUI() {
    // Search button
    const searchFilterBtn = document.querySelector('.search-filter-btn');
    if (searchFilterBtn) {
        searchFilterBtn.addEventListener('click', applyFilters);
    }
    
    // Filter change listeners
    const filters = document.querySelectorAll('.filter-select, .filter-input');
    filters.forEach(filter => {
        filter.addEventListener('change', handleFilterChange);
    });
    
    // Load more button
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreVehicles);
    }
    
    // Clear filters button
    const clearFiltersBtn = document.querySelector('.clear-filters-btn');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }
    
    // Set minimum date to today for availability
    const availabilityInput = document.getElementById('availability');
    if (availabilityInput) {
        const today = new Date().toISOString().split('T')[0];
        availabilityInput.min = today;
    }
}

// Load vehicles from Firebase Firestore
async function loadVehiclesFromFirebase() {
    try {
        console.log('📡 Setting up Firebase listener for vehicles...');
        
        // Unsubscribe from previous listener if exists
        if (vehiclesUnsubscribe) {
            vehiclesUnsubscribe();
        }
        
        // Create real-time listener for vehicles
        // TEMPORARY: Removed orderBy to avoid index requirement
        // Add it back after creating the index in Firebase Console
        vehiclesUnsubscribe = db.collection('vehicles')
            .where('status', '==', 'approved')
            // .orderBy('createdAt', 'desc')  // Commented out until index is created
            .onSnapshot((snapshot) => {
                console.log('🔄 Real-time update received!');
                console.log(`📊 Total approved vehicles in Firebase: ${snapshot.size}`);
                
                allVehicles = [];
                snapshot.forEach(doc => {
                    const vehicleData = {
                        id: doc.id,
                        ...doc.data()
                    };
                    allVehicles.push(vehicleData);
                    console.log('✓ Vehicle:', vehicleData.name, '| Available:', vehicleData.available);
                });
                
                console.log(`✅ Loaded ${allVehicles.length} approved vehicles`);
                
                // Apply current filters
                applyFilters();
                
            }, (error) => {
                console.error('❌ Error loading vehicles:', error);
                showMessage('Error loading vehicles. Please refresh the page.', 'error');
                showLoading(false);
            });
            
    } catch (error) {
        console.error('❌ Error setting up vehicle listener:', error);
        showMessage('Error loading vehicles', 'error');
        showLoading(false);
    }
}

// Load user's favorite vehicles
async function loadUserFavorites(userId) {
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        if (userDoc.exists) {
            const userData = userDoc.data();
            currentUserFavorites = userData.favorites || [];
            console.log('⭐ User favorites:', currentUserFavorites.length);
        }
    } catch (error) {
        console.error('Error loading favorites:', error);
    }
}

// Apply filters to vehicles
function applyFilters() {
    // Get filter values
    const locationFilter = document.getElementById('location-filter');
    const vehicleTypeFilter = document.getElementById('vehicle-type-filter');
    const priceRange = document.getElementById('price-range');
    const availability = document.getElementById('availability');
    
    currentFilters = {
        location: locationFilter?.value || '',
        type: vehicleTypeFilter?.value || '',
        priceRange: priceRange?.value || '',
        availability: availability?.value || ''
    };
    
    console.log('🔍 Applying filters:', currentFilters);
    
    // Filter vehicles
    filteredVehicles = allVehicles.filter(vehicle => {
        // Location filter
        if (currentFilters.location && vehicle.location !== currentFilters.location) {
            return false;
        }
        
        // Type filter
        if (currentFilters.type && vehicle.type !== currentFilters.type) {
            return false;
        }
        
        // Price range filter
        if (currentFilters.priceRange) {
            const [min, max] = currentFilters.priceRange.split('-').map(p => {
                if (p === '50+') return 50;
                return parseFloat(p) || 0;
            });
            
            if (currentFilters.priceRange === '50+') {
                if (vehicle.pricePerDay < 50) return false;
            } else {
                if (vehicle.pricePerDay < min || vehicle.pricePerDay > max) return false;
            }
        }
        
        // Availability filter
        if (currentFilters.availability && !vehicle.available) {
            return false;
        }
        
        return true;
    });
    
    console.log(`📋 Filtered results: ${filteredVehicles.length} vehicles`);
    
    // Display filtered vehicles
    displayVehicles(filteredVehicles);
    
    // Show/hide no results message
    if (filteredVehicles.length === 0) {
        showNoResults();
    } else {
        hideNoResults();
        showMessage(`Found ${filteredVehicles.length} vehicles`, 'success');
    }
}

// Display vehicles in the grid
function displayVehicles(vehicles) {
    const vehicleGrid = document.querySelector('.vehicles-grid');
    if (!vehicleGrid) {
        console.error('❌ Vehicle grid not found!');
        return;
    }
    
    console.log(`🎨 Displaying ${vehicles.length} vehicles...`);
    
    // Clear existing vehicles
    vehicleGrid.innerHTML = '';
    
    if (vehicles.length === 0) {
        console.log('⚠️ No vehicles to display');
        return;
    }
    
    // Display each vehicle
    vehicles.forEach((vehicle, index) => {
        console.log(`  ${index + 1}. ${vehicle.name} - $${vehicle.pricePerDay}/day`);
        const vehicleCard = createVehicleCard(vehicle);
        vehicleGrid.appendChild(vehicleCard);
    });
    
    // Setup event listeners for new cards
    setupVehicleCardListeners();
    
    console.log('✅ Vehicles displayed successfully');
}

// Create a vehicle card element
function createVehicleCard(vehicle) {
    const isFavorite = currentUserFavorites.includes(vehicle.id);
    const card = document.createElement('div');
    card.className = 'vehicle-card';
    
    // Get image URL
    const imageUrl = (vehicle.images && vehicle.images[0]) || vehicle.image || '/RideShare/imge/placeholder.png';
    
    card.innerHTML = `
        <div class="vehicle-image-container">
            <img src="${imageUrl}" 
                 alt="${vehicle.name}" class="vehicle-image"
                 onerror="this.src='/RideShare/imge/placeholder.png'">
            <div class="vehicle-badge ${vehicle.available ? '' : 'rented'}">
                ${vehicle.available ? 'Available' : 'Rented'}
            </div>
            <div class="vehicle-favorite ${isFavorite ? 'active' : ''}" data-vehicle-id="${vehicle.id}">
                <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>
            </div>
        </div>
        <div class="vehicle-details">
            <div class="vehicle-header">
                <h3>${vehicle.name}</h3>
                <span class="vehicle-type">${capitalizeFirst(vehicle.type)}</span>
            </div>
            <div class="vehicle-location">
                <i class="fas fa-map-marker-alt"></i>
                <span>${vehicle.district || ''}, ${formatLocation(vehicle.location)}</span>
            </div>
            <div class="vehicle-features">
                ${(vehicle.features || []).slice(0, 3).map(feature => 
                    `<span class="feature">${feature}</span>`
                ).join('')}
            </div>
            <div class="vehicle-rating">
                <div class="stars">
                    ${generateStarRating(vehicle.rating || 0)}
                </div>
                <span class="rating-text">${(vehicle.rating || 0).toFixed(1)} (${vehicle.reviewCount || 0} reviews)</span>
            </div>
            <div class="vehicle-pricing">
                <div class="price-info">
                    <span class="daily-price">$${vehicle.pricePerDay}/day</span>
                    <span class="deposit">Deposit: $${vehicle.deposit || 0}</span>
                </div>
                <button class="btn ${vehicle.available ? 'btn-primary' : 'btn-secondary'} rent-btn" 
                        data-vehicle-id="${vehicle.id}"
                        ${vehicle.available ? '' : 'disabled'}>
                    ${vehicle.available ? 'Rent Now' : 'Currently Rented'}
                </button>
            </div>
        </div>
    `;
    return card;
}

// Generate star rating HTML
function generateStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 <= rating) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Capitalize first letter
function capitalizeFirst(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

// Format location for display
function formatLocation(location) {
    const locationMap = {
        'phnom-penh': 'Phnom Penh',
        'siem-reap': 'Siem Reap',
        'sihanoukville': 'Sihanoukville',
        'battambang': 'Battambang',
        'kampot': 'Kampot'
    };
    return locationMap[location] || location;
}

// Setup event listeners for vehicle cards
function setupVehicleCardListeners() {
    // Rent buttons
    const rentButtons = document.querySelectorAll('.rent-btn:not([disabled])');
    rentButtons.forEach(button => {
        button.addEventListener('click', handleRentClick);
    });
    
    // Favorite buttons
    const favoriteButtons = document.querySelectorAll('.vehicle-favorite');
    favoriteButtons.forEach(button => {
        button.addEventListener('click', handleFavoriteClick);
    });
}

// Handle rent button click
async function handleRentClick(e) {
    const vehicleId = e.target.getAttribute('data-vehicle-id');
    
    console.log('🚗 Rent button clicked for vehicle:', vehicleId);
    
    // Check if user is logged in
    const user = auth.currentUser;
    if (!user) {
        showMessage('Please log in to rent a vehicle', 'warning');
        // Store intended action in session storage
        sessionStorage.setItem('intendedAction', JSON.stringify({
            action: 'rent',
            vehicleId: vehicleId
        }));
        setTimeout(() => {
            window.location.href = 'auth.html';
        }, 1500);
        return;
    }
    
    // Email verification check removed - users can rent without verification
    // if (!user.emailVerified) {
    //     showMessage('Please verify your email before renting', 'warning');
    //     return;
    // }
    
    // Navigate to product detail page
    console.log('✅ Redirecting to product detail page...');
    window.location.href = `product-detail.html?id=${vehicleId}`;
}

// Handle favorite button click
async function handleFavoriteClick(e) {
    e.stopPropagation();
    
    const user = auth.currentUser;
    if (!user) {
        showMessage('Please log in to save favorites', 'warning');
        return;
    }
    
    const favoriteBtn = e.currentTarget;
    const vehicleId = favoriteBtn.getAttribute('data-vehicle-id');
    const icon = favoriteBtn.querySelector('i');
    const isCurrentlyFavorite = favoriteBtn.classList.contains('active');
    
    try {
        if (isCurrentlyFavorite) {
            // Remove from favorites
            await db.collection('users').doc(user.uid).update({
                favorites: firebase.firestore.FieldValue.arrayRemove(vehicleId)
            });
            
            favoriteBtn.classList.remove('active');
            icon.classList.remove('fas');
            icon.classList.add('far');
            
            // Update local array
            currentUserFavorites = currentUserFavorites.filter(id => id !== vehicleId);
            
            showMessage('Removed from favorites', 'info');
        } else {
            // Add to favorites
            await db.collection('users').doc(user.uid).update({
                favorites: firebase.firestore.FieldValue.arrayUnion(vehicleId)
            });
            
            favoriteBtn.classList.add('active');
            icon.classList.remove('far');
            icon.classList.add('fas');
            
            // Update local array
            currentUserFavorites.push(vehicleId);
            
            showMessage('Added to favorites', 'success');
        }
    } catch (error) {
        console.error('Error updating favorites:', error);
        showMessage('Error updating favorites', 'error');
    }
}

// Handle filter change
function handleFilterChange() {
    // Auto-apply filters when any filter changes
    applyFilters();
}

// Load more vehicles
async function loadMoreVehicles() {
    showMessage('All available vehicles are displayed', 'info');
}

// Clear all filters
function clearAllFilters() {
    // Reset all filter inputs
    const locationFilter = document.getElementById('location-filter');
    const vehicleTypeFilter = document.getElementById('vehicle-type-filter');
    const priceRange = document.getElementById('price-range');
    const availability = document.getElementById('availability');
    
    if (locationFilter) locationFilter.value = '';
    if (vehicleTypeFilter) vehicleTypeFilter.value = '';
    if (priceRange) priceRange.value = '';
    if (availability) availability.value = '';
    
    // Reset current filters
    currentFilters = {
        location: '',
        type: '',
        priceRange: '',
        availability: ''
    };
    
    // Apply filters (will show all vehicles)
    applyFilters();
    
    hideNoResults();
    showMessage('Filters cleared', 'success');
}

// Show no results message
function showNoResults() {
    const noResults = document.querySelector('.no-results');
    if (noResults) {
        noResults.style.display = 'block';
    }
    
    const vehicleGrid = document.querySelector('.vehicles-grid');
    if (vehicleGrid) {
        vehicleGrid.style.display = 'none';
    }
}

// Hide no results message
function hideNoResults() {
    const noResults = document.querySelector('.no-results');
    if (noResults) {
        noResults.style.display = 'none';
    }
    
    const vehicleGrid = document.querySelector('.vehicles-grid');
    if (vehicleGrid) {
        vehicleGrid.style.display = 'grid';
    }
}

// Load URL parameters
function loadURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const location = urlParams.get('location');
    const type = urlParams.get('type');
    
    let hasParams = false;
    
    if (location) {
        const locationFilter = document.getElementById('location-filter');
        if (locationFilter) {
            locationFilter.value = location;
            hasParams = true;
        }
    }
    
    if (type) {
        const typeFilter = document.getElementById('vehicle-type-filter');
        if (typeFilter) {
            typeFilter.value = type;
            hasParams = true;
        }
    }
    
    // Apply filters if URL had parameters
    if (hasParams) {
        setTimeout(applyFilters, 500);
    }
}

// Show/hide loading state
function showLoading(show = true) {
    let loadingOverlay = document.getElementById('loadingOverlay');
    
    if (show && !loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loadingOverlay';
        loadingOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;
        loadingOverlay.innerHTML = `
            <div style="text-align: center;">
                <div style="
                    border: 4px solid rgba(0, 0, 0, 0.1);
                    border-top: 4px solid var(--primary-orange);
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 1rem;
                "></div>
                <p style="color: var(--text-dark); font-size: 1.2rem;">Loading vehicles...</p>
            </div>
        `;
        document.body.appendChild(loadingOverlay);
        
        // Add spin animation if not exists
        if (!document.getElementById('spinAnimation')) {
            const style = document.createElement('style');
            style.id = 'spinAnimation';
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    } else if (!show && loadingOverlay) {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            loadingOverlay.remove();
        }, 300);
    }
}

// Check for intended action after login
function checkIntendedAction() {
    const intendedAction = sessionStorage.getItem('intendedAction');
    if (intendedAction) {
        const action = JSON.parse(intendedAction);
        sessionStorage.removeItem('intendedAction');
        
        if (action.action === 'rent' && action.vehicleId) {
            // Automatically click the rent button for the intended vehicle
            setTimeout(() => {
                const rentBtn = document.querySelector(`[data-vehicle-id="${action.vehicleId}"]`);
                if (rentBtn) {
                    rentBtn.click();
                }
            }, 1000);
        }
    }
}

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (vehiclesUnsubscribe) {
        vehiclesUnsubscribe();
    }
});

// Check for intended actions when auth state changes
auth.onAuthStateChanged((user) => {
    // Email verification check removed
    if (user) {
        checkIntendedAction();
    }
});

console.log('✓ Rent page with Firebase integration loaded');