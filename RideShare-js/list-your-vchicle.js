// list-your-vehicle.js - Complete Enhanced Version with Firebase & Notifications

(function() {
    'use strict';
    
    let currentStep = 1;
    const totalSteps = 8;
    let listVehicleData = {
        images: [],
        features: []
    };
    let currentUser = null;
    let uploadedFiles = [];

    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Disable browser alerts for this page (use notifications instead)
        window.alert = function(message) {
            console.warn('Alert blocked:', message);
            showNotification({
                type: 'warning',
                title: 'Notice',
                message: message,
                duration: 4000
            });
        };
        
        // Check authentication first
        firebase.auth().onAuthStateChanged(user => {
            currentUser = user;
            if (!user) {
                showNotification({
                    type: 'warning',
                    title: 'Login Required',
                    message: 'Please log in to list a vehicle. Redirecting...',
                    duration: 3000
                });
                setTimeout(() => {
                    window.location.href = 'auth.html';
                }, 2000);
                return;
            }
            
            // User is logged in
            console.log('List vehicle auth: Logged in as', user.email);
            initializeListVehiclePage();
        });
    });

    // Main initialization
    function initializeListVehiclePage() {
        setupListVehiclePage();
        setupBenefitsAnimation();
        setupFormProgressBar();
        setupDynamicPricing();
        setupInteractiveForm();
        setupImagePreview();
        // Map picker is handled by map-location-picker.js        
        console.log('✓ List Your Vehicle page enhanced functionality loaded');
    }

    // Setup list vehicle page functionality
    function setupListVehiclePage() {
        // Form submission
        const listVehicleForm = document.getElementById('listVehicleForm');
        if (listVehicleForm) {
            listVehicleForm.addEventListener('submit', handleVehicleListing);
        }
        
        // Photo upload with drag & drop
        setupEnhancedPhotoUpload();
        
        // Vehicle type change
        const vehicleTypeSelect = document.getElementById('vehicleType');
        if (vehicleTypeSelect) {
            vehicleTypeSelect.addEventListener('change', handleVehicleTypeChange);
        }
        
        // Earnings calculator
        setupEarningsCalculator();
        
        // Availability checkboxes
        setupAvailabilityCheckboxes();
        
        // Form validation
        setupFormValidation();
    }

    // Enhanced vehicle listing handler with Firebase
    async function handleVehicleListing(e) {
        e.preventDefault();
        
        if (!currentUser) {
            showNotification({
                type: 'error',
                title: 'Not Logged In',
                message: 'Please log in to list a vehicle',
                duration: 3000
            });
            setTimeout(() => {
                window.location.href = 'auth.html';
            }, 2000);
            return;
        }
        
        const formData = new FormData(e.target);
        
        // Animated validation
        const requiredFields = e.target.querySelectorAll('[required]');
        let hasError = false;
        
        requiredFields.forEach((field, index) => {
            if (!field.value || (field.type === 'checkbox' && !field.checked)) {
                setTimeout(() => {
                    showFieldError(field);
                }, index * 100);
                hasError = true;
            }
        });
        
        // Check availability days
        const selectedDays = formData.getAll('availableDays[]');
        if (selectedDays.length === 0) {
            showNotification({
                type: 'error',
                title: 'Missing Information',
                message: 'Please select at least one available day',
                duration: 4000
            });
            return;
        }
        
        if (hasError) {
            shakeForm(e.target);
            showNotification({
                type: 'error',
                title: 'Incomplete Form',
                message: 'Please fill in all required fields',
                duration: 4000
            });
            return;
        }
        
        // Prepare vehicle data
        const vehicleInfo = {
            name: formData.get('vehicleTitle') || formData.get('vehicleName'),
            type: formData.get('vehicleType'),
            brand: formData.get('brand'),
            model: formData.get('model'),
            year: parseInt(formData.get('year')),
            description: formData.get('description'),
            location: formData.get('location'),
            district: formData.get('district'),
            address: formData.get('address') || formData.get('pickupLocation'),
            pricePerDay: parseFloat(formData.get('dailyPrice')),
            deposit: parseFloat(formData.get('depositAmount') || formData.get('deposit')),
            availableDays: selectedDays,
            features: listVehicleData.features,
            images: listVehicleData.images,
            contactEmail: formData.get('contactEmail'),
            contactPhone: formData.get('contactPhone')
        };
        
        // Show submission animation
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalContent = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;
        
        // Progress steps with notifications
        const steps = [
            'Validating information...',
            'Uploading photos...',
            'Creating listing...',
            'Almost done...'
        ];
        
        let stepIndex = 0;
        const stepInterval = setInterval(() => {
            if (stepIndex < steps.length) {
                submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${steps[stepIndex]}`;
                stepIndex++;
            }
        }, 800);
        
        try {
            // Show processing notification
            showNotification({
                type: 'info',
                title: 'Submitting Your Listing',
                message: 'Please wait while we process your vehicle listing...',
                duration: 3000
            });
            
            // Check if Firebase is available
            if (!firebase || !firebase.firestore) {
                throw new Error('Database connection unavailable. Please refresh the page.');
            }
            
            // Prepare final data for Firebase
            const finalData = {
                ...vehicleInfo,
                ownerId: currentUser.uid,
                ownerEmail: currentUser.email,
                ownerName: currentUser.displayName || 'Owner',
                status: 'pending',
                available: true,
                rating: 0,
                reviewCount: 0,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            // Save to Firestore with error handling
            let docRef;
            try {
                docRef = await firebase.firestore()
                    .collection('vehicles')
                    .add(finalData);
            } catch (fbError) {
                console.error('Firebase error:', fbError);
                if (fbError.code === 'permission-denied') {
                    throw new Error('You do not have permission to list vehicles. Please contact support.');
                }
                throw new Error('Unable to save vehicle data. Please try again later.');
            }
            
            if (!docRef || !docRef.id) {
                throw new Error('Failed to create listing. Please try again.');
            }
            
            console.log('✓ Vehicle listed successfully! ID:', docRef.id);
            
            clearInterval(stepInterval);
            
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
            submitBtn.style.background = 'var(--success)';
            
            // Show big success notification
            showNotification({
                type: 'success',
                title: '🎉 Vehicle Listed Successfully!',
                message: `Your ${vehicleInfo.name} has been submitted for review. You'll be notified once it's approved.`,
                duration: 8000,
                action: {
                    text: 'View My Listings',
                    onClick: function() {
                        window.location.href = 'my-listings.html';
                    }
                }
            });
            
            // Animate form out
            e.target.style.animation = 'slideOutDown 0.8s ease';
            
            // Show success screen
            setTimeout(() => {
                showSuccessScreen(vehicleInfo);
            }, 800);
            
        } catch (error) {
            console.error('Error listing vehicle:', error);
            
            clearInterval(stepInterval);
            
            // Determine error message
            let errorMessage = 'Failed to submit your listing. Please try again.';
            
            if (error.code === 'permission-denied') {
                errorMessage = 'Permission denied. Please contact support or try logging in again.';
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            showNotification({
                type: 'error',
                title: 'Listing Failed',
                message: errorMessage,
                duration: 6000
            });
            
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalContent;
            submitBtn.style.background = '';
        }
    }

    // Show success screen after listing
    function showSuccessScreen(vehicleInfo) {
        const formContainer = document.querySelector('.form-container') || document.querySelector('main');
        
        const successScreen = document.createElement('div');
        successScreen.className = 'success-screen';
        successScreen.innerHTML = `
            <div class="success-content">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2>Vehicle Listed Successfully!</h2>
                <p>Your ${vehicleInfo.name || 'vehicle'} has been submitted for review.</p>
                <div class="success-details">
                    <div class="detail-item">
                        <i class="fas fa-clock"></i>
                        <span>Review time: 24 hours</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-envelope"></i>
                        <span>Confirmation sent to ${vehicleInfo.contactEmail || currentUser.email}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-dollar-sign"></i>
                        <span>Expected earnings: $${vehicleInfo.pricePerDay || '0'}/day</span>
                    </div>
                </div>
                <div class="success-actions">
                    <a href="rent.html" class="btn btn-primary">View Listings</a>
                    <button class="btn btn-secondary" onclick="location.reload()">List Another Vehicle</button>
                </div>
            </div>
        `;
        
        successScreen.style.cssText = `
            opacity: 0;
            transform: scale(0.9);
            transition: all 0.5s ease;
        `;
        
        formContainer.innerHTML = '';
        formContainer.appendChild(successScreen);
        
        setTimeout(() => {
            successScreen.style.opacity = '1';
            successScreen.style.transform = 'scale(1)';
        }, 100);
    }

    // Enhanced photo upload with drag & drop
    function setupEnhancedPhotoUpload() {
        const photoUpload = document.getElementById('photoUpload');
        const photoInput = document.getElementById('vehiclePhotos') || document.getElementById('vehicleImages');
        const photoPreview = document.getElementById('photoPreview') || document.getElementById('imagePreview');
        
        if (!photoUpload || !photoInput) return;
        
        uploadedFiles = [];
        
        photoUpload.addEventListener('click', () => {
            photoInput.click();
        });
        
        // Drag and drop functionality
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            photoUpload.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        ['dragenter', 'dragover'].forEach(eventName => {
            photoUpload.addEventListener(eventName, () => {
                photoUpload.classList.add('drag-over');
                photoUpload.style.borderColor = 'var(--primary-orange)';
                photoUpload.style.background = 'rgba(255, 140, 66, 0.1)';
                photoUpload.style.transform = 'scale(1.02)';
            });
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            photoUpload.addEventListener(eventName, () => {
                photoUpload.classList.remove('drag-over');
                photoUpload.style.borderColor = 'var(--border-light)';
                photoUpload.style.background = 'var(--light-gray)';
                photoUpload.style.transform = 'scale(1)';
            });
        });
        
        photoUpload.addEventListener('drop', handleDrop);
        photoInput.addEventListener('change', (e) => handleFiles(e.target.files));
        
        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFiles(files);
        }
        
        function handleFiles(files) {
            if (files.length === 0) return;
            
            if (files.length > 5) {
                showNotification({
                    type: 'warning',
                    title: 'Too Many Images',
                    message: 'You can upload maximum 5 images',
                    duration: 3000
                });
                return;
            }
            
            showNotification({
                type: 'info',
                title: 'Uploading Images',
                message: `Processing ${files.length} image(s)...`,
                duration: 2000
            });
            
            ([...files]).forEach((file, index) => {
                if (file.type.startsWith('image/')) {
                    if (file.size > 5 * 1024 * 1024) {
                        showNotification({
                            type: 'error',
                            title: 'File Too Large',
                            message: `${file.name} is too large. Maximum size is 5MB`,
                            duration: 3000
                        });
                        return;
                    }
                    uploadedFiles.push(file);
                    previewFile(file, index);
                }
            });
            
            updateUploadText();
        }
        
        function previewFile(file, index) {
            const reader = new FileReader();
            
            reader.onloadend = function() {
                listVehicleData.images.push(reader.result);
                const preview = createPhotoPreview(reader.result, file.name, index);
                if (photoPreview) {
                    photoPreview.appendChild(preview);
                }
            };
            
            reader.readAsDataURL(file);
        }
        
        function createPhotoPreview(src, name, index) {
            const previewDiv = document.createElement('div');
            previewDiv.className = 'photo-preview enhanced';
            previewDiv.style.cssText = `
                opacity: 0;
                transform: scale(0.8);
                animation: fadeInScale 0.5s ease forwards;
                animation-delay: ${index * 0.1}s;
            `;
            
            previewDiv.innerHTML = `
                <img src="${src}" alt="${name}">
                <div class="photo-overlay">
                    <span class="photo-name">${name}</span>
                    <div class="photo-actions">
                        <button class="photo-edit" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="photo-remove" data-image-url="${src}">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <div class="photo-progress">
                    <div class="progress-bar"></div>
                </div>
            `;
            
            // Add remove listener
            const removeBtn = previewDiv.querySelector('.photo-remove');
            removeBtn.addEventListener('click', function() {
                removePhoto(this);
            });
            
            // Simulate upload progress
            const progressBar = previewDiv.querySelector('.progress-bar');
            setTimeout(() => {
                progressBar.style.width = '100%';
                setTimeout(() => {
                    previewDiv.querySelector('.photo-progress').style.display = 'none';
                }, 500);
            }, 1000);
            
            return previewDiv;
        }
        
        function updateUploadText() {
            const uploadText = photoUpload.querySelector('p');
            if (uploadedFiles.length > 0 && uploadText) {
                uploadText.textContent = `${uploadedFiles.length} photo(s) uploaded. Click or drag to add more.`;
                photoUpload.style.borderColor = 'var(--success)';
            }
        }
    }

    // Remove photo with animation
    function removePhoto(button) {
        const preview = button.closest('.photo-preview');
        const imageUrl = button.getAttribute('data-image-url');
        const index = listVehicleData.images.indexOf(imageUrl);
        
        if (index > -1) {
            listVehicleData.images.splice(index, 1);
        }
        
        preview.style.animation = 'fadeOutScale 0.3s ease';
        
        setTimeout(() => {
            preview.remove();
        }, 300);
        
        showNotification({
            type: 'info',
            title: 'Image Removed',
            message: 'Image has been removed from your listing',
            duration: 2000
        });
    }

    // Handle vehicle type change with animations
    function handleVehicleTypeChange() {
        const vehicleType = document.getElementById('vehicleType').value;
        const featureCategories = document.querySelectorAll('.feature-category');
        
        // Hide all categories with animation
        featureCategories.forEach(category => {
            category.style.opacity = '0';
            category.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                category.style.display = 'none';
            }, 300);
        });
        
        // Show relevant category
        if (vehicleType) {
            const targetCategory = document.getElementById(`${vehicleType}Features`);
            if (targetCategory) {
                setTimeout(() => {
                    targetCategory.style.display = 'block';
                    targetCategory.style.opacity = '0';
                    targetCategory.style.transform = 'translateY(10px)';
                    
                    setTimeout(() => {
                        targetCategory.style.transition = 'all 0.5s ease';
                        targetCategory.style.opacity = '1';
                        targetCategory.style.transform = 'translateY(0)';
                    }, 50);
                }, 350);
            }
            
            // Update pricing suggestions
            updatePricingSuggestions(vehicleType);
        }
    }

    // Update pricing suggestions based on vehicle type
    function updatePricingSuggestions(vehicleType) {
        const dailyPriceInput = document.getElementById('dailyPrice');
        const depositInput = document.getElementById('depositAmount') || document.getElementById('deposit');
        
        const suggestions = {
            car: { daily: 35, deposit: 200 },
            motorbike: { daily: 8, deposit: 50 },
            bicycle: { daily: 5, deposit: 25 }
        };
        
        if (suggestions[vehicleType] && dailyPriceInput && depositInput) {
            animateValueChange(dailyPriceInput, suggestions[vehicleType].daily);
            animateValueChange(depositInput, suggestions[vehicleType].deposit);
            
            // Highlight the inputs
            [dailyPriceInput, depositInput].forEach(input => {
                input.style.borderColor = 'var(--primary-orange)';
                input.style.animation = 'pulse 0.5s ease';
                
                setTimeout(() => {
                    input.style.borderColor = 'var(--success)';
                    input.style.animation = '';
                }, 500);
            });
            
            showNotification({
                type: 'info',
                title: 'Pricing Suggestion',
                message: `Suggested pricing for ${vehicleType}: $${suggestions[vehicleType].daily}/day`,
                duration: 3000
            });
        }
    }

    // Animate value change in inputs
    function animateValueChange(input, targetValue) {
        const startValue = parseFloat(input.value) || 0;
        const duration = 500;
        const steps = 20;
        const increment = (targetValue - startValue) / steps;
        let currentStep = 0;
        
        const interval = setInterval(() => {
            if (currentStep < steps) {
                input.value = (startValue + increment * currentStep).toFixed(2);
                currentStep++;
            } else {
                input.value = targetValue;
                clearInterval(interval);
            }
        }, duration / steps);
    }

    // Enhanced earnings calculator
    function setupEarningsCalculator() {
        const calcVehicleType = document.getElementById('calcVehicleType');
        const calcDailyRate = document.getElementById('calcDailyRate');
        const calcDaysPerMonth = document.getElementById('calcDaysPerMonth');
        
        if (calcVehicleType && calcDailyRate && calcDaysPerMonth) {
            // Add range slider for better UX
            createRangeSlider(calcDailyRate);
            createRangeSlider(calcDaysPerMonth);
            
            // Add event listeners
            [calcVehicleType, calcDailyRate, calcDaysPerMonth].forEach(input => {
                input.addEventListener('change', updateCalculator);
                input.addEventListener('input', updateCalculator);
            });
            
            // Vehicle type change updates default rates
            calcVehicleType.addEventListener('change', function() {
                const defaultRates = {
                    'car': 30,
                    'motorbike': 8,
                    'bicycle': 5
                };
                
                const newRate = defaultRates[this.value] || 30;
                animateValueChange(calcDailyRate, newRate);
                updateCalculator();
            });
            
            // Initial calculation
            updateCalculator();
        }
    }

    // Create range slider for inputs
    function createRangeSlider(input) {
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = input.min || 1;
        slider.max = input.id === 'calcDailyRate' ? 100 : 31;
        slider.value = input.value;
        slider.className = 'range-slider';
        
        slider.style.cssText = `
            width: 100%;
            margin-top: 0.5rem;
            -webkit-appearance: none;
            height: 5px;
            background: var(--border-light);
            border-radius: 5px;
            outline: none;
        `;
        
        slider.addEventListener('input', function() {
            input.value = this.value;
            updateCalculator();
        });
        
        input.addEventListener('input', function() {
            slider.value = this.value;
        });
        
        input.parentElement.appendChild(slider);
    }

    // Enhanced earnings calculator
    function updateCalculator() {
        const vehicleType = document.getElementById('calcVehicleType')?.value;
        const dailyRate = parseFloat(document.getElementById('calcDailyRate')?.value) || 0;
        const daysPerMonth = parseInt(document.getElementById('calcDaysPerMonth')?.value) || 0;
        
        // Calculate earnings (10% platform commission)
        const commission = 0.10;
        const netDailyRate = dailyRate * (1 - commission);
        const monthlyEarnings = netDailyRate * daysPerMonth;
        const yearlyEarnings = monthlyEarnings * 12;
        
        // Animate the updates
        animateEarningDisplay('dailyEarning', netDailyRate);
        animateEarningDisplay('monthlyEarning', monthlyEarnings);
        animateEarningDisplay('yearlyEarning', yearlyEarnings);
        
        // Show potential ranking
        showEarningRanking(monthlyEarnings);
    }

    // Animate earning display
    function animateEarningDisplay(elementId, value) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const currentValue = parseFloat(element.textContent.replace('$', '')) || 0;
        const duration = 500;
        const steps = 20;
        const increment = (value - currentValue) / steps;
        let currentStep = 0;
        
        const interval = setInterval(() => {
            if (currentStep < steps) {
                element.textContent = `$${(currentValue + increment * currentStep).toFixed(2)}`;
                currentStep++;
            } else {
                element.textContent = `$${value.toFixed(2)}`;
                clearInterval(interval);
                
                // Add pulse effect
                element.style.animation = 'pulse 0.5s ease';
                setTimeout(() => {
                    element.style.animation = '';
                }, 500);
            }
        }, duration / steps);
    }

    // Show earning ranking
    function showEarningRanking(monthlyEarnings) {
        let ranking = '';
        let color = '';
        
        if (monthlyEarnings < 100) {
            ranking = '🥉 Bronze Level';
            color = '#cd7f32';
        } else if (monthlyEarnings < 500) {
            ranking = '🥈 Silver Level';
            color = '#c0c0c0';
        } else if (monthlyEarnings < 1000) {
            ranking = '🥇 Gold Level';
            color = '#ffd700';
        } else {
            ranking = '💎 Diamond Level';
            color = '#b9f2ff';
        }
        
        const calculatorResults = document.querySelector('.calculator-results');
        if (!calculatorResults) return;
        
        let rankingDisplay = calculatorResults.querySelector('.ranking-display');
        
        if (!rankingDisplay) {
            rankingDisplay = document.createElement('div');
            rankingDisplay.className = 'ranking-display';
            rankingDisplay.style.cssText = `
                text-align: center;
                padding: 1rem;
                margin-top: 1rem;
                border-radius: 12px;
                font-weight: 600;
                transition: all 0.3s ease;
            `;
            calculatorResults.appendChild(rankingDisplay);
        }
        
        rankingDisplay.textContent = ranking;
        rankingDisplay.style.background = `linear-gradient(135deg, ${color}22, ${color}44)`;
        rankingDisplay.style.color = color;
    }

    // Enhanced availability checkboxes
    function setupAvailabilityCheckboxes() {
        const checkboxes = document.querySelectorAll('input[name="availableDays[]"]');
        
        if (checkboxes.length > 0) {
            const checkboxGroup = checkboxes[0].closest('.checkbox-group');
            if (checkboxGroup) {
                // Create select all button
                const buttonContainer = document.createElement('div');
                buttonContainer.style.marginBottom = '1rem';
                
                const selectAllBtn = document.createElement('button');
                selectAllBtn.type = 'button';
                selectAllBtn.textContent = 'Select All Days';
                selectAllBtn.className = 'btn btn-secondary';
                
                const selectWeekdaysBtn = document.createElement('button');
                selectWeekdaysBtn.type = 'button';
                selectWeekdaysBtn.textContent = 'Weekdays Only';
                selectWeekdaysBtn.className = 'btn btn-outline';
                selectWeekdaysBtn.style.marginLeft = '1rem';
                
                const selectWeekendsBtn = document.createElement('button');
                selectWeekendsBtn.type = 'button';
                selectWeekendsBtn.textContent = 'Weekends Only';
                selectWeekendsBtn.className = 'btn btn-outline';
                selectWeekendsBtn.style.marginLeft = '1rem';
                
                buttonContainer.appendChild(selectAllBtn);
                buttonContainer.appendChild(selectWeekdaysBtn);
                buttonContainer.appendChild(selectWeekendsBtn);
                
                checkboxGroup.parentNode.insertBefore(buttonContainer, checkboxGroup);
                
                // Select all functionality
                selectAllBtn.addEventListener('click', function() {
                    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
                    checkboxes.forEach((cb, index) => {
                        setTimeout(() => {
                            cb.checked = !allChecked;
                            cb.parentElement.style.animation = 'pulse 0.3s ease';
                        }, index * 50);
                    });
                    this.textContent = allChecked ? 'Select All Days' : 'Deselect All Days';
                });
                
                // Weekdays only
                selectWeekdaysBtn.addEventListener('click', function() {
                    const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
                    checkboxes.forEach((cb, index) => {
                        setTimeout(() => {
                            cb.checked = weekdays.includes(cb.value);
                            cb.parentElement.style.animation = 'pulse 0.3s ease';
                        }, index * 50);
                    });
                });
                
                // Weekends only
                selectWeekendsBtn.addEventListener('click', function() {
                    const weekends = ['saturday', 'sunday'];
                    checkboxes.forEach((cb, index) => {
                        setTimeout(() => {
                            cb.checked = weekends.includes(cb.value);
                            cb.parentElement.style.animation = 'pulse 0.3s ease';
                        }, index * 50);
                    });
                });
            }
        }
    }

    // Form validation with animations
    function setupFormValidation() {
        const form = document.getElementById('listVehicleForm');
        if (!form) return;
        
        // Real-time validation for required fields
        const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
        
        requiredFields.forEach(field => {
            field.addEventListener('blur', function() {
                validateField(this);
            });
            
            field.addEventListener('input', function() {
                if (this.value.trim()) {
                    clearFieldError(this);
                    this.style.borderColor = 'var(--success)';
                    showFieldSuccess(this);
                }
            });
        });
        
        // Price validation with animation
        const priceInputs = form.querySelectorAll('input[type="number"]');
        priceInputs.forEach(input => {
            input.addEventListener('blur', function() {
                const value = parseFloat(this.value);
                if (this.value && (isNaN(value) || value <= 0)) {
                    showFieldError(this, 'Please enter a valid positive number');
                } else if (this.value) {
                    clearFieldError(this);
                    this.style.borderColor = 'var(--success)';
                    showFieldSuccess(this);
                }
            });
        });
    }

    // Field validation helpers
    function validateField(field) {
        const value = field.value.trim();
        
        if (field.hasAttribute('required') && !value) {
            showFieldError(field, `${formatFieldName(field.name || field.id)} is required`);
            return false;
        } else if (value) {
            clearFieldError(field);
            field.style.borderColor = 'var(--success)';
            showFieldSuccess(field);
            return true;
        }
        
        return true;
    }

    function showFieldError(field, message) {
        clearFieldError(field);
        
        field.style.borderColor = 'var(--danger)';
        field.style.animation = 'shake 0.5s';
        
        if (message) {
            const error = document.createElement('div');
            error.className = 'field-error';
            error.textContent = message;
            error.style.cssText = `
                color: var(--danger);
                font-size: 0.85rem;
                margin-top: 0.25rem;
                animation: slideInLeft 0.3s ease;
            `;
            field.parentElement.appendChild(error);
        }
        
        setTimeout(() => {
            field.style.animation = '';
        }, 500);
    }

    function clearFieldError(field) {
        if (!field) return;
        
        field.style.borderColor = 'var(--border-light)';
        const error = field.parentElement?.querySelector('.field-error');
        if (error) error.remove();
        
        const success = field.parentElement?.querySelector('.field-success');
        if (success) success.remove();
    }

    function showFieldSuccess(field) {
        // Green checkmark removed - just keep the green border
        // No icon will be shown
    }

    function formatFieldName(name) {
        return name
            .replace(/([A-Z])/g, ' $1')
            .replace(/[_-]/g, ' ')
            .replace(/\[\]/g, '')
            .trim()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    function shakeForm(form) {
        form.style.animation = 'shake 0.5s';
        setTimeout(() => {
            form.style.animation = '';
        }, 500);
    }

    // Benefits section animation
    function setupBenefitsAnimation() {
        const benefitCards = document.querySelectorAll('.benefit-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0) rotateY(0)';
                        
                        // Animate icon
                        const icon = entry.target.querySelector('.benefit-icon');
                        if (icon) {
                            icon.style.animation = 'bounceIn 0.6s ease';
                        }
                    }, index * 150);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        benefitCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px) rotateY(90deg)';
            card.style.transition = 'all 0.8s ease';
            card.style.transformStyle = 'preserve-3d';
            observer.observe(card);
        });
    }

    // Form progress bar
    function setupFormProgressBar() {
        const form = document.getElementById('listVehicleForm');
        if (!form) return;
        
        const sections = form.querySelectorAll('.form-section');
        if (sections.length === 0) return;
        
        const progressBar = document.createElement('div');
        progressBar.className = 'form-progress';
        progressBar.style.cssText = `
            position: sticky;
            top: 80px;
            background: var(--light-gray);
            padding: 1rem;
            margin-bottom: 2rem;
            border-radius: 12px;
            z-index: 10;
        `;
        
        const progressFill = document.createElement('div');
        progressFill.style.cssText = `
            height: 5px;
            background: linear-gradient(90deg, var(--primary-orange), var(--primary-blue));
            width: 0%;
            border-radius: 5px;
            transition: width 0.3s ease;
        `;
        
        const progressText = document.createElement('div');
        progressText.style.cssText = `
            text-align: center;
            margin-top: 0.5rem;
            font-size: 0.9rem;
            color: var(--text-light);
        `;
        progressText.textContent = 'Step 1 of ' + sections.length;
        
        progressBar.appendChild(progressFill);
        progressBar.appendChild(progressText);
        form.insertBefore(progressBar, form.firstChild);
        
        // Update progress on input
        form.addEventListener('input', updateProgress);
        form.addEventListener('change', updateProgress);
        
        function updateProgress() {
            let filledSections = 0;
            
            sections.forEach(section => {
                const requiredFields = section.querySelectorAll('[required]');
                const filledFields = Array.from(requiredFields).filter(field => {
                    if (field.type === 'checkbox') {
                        return field.checked;
                    }
                    return field.value.trim() !== '';
                });
                
                if (filledFields.length === requiredFields.length && requiredFields.length > 0) {
                    filledSections++;
                }
            });
            
            const percentage = (filledSections / sections.length) * 100;
            progressFill.style.width = percentage + '%';
            progressText.textContent = `Step ${Math.min(filledSections + 1, sections.length)} of ${sections.length}`;
            
            // Add celebration when complete
            if (percentage === 100) {
                progressBar.style.animation = 'pulse 0.5s ease';
                progressText.innerHTML = '<i class="fas fa-check"></i> All sections complete!';
                progressText.style.color = 'var(--success)';
            }
        }
    }

    // Interactive form sections
    function setupInteractiveForm() {
        const formSections = document.querySelectorAll('.form-section');
        
        formSections.forEach((section, index) => {
            // Add collapsible functionality
            const heading = section.querySelector('h3');
            if (heading) {
                heading.style.cursor = 'pointer';
                heading.style.userSelect = 'none';
                
                // Add expand/collapse icon
                const icon = document.createElement('i');
                icon.className = 'fas fa-chevron-down';
                icon.style.cssText = `
                    float: right;
                    transition: transform 0.3s ease;
                `;
                heading.appendChild(icon);
                
                heading.addEventListener('click', function() {
                    const content = Array.from(section.children).slice(1);
                    const isCollapsed = section.classList.contains('collapsed');
                    
                    if (isCollapsed) {
                        section.classList.remove('collapsed');
                        icon.style.transform = 'rotate(0)';
                        content.forEach(elem => {
                            elem.style.display = '';
                            elem.style.opacity = '0';
                            setTimeout(() => {
                                elem.style.transition = 'opacity 0.3s ease';
                                elem.style.opacity = '1';
                            }, 50);
                        });
                    } else {
                        section.classList.add('collapsed');
                        icon.style.transform = 'rotate(-90deg)';
                        content.forEach(elem => {
                            elem.style.opacity = '0';
                            setTimeout(() => {
                                elem.style.display = 'none';
                            }, 300);
                        });
                    }
                });
            }
        });
    }

    // Enhanced image preview with editing
    function setupImagePreview() {
        // Add lightbox functionality
        document.addEventListener('click', function(e) {
            if (e.target.matches('.photo-preview img')) {
                showImageLightbox(e.target.src);
            }
            
            if (e.target.matches('.photo-edit') || e.target.closest('.photo-edit')) {
                const preview = e.target.closest('.photo-preview');
                const img = preview.querySelector('img');
                showImageEditor(img);
            }
        });
    }

    // Show image in lightbox
    function showImageLightbox(src) {
        const lightbox = document.createElement('div');
        lightbox.className = 'image-lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="${src}" alt="Preview">
                <button class="lightbox-close">&times;</button>
            </div>
        `;
        
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(lightbox);
        
        setTimeout(() => {
            lightbox.style.opacity = '1';
        }, 10);
        
        // Close functionality
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox || e.target.className === 'lightbox-close') {
                lightbox.style.opacity = '0';
                setTimeout(() => lightbox.remove(), 300);
            }
        });
    }

    // Show image editor (placeholder)
    function showImageEditor(img) {
        showNotification({
            type: 'info',
            title: 'Coming Soon',
            message: 'Image editing functionality will be available soon!',
            duration: 3000
        });
    }



    // Show map picker modal
    function showMapPicker() {
        const modal = document.createElement('div');
        modal.className = 'map-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Select Pickup Location</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="map-container">
                    <div class="map-placeholder">
                        <i class="fas fa-map-marked-alt"></i>
                        <p>Interactive map coming soon!</p>
                        <p>You'll be able to pin your exact pickup location.</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary">Cancel</button>
                    <button class="btn btn-primary">Confirm Location</button>
                </div>
            </div>
        `;
        
        modal.style.cssText = `
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
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
        
        // Close functionality
        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.querySelector('.btn-secondary').addEventListener('click', closeModal);
        
        function closeModal() {
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 300);
        }
        
        // Confirm location
        modal.querySelector('.btn-primary').addEventListener('click', () => {
            const pickupLocation = document.getElementById('pickupLocation') || document.getElementById('address');
            if (pickupLocation) {
                pickupLocation.value = 'Location selected on map (Phnom Penh, Cambodia)';
                pickupLocation.style.borderColor = 'var(--success)';
            }
            showNotification({
                type: 'success',
                title: 'Location Selected',
                message: 'Location selected successfully!',
                duration: 2000
            });
            closeModal();
        });
    }

    (function() {
    'use strict';
    
    // Remove the setupMapPicker call that's causing the error
    // The map picker is already initialized by map-location-picker.js
    
    console.log('✅ List vehicle fix applied - map picker handled by map-location-picker.js');
    
    // If the old setupMapPicker function exists, remove it
    if (typeof window.setupMapPicker !== 'undefined') {
        delete window.setupMapPicker;
        console.log('✅ Removed duplicate setupMapPicker function');
    }
    
})();

    // Dynamic pricing suggestions
    function setupDynamicPricing() {
        const dailyPriceInput = document.getElementById('dailyPrice');
        if (!dailyPriceInput) return;
        
        // Add pricing helper
        const pricingHelper = document.createElement('div');
        pricingHelper.className = 'pricing-helper';
        pricingHelper.innerHTML = `
            <div class="price-comparison">
                <span class="comparison-text">Similar vehicles earn:</span>
                <span class="comparison-value">$25-35/day</span>
            </div>
            <div class="price-slider">
                <span>Low</span>
                <div class="slider-track">
                    <div class="slider-fill"></div>
                    <div class="slider-thumb"></div>
                </div>
                <span>High</span>
            </div>
        `;
        
        pricingHelper.style.cssText = `
            margin-top: 1rem;
            padding: 1rem;
            background: var(--light-gray);
            border-radius: 8px;
            font-size: 0.9rem;
        `;
        
        dailyPriceInput.parentElement.appendChild(pricingHelper);
        
        // Update comparison based on input
        dailyPriceInput.addEventListener('input', function() {
            const value = parseFloat(this.value);
            const sliderFill = pricingHelper.querySelector('.slider-fill');
            const sliderThumb = pricingHelper.querySelector('.slider-thumb');
            
            if (value) {
                const percentage = Math.min((value / 50) * 100, 100);
                sliderFill.style.width = percentage + '%';
                sliderThumb.style.left = percentage + '%';
                
                // Update recommendation
                let recommendation = '';
                if (value < 10) {
                    recommendation = 'Below market average';
                    sliderFill.style.background = 'var(--warning)';
                } else if (value < 30) {
                    recommendation = 'Good competitive price';
                    sliderFill.style.background = 'var(--success)';
                } else {
                    recommendation = 'Premium pricing';
                    sliderFill.style.background = 'var(--primary-blue)';
                }
                
                const comparisonText = pricingHelper.querySelector('.comparison-text');
                comparisonText.textContent = recommendation;
            }
        });
    }

    // Add necessary styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInScale {
            from {
                opacity: 0;
                transform: scale(0.8);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        @keyframes fadeOutScale {
            from {
                opacity: 1;
                transform: scale(1);
            }
            to {
                opacity: 0;
                transform: scale(0.8);
            }
        }
        
        @keyframes slideOutDown {
            from {
                transform: translateY(0);
                opacity: 1;
            }
            to {
                transform: translateY(100px);
                opacity: 0;
            }
        }
        
        @keyframes bounceIn {
            0% {
                transform: scale(0);
                opacity: 0;
            }
            50% {
                transform: scale(1.1);
            }
            100% {
                transform: scale(1);
                opacity: 1;
            }
        }
        
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
        }
        
        @keyframes shake {
            0%, 100% {
                transform: translateX(0);
            }
            25% {
                transform: translateX(-10px);
            }
            75% {
                transform: translateX(10px);
            }
        }
        
        @keyframes slideInLeft {
            from {
                transform: translateX(-20px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
        
        .photo-preview.enhanced {
            position: relative;
            overflow: hidden;
            border-radius: 12px;
        }
        
        .photo-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
            color: white;
            padding: 1rem;
            transform: translateY(100%);
            transition: transform 0.3s ease;
        }
        
        .photo-preview:hover .photo-overlay {
            transform: translateY(0);
        }
        
        .photo-progress {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: var(--border-light);
        }
        
        .progress-bar {
            height: 100%;
            background: var(--success);
            width: 0;
            transition: width 1s ease;
        }
        
        .success-screen {
            text-align: center;
            padding: 3rem;
        }
        
        .success-icon {
            font-size: 5rem;
            color: var(--success);
            margin-bottom: 2rem;
            animation: bounceIn 0.8s ease;
        }
        
        .success-details {
            background: var(--light-gray);
            padding: 2rem;
            border-radius: 12px;
            margin: 2rem 0;
        }
        
        .detail-item {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            margin: 1rem 0;
            color: var(--text-dark);
        }
        
        .success-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .map-placeholder,
        .lightbox-content {
            text-align: center;
            padding: 3rem;
            background: white;
            border-radius: 20px;
        }
        
        .map-placeholder i {
            font-size: 4rem;
            color: var(--primary-orange);
            margin-bottom: 1rem;
        }
        
        .lightbox-content img {
            max-width: 90vw;
            max-height: 90vh;
            border-radius: 12px;
        }
        
        .lightbox-close {
            position: absolute;
            top: 20px;
            right: 40px;
            background: none;
            border: none;
            color: white;
            font-size: 3rem;
            cursor: pointer;
        }
        
        .price-slider {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-top: 1rem;
        }
        
        .slider-track {
            flex: 1;
            height: 5px;
            background: var(--border-light);
            border-radius: 5px;
            position: relative;
        }
        
        .slider-fill {
            height: 100%;
            background: var(--primary-orange);
            border-radius: 5px;
            transition: all 0.3s ease;
        }
        
        .slider-thumb {
            position: absolute;
            top: -5px;
            width: 15px;
            height: 15px;
            background: white;
            border: 2px solid var(--primary-orange);
            border-radius: 50%;
            transition: left 0.3s ease;
        }
        
        @media (max-width: 768px) {
            .success-screen {
                padding: 1.5rem;
            }
            
            .map-placeholder {
                padding: 2rem;
            }
        }
    `;
    document.head.appendChild(style);

    console.log('✓ Complete List Vehicle system loaded');
    
})();