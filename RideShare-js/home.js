// home.js - Fixed Search with Location Transfer to Rent Page

// Handle search with proper location formatting
function handleSearch() {
    const searchInput = document.querySelector('.search-input');
    const locationSelects = document.querySelectorAll('.search-select');
    
    const searchLocation = searchInput ? searchInput.value.trim() : '';
    const selectedLocation = locationSelects[0] ? locationSelects[0].value : '';
    const selectedGP = locationSelects[1] ? locationSelects[1].value : '';
    
    // Determine which location to use
    let finalLocation = '';
    
    if (selectedLocation) {
        // Use dropdown selection
        finalLocation = selectedLocation;
    } else if (searchLocation) {
        // Use text input - normalize it
        finalLocation = searchLocation.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
    }
    
    if (!finalLocation) {
        // Shake animation for empty search
        if (searchInput) {
            searchInput.style.animation = 'shake 0.5s';
            setTimeout(() => {
                searchInput.style.animation = '';
            }, 500);
        }
        
        showNotification({
            type: 'error',
            title: 'Search Required',
            message: 'Please enter or select a location to search for vehicles',
            duration: 3000
        });
        return;
    }
    
    // Show loading notification
    showNotification({
        type: 'info',
        title: 'Searching...',
        message: `Looking for vehicles in: ${finalLocation.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
        duration: 1500
    });
    
    // Show loading animation
    showLoading(true);
    
    // Redirect to rent page with location parameter
    setTimeout(() => {
        window.location.href = `rent.html?location=${encodeURIComponent(finalLocation)}`;
    }, 1000);
}

// Quick links - pass vehicle type to rent page
document.addEventListener('DOMContentLoaded', function() {
    const quickLinkButtons = document.querySelectorAll('.link-card .btn');
    
    quickLinkButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // If it has query parameters, let it work normally
            if (href && href.includes('?')) {
                e.preventDefault();
                
                showNotification({
                    type: 'info',
                    title: 'Loading Vehicles',
                    message: 'Filtering vehicles by type...',
                    duration: 1500
                });
                
                showLoading(true);
                
                setTimeout(() => {
                    window.location.href = href;
                }, 800);
            }
        });
    });
    
    // Search button click handler
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleSearch();
        });
    }
    
    // Enter key on search input
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
            }
        });
    }
    
    console.log('Home page search functionality initialized');
});