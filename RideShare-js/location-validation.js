// location-validation.js - Validate and handle pickup location

/**
 * Validate that pickup location was selected from map
 */
function validatePickupLocation() {
    const pickupLocationField = document.getElementById('pickupLocation');
    
    if (!pickupLocationField) {
        console.error('Pickup location field not found');
        return false;
    }
    
    const latitude = pickupLocationField.getAttribute('data-lat');
    const longitude = pickupLocationField.getAttribute('data-lng');
    
    // Check if coordinates exist
    if (!latitude || !longitude) {
        // Show error using global showMessage if available
        if (typeof window.showMessage === 'function') {
            window.showMessage('⚠️ Please select your pickup location using the "Pick on Map" button', 'error');
        } else {
            alert('⚠️ Please select your pickup location using the "Pick on Map" button');
        }
        
        // Visual feedback
        pickupLocationField.style.borderColor = '#f44336';
        pickupLocationField.style.backgroundColor = '#ffebee';
        
        // Scroll to field
        pickupLocationField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Add shake animation
        pickupLocationField.style.animation = 'shake 0.5s';
        setTimeout(() => {
            pickupLocationField.style.animation = '';
            pickupLocationField.style.borderColor = '';
            pickupLocationField.style.backgroundColor = '';
        }, 2000);
        
        return false;
    }
    
    // Validation passed
    console.log('Pickup location validated:', {
        lat: latitude,
        lng: longitude,
        address: pickupLocationField.value
    });
    
    return true;
}

/**
 * Get pickup location data
 */
function getPickupLocationData() {
    const pickupLocationField = document.getElementById('pickupLocation');
    
    if (!pickupLocationField) return null;
    
    const latitude = pickupLocationField.getAttribute('data-lat');
    const longitude = pickupLocationField.getAttribute('data-lng');
    const placeId = pickupLocationField.getAttribute('data-place-id');
    const city = pickupLocationField.getAttribute('data-city');
    const province = pickupLocationField.getAttribute('data-province');
    const country = pickupLocationField.getAttribute('data-country');
    
    if (!latitude || !longitude) return null;
    
    return {
        address: pickupLocationField.value,
        coordinates: {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude)
        },
        placeId: placeId,
        city: city,
        province: province,
        country: country
    };
}

/**
 * Add validation to the list vehicle form
 */
function setupLocationValidation() {
    const form = document.getElementById('listVehicleForm');
    
    if (!form) return;
    
    // Add validation before submit
    const originalSubmitHandler = form.onsubmit;
    
    form.onsubmit = function(e) {
        // First validate the pickup location
        if (!validatePickupLocation()) {
            e.preventDefault();
            return false;
        }
        
        // Then call original handler if exists
        if (originalSubmitHandler && typeof originalSubmitHandler === 'function') {
            return originalSubmitHandler.call(this, e);
        }
        
        return true;
    };
    
    // Add visual indicator when location is set
    const pickupLocationField = document.getElementById('pickupLocation');
    if (pickupLocationField) {
        // Monitor changes to location
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-lat') {
                    const hasLocation = pickupLocationField.getAttribute('data-lat');
                    
                    if (hasLocation) {
                        // Add checkmark icon
                        let checkIcon = pickupLocationField.parentNode.querySelector('.location-verified-icon');
                        
                        if (!checkIcon) {
                            checkIcon = document.createElement('i');
                            checkIcon.className = 'fas fa-check-circle location-verified-icon';
                            checkIcon.style.cssText = `
                                position: absolute;
                                right: 15px;
                                top: 50%;
                                transform: translateY(-50%);
                                color: #10b981;
                                font-size: 1.4rem;
                                pointer-events: none;
                                animation: bounceIn 0.5s ease;
                                z-index: 10;
                            `;
                            
                            // Add a subtle success border to the field
                            pickupLocationField.style.borderColor = '#10b981';
                            pickupLocationField.style.backgroundColor = '#f0fdf4';
                            
                            // Make parent position relative
                            const parent = pickupLocationField.parentNode;
                            if (parent.style.position !== 'relative') {
                                parent.style.position = 'relative';
                            }
                            parent.appendChild(checkIcon);
                            
                            // Reset field styling after animation
                            setTimeout(() => {
                                pickupLocationField.style.borderColor = '';
                                pickupLocationField.style.backgroundColor = '';
                            }, 2000);
                        }
                    }
                }
            });
        });
        
        observer.observe(pickupLocationField, {
            attributes: true,
            attributeFilter: ['data-lat', 'data-lng']
        });
    }
}

/**
 * Add shake animation CSS
 */
function addValidationStyles() {
    if (document.getElementById('locationValidationStyles')) return;
    
    const style = document.createElement('style');
    style.id = 'locationValidationStyles';
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
            20%, 40%, 60%, 80% { transform: translateX(8px); }
        }
        
        @keyframes bounceIn {
            0% {
                opacity: 0;
                transform: translateY(-50%) scale(0.3);
            }
            50% {
                transform: translateY(-50%) scale(1.15);
            }
            70% {
                transform: translateY(-50%) scale(0.95);
            }
            100% {
                opacity: 1;
                transform: translateY(-50%) scale(1);
            }
        }
        
        .location-verified-icon {
            animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
        }
        
        /* Pulse animation for verified icon */
        @keyframes pulse-glow {
            0%, 100% {
                opacity: 1;
                filter: drop-shadow(0 0 0 transparent);
            }
            50% {
                opacity: 0.8;
                filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.6));
            }
        }
        
        .location-verified-icon {
            animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55), 
                    pulse-glow 2s ease-in-out infinite 0.6s !important;
        }
    `;
    
    document.head.appendChild(style);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setupLocationValidation();
        addValidationStyles();
    });
} else {
    setupLocationValidation();
    addValidationStyles();
}

// Export functions for use in other scripts
window.validatePickupLocation = validatePickupLocation;
window.getPickupLocationData = getPickupLocationData;