// verify-id.js - ID Verification Handler

let uploadedFiles = {
    idFront: null,
    idBack: null,
    selfieWithId: null,
    drivingLicense: null
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Show loading state while checking auth
    showLoadingState();
    
    // Wait for Firebase Auth to be ready
    checkAuthStatus();
});

// Show loading state
function showLoadingState() {
    const container = document.querySelector('.verification-container');
    if (container) {
        container.style.opacity = '0.5';
        container.style.pointerEvents = 'none';
    }
}

// Hide loading state
function hideLoadingState() {
    const container = document.querySelector('.verification-container');
    if (container) {
        container.style.opacity = '1';
        container.style.pointerEvents = 'auto';
    }
}

// Check if user is authenticated
function checkAuthStatus() {
    // Use onAuthStateChanged to wait for auth to be ready
    auth.onAuthStateChanged(async (user) => {
        if (!user) {
            // User is not logged in - show alert
            const authAlert = document.getElementById('authAlert');
            if (authAlert) {
                authAlert.style.display = 'block';
            }
            
            // Also blur/disable the verification form
            const verificationCard = document.querySelector('.verification-card');
            if (verificationCard) {
                verificationCard.style.opacity = '0.5';
                verificationCard.style.pointerEvents = 'none';
            }
            
            showMessage('Please login to verify your ID', 'warning');
            
            // Redirect after 3 seconds
            setTimeout(() => {
                window.location.href = 'auth.html';
            }, 3000);
        } else {
            // User is logged in - hide loading and setup page
            const authAlert = document.getElementById('authAlert');
            if (authAlert) {
                authAlert.style.display = 'none';
            }
            
            hideLoadingState();
            setupFileUploads();
            setupFormSubmission();
            await setupAccountTypeCheck();
            
            console.log('User authenticated:', user.email);
        }
    });
}

// Check account type and show driving license if needed
async function setupAccountTypeCheck() {
    const user = auth.currentUser;
    if (user) {
        const userData = await getUserFromFirestore(user.uid);
        if (userData && (userData.accountType === 'list' || userData.accountType === 'both')) {
            document.getElementById('licenseGroup').style.display = 'block';
        }
    }
}

// Setup file upload handlers
function setupFileUploads() {
    setupSingleUpload('idFront', 'frontUploadArea', 'frontPreview');
    setupSingleUpload('idBack', 'backUploadArea', 'backPreview');
    setupSingleUpload('selfieWithId', 'selfieUploadArea', 'selfiePreview');
    setupSingleUpload('drivingLicense', 'licenseUploadArea', 'licensePreview');
}

// Setup individual file upload
function setupSingleUpload(inputId, areaId, previewId) {
    const input = document.getElementById(inputId);
    const area = document.getElementById(areaId);
    const preview = document.getElementById(previewId);
    
    if (!input || !area) return;
    
    // Click to upload
    area.addEventListener('click', () => input.click());
    
    // Drag and drop
    area.addEventListener('dragover', (e) => {
        e.preventDefault();
        area.classList.add('dragover');
    });
    
    area.addEventListener('dragleave', () => {
        area.classList.remove('dragover');
    });
    
    area.addEventListener('drop', (e) => {
        e.preventDefault();
        area.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0], inputId, area, preview);
        }
    });
    
    // File input change
    input.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileSelect(e.target.files[0], inputId, area, preview);
        }
    });
}

// Handle file selection
function handleFileSelect(file, inputId, area, preview) {
    // Validate file
    if (!validateFile(file)) {
        showMessage('Invalid file type. Please upload an image (JPG, PNG) or PDF', 'error');
        return;
    }
    
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        showMessage('File size too large. Maximum size is 5MB', 'error');
        return;
    }
    
    // Store file
    uploadedFiles[inputId] = file;
    
    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
        preview.innerHTML = `
            <div class="preview-image">
                <img src="${e.target.result}" alt="Preview">
                <button type="button" class="remove-image" onclick="removeFile('${inputId}', '${preview.id}')">
                    <i class="fas fa-times"></i>
                </button>
                <div class="file-info">
                    <i class="fas fa-check-circle"></i>
                    <span>${file.name}</span>
                </div>
            </div>
        `;
        preview.style.display = 'block';
        area.classList.add('has-file');
    };
    reader.readAsDataURL(file);
}

// Remove uploaded file
function removeFile(inputId, previewId) {
    uploadedFiles[inputId] = null;
    document.getElementById(inputId).value = '';
    
    const preview = document.getElementById(previewId);
    preview.innerHTML = '';
    preview.style.display = 'none';
    
    const area = preview.parentElement;
    area.classList.remove('has-file');
}

// Validate file type
function validateFile(file) {
    const acceptedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    return acceptedTypes.includes(file.type);
}

// Setup form submission
function setupFormSubmission() {
    const form = document.getElementById('verificationForm');
    
    if (!form) {
        console.error('Verification form not found!');
        return;
    }
    
    console.log('✅ Form submission handler attached');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        console.log('📝 Form submitted!');
        console.log('Uploaded files:', uploadedFiles);
        
        const idType = document.getElementById('idType').value;
        console.log('Selected ID type:', idType);
        
        // Validation with detailed logging
        if (!idType) {
            console.log('❌ Validation failed: No ID type selected');
            showMessage('Please select an ID type', 'error');
            return;
        }
        
        if (!uploadedFiles.idFront) {
            console.log('❌ Validation failed: No front ID uploaded');
            showMessage('Please upload the front of your ID', 'error');
            return;
        }
        
        if (!uploadedFiles.idBack) {
            console.log('❌ Validation failed: No back ID uploaded');
            showMessage('Please upload the back of your ID', 'error');
            return;
        }
        
        if (!uploadedFiles.selfieWithId) {
            console.log('❌ Validation failed: No selfie uploaded');
            showMessage('Please upload a selfie holding your ID', 'error');
            return;
        }
        
        console.log('✅ All validations passed!');
        
        // Check if license is required
        try {
            const userData = await getUserFromFirestore(auth.currentUser.uid);
            if (userData && (userData.accountType === 'list' || userData.accountType === 'both')) {
                if (!uploadedFiles.drivingLicense) {
                    const proceed = confirm('Driving license is recommended for listing vehicles. Continue without it?');
                    if (!proceed) {
                        console.log('User cancelled due to missing license');
                        return;
                    }
                }
            }
        } catch (error) {
            console.warn('Could not check account type:', error);
        }
        
        console.log('🚀 Starting verification submission...');
        await submitVerification(idType);
    });
    
    // Also add click handler to button as backup
    const submitBtn = document.getElementById('submitVerification');
    if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
            console.log('Submit button clicked!');
            // Check if it's not already submitting via form
            if (e.target.type !== 'submit') {
                form.dispatchEvent(new Event('submit'));
            }
        });
    }
}

// Submit verification documents
async function submitVerification(idType) {
    const submitBtn = document.getElementById('submitVerification');
    const progressContainer = document.querySelector('.upload-progress-container');
    const progressFill = document.querySelector('.upload-progress-fill');
    const statusText = document.querySelector('.upload-status');
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
    
    // Show progress bar
    progressContainer.style.display = 'block';
    
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');
        
        console.log('📤 Starting file uploads...');
        
        // Check if uploadImage function exists
        if (typeof uploadImage !== 'function') {
            throw new Error('Upload function not available. Please make sure firebase-storage.js is loaded.');
        }
        
        const folder = `verification/${user.uid}`;
        const urls = {};
        let uploadedCount = 0;
        const totalFiles = Object.values(uploadedFiles).filter(f => f !== null).length;
        
        console.log(`Total files to upload: ${totalFiles}`);
        
        // Upload each file
        for (const [key, file] of Object.entries(uploadedFiles)) {
            if (file) {
                console.log(`📤 Uploading ${key}...`);
                statusText.textContent = `Uploading ${key}...`;
                
                try {
                    urls[key] = await uploadImage(file, folder);
                    console.log(`✅ ${key} uploaded successfully`);
                } catch (uploadError) {
                    console.error(`❌ Failed to upload ${key}:`, uploadError);
                    throw new Error(`Failed to upload ${key}: ${uploadError.message}`);
                }
                
                uploadedCount++;
                
                const progress = (uploadedCount / totalFiles) * 100;
                progressFill.style.width = `${progress}%`;
                console.log(`Progress: ${progress.toFixed(0)}%`);
            }
        }
        
        console.log('✅ All files uploaded successfully');
        statusText.textContent = 'Creating verification request...';
        
        // Create verification request in Firestore
        await db.collection('verifications').add({
            userId: user.uid,
            idType: idType,
            documents: urls,
            status: 'pending',
            submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
            type: 'id_verification'
        });
        
        console.log('✅ Verification request created');
        
        // Update user profile
        await updateUserProfile(user.uid, {
            idVerificationStatus: 'pending',
            idVerificationDocs: urls,
            idType: idType
        });
        
        console.log('✅ User profile updated');
        
        // Show success
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Submitted!';
        submitBtn.style.background = '#28a745';
        progressContainer.style.display = 'none';
        
        // Show success modal
        const successModal = document.getElementById('successModal');
        if (successModal) {
            successModal.style.display = 'flex';
        }
        
        console.log('🎉 Verification submitted successfully!');
        
    } catch (error) {
        console.error('❌ Verification submission error:', error);
        console.error('Error details:', {
            code: error.code,
            message: error.message,
            stack: error.stack
        });
        
        let errorMessage = 'Error submitting verification documents. ';
        
        if (error.message.includes('Upload function not available')) {
            errorMessage += 'Storage service not loaded. Please refresh the page.';
        } else if (error.code === 'permission-denied') {
            errorMessage += 'Permission denied. Please check your account settings.';
        } else {
            errorMessage += error.message || 'Please try again.';
        }
        
        showMessage(errorMessage, 'error');
        
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Submit for Verification';
        submitBtn.style.background = '';
        progressContainer.style.display = 'none';
    }
}

// Skip verification (for now)
function skipVerification() {
    const user = auth.currentUser;
    if (user) {
        // Update user profile to indicate they skipped verification
        updateUserProfile(user.uid, {
            idVerificationStatus: 'skipped',
            verificationSkippedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showMessage('You can verify your ID later from your profile settings', 'info');
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 2000);
    }
}

// Complete verification and redirect
function completeVerification() {
    window.location.href = 'home.html';
}

// Show message helper
function showMessage(message, type = 'info') {
    const existingMessage = document.querySelector('.auth-message');
    if (existingMessage) existingMessage.remove();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `auth-message auth-message-${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 10000;
        animation: slideDown 0.3s ease;
    `;
    
    if (type === 'success') {
        messageDiv.style.background = '#28a745';
        messageDiv.style.color = 'white';
    } else if (type === 'error') {
        messageDiv.style.background = '#dc3545';
        messageDiv.style.color = 'white';
    } else if (type === 'warning') {
        messageDiv.style.background = '#ffc107';
        messageDiv.style.color = '#333';
    } else {
        messageDiv.style.background = '#17a2b8';
        messageDiv.style.color = 'white';
    }
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
}

// Make functions globally available
window.removeFile = removeFile;
window.skipVerification = skipVerification;
window.completeVerification = completeVerification;