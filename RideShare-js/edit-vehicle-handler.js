// edit-vehicle-handler.js - Pre-fill form when editing vehicle

(function() {
    'use strict';
    
    // Check if we're in edit mode
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    
    if (editId) {
        console.log('Edit mode detected for vehicle:', editId);
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initEditMode);
        } else {
            initEditMode();
        }
    }
    
    async function initEditMode() {
        try {
            // Get vehicle data from sessionStorage
            const editDataStr = sessionStorage.getItem('editVehicle');
            
            if (!editDataStr) {
                console.error('No edit data found');
                showNotification({
                    type: 'error',
                    title: 'Error',
                    message: 'Vehicle data not found. Please try again.',
                    duration: 3000
                });
                return;
            }
            
            const vehicle = JSON.parse(editDataStr);
            console.log('Loading vehicle data:', vehicle);
            
            // Show loading notification
            showNotification({
                type: 'info',
                title: 'Loading',
                message: 'Pre-filling form with vehicle data...',
                duration: 2000
            });
            
            // Wait a bit for the form to render
            setTimeout(() => {
                prefillForm(vehicle);
            }, 500);
            
        } catch (error) {
            console.error('Error loading edit data:', error);
            showNotification({
                type: 'error',
                title: 'Load Error',
                message: 'Unable to load vehicle data',
                duration: 3000
            });
        }
    }
    
    function prefillForm(vehicle) {
        console.log('Pre-filling form with:', vehicle);
        
        // Basic Information
        setFieldValue('vehicleTitle', vehicle.name);
        setFieldValue('vehicleName', vehicle.name);
        setFieldValue('vehicleType', vehicle.type);
        
        // Details
        setFieldValue('brand', vehicle.brand);
        setFieldValue('model', vehicle.model);
        setFieldValue('year', vehicle.year);
        setFieldValue('description', vehicle.description);
        
        // Location
        setFieldValue('location', vehicle.location);
        setFieldValue('district', vehicle.district);
        setFieldValue('address', vehicle.address);
        setFieldValue('pickupLocation', vehicle.address);
        
        // Pricing
        setFieldValue('dailyPrice', vehicle.pricePerDay);
        setFieldValue('pricePerDay', vehicle.pricePerDay);
        setFieldValue('depositAmount', vehicle.deposit);
        setFieldValue('deposit', vehicle.deposit);
        
        // Availability
        setFieldValue('availableFrom', vehicle.availableFrom);
        setFieldValue('availableUntil', vehicle.availableUntil);
        
        // Features (checkboxes)
        if (vehicle.features && Array.isArray(vehicle.features)) {
            vehicle.features.forEach(feature => {
                const checkbox = document.querySelector(`input[type="checkbox"][value="${feature}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        }
        
        // Images - Show existing images
        if (vehicle.images && Array.isArray(vehicle.images)) {
            displayExistingImages(vehicle.images);
        }
        
        // Update page title
        const pageTitle = document.querySelector('h1, .page-title');
        if (pageTitle) {
            pageTitle.textContent = 'Edit Your Vehicle';
        }
        
        // Update submit button
        const submitBtn = document.querySelector('button[type="submit"], .submit-btn');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Vehicle';
            submitBtn.style.background = '#17a2b8';
        }
        
        // Change form submission to update instead of create
        interceptFormSubmit(vehicle.id);
        
        showNotification({
            type: 'success',
            title: 'Ready to Edit',
            message: 'Form loaded with vehicle information. Make your changes and click Update.',
            duration: 4000
        });
    }
    
    function setFieldValue(fieldId, value) {
        const field = document.getElementById(fieldId);
        if (field && value !== undefined && value !== null) {
            field.value = value;
            console.log(`Set ${fieldId} = ${value}`);
            
            // Trigger change event for any listeners
            field.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }
    
    function displayExistingImages(images) {
        const photoPreview = document.getElementById('photoPreview') || document.getElementById('imagePreview');
        if (!photoPreview) return;
        
        photoPreview.innerHTML = '';
        
        images.forEach((imageUrl, index) => {
            const previewDiv = document.createElement('div');
            previewDiv.className = 'photo-preview enhanced';
            previewDiv.innerHTML = `
                <img src="${imageUrl}" alt="Vehicle image ${index + 1}">
                <div class="photo-overlay">
                    <span class="photo-name">Existing Image ${index + 1}</span>
                    <div class="photo-actions">
                        <button class="photo-remove" onclick="removeEditImage(${index})">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            `;
            photoPreview.appendChild(previewDiv);
        });
    }
    
    // Global function to remove images during edit
    window.removeEditImage = function(index) {
        const editDataStr = sessionStorage.getItem('editVehicle');
        if (editDataStr) {
            const vehicle = JSON.parse(editDataStr);
            vehicle.images.splice(index, 1);
            sessionStorage.setItem('editVehicle', JSON.stringify(vehicle));
            displayExistingImages(vehicle.images);
            
            showNotification({
                type: 'info',
                title: 'Image Removed',
                message: 'Image will be removed when you update',
                duration: 2000
            });
        }
    };
    
    function interceptFormSubmit(vehicleId) {
        const form = document.getElementById('listVehicleForm');
        if (!form) {
            console.error('Form not found');
            return;
        }
        
        // Remove existing submit listeners
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);
        
        // Add new submit handler for update
        newForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            await handleVehicleUpdate(vehicleId, newForm);
        });
        
        console.log('Form intercepted for update mode');
    }
    
    async function handleVehicleUpdate(vehicleId, form) {
        try {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
            }
            
            showNotification({
                type: 'info',
                title: 'Updating Vehicle',
                message: 'Saving your changes...',
                duration: 2000
            });
            
            // Get current user
            const user = firebase.auth().currentUser;
            if (!user) {
                throw new Error('You must be logged in to update a vehicle');
            }
            
            // Collect form data
            const formData = new FormData(form);
            const editDataStr = sessionStorage.getItem('editVehicle');
            const existingVehicle = editDataStr ? JSON.parse(editDataStr) : {};
            
            // Prepare update data
            const updateData = {
                name: formData.get('vehicleTitle') || formData.get('vehicleName'),
                type: formData.get('vehicleType'),
                brand: formData.get('brand'),
                model: formData.get('model'),
                year: parseInt(formData.get('year')),
                description: formData.get('description'),
                location: formData.get('location'),
                district: formData.get('district'),
                address: formData.get('address') || formData.get('pickupLocation'),
                pricePerDay: parseFloat(formData.get('dailyPrice') || formData.get('pricePerDay')),
                deposit: parseFloat(formData.get('depositAmount') || formData.get('deposit')),
                availableFrom: formData.get('availableFrom'),
                availableUntil: formData.get('availableUntil'),
                features: formData.getAll('features[]') || existingVehicle.features || [],
                images: existingVehicle.images || [],
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            // Update in Firestore
            await firebase.firestore()
                .collection('vehicles')
                .doc(vehicleId)
                .update(updateData);
            
            console.log('Vehicle updated successfully!');
            
            // Clear edit data
            sessionStorage.removeItem('editVehicle');
            
            // Show success
            showNotification({
                type: 'success',
                title: '✓ Vehicle Updated!',
                message: `${updateData.name} has been updated successfully`,
                duration: 5000,
                action: {
                    text: 'View Profile',
                    onClick: function() {
                        window.location.href = 'home.html';
                    }
                }
            });
            
            // Redirect after delay
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 3000);
            
        } catch (error) {
            console.error('Error updating vehicle:', error);
            
            showNotification({
                type: 'error',
                title: 'Update Failed',
                message: error.message || 'Unable to update vehicle. Please try again.',
                duration: 5000
            });
            
            // Re-enable button
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Vehicle';
            }
        }
    }
    
    console.log('✓ Edit vehicle handler loaded');
    
})();