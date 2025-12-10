// base.js - Enhanced Shared JavaScript Functions for RideShare Local with Firebase

// Global variables
let currentUser = null;
let vehicleData = []; // Will be populated from Firebase
let vehicleDataLoaded = false;

// Load vehicles from Firebase
async function loadVehiclesGlobal() {
    try {
        console.log('Loading vehicles from Firebase...');
        
        const snapshot = await db.collection('vehicles')
            .where('status', '==', 'approved')
            .get();
        
        vehicleData = [];
        snapshot.forEach(doc => {
            vehicleData.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        vehicleDataLoaded = true;
        console.log(`✓ Loaded ${vehicleData.length} vehicles from Firebase`);
        
        // Dispatch event to notify other scripts
        window.dispatchEvent(new CustomEvent('vehiclesLoaded', { 
            detail: { vehicles: vehicleData } 
        }));
        
        return vehicleData;
    } catch (error) {
        console.error('Error loading vehicles:', error);
        return [];
    }
}

// Get single vehicle by ID from Firebase
async function getVehicleById(vehicleId) {
    try {
        const doc = await db.collection('vehicles').doc(vehicleId).get();
        
        if (doc.exists) {
            return {
                id: doc.id,
                ...doc.data()
            };
        }
        
        return null;
    } catch (error) {
        console.error('Error getting vehicle:', error);
        return null;
    }
}

// Subscribe to vehicle updates in real-time
function subscribeToVehicleUpdates(callback) {
    return db.collection('vehicles')
        .where('status', '==', 'approved')
        .onSnapshot((snapshot) => {
            vehicleData = [];
            snapshot.forEach(doc => {
                vehicleData.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            vehicleDataLoaded = true;
            console.log(`Real-time update: ${vehicleData.length} vehicles`);
            
            if (callback) {
                callback(vehicleData);
            }
            
            // Dispatch event
            window.dispatchEvent(new CustomEvent('vehiclesUpdated', { 
                detail: { vehicles: vehicleData } 
            }));
        }, (error) => {
            console.error('Error in vehicle subscription:', error);
        });
}

// Enhanced Mobile menu with smooth animations
function setupMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle && navLinks) {
        // Add transition styles
        navLinks.style.transition = 'all 0.3s ease';
        
        mobileMenuToggle.addEventListener('click', function() {
            if (navLinks.classList.contains('mobile-active')) {
                // Close menu with animation
                navLinks.style.opacity = '0';
                navLinks.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    navLinks.classList.remove('mobile-active');
                    navLinks.style.display = 'none';
                }, 300);
                
                this.classList.remove('active');
            } else {
                // Open menu with animation
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.right = '0';
                navLinks.style.background = 'var(--primary-blue)';
                navLinks.style.padding = '1rem';
                navLinks.style.boxShadow = 'var(--shadow)';
                navLinks.style.zIndex = '1000';
                navLinks.style.opacity = '0';
                navLinks.style.transform = 'translateY(-20px)';
                
                navLinks.classList.add('mobile-active');
                
                // Force reflow
                navLinks.offsetHeight;
                
                navLinks.style.opacity = '1';
                navLinks.style.transform = 'translateY(0)';
                
                this.classList.add('active');
            }
        });
    }
}

// Enhanced smooth scrolling with progress indicator
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Add highlight animation to target
                target.style.animation = 'highlightPulse 1s ease';
                setTimeout(() => {
                    target.style.animation = '';
                }, 1000);
                
                // Close mobile menu if open
                const navLinks = document.querySelector('.nav-links');
                if (window.innerWidth <= 768 && navLinks.classList.contains('mobile-active')) {
                    navLinks.style.display = 'none';
                    navLinks.classList.remove('mobile-active');
                    document.querySelector('.mobile-menu-toggle').classList.remove('active');
                }
            }
        });
    });
}

// Enhanced header with scroll progress indicator
function setupHeaderScrollEffects() {
    const header = document.querySelector('.header');
    
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        background: var(--primary-orange);
        transition: width 0.3s ease;
        z-index: 1000;
    `;
    if (header) {
        header.appendChild(progressBar);
    }
    
    window.addEventListener('scroll', function() {
        const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = `${scrollPercentage}%`;
        
        if (header) {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
                header.style.background = 'rgba(30, 58, 95, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.classList.remove('scrolled');
                header.style.background = 'var(--primary-blue)';
                header.style.backdropFilter = 'none';
            }
        }
    });
}

// Enhanced message display with animations
function showMessage(text, type = 'info') {
    let messageContainer = document.getElementById('messageContainer');
    
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.id = 'messageContainer';
        messageContainer.className = 'message-container';
        messageContainer.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 2000;
            max-width: 400px;
        `;
        document.body.appendChild(messageContainer);
    }
    
    const messageId = 'msg_' + Date.now();
    const message = document.createElement('div');
    message.id = messageId;
    message.className = `message ${type}`;
    
    const icons = {
        'success': 'fas fa-check-circle',
        'error': 'fas fa-exclamation-circle',
        'info': 'fas fa-info-circle',
        'warning': 'fas fa-exclamation-triangle'
    };
    
    const colors = {
        'success': '#28a745',
        'error': '#dc3545',
        'info': '#1e3a5f',
        'warning': '#ffc107'
    };
    
    message.innerHTML = `
        <i class="${icons[type] || icons['info']} message-icon"></i>
        <span class="message-text">${text}</span>
        <button class="message-close" onclick="hideSpecificMessage('${messageId}')">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    message.style.cssText = `
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem 1.5rem;
        margin-bottom: 1rem;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        background: ${colors[type] || colors['info']};
        color: ${type === 'warning' ? '#333' : 'white'};
        font-weight: 500;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    messageContainer.appendChild(message);
    
    // Animate in
    setTimeout(() => {
        message.style.opacity = '1';
        message.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto-hide with animation
    setTimeout(() => {
        hideSpecificMessage(messageId);
    }, 5000);
}

function hideSpecificMessage(messageId) {
    const message = document.getElementById(messageId);
    if (message) {
        message.style.opacity = '0';
        message.style.transform = 'translateX(100%)';
        setTimeout(() => {
            message.remove();
        }, 300);
    }
}

function hideMessage() {
    const messageContainer = document.getElementById('messageContainer');
    if (messageContainer) {
        messageContainer.innerHTML = '';
    }
}

// User session management
function setCurrentUser(userData) {
    currentUser = userData;
    saveToLocalStorage('rideshare_user', userData);
    updateUIForLoggedInUser();
    
    // Animate user welcome
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
        authButtons.style.animation = 'fadeIn 0.5s ease';
    }
}

function getCurrentUser() {
    if (!currentUser) {
        currentUser = loadFromLocalStorage('rideshare_user');
    }
    return currentUser;
}

function logoutUser() {
    currentUser = null;
    localStorage.removeItem('rideshare_user');
    updateUIForLoggedOutUser();
    
    // Animate logout
    showMessage('You have been logged out successfully', 'success');
    
    setTimeout(() => {
        window.location.href = 'home.html';
    }, 1500);
}

function updateUIForLoggedInUser() {
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons && currentUser) {
        authButtons.innerHTML = `
            <span style="color: var(--white); margin-right: 1rem;">Welcome, ${currentUser.name}</span>
            <button class="btn btn-secondary" onclick="logoutUser()">Logout</button>
        `;
    }
}

function updateUIForLoggedOutUser() {
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
        authButtons.innerHTML = `
            <a href="auth.html" class="btn btn-secondary">Sign Up / Log In</a>
        `;
    }
}

// Local Storage utilities
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.warn('LocalStorage not available:', error);
    }
}

function loadFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.warn('Error loading from localStorage:', error);
        return null;
    }
}

// Form validation utilities
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^\+855\s?\d{2}\s?\d{3}\s?\d{3,4}$/;
    return phoneRegex.test(phone);
}

function checkPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    
    if (strength < 2) return 'weak';
    if (strength < 4) return 'medium';
    return 'strong';
}

// Enhanced scroll animations with Intersection Observer
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered animation
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.classList.add('animated');
                }, index * 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe different elements
    const elementsToAnimate = document.querySelectorAll(
        '.feature-card, .link-card, .step-card, .vehicle-card, .benefit-card, .safety-feature'
    );
    
    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Loading animation
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
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;
        loadingOverlay.innerHTML = `
            <div style="text-align: center;">
                <div class="spinner" style="
                    border: 4px solid rgba(255, 255, 255, 0.3);
                    border-top: 4px solid var(--primary-orange);
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 1rem;
                "></div>
                <p style="color: white; font-size: 1.2rem;">Loading...</p>
            </div>
        `;
        document.body.appendChild(loadingOverlay);
        
        // Add spin animation
        if (!document.getElementById('baseAnimations')) {
            const style = document.createElement('style');
            style.id = 'baseAnimations';
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes highlightPulse {
                    0% { background-color: transparent; }
                    50% { background-color: rgba(255, 140, 66, 0.1); }
                    100% { background-color: transparent; }
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

// Initialize base functionality with Firebase
function initializeBase() {
    console.log('Initializing RideShare Local base...');
    
    // Show loading initially
    showLoading(true);
    
    // Setup all functionality
    setupMobileMenu();
    setupSmoothScrolling();
    setupHeaderScrollEffects();
    
    // Check for user session
    const user = getCurrentUser();
    if (user) {
        updateUIForLoggedInUser();
    }
    
    // Load vehicles from Firebase if db is available
    if (typeof db !== 'undefined') {
        console.log('Firebase detected, loading vehicles...');
        loadVehiclesGlobal().then(() => {
            console.log('Vehicles loaded successfully');
        }).catch(err => {
            console.error('Error loading vehicles:', err);
        });
    } else {
        console.warn('Firebase not initialized yet, waiting for firebase-config.js');
        // Wait for Firebase to initialize
        const waitForFirebase = setInterval(() => {
            if (typeof db !== 'undefined') {
                clearInterval(waitForFirebase);
                console.log('Firebase now available, loading vehicles...');
                loadVehiclesGlobal();
            }
        }, 100);
        
        // Stop waiting after 5 seconds
        setTimeout(() => {
            clearInterval(waitForFirebase);
            if (typeof db === 'undefined') {
                console.error('Firebase initialization timeout');
            }
        }, 5000);
    }
    
    // Add scroll animations after a delay
    setTimeout(() => {
        addScrollAnimations();
        showLoading(false);
    }, 500);
    
    // Window resize handler
    window.addEventListener('resize', handleWindowResize);
    
    // Page transition animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    console.log('✓ RideShare Local - Enhanced base functionality loaded');
}

// Handle window resize
function handleWindowResize() {
    const navLinks = document.querySelector('.nav-links');
    
    if (window.innerWidth > 768 && navLinks) {
        navLinks.style.display = '';
        navLinks.style.flexDirection = '';
        navLinks.style.position = '';
        navLinks.style.opacity = '';
        navLinks.style.transform = '';
        navLinks.classList.remove('mobile-active');
        document.querySelector('.mobile-menu-toggle')?.classList.remove('active');
    }
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    showMessage('Something went wrong. Please refresh the page.', 'error');
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeBase);

// Export for use in other files
window.hideSpecificMessage = hideSpecificMessage;
window.loadVehiclesGlobal = loadVehiclesGlobal;
window.getVehicleById = getVehicleById;
window.subscribeToVehicleUpdates = subscribeToVehicleUpdates;

console.log('✓ Base.js with Firebase integration loaded');