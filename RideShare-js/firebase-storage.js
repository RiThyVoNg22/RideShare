// firebase-storage.js - Firebase Storage Service for Images and Files

// ===============================
// Image Upload Functions
// ===============================

/**
 * Upload image to Firebase Storage
 * @param {File} file - Image file to upload
 * @param {string} folder - Storage folder path
 * @returns {Promise<string>} Download URL
 */
async function uploadImage(file, folder = 'general') {
    try {
        // Validate file
        if (!validateImageFile(file)) {
            throw new Error('Invalid file type. Please upload an image (JPG, PNG, GIF)');
        }
        
        // Check file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            throw new Error('File size too large. Maximum size is 5MB');
        }
        
        // Generate unique filename
        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.name}`;
        const filePath = `${folder}/${fileName}`;
        
        // Create storage reference
        const storageRef = storage.ref(filePath);
        
        // Upload file with metadata
        const metadata = {
            contentType: file.type,
            customMetadata: {
                uploadedBy: auth.currentUser?.uid || 'anonymous',
                uploadedAt: new Date().toISOString()
            }
        };
        
        // Show upload progress
        const uploadTask = storageRef.put(file, metadata);
        
        return new Promise((resolve, reject) => {
            uploadTask.on('state_changed',
                (snapshot) => {
                    // Progress callback
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload progress: ${progress}%`);
                    
                    // Update progress UI if available
                    const progressBar = document.querySelector('.upload-progress');
                    if (progressBar) {
                        progressBar.style.width = `${progress}%`;
                    }
                },
                (error) => {
                    // Error callback
                    console.error('Upload error:', error);
                    reject(error);
                },
                async () => {
                    // Success callback
                    const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                    console.log('File uploaded successfully:', downloadURL);
                    resolve(downloadURL);
                }
            );
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        showMessage(error.message || 'Error uploading image', 'error');
        throw error;
    }
}

/**
 * Upload multiple images
 * @param {FileList|Array} files - Multiple image files
 * @param {string} folder - Storage folder path
 * @returns {Promise<Array>} Array of download URLs
 */
async function uploadMultipleImages(files, folder = 'general') {
    try {
        const uploadPromises = [];
        const fileArray = Array.from(files);
        
        for (const file of fileArray) {
            uploadPromises.push(uploadImage(file, folder));
        }
        
        const urls = await Promise.all(uploadPromises);
        return urls;
    } catch (error) {
        console.error('Error uploading multiple images:', error);
        throw error;
    }
}

/**
 * Upload vehicle images
 * @param {string} vehicleId - Vehicle document ID
 * @param {FileList|Array} files - Vehicle image files
 * @returns {Promise<Array>} Array of image URLs
 */
async function uploadVehicleImages(vehicleId, files) {
    try {
        const folder = `vehicles/${vehicleId}`;
        const urls = await uploadMultipleImages(files, folder);
        
        // Update vehicle document with image URLs
        await db.collection('vehicles').doc(vehicleId).update({
            images: firebase.firestore.FieldValue.arrayUnion(...urls),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showMessage('Vehicle images uploaded successfully!', 'success');
        return urls;
    } catch (error) {
        console.error('Error uploading vehicle images:', error);
        showMessage('Error uploading vehicle images', 'error');
        throw error;
    }
}

/**
 * Upload profile picture
 * @param {File} file - Profile picture file
 * @returns {Promise<string>} Profile picture URL
 */
async function uploadProfilePicture(file) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User must be logged in');
        
        const folder = `profiles/${user.uid}`;
        const url = await uploadImage(file, folder);
        
        // Update user profile with new picture
        await updateUserProfile(user.uid, {
            profilePicture: url
        });
        
        // Update Firebase Auth profile
        await user.updateProfile({
            photoURL: url
        });
        
        showMessage('Profile picture updated successfully!', 'success');
        return url;
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        showMessage('Error uploading profile picture', 'error');
        throw error;
    }
}

/**
 * Upload ID verification documents
 * @param {Object} documents - ID verification documents
 * @returns {Promise<Object>} Document URLs
 */
async function uploadIdVerificationDocs(documents) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User must be logged in');
        
        const folder = `verification/${user.uid}`;
        const urls = {};
        
        // Upload front of ID
        if (documents.idFront) {
            urls.idFront = await uploadImage(documents.idFront, folder);
        }
        
        // Upload back of ID
        if (documents.idBack) {
            urls.idBack = await uploadImage(documents.idBack, folder);
        }
        
        // Upload selfie with ID
        if (documents.selfieWithId) {
            urls.selfieWithId = await uploadImage(documents.selfieWithId, folder);
        }
        
        // Upload driving license if provided
        if (documents.drivingLicense) {
            urls.drivingLicense = await uploadImage(documents.drivingLicense, folder);
        }
        
        // Create verification request
        await db.collection('verifications').add({
            userId: user.uid,
            documents: urls,
            status: 'pending', // pending, approved, rejected
            submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
            type: 'id_verification'
        });
        
        // Update user profile
        await updateUserProfile(user.uid, {
            idVerificationStatus: 'pending',
            idVerificationDocs: urls
        });
        
        showMessage('Verification documents submitted successfully!', 'success');
        return urls;
    } catch (error) {
        console.error('Error uploading verification documents:', error);
        showMessage('Error uploading verification documents', 'error');
        throw error;
    }
}

// ===============================
// Image Management Functions
// ===============================

/**
 * Delete image from Firebase Storage
 * @param {string} imageUrl - Image URL to delete
 */
async function deleteImage(imageUrl) {
    try {
        // Get reference from URL
        const imageRef = storage.refFromURL(imageUrl);
        await imageRef.delete();
        console.log('Image deleted successfully');
    } catch (error) {
        console.error('Error deleting image:', error);
        throw error;
    }
}

/**
 * Delete multiple images
 * @param {Array} imageUrls - Array of image URLs
 */
async function deleteMultipleImages(imageUrls) {
    try {
        const deletePromises = imageUrls.map(url => deleteImage(url));
        await Promise.all(deletePromises);
        console.log('All images deleted successfully');
    } catch (error) {
        console.error('Error deleting multiple images:', error);
        throw error;
    }
}

/**
 * Compress image before upload
 * @param {File} file - Image file
 * @param {number} maxWidth - Maximum width
 * @param {number} quality - Compression quality (0-1)
 * @returns {Promise<Blob>} Compressed image blob
 */
async function compressImage(file, maxWidth = 1200, quality = 0.8) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Calculate new dimensions
                let width = img.width;
                let height = img.height;
                
                if (width > maxWidth) {
                    height = (maxWidth / width) * height;
                    width = maxWidth;
                }
                
                canvas.width = width;
                canvas.height = height;
                
                // Draw and compress
                ctx.drawImage(img, 0, 0, width, height);
                
                canvas.toBlob((blob) => {
                    resolve(blob);
                }, file.type, quality);
            };
            
            img.onerror = reject;
        };
        
        reader.onerror = reject;
    });
}

/**
 * Generate thumbnail for image
 * @param {string} imageUrl - Original image URL
 * @param {number} size - Thumbnail size
 * @returns {Promise<string>} Thumbnail URL
 */
async function generateThumbnail(imageUrl, size = 200) {
    // In production, this would be handled by Firebase Functions
    // For now, return the same URL
    // You can implement client-side thumbnail generation if needed
    return imageUrl;
}

// ===============================
// File Validation
// ===============================

/**
 * Validate image file
 * @param {File} file - File to validate
 * @returns {boolean} Is valid image
 */
function validateImageFile(file) {
    const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    return acceptedTypes.includes(file.type);
}

/**
 * Validate document file
 * @param {File} file - File to validate
 * @returns {boolean} Is valid document
 */
function validateDocumentFile(file) {
    const acceptedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    return acceptedTypes.includes(file.type);
}

// ===============================
// Storage URL Management
// ===============================

/**
 * Get storage reference from URL
 * @param {string} url - Storage URL
 * @returns {Reference} Storage reference
 */
function getStorageRef(url) {
    try {
        return storage.refFromURL(url);
    } catch (error) {
        console.error('Error getting storage reference:', error);
        return null;
    }
}

/**
 * Get file metadata
 * @param {string} url - Storage URL
 * @returns {Promise<Object>} File metadata
 */
async function getFileMetadata(url) {
    try {
        const ref = getStorageRef(url);
        if (ref) {
            const metadata = await ref.getMetadata();
            return metadata;
        }
        return null;
    } catch (error) {
        console.error('Error getting file metadata:', error);
        return null;
    }
}

// ===============================
// Cleanup Functions
// ===============================

/**
 * Clean up orphaned images (not referenced in database)
 * Admin function - should be run periodically
 */
async function cleanupOrphanedImages() {
    try {
        // This should ideally be done server-side with Cloud Functions
        console.log('Cleanup function should be implemented server-side');
    } catch (error) {
        console.error('Error cleaning up images:', error);
    }
}