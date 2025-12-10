// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAuthPage();
    setupFormAnimations();
    setupPasswordStrengthMeter();
    setupSocialAuthAnimations();
});


// Main initialization
function initializeAuthPage() {
    setupAuth();
    setupAuthValidation();
    setupFormTransitions();
    
    console.log('Auth page enhanced functionality loaded');
}

// Store user data in Firestore
async function storeUserInFirestore(uid, userData) {
    try {
        await db.collection('users').doc(uid).set({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phone: userData.phone,
            accountType: userData.accountType,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
            emailVerified: false
        });
        console.log('User data stored in Firestore');
    } catch (error) {
        console.error('Error storing user data:', error);
        throw error;
    }
}

// Get user data from Firestore
async function getUserFromFirestore(uid) {
    try {
        const userDoc = await db.collection('users').doc(uid).get();
        if (userDoc.exists) {
            return userDoc.data();
        }
        return null;
    } catch (error) {
        console.error('Error getting user data:', error);
        throw error;
    }
}

// Update user profile in Firestore
async function updateUserProfile(uid, updates) {
    try {
        await db.collection('users').doc(uid).update(updates);
        console.log('User profile updated');
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
}

// Toggle between login and signup forms with animation
function switchToSignup() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginToggle = document.getElementById('loginToggle');
    const signupToggle = document.getElementById('signupToggle');
    
    loginForm.style.animation = 'slideOutLeft 0.5s ease';
    
    setTimeout(() => {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        signupForm.style.animation = 'slideInRight 0.5s ease';
        
        loginToggle.classList.remove('active');
        signupToggle.classList.add('active');
        
        signupToggle.style.animation = 'pulse 0.5s ease';
        setTimeout(() => {
            signupToggle.style.animation = '';
        }, 500);
    }, 400);
}

function switchToLogin() {
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    const signupToggle = document.getElementById('signupToggle');
    const loginToggle = document.getElementById('loginToggle');
    
    signupForm.style.animation = 'slideOutRight 0.5s ease';
    
    setTimeout(() => {
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
        loginForm.style.animation = 'slideInLeft 0.5s ease';
        
        signupToggle.classList.remove('active');
        loginToggle.classList.add('active');
        
        loginToggle.style.animation = 'pulse 0.5s ease';
        setTimeout(() => {
            loginToggle.style.animation = '';
        }, 500);
    }, 400);
}

// Enhanced password visibility toggle
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggle = input.parentElement.querySelector('.password-toggle i');
    
    if (input.type === 'password') {
        input.type = 'text';
        toggle.classList.remove('fa-eye');
        toggle.classList.add('fa-eye-slash');
        toggle.style.animation = 'rotate 0.3s ease';
    } else {
        input.type = 'password';
        toggle.classList.remove('fa-eye-slash');
        toggle.classList.add('fa-eye');
        toggle.style.animation = 'rotate 0.3s ease reverse';
    }
    
    setTimeout(() => {
        toggle.style.animation = '';
    }, 300);
}

// Setup authentication functionality
function setupAuth() {
    const loginToggle = document.getElementById('loginToggle');
    const signupToggle = document.getElementById('signupToggle');
    
    if (loginToggle) {
        loginToggle.addEventListener('click', switchToLogin);
    }
    if (signupToggle) {
        signupToggle.addEventListener('click', switchToSignup);
    }
    
    const loginForm = document.getElementById('loginFormSubmit');
    const signupForm = document.getElementById('signupFormSubmit');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleFirebaseLogin);
    }
    if (signupForm) {
        signupForm.addEventListener('submit', handleFirebaseSignup);
    }
    
    setupSocialLogin();
}

// Firebase login handler
async function handleFirebaseLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail');
    const password = document.getElementById('loginPassword');
    const rememberMe = document.querySelector('input[name="rememberMe"]');
    const submitBtn = this.querySelector('.auth-submit');
    
    clearFieldErrors([email, password]);
    
    let hasError = false;
    
    if (!email.value) {
        showFieldError(email, 'Email is required');
        hasError = true;
    } else if (!validateEmail(email.value)) {
        showFieldError(email, 'Please enter a valid email');
        hasError = true;
    }
    
    if (!password.value) {
        showFieldError(password, 'Password is required');
        hasError = true;
    }
    
    if (hasError) {
        shakeForm(this);
        return;
    }
    
    const originalContent = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    submitBtn.disabled = true;
    
    try {
        // Set persistence
        const persistence = rememberMe?.checked 
            ? firebase.auth.Auth.Persistence.LOCAL 
            : firebase.auth.Auth.Persistence.SESSION;
        await auth.setPersistence(persistence);
        
        // Sign in with Firebase
        const userCredential = await auth.signInWithEmailAndPassword(email.value, password.value);
        const user = userCredential.user;
        
        // Get user data from Firestore
        const userData = await getUserFromFirestore(user.uid);
        
        if (!userData) {
            throw new Error('User profile not found');
        }
        
        // Update last login
        await updateUserProfile(user.uid, {
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
        submitBtn.style.background = 'var(--success)';
        
        // Store minimal session data (no sensitive info)
        setCurrentUser({
            uid: user.uid,
            name: `${userData.firstName} ${userData.lastName}`,
            email: userData.email,
            accountType: userData.accountType
        });
        
        showMessage('Login successful! Redirecting...', 'success');
        
        this.style.animation = 'fadeOut 0.5s ease';
        
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 1500);
        
    } catch (error) {
        console.error('Login error:', error);
        submitBtn.innerHTML = originalContent;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
        
        if (error.code === 'auth/user-not-found') {
            showFieldError(email, 'Email not registered. Please sign up first.');
            showMessage('No account found with this email', 'error');
        } else if (error.code === 'auth/wrong-password') {
            showFieldError(password, 'Incorrect password');
            showMessage('Invalid credentials. Please try again.', 'error');
        } else if (error.code === 'auth/invalid-credential') {
            showFieldError(password, 'Invalid credentials');
            showMessage('Invalid email or password', 'error');
        } else {
            showMessage(error.message || 'Error logging in', 'error');
        }
        
        shakeForm(this);
    }
}

// Firebase signup handler
async function handleFirebaseSignup(e) {
    e.preventDefault();
    
    const fields = {
        firstName: document.getElementById('firstName'),
        lastName: document.getElementById('lastName'),
        email: document.getElementById('signupEmail'),
        phone: document.getElementById('phoneNumber'),
        password: document.getElementById('signupPassword'),
        confirmPassword: document.getElementById('confirmPassword'),
        accountType: document.getElementById('accountType'),
        agreeTerms: document.querySelector('input[name="agreeTerms"]')
    };
    
    const submitBtn = this.querySelector('.auth-submit');
    
    clearFieldErrors(Object.values(fields));
    
    let hasError = false;
    
    // Validation
    Object.entries(fields).forEach(([key, field]) => {
        if (!field) return;
        
        if (key === 'agreeTerms') {
            if (!field.checked) {
                showMessage('Please agree to the Terms of Service', 'error');
                hasError = true;
            }
        } else if (!field.value) {
            showFieldError(field, `${formatFieldName(key)} is required`);
            hasError = true;
        }
    });
    
    if (fields.email.value && !validateEmail(fields.email.value)) {
        showFieldError(fields.email, 'Please enter a valid email address');
        hasError = true;
    }
    
    if (fields.phone.value && !validatePhone(fields.phone.value)) {
        showFieldError(fields.phone, 'Please enter a valid phone number (+855 XX XXX XXX)');
        hasError = true;
    }
    
    if (fields.password.value && fields.password.value.length < 8) {
        showFieldError(fields.password, 'Password must be at least 8 characters');
        hasError = true;
    }
    
    if (fields.password.value !== fields.confirmPassword.value) {
        showFieldError(fields.confirmPassword, 'Passwords do not match');
        hasError = true;
    }
    
    if (hasError) {
        shakeForm(this);
        return;
    }
    
    const originalContent = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
    submitBtn.disabled = true;
    
    try {
        // Create user with Firebase Authentication
        const userCredential = await auth.createUserWithEmailAndPassword(
            fields.email.value, 
            fields.password.value
        );
        
        const user = userCredential.user;
        
        // Store additional user data in Firestore
        await storeUserInFirestore(user.uid, {
            firstName: fields.firstName.value,
            lastName: fields.lastName.value,
            email: fields.email.value,
            phone: fields.phone.value,
            accountType: fields.accountType.value
        });
        
        // Send email verification
        await user.sendEmailVerification();
        
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Account created!';
        submitBtn.style.background = 'var(--success)';
        
        showMessage('Account created successfully! Please verify your email before logging in.', 'success');
        
        // Sign out the user after signup
        await auth.signOut();
        
        // Switch to login after delay
        setTimeout(() => {
            switchToLogin();
            
            const loginEmail = document.getElementById('loginEmail');
            if (loginEmail) {
                loginEmail.value = fields.email.value;
                loginEmail.style.borderColor = 'var(--success)';
            }
            
            // Clear signup form
            Object.values(fields).forEach(field => {
                if (field && field.type !== 'checkbox') {
                    field.value = '';
                } else if (field && field.type === 'checkbox') {
                    field.checked = false;
                }
            });
            
            submitBtn.innerHTML = originalContent;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
            
            showMessage('Verification email sent! Please check your inbox.', 'info');
        }, 2000);
        
    } catch (error) {
        console.error('Signup error:', error);
        submitBtn.innerHTML = originalContent;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
        
        if (error.code === 'auth/email-already-in-use') {
            showFieldError(fields.email, 'This email is already registered');
            showMessage('Email already in use. Please login instead.', 'error');
        } else if (error.code === 'auth/weak-password') {
            showFieldError(fields.password, 'Password is too weak');
            showMessage('Please choose a stronger password', 'error');
        } else {
            showMessage(error.message || 'Error creating account', 'error');
        }
        
        shakeForm(this);
    }
}

// Form animations
function setupFormAnimations() {
    const authForms = document.querySelectorAll('.auth-form');
    authForms.forEach((form, index) => {
        form.style.opacity = '0';
        form.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            form.style.transition = 'all 0.6s ease';
            form.style.opacity = '1';
            form.style.transform = 'translateY(0)';
        }, 200 + (index * 100));
    });
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInLeft {
            from { transform: translateX(-30px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInRight {
            from { transform: translateX(30px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutLeft {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(-30px); opacity: 0; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(30px); opacity: 0; }
        }
        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        @keyframes shakeForm {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        .field-error {
            color: var(--danger);
            font-size: 0.85rem;
            margin-top: 0.25rem;
            animation: slideInLeft 0.3s ease;
        }
        .password-strength-meter {
            height: 4px;
            background: var(--border-light);
            border-radius: 2px;
            margin-top: 0.5rem;
            overflow: hidden;
        }
        .password-strength-bar {
            height: 100%;
            transition: all 0.3s ease;
            border-radius: 2px;
        }
    `;
    document.head.appendChild(style);
}

// Enhanced password strength meter
function setupPasswordStrengthMeter() {
    const passwordInput = document.getElementById('signupPassword');
    
    if (passwordInput) {
        const meter = document.createElement('div');
        meter.className = 'password-strength-meter';
        meter.innerHTML = '<div class="password-strength-bar"></div>';
        
        passwordInput.parentElement.appendChild(meter);
        
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const bar = meter.querySelector('.password-strength-bar');
            const strength = checkPasswordStrength(password);
            const requirements = this.parentElement.nextElementSibling;
            
            if (password.length === 0) {
                bar.style.width = '0';
                bar.style.background = '';
            } else if (strength === 'weak') {
                bar.style.width = '33%';
                bar.style.background = 'var(--danger)';
            } else if (strength === 'medium') {
                bar.style.width = '66%';
                bar.style.background = 'var(--warning)';
            } else {
                bar.style.width = '100%';
                bar.style.background = 'var(--success)';
            }
            
            if (requirements && requirements.classList.contains('password-requirements')) {
                const small = requirements.querySelector('small');
                if (small) {
                    let message = 'Password must contain at least 8 characters';
                    let color = 'var(--text-light)';
                    
                    if (password.length > 0) {
                        if (strength === 'weak') {
                            message = '🔴 Weak - Add uppercase, numbers, and symbols';
                            color = 'var(--danger)';
                        } else if (strength === 'medium') {
                            message = '🟡 Medium - Add more complexity for better security';
                            color = 'var(--warning)';
                        } else {
                            message = '🟢 Strong password!';
                            color = 'var(--success)';
                        }
                    }
                    
                    small.textContent = message;
                    small.style.color = color;
                }
            }
        });
    }
}

// Password strength checker
function checkPasswordStrength(password) {
    if (!password || password.length < 8) return 'weak';
    
    let strength = 0;
    
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    if (password.length >= 12) strength++;
    if (password.length >= 16) strength++;
    
    if (strength < 3) return 'weak';
    if (strength < 5) return 'medium';
    return 'strong';
}

// Social login setup
function setupSocialLogin() {
    const googleButtons = document.querySelectorAll('.google-btn');
    const facebookButtons = document.querySelectorAll('.facebook-btn');
    
    googleButtons.forEach(btn => {
        btn.addEventListener('click', async function(e) {
            createRipple(this, e);
            this.style.animation = 'pulse 0.5s ease';
            
            showMessage('Connecting to Google...', 'info');
            
            try {
                const provider = new firebase.auth.GoogleAuthProvider();
                const result = await auth.signInWithPopup(provider);
                
                // Store user data in Firestore if new user
                const userDoc = await getUserFromFirestore(result.user.uid);
                if (!userDoc) {
                    const names = result.user.displayName?.split(' ') || ['', ''];
                    await storeUserInFirestore(result.user.uid, {
                        firstName: names[0],
                        lastName: names.slice(1).join(' '),
                        email: result.user.email,
                        phone: result.user.phoneNumber || '',
                        accountType: 'individual'
                    });
                }
                
                showMessage('Login successful!', 'success');
                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 1500);
                
            } catch (error) {
                console.error('Google login error:', error);
                showMessage('Google login failed. Please try again.', 'error');
            }
            
            this.style.animation = '';
        });
    });
    
    facebookButtons.forEach(btn => {
        btn.addEventListener('click', async function(e) {
            createRipple(this, e);
            this.style.animation = 'pulse 0.5s ease';
            
            showMessage('Connecting to Facebook...', 'info');
            
            try {
                const provider = new firebase.auth.FacebookAuthProvider();
                const result = await auth.signInWithPopup(provider);
                
                // Store user data in Firestore if new user
                const userDoc = await getUserFromFirestore(result.user.uid);
                if (!userDoc) {
                    const names = result.user.displayName?.split(' ') || ['', ''];
                    await storeUserInFirestore(result.user.uid, {
                        firstName: names[0],
                        lastName: names.slice(1).join(' '),
                        email: result.user.email,
                        phone: result.user.phoneNumber || '',
                        accountType: 'individual'
                    });
                }
                
                showMessage('Login successful!', 'success');
                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 1500);
                
            } catch (error) {
                console.error('Facebook login error:', error);
                showMessage('Facebook login failed. Please try again.', 'error');
            }
            
            this.style.animation = '';
        });
    });
}

// Social auth animations
function setupSocialAuthAnimations() {
    const socialButtons = document.querySelectorAll('.btn-social');
    
    socialButtons.forEach((btn, index) => {
        btn.style.opacity = '0';
        btn.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            btn.style.transition = 'all 0.5s ease';
            btn.style.opacity = '1';
            btn.style.transform = 'translateY(0)';
        }, 800 + (index * 100));
        
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Form transitions
function setupFormTransitions() {
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.style.boxShadow = '0 0 0 3px rgba(255, 140, 66, 0.1)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
            this.style.boxShadow = '';
        });
    });
}

// Validation setup
function setupAuthValidation() {
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            const email = this.value.trim();
            
            if (email) {
                if (!validateEmail(email)) {
                    showFieldError(this, 'Please enter a valid email address');
                } else {
                    clearFieldError(this);
                    this.style.borderColor = 'var(--success)';
                    showFieldSuccess(this);
                }
            }
        });
    });
    
    const phoneInput = document.getElementById('phoneNumber');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.startsWith('855')) {
                value = value.slice(3);
            }
            
            if (value.length > 0) {
                let formatted = '+855 ';
                if (value.length > 0) formatted += value.slice(0, 2) + ' ';
                if (value.length > 2) formatted += value.slice(2, 5) + ' ';
                if (value.length > 5) formatted += value.slice(5, 9);
                
                this.value = formatted.trim();
            }
        });
        
        phoneInput.addEventListener('blur', function() {
            const phone = this.value.trim();
            
            if (phone && !validatePhone(phone)) {
                showFieldError(this, 'Please enter a valid Cambodian phone number');
            } else if (phone) {
                clearFieldError(this);
                this.style.borderColor = 'var(--success)';
                showFieldSuccess(this);
            }
        });
    }
    
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordInput = document.getElementById('signupPassword');
    
    if (confirmPasswordInput && passwordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            if (this.value && passwordInput.value) {
                if (this.value === passwordInput.value) {
                    clearFieldError(this);
                    this.style.borderColor = 'var(--success)';
                    showFieldSuccess(this);
                } else {
                    this.style.borderColor = 'var(--danger)';
                }
            }
        });
        
        confirmPasswordInput.addEventListener('blur', function() {
            if (this.value && passwordInput.value && this.value !== passwordInput.value) {
                showFieldError(this, 'Passwords do not match');
            }
        });
    }
}

// Validation helper functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 11 && (cleaned.startsWith('855') || phone.startsWith('+855'));
}

// Field error handling
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = 'var(--danger)';
    field.style.animation = 'shake 0.5s';
    
    const error = document.createElement('div');
    error.className = 'field-error';
    error.textContent = message;
    field.parentElement.appendChild(error);
    
    setTimeout(() => {
        field.style.animation = '';
    }, 500);
}

function clearFieldError(field) {
    if (!field) return;
    
    field.style.borderColor = 'var(--border-light)';
    const error = field.parentElement.querySelector('.field-error');
    if (error) error.remove();
    
    const success = field.parentElement.querySelector('.field-success');
    if (success) success.remove();
}

function clearFieldErrors(fields) {
    fields.forEach(field => clearFieldError(field));
}

function showFieldSuccess(field) {
    const existing = field.parentElement.querySelector('.field-success');
    if (!existing) {
        const success = document.createElement('span');
        success.className = 'field-success';
        success.innerHTML = '<i class="fas fa-check-circle"></i>';
        success.style.cssText = `
            position: absolute;
            right: 3rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--success);
            animation: fadeIn 0.3s ease;
        `;
        field.parentElement.style.position = 'relative';
        field.parentElement.appendChild(success);
    }
}

function shakeForm(form) {
    form.style.animation = 'shakeForm 0.5s';
    setTimeout(() => {
        form.style.animation = '';
    }, 500);
}

function formatFieldName(name) {
    return name
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
}

// Message display
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

// Set current user in session storage only (minimal data)
function setCurrentUser(userData) {
    sessionStorage.setItem('currentUser', JSON.stringify(userData));
    console.log('User session created');
}

// Create ripple effect
function createRipple(button, e) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        transform: scale(0);
        animation: rippleAnimation 0.6s ease-out;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes rippleAnimation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    @keyframes slideDown {
        from {
            transform: translate(-50%, -100%);
            opacity: 0;
        }
        to {
            transform: translate(-50%, 0);
            opacity: 1;
        }
    }
    @keyframes slideUp {
        from {
            transform: translate(-50%, 0);
            opacity: 1;
        }
        to {
            transform: translate(-50%, -100%);
            opacity: 0;
        }
    }
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(rippleStyle);

// Function to resend verification email
async function resendVerificationEmail() {
    try {
        const user = auth.currentUser;
        
        if (user && !user.emailVerified) {
            await user.sendEmailVerification();
            showMessage('Verification email sent! Please check your inbox and spam folder.', 'success');
            console.log('Verification email sent to:', user.email);
        } else if (user && user.emailVerified) {
            showMessage('Your email is already verified!', 'info');
        } else {
            showMessage('Please sign up first to receive verification email.', 'warning');
        }
    } catch (error) {
        console.error('Error sending verification:', error);
        if (error.code === 'auth/too-many-requests') {
            showMessage('Too many requests. Please wait a few minutes before trying again.', 'error');
        } else {
            showMessage('Error sending verification email. Please try again.', 'error');
        }
    }
}

// Function to check verification status
async function checkVerificationStatus() {
    const user = auth.currentUser;
    if (user) {
        await user.reload();
        console.log('Email verified status:', user.emailVerified);
        if (user.emailVerified) {
            showMessage('Your email is verified! You can now log in.', 'success');
        } else {
            showMessage('Email not yet verified. Please check your inbox.', 'info');
        }
    } else {
        showMessage('No user is currently signed in.', 'info');
    }
}

// Function to get current user from Firebase
async function getCurrentUser() {
    return new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            unsubscribe();
            if (user) {
                const userData = await getUserFromFirestore(user.uid);
                resolve({
                    uid: user.uid,
                    email: user.email,
                    emailVerified: user.emailVerified,
                    ...userData
                });
            } else {
                resolve(null);
            }
        });
    });
}

// Function to sign out
async function signOut() {
    try {
        await auth.signOut();
        sessionStorage.removeItem('currentUser');
        showMessage('Signed out successfully', 'success');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    } catch (error) {
        console.error('Sign out error:', error);
        showMessage('Error signing out', 'error');
    }
}

// Password reset function
async function sendPasswordResetEmail(email) {
    try {
        await auth.sendPasswordResetEmail(email);
        showMessage('Password reset email sent! Check your inbox.', 'success');
    } catch (error) {
        console.error('Password reset error:', error);
        if (error.code === 'auth/user-not-found') {
            showMessage('No account found with this email', 'error');
        } else {
            showMessage('Error sending password reset email', 'error');
        }
    }
}
// Modified Firebase signup handler - Replace in auth.js
async function handleFirebaseSignup(e) {
    e.preventDefault();
    
    const fields = {
        firstName: document.getElementById('firstName'),
        lastName: document.getElementById('lastName'),
        email: document.getElementById('signupEmail'),
        phone: document.getElementById('phoneNumber'),
        password: document.getElementById('signupPassword'),
        confirmPassword: document.getElementById('confirmPassword'),
        accountType: document.getElementById('accountType'),
        agreeTerms: document.querySelector('input[name="agreeTerms"]')
    };
    
    const submitBtn = this.querySelector('.auth-submit');
    
    clearFieldErrors(Object.values(fields));
    
    let hasError = false;
    
    // Validation
    Object.entries(fields).forEach(([key, field]) => {
        if (!field) return;
        
        if (key === 'agreeTerms') {
            if (!field.checked) {
                showMessage('Please agree to the Terms of Service', 'error');
                hasError = true;
            }
        } else if (!field.value) {
            showFieldError(field, `${formatFieldName(key)} is required`);
            hasError = true;
        }
    });
    
    if (fields.email.value && !validateEmail(fields.email.value)) {
        showFieldError(fields.email, 'Please enter a valid email address');
        hasError = true;
    }
    
    if (fields.phone.value && !validatePhone(fields.phone.value)) {
        showFieldError(fields.phone, 'Please enter a valid phone number (+855 XX XXX XXX)');
        hasError = true;
    }
    
    if (fields.password.value && fields.password.value.length < 8) {
        showFieldError(fields.password, 'Password must be at least 8 characters');
        hasError = true;
    }
    
    if (fields.password.value !== fields.confirmPassword.value) {
        showFieldError(fields.confirmPassword, 'Passwords do not match');
        hasError = true;
    }
    
    if (hasError) {
        shakeForm(this);
        return;
    }
    
    const originalContent = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
    submitBtn.disabled = true;
    
    try {
        // Create user with Firebase Authentication
        const userCredential = await auth.createUserWithEmailAndPassword(
            fields.email.value, 
            fields.password.value
        );
        
        const user = userCredential.user;
        
        // Store additional user data in Firestore
        await storeUserInFirestore(user.uid, {
            firstName: fields.firstName.value,
            lastName: fields.lastName.value,
            email: fields.email.value,
            phone: fields.phone.value,
            accountType: fields.accountType.value
        });
        
        // Send email verification
        await user.sendEmailVerification();
        
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Account created!';
        submitBtn.style.background = 'var(--success)';
        
        showMessage('Account created successfully! Redirecting to ID verification...', 'success');
        
        // Store user session
        setCurrentUser({
            uid: user.uid,
            name: `${fields.firstName.value} ${fields.lastName.value}`,
            email: fields.email.value,
            accountType: fields.accountType.value
        });
        
        // Redirect to ID verification page
        setTimeout(() => {
            window.location.href = 'verify-id.html';
        }, 2000);
        
    } catch (error) {
        console.error('Signup error:', error);
        submitBtn.innerHTML = originalContent;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
        
        if (error.code === 'auth/email-already-in-use') {
            showFieldError(fields.email, 'This email is already registered');
            showMessage('Email already in use. Please login instead.', 'error');
        } else if (error.code === 'auth/weak-password') {
            showFieldError(fields.password, 'Password is too weak');
            showMessage('Please choose a stronger password', 'error');
        } else {
            showMessage(error.message || 'Error creating account', 'error');
        }
        
        shakeForm(this);
    }
}

// Make functions globally available
window.switchToSignup = switchToSignup;
window.switchToLogin = switchToLogin;
window.togglePassword = togglePassword;
window.resendVerificationEmail = resendVerificationEmail;
window.checkVerificationStatus = checkVerificationStatus;
window.getCurrentUser = getCurrentUser;
window.signOut = signOut;
window.sendPasswordResetEmail = sendPasswordResetEmail;
window.getUserFromFirestore = getUserFromFirestore;
window.updateUserProfile = updateUserProfile;

console.log('Firebase Auth module loaded successfully')