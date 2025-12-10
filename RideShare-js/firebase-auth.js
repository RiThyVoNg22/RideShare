// firebase-auth.js - Firebase Authentication Service

// ===============================
// Authentication Functions
// ===============================

/**
 * Register a new user with email and password
 * @param {Object} userData - User registration data
 * @returns {Promise} Firebase user object
 */
async function registerWithEmail(userData) {
    try {
        // Create user with email and password
        const userCredential = await auth.createUserWithEmailAndPassword(
            userData.email,
            userData.password
        );
        
        const user = userCredential.user;
        
        // Send email verification
        await user.sendEmailVerification();
        
        // Create user profile in Firestore
        await createUserProfile(user.uid, {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phone: userData.phone,
            accountType: userData.accountType,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            emailVerified: false,
            idVerified: false,
            profileComplete: false,
            rating: 0,
            totalRentals: 0,
            totalListings: 0
        });
        
        // Update display name
        await user.updateProfile({
            displayName: `${userData.firstName} ${userData.lastName}`
        });
        
        showMessage('Registration successful! Please check your email for verification.', 'success');
        return user;
        
    } catch (error) {
        console.error('Registration error:', error);
        handleAuthError(error);
        throw error;
    }
}

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} Firebase user object
 */
async function loginWithEmail(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Check if email is verified
        if (!user.emailVerified) {
            showMessage('Please verify your email before logging in. Check your inbox.', 'warning');
            // Optionally resend verification email
            const resend = confirm('Would you like us to resend the verification email?');
            if (resend) {
                await user.sendEmailVerification();
                showMessage('Verification email sent!', 'success');
            }
            await auth.signOut();
            return null;
        }
        
        // Update last login time
        await updateUserProfile(user.uid, {
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showMessage('Login successful!', 'success');
        return user;
        
    } catch (error) {
        console.error('Login error:', error);
        handleAuthError(error);
        throw error;
    }
}

/**
 * Login/Register with Google
 * @returns {Promise} Firebase user object
 */
async function loginWithGoogle() {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        
        const result = await auth.signInWithPopup(provider);
        const user = result.user;
        const isNewUser = result.additionalUserInfo.isNewUser;
        
        if (isNewUser) {
            // Create profile for new Google users
            const profile = result.additionalUserInfo.profile;
            await createUserProfile(user.uid, {
                firstName: profile.given_name || '',
                lastName: profile.family_name || '',
                email: user.email,
                phone: '',
                accountType: 'both', // Default for social login
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                emailVerified: true, // Google emails are pre-verified
                idVerified: false,
                profileComplete: false,
                profilePicture: user.photoURL || '',
                rating: 0,
                totalRentals: 0,
                totalListings: 0,
                authProvider: 'google'
            });
            showMessage('Welcome to RideShare Local! Please complete your profile.', 'success');
        } else {
            // Update existing user's last login
            await updateUserProfile(user.uid, {
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            });
            showMessage('Welcome back!', 'success');
        }
        
        return user;
        
    } catch (error) {
        console.error('Google login error:', error);
        handleAuthError(error);
        throw error;
    }
}

/**
 * Login/Register with Facebook
 * @returns {Promise} Firebase user object
 */
async function loginWithFacebook() {
    try {
        const provider = new firebase.auth.FacebookAuthProvider();
        provider.addScope('email');
        provider.addScope('public_profile');
        
        const result = await auth.signInWithPopup(provider);
        const user = result.user;
        const isNewUser = result.additionalUserInfo.isNewUser;
        
        if (isNewUser) {
            // Create profile for new Facebook users
            const profile = result.additionalUserInfo.profile;
            await createUserProfile(user.uid, {
                firstName: profile.first_name || '',
                lastName: profile.last_name || '',
                email: user.email || '',
                phone: '',
                accountType: 'both',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                emailVerified: true,
                idVerified: false,
                profileComplete: false,
                profilePicture: user.photoURL || '',
                rating: 0,
                totalRentals: 0,
                totalListings: 0,
                authProvider: 'facebook'
            });
            showMessage('Welcome to RideShare Local! Please complete your profile.', 'success');
        } else {
            await updateUserProfile(user.uid, {
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            });
            showMessage('Welcome back!', 'success');
        }
        
        return user;
        
    } catch (error) {
        console.error('Facebook login error:', error);
        handleAuthError(error);
        throw error;
    }
}

/**
 * Send password reset email
 * @param {string} email - User email
 */
async function sendPasswordReset(email) {
    try {
        await auth.sendPasswordResetEmail(email);
        showMessage('Password reset email sent! Check your inbox.', 'success');
    } catch (error) {
        console.error('Password reset error:', error);
        handleAuthError(error);
        throw error;
    }
}

/**
 * Logout current user
 */
async function handleLogout() {
    try {
        await auth.signOut();
        showMessage('Logged out successfully', 'success');
        // Redirect to home page
        if (window.location.pathname !== '/home.html') {
            window.location.href = 'home.html';
        }
    } catch (error) {
        console.error('Logout error:', error);
        showMessage('Error logging out. Please try again.', 'error');
    }
}

/**
 * Update user password
 * @param {string} newPassword - New password
 */
async function updatePassword(newPassword) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('No user logged in');
        
        await user.updatePassword(newPassword);
        showMessage('Password updated successfully!', 'success');
    } catch (error) {
        console.error('Password update error:', error);
        if (error.code === 'auth/requires-recent-login') {
            showMessage('Please log in again before changing your password.', 'warning');
            // You might want to implement reauthentication here
        } else {
            handleAuthError(error);
        }
        throw error;
    }
}

/**
 * Delete user account
 */
async function deleteAccount() {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('No user logged in');
        
        const confirmation = confirm('Are you sure you want to delete your account? This action cannot be undone.');
        if (!confirmation) return;
        
        // Delete user data from Firestore
        await deleteUserProfile(user.uid);
        
        // Delete user authentication
        await user.delete();
        
        showMessage('Account deleted successfully.', 'success');
        window.location.href = 'home.html';
        
    } catch (error) {
        console.error('Account deletion error:', error);
        if (error.code === 'auth/requires-recent-login') {
            showMessage('Please log in again before deleting your account.', 'warning');
        } else {
            handleAuthError(error);
        }
        throw error;
    }
}

/**
 * Resend email verification
 */
async function resendVerificationEmail() {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('No user logged in');
        
        await user.sendEmailVerification();
        showMessage('Verification email sent!', 'success');
    } catch (error) {
        console.error('Verification email error:', error);
        handleAuthError(error);
        throw error;
    }
}

/**
 * Reauthenticate user (for sensitive operations)
 * @param {string} password - User's current password
 */
async function reauthenticateUser(password) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('No user logged in');
        
        const credential = firebase.auth.EmailAuthProvider.credential(
            user.email,
            password
        );
        
        await user.reauthenticateWithCredential(credential);
        return true;
    } catch (error) {
        console.error('Reauthentication error:', error);
        handleAuthError(error);
        throw error;
    }
}

/**
 * Update user email
 * @param {string} newEmail - New email address
 */
async function updateEmail(newEmail) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('No user logged in');
        
        await user.updateEmail(newEmail);
        await user.sendEmailVerification();
        
        // Update email in Firestore
        await updateUserProfile(user.uid, {
            email: newEmail,
            emailVerified: false
        });
        
        showMessage('Email updated! Please verify your new email address.', 'success');
    } catch (error) {
        console.error('Email update error:', error);
        if (error.code === 'auth/requires-recent-login') {
            showMessage('Please log in again before changing your email.', 'warning');
        } else {
            handleAuthError(error);
        }
        throw error;
    }
}

/**
 * Link additional auth provider to existing account
 * @param {string} provider - Provider name ('google' or 'facebook')
 */
async function linkAuthProvider(provider) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('No user logged in');
        
        let authProvider;
        if (provider === 'google') {
            authProvider = new firebase.auth.GoogleAuthProvider();
        } else if (provider === 'facebook') {
            authProvider = new firebase.auth.FacebookAuthProvider();
        } else {
            throw new Error('Invalid provider');
        }
        
        await user.linkWithPopup(authProvider);
        showMessage(`${provider} account linked successfully!`, 'success');
    } catch (error) {
        console.error('Provider linking error:', error);
        handleAuthError(error);
        throw error;
    }
}

/**
 * Unlink auth provider from account
 * @param {string} providerId - Provider ID to unlink
 */
async function unlinkAuthProvider(providerId) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('No user logged in');
        
        await user.unlink(providerId);
        showMessage('Provider unlinked successfully!', 'success');
    } catch (error) {
        console.error('Provider unlinking error:', error);
        handleAuthError(error);
        throw error;
    }
}

/**
 * Handle authentication errors
 * @param {Error} error - Firebase auth error
 */
function handleAuthError(error) {
    let message = 'An error occurred. Please try again.';
    
    switch (error.code) {
        case 'auth/email-already-in-use':
            message = 'This email is already registered. Please login instead.';
            break;
        case 'auth/invalid-email':
            message = 'Invalid email address format.';
            break;
        case 'auth/operation-not-allowed':
            message = 'This operation is not allowed. Please contact support.';
            break;
        case 'auth/weak-password':
            message = 'Password is too weak. Please use at least 6 characters.';
            break;
        case 'auth/user-disabled':
            message = 'This account has been disabled. Please contact support.';
            break;
        case 'auth/user-not-found':
            message = 'No account found with this email. Please sign up first.';
            break;
        case 'auth/wrong-password':
            message = 'Incorrect password. Please try again.';
            break;
        case 'auth/invalid-credential':
            message = 'Invalid credentials. Please check your email and password.';
            break;
        case 'auth/network-request-failed':
            message = 'Network error. Please check your internet connection.';
            break;
        case 'auth/too-many-requests':
            message = 'Too many failed attempts. Please try again later.';
            break;
        case 'auth/popup-closed-by-user':
            message = 'Sign-in popup was closed. Please try again.';
            break;
        case 'auth/cancelled-popup-request':
            message = 'Another sign-in popup is already open.';
            break;
        case 'auth/account-exists-with-different-credential':
            message = 'An account already exists with the same email but different sign-in credentials.';
            break;
        case 'auth/credential-already-in-use':
            message = 'This credential is already associated with another account.';
            break;
        case 'auth/requires-recent-login':
            message = 'This operation requires recent authentication. Please log in again.';
            break;
        default:
            message = error.message || 'An unexpected error occurred.';
    }
    
    showMessage(message, 'error');
}

// ===============================
// Session Management
// ===============================

/**
 * Check if user is logged in
 * @returns {boolean} Authentication status
 */
function isAuthenticated() {
    return auth.currentUser !== null;
}

/**
 * Get current user
 * @returns {Object|null} Current user object
 */
function getCurrentFirebaseUser() {
    return auth.currentUser;
}

/**
 * Get current user with profile data
 * @returns {Promise<Object|null>} User with profile data
 */
async function getCurrentUserWithProfile() {
    try {
        const user = auth.currentUser;
        if (!user) return null;
        
        const profile = await getUserProfile(user.uid);
        return {
            ...user,
            profile: profile
        };
    } catch (error) {
        console.error('Error getting user with profile:', error);
        return null;
    }
}

/**
 * Wait for auth state to be determined
 * @returns {Promise<User|null>} Resolves with user or null
 */
function waitForAuth() {
    return new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            unsubscribe();
            resolve(user);
        });
    });
}

/**
 * Protected route check
 * Redirects to login if not authenticated
 */
async function requireAuth() {
    const user = await waitForAuth();
    if (!user) {
        showMessage('Please login to access this page', 'warning');
        window.location.href = 'auth.html';
        return false;
    }
    return true;
}

/**
 * Check if user has verified email
 */
async function requireVerifiedEmail() {
    const user = auth.currentUser;
    if (!user) return false;
    
    if (!user.emailVerified) {
        showMessage('Please verify your email to access this feature.', 'warning');
        const resend = confirm('Would you like us to resend the verification email?');
        if (resend) {
            await resendVerificationEmail();
        }
        return false;
    }
    return true;
}

/**
 * Check if user has verified ID (custom verification)
 */
async function requireIdVerification() {
    const user = auth.currentUser;
    if (!user) return false;
    
    const profile = await getUserProfile(user.uid);
    if (!profile?.idVerified) {
        showMessage('ID verification required to proceed.', 'warning');
        // Redirect to verification page
        window.location.href = 'verify-id.html';
        return false;
    }
    return true;
}

/**
 * Check if user has completed profile
 */
async function requireCompleteProfile() {
    const user = auth.currentUser;
    if (!user) return false;
    
    const profile = await getUserProfile(user.uid);
    if (!profile?.profileComplete) {
        showMessage('Please complete your profile to access this feature.', 'warning');
        window.location.href = 'profile.html';
        return false;
    }
    return true;
}

/**
 * Get user's authentication providers
 * @returns {Array} List of provider IDs
 */
function getUserProviders() {
    const user = auth.currentUser;
    if (!user) return [];
    
    return user.providerData.map(provider => provider.providerId);
}
