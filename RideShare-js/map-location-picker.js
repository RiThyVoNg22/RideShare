// map-location-picker.js - Google Maps Location Picker (FULLY FIXED)

// Replace with your actual Google Maps API key
const GOOGLE_MAPS_API_KEY = 'AIzaSyCkzovYieZfLpKFllObRNS38qlBNIuOqUU';

let map;
let marker;
let geocoder;
let selectedLocation = null;

/**
 * Load Google Maps API dynamically
 */
function loadGoogleMapsAPI() {
    return new Promise((resolve, reject) => {
        if (window.google && window.google.maps) {
            console.log('Google Maps already loaded');
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&v=weekly`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
            console.log('Google Maps API loaded successfully');
            resolve();
        };
        script.onerror = () => {
            console.error('Failed to load Google Maps API');
            reject(new Error('Failed to load Google Maps'));
        };
        document.head.appendChild(script);
    });
}

/**
 * Initialize the map location picker
 */
async function initMapLocationPicker() {
    try {
        console.log('Initializing map location picker...');
        await loadGoogleMapsAPI();
        setupMapModal();
        setupPickOnMapButton();
        console.log('✅ Map location picker initialized successfully');
    } catch (error) {
        console.error('❌ Error loading Google Maps:', error);
        showMapMessage('Failed to load Google Maps. Please check your API key.', 'error');
    }
}

/**
 * Setup the map modal HTML
 */
function setupMapModal() {
    if (document.getElementById('mapLocationModal')) return;

    const modalHTML = `
        <div id="mapLocationModal" class="map-modal" style="display: none;">
            <div class="map-modal-content">
                <div class="map-modal-header">
                    <h2>Select Pickup Location</h2>
                    <button class="map-modal-close" onclick="closeMapModal()" type="button">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="map-search-container">
                    <input type="text" id="mapSearchInput" placeholder="Search for a location..." class="map-search-input">
                    <button onclick="getCurrentLocation()" type="button" class="btn-current-location" title="Use my current location">
                        <i class="fas fa-crosshairs"></i>
                    </button>
                </div>
                
                <div id="map" class="map-container"></div>
                
                <div class="map-selected-info">
                    <div class="selected-location-display">
                        <i class="fas fa-map-marker-alt"></i>
                        <span id="selectedLocationText">Click on the map to select a location</span>
                    </div>
                </div>
                
                <div class="map-modal-footer">
                    <button onclick="closeMapModal()" type="button" class="btn btn-secondary">Cancel</button>
                    <button onclick="confirmLocation()" type="button" class="btn btn-primary" id="confirmLocationBtn" disabled>
                        <i class="fas fa-check"></i> Confirm Location
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    addMapStyles();
}

/**
 * Setup the "Pick on Map" button
 */
function setupPickOnMapButton() {
    // Find or create the button
    let pickMapBtn = document.querySelector('.btn-pick-map');
    
    if (!pickMapBtn) {
        const pickupLocationField = document.getElementById('pickupLocation');
        if (pickupLocationField) {
            pickMapBtn = document.createElement('button');
            pickMapBtn.type = 'button';
            pickMapBtn.className = 'btn btn-pick-map';
            pickMapBtn.innerHTML = '<i class="fas fa-map-marked-alt"></i> Pick on Map';
            pickMapBtn.style.marginTop = '0.5rem';
            pickupLocationField.parentNode.insertBefore(pickMapBtn, pickupLocationField.nextSibling);
        }
    }
    
    if (pickMapBtn) {
        pickMapBtn.onclick = function(e) {
            e.preventDefault();
            openMapModal();
        };
    }
}

/**
 * Open the map modal
 */
async function openMapModal() {
    const modal = document.getElementById('mapLocationModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Initialize map if not already done
    if (!map) {
        await initializeMap();
    } else {
        google.maps.event.trigger(map, 'resize');
    }
    
    // Check if there's an existing location in the form
    const pickupLocationField = document.getElementById('pickupLocation');
    const existingLat = pickupLocationField?.getAttribute('data-lat');
    const existingLng = pickupLocationField?.getAttribute('data-lng');
    
    if (existingLat && existingLng) {
        // Restore previous selection
        const location = new google.maps.LatLng(
            parseFloat(existingLat), 
            parseFloat(existingLng)
        );
        marker.setPosition(location);
        map.setCenter(location);
        updateSelectedLocation(location);
    } else {
        // Don't reset selectedLocation here - just update UI
        document.getElementById('confirmLocationBtn').disabled = true;
        document.getElementById('selectedLocationText').textContent = 'Click on the map to select a location';
    }
}

/**
 * Close the map modal
 */
function closeMapModal() {
    const modal = document.getElementById('mapLocationModal');
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

/**
 * Initialize Google Map
 */
async function initializeMap() {
    try {
        console.log('🗺️ Initializing Google Map...');
        
        geocoder = new google.maps.Geocoder();
        
        // Default center (Phnom Penh, Cambodia)
        const defaultCenter = { lat: 11.5564, lng: 104.9282 };
        
        // Try to get user's current location
        let initialCenter = defaultCenter;
        try {
            const position = await getCurrentPositionPromise();
            initialCenter = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            console.log('📍 Using current location:', initialCenter);
        } catch (error) {
            console.log('📍 Using default location (Phnom Penh)');
        }
    
        // Create map
        map = new google.maps.Map(document.getElementById('map'), {
            center: initialCenter,
            zoom: 15,
            mapTypeControl: true,
            streetViewControl: false,
            fullscreenControl: true,
            zoomControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                position: google.maps.ControlPosition.TOP_RIGHT
            },
            gestureHandling: 'greedy'
        });
        
        // Create marker
        marker = new google.maps.Marker({
            map: map,
            draggable: true,
            animation: google.maps.Animation.DROP,
            position: initialCenter,
            title: 'Drag me to adjust location'
        });
        
        // Add click listener to map
        map.addListener('click', (event) => {
            placeMarker(event.latLng);
        });
        
        // Add drag listener to marker
        marker.addListener('dragend', (event) => {
            updateSelectedLocation(event.latLng);
        });
        
        // Setup search box
        setupSearchBox();
        
        // Set initial location
        updateSelectedLocation(new google.maps.LatLng(initialCenter.lat, initialCenter.lng));
        
        console.log('✅ Google Map initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing map:', error);
        showMapMessage('Error initializing map. Please refresh and try again.', 'error');
        throw error;
    }
}

/**
 * Setup search autocomplete
 */
function setupSearchBox() {
    const input = document.getElementById('mapSearchInput');
    const searchBox = new google.maps.places.SearchBox(input);
    
    // Bias results to map's viewport
    map.addListener('bounds_changed', () => {
        searchBox.setBounds(map.getBounds());
    });
    
    // Listen for place selection
    searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();
        
        if (places.length === 0) return;
        
        const place = places[0];
        
        if (!place.geometry || !place.geometry.location) {
            console.log('Place has no geometry');
            return;
        }
        
        // Move map and marker to selected place
        map.setCenter(place.geometry.location);
        map.setZoom(17);
        marker.setPosition(place.geometry.location);
        
        updateSelectedLocation(place.geometry.location);
    });
}

/**
 * Place marker on map
 */
function placeMarker(location) {
    marker.setPosition(location);
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(() => marker.setAnimation(null), 750);
    map.panTo(location);
    
    updateSelectedLocation(location);
}

/**
 * Update selected location and enable confirm button - FULLY FIXED
 */
function updateSelectedLocation(location) {
    try {
        // Handle both LatLng objects and plain objects
        const lat = typeof location.lat === 'function' ? location.lat() : location.lat;
        const lng = typeof location.lng === 'function' ? location.lng() : location.lng;
        
        if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
            console.error('Invalid location:', location);
            return;
        }
        
        // Create the location object immediately
        // Store a reference to prevent race conditions
        const locationData = {
            lat: lat,
            lng: lng
        };
        
        // Update the global selectedLocation
        selectedLocation = locationData;
        
        // Show loading state
        const locationText = document.getElementById('selectedLocationText');
        if (!locationText) {
            console.error('Selected location text element not found');
            return;
        }
        
        locationText.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting address...';
        
        // Create proper LatLng object for geocoding
        const latLng = location.lat && typeof location.lat === 'function' ? 
            location : 
            new google.maps.LatLng(lat, lng);
        
        // Geocode to get address
        geocoder.geocode({ location: latLng }, (results, status) => {
            // CRITICAL FIX: Check if locationData is still the current selection
            // This prevents race conditions when user clicks multiple times quickly
            if (selectedLocation !== locationData) {
                console.log('Location changed before geocoding completed, ignoring old result');
                return;
            }
            
            if (status === 'OK' && results[0]) {
                const address = results[0].formatted_address;
                
                // SAFE: Now we can set properties on locationData
                locationData.address = address;
                locationData.placeId = results[0].place_id;
                
                // Parse address components
                locationData.components = {};
                results[0].address_components.forEach(component => {
                    const types = component.types;
                    if (types.includes('locality') || types.includes('administrative_area_level_2')) {
                        locationData.components.city = component.long_name;
                    }
                    if (types.includes('administrative_area_level_1')) {
                        locationData.components.province = component.long_name;
                    }
                    if (types.includes('country')) {
                        locationData.components.country = component.long_name;
                    }
                });
                
                // Update display
                locationText.innerHTML = `<strong>Selected:</strong> ${address}`;
                document.getElementById('confirmLocationBtn').disabled = false;
                
                console.log('✅ Location geocoded successfully:', locationData);
                
            } else {
                console.warn('Geocoding failed:', status);
                // If geocoding fails, still allow selection with coordinates
                locationText.innerHTML = `
                    <strong>Coordinates:</strong> ${locationData.lat.toFixed(6)}, ${locationData.lng.toFixed(6)}
                `;
                locationData.address = `Lat: ${locationData.lat.toFixed(6)}, Lng: ${locationData.lng.toFixed(6)}`;
                document.getElementById('confirmLocationBtn').disabled = false;
            }
        });
    } catch (error) {
        console.error('Error updating selected location:', error);
        showMapMessage('Error updating location. Please try again.', 'error');
    }
}

/**
 * Get current location
 */
async function getCurrentLocation() {
    if (!navigator.geolocation) {
        showMapMessage('Geolocation is not supported by your browser', 'error');
        return;
    }
    
    const btn = event.target.closest('.btn-current-location');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    btn.disabled = true;
    
    try {
        const position = await getCurrentPositionPromise();
        const location = new google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
        );
        
        map.setCenter(location);
        map.setZoom(17);
        marker.setPosition(location);
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(() => marker.setAnimation(null), 750);
        
        updateSelectedLocation(location);
        
        showMapMessage('Location updated to your current position', 'success');
    } catch (error) {
        console.error('Error getting location:', error);
        let errorMsg = 'Could not get your location. ';
        if (error.code === 1) {
            errorMsg += 'Please enable location permissions.';
        } else if (error.code === 2) {
            errorMsg += 'Location information unavailable.';
        } else if (error.code === 3) {
            errorMsg += 'Location request timed out.';
        }
        showMapMessage(errorMsg, 'error');
    } finally {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
    }
}

/**
 * Promise wrapper for getCurrentPosition
 */
function getCurrentPositionPromise() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        });
    });
}

/**
 * Confirm selected location
 */
function confirmLocation() {
    try {
        if (!selectedLocation) {
            showMapMessage('Please select a location first', 'error');
            return;
        }
        
        console.log('✅ Confirming location:', selectedLocation);
        
        // Update the pickup location textarea
        const pickupLocationField = document.getElementById('pickupLocation');
        if (!pickupLocationField) {
            console.error('❌ Pickup location field not found!');
            showMapMessage('Error: Form field not found', 'error');
            return;
        }
        
        // Set the address text
        const locationText = selectedLocation.address || 
            `Coordinates: ${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`;
        
        pickupLocationField.value = locationText;
        
        // Store coordinates and other data as attributes
        pickupLocationField.setAttribute('data-lat', selectedLocation.lat);
        pickupLocationField.setAttribute('data-lng', selectedLocation.lng);
        
        if (selectedLocation.placeId) {
            pickupLocationField.setAttribute('data-place-id', selectedLocation.placeId);
        }
        
        if (selectedLocation.components) {
            if (selectedLocation.components.city) {
                pickupLocationField.setAttribute('data-city', selectedLocation.components.city);
            }
            if (selectedLocation.components.province) {
                pickupLocationField.setAttribute('data-province', selectedLocation.components.province);
            }
            if (selectedLocation.components.country) {
                pickupLocationField.setAttribute('data-country', selectedLocation.components.country);
            }
        }
        
        // Visual feedback
        pickupLocationField.style.borderColor = '#4CAF50';
        pickupLocationField.style.backgroundColor = '#f0fff0';
        setTimeout(() => {
            pickupLocationField.style.borderColor = '';
            pickupLocationField.style.backgroundColor = '';
        }, 2000);
        
        // Trigger change event for validation
        pickupLocationField.dispatchEvent(new Event('change', { bubbles: true }));
        pickupLocationField.dispatchEvent(new Event('input', { bubbles: true }));
        
        // Log for debugging
        console.log('✅ Location saved to form:', {
            text: locationText,
            lat: selectedLocation.lat,
            lng: selectedLocation.lng,
            placeId: selectedLocation.placeId
        });
        
        // Show success message
        showMapMessage('📍 Location selected successfully!', 'success');
        
        // Close modal
        closeMapModal();
        
        // Scroll to the field
        pickupLocationField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (error) {
        console.error('❌ Error confirming location:', error);
        showMapMessage('Error saving location. Please try again.', 'error');
    }
}

/**
 * Add CSS styles for map modal
 */
function addMapStyles() {
    if (document.getElementById('mapLocationStyles')) return;
    
    const style = document.createElement('style');
    style.id = 'mapLocationStyles';
    style.textContent = `
        .map-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(4px);
            z-index: 10000;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
            padding: 1rem;
        }
        
        .map-modal-content {
            background: white;
            border-radius: 24px;
            width: 100%;
            max-width: 900px;
            max-height: 90vh;
            height: auto;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-shadow: 0 25px 70px rgba(0, 0, 0, 0.5);
            animation: slideUp 0.3s ease;
        }
        
        .map-modal-header {
            padding: 1.75rem 1.5rem;
            border-bottom: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%);
            color: white;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            flex-shrink: 0;
        }
        
        .map-modal-header h2 {
            margin: 0;
            font-size: 1.6rem;
            font-weight: 700;
            letter-spacing: 0.3px;
        }
        
        .map-modal-close {
            background: rgba(255, 255, 255, 0.15);
            border: 2px solid rgba(255, 255, 255, 0.3);
            font-size: 1.4rem;
            cursor: pointer;
            color: white;
            width: 42px;
            height: 42px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }
        
        .map-modal-close:hover {
            background: rgba(255, 255, 255, 0.25);
            border-color: rgba(255, 255, 255, 0.5);
            transform: rotate(90deg) scale(1.05);
        }
        
        .map-search-container {
            padding: 1.25rem 1.5rem;
            background: linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%);
            display: flex;
            gap: 0.75rem;
            border-bottom: 1px solid #e0e0e0;
            flex-shrink: 0;
        }
        
        .map-search-input {
            flex: 1;
            padding: 1rem 1.5rem;
            border: 2px solid #e0e0e0;
            border-radius: 50px;
            font-size: 1rem;
            transition: all 0.3s ease;
            background: white;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        
        .map-search-input:focus {
            outline: none;
            border-color: #FF6B35;
            box-shadow: 0 0 0 4px rgba(255, 107, 53, 0.1), 0 4px 12px rgba(0, 0, 0, 0.1);
            transform: translateY(-1px);
        }
        
        .btn-current-location {
            padding: 0;
            background: white;
            border: 2px solid #FF6B35;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            cursor: pointer;
            color: #FF6B35;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            font-size: 1.2rem;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .btn-current-location:hover:not(:disabled) {
            background: #FF6B35;
            color: white;
            transform: scale(1.08);
            box-shadow: 0 4px 15px rgba(255, 107, 53, 0.35);
        }
        
        .btn-current-location:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }
        
        .map-container {
            width: 100%;
            height: 350px;
            min-height: 250px;
            max-height: 50vh;
            border: none;
            flex-shrink: 1;
            position: relative;
        }
        
        .map-selected-info {
            padding: 1.25rem 1.5rem;
            background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%);
            border-top: 2px solid #e0e0e0;
            min-height: 70px;
            max-height: 100px;
            display: flex;
            align-items: center;
            flex-shrink: 0;
            overflow-y: auto;
        }
        
        .selected-location-display {
            display: flex;
            align-items: flex-start;
            gap: 0.875rem;
            color: #333;
            line-height: 1.6;
            width: 100%;
        }
        
        .selected-location-display i {
            color: #FF6B35;
            font-size: 1.4rem;
            margin-top: 2px;
            flex-shrink: 0;
        }
        
        .map-modal-footer {
            padding: 1.25rem 1.5rem;
            border-top: 2px solid #f0f0f0;
            display: flex;
            justify-content: space-between;
            gap: 1rem;
            background: white;
            flex-shrink: 0;
        }
        
        .map-modal-footer .btn {
            flex: 1;
            padding: 1rem 2rem;
            border-radius: 50px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            max-width: 250px;
        }
        
        .map-modal-footer .btn-secondary {
            background: white;
            color: #555;
            border: 2px solid #ddd;
        }
        
        .map-modal-footer .btn-primary {
            background: linear-gradient(135deg, #FF6B35 0%, #ff8555 100%);
            color: white;
            box-shadow: 0 4px 15px rgba(255, 107, 53, 0.35);
        }
        
        .map-modal-footer .btn-primary:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            background: #ccc;
        }
        
        .btn-pick-map {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.875rem 1.75rem;
            background: linear-gradient(135deg, #FF6B35 0%, #ff8555 100%);
            border: none;
            color: white;
            border-radius: 50px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from {
                transform: translateY(50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        @media (max-width: 768px) {
            .map-modal-content {
                max-width: 100%;
                border-radius: 20px 20px 0 0;
            }
            
            .map-container {
                height: 280px;
            }
        }
    `;
    
    document.head.appendChild(style);
}

/**
 * Show message helper
 */
function showMapMessage(message, type = 'info') {
    if (typeof window.showMessage === 'function' && window.showMessage !== showMapMessage) {
        window.showMessage(message, type);
    } else {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10001;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMapLocationPicker);
} else {
    initMapLocationPicker();
}

// Make functions globally accessible
window.openMapModal = openMapModal;
window.closeMapModal = closeMapModal;
window.confirmLocation = confirmLocation;
window.getCurrentLocation = getCurrentLocation;