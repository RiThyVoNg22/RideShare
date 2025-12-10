// firebase-profile.js - Enhanced Profile System with Booking Details & Owner Contact

let profileUser = null;

window.addEventListener('load', function() {
    console.log('RideShare profile system initializing...');
    
    if (typeof firebase === 'undefined') {
        console.error('Firebase not loaded!');
        return;
    }
    
    firebase.auth().onAuthStateChanged(user => {
        console.log('Auth state:', user ? user.email : 'Not logged in');
        profileUser = user;
        updateAuthButtons(user);
    });
});

function updateAuthButtons(user) {
    const authButtons = document.querySelector('.auth-buttons');
    
    if (!authButtons) {
        console.error('Auth buttons container not found!');
        return;
    }

    if (user) {
        const displayName = user.displayName || user.email.split('@')[0];
        authButtons.innerHTML = `
            <button class="btn btn-profile" id="profileBtn">
                <i class="fas fa-user-circle"></i> ${displayName}
            </button>
        `;
        
        const profileBtn = document.getElementById('profileBtn');
        if (profileBtn) {
            profileBtn.addEventListener('click', openProfileModal);
            console.log('Profile button created');
        }
    } else {
        authButtons.innerHTML = `
            <a href="/RideShare/auth.html" class="btn btn-secondary">Sign Up / Log In</a>
        `;
    }
}

function openProfileModal() {
    console.log('Opening profile modal...');
    
    if (!profileUser) {
        console.error('No user logged in');
        return;
    }
    
    let modal = document.getElementById('profileModal');
    if (!modal) {
        modal = createEnhancedProfileModal();
        document.body.appendChild(modal);
    }
    
    loadUserProfile();
    
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

function createEnhancedProfileModal() {
    const modal = document.createElement('div');
    modal.id = 'profileModal';
    modal.className = 'profile-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeProfileModal()"></div>
        <div class="modal-content">
            <button class="modal-close" onclick="closeProfileModal()">
                <i class="fas fa-times"></i>
            </button>
            
            <div class="profile-header">
                <div class="profile-avatar">
                    <i class="fas fa-user-circle"></i>
                </div>
                <h2 id="profileName">Loading...</h2>
                <p id="profileEmail"></p>
                <div class="profile-stats">
                    <div class="stat-item">
                        <span class="stat-number" id="totalBookings">0</span>
                        <span class="stat-label">Bookings</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number" id="totalVehicles">0</span>
                        <span class="stat-label">Vehicles</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number" id="memberDays">0</span>
                        <span class="stat-label">Days</span>
                    </div>
                </div>
            </div>
            
            <div class="profile-tabs">
                <button class="tab-btn active" onclick="showProfileTab('info')">
                    <i class="fas fa-info-circle"></i> Profile
                </button>
                <button class="tab-btn" onclick="showProfileTab('bookings')">
                    <i class="fas fa-calendar-check"></i> Bookings
                </button>
                <button class="tab-btn" onclick="showProfileTab('messages')">
                    <i class="fas fa-comments"></i> Messages
                </button>
                <button class="tab-btn" onclick="showProfileTab('vehicles')">
                    <i class="fas fa-car"></i> Vehicles
                </button>
                <button class="tab-btn" onclick="showProfileTab('settings')">
                    <i class="fas fa-cog"></i> Settings
                </button>
            </div>
            
            <div class="profile-body">
                <!-- Profile Info Tab -->
                <div id="infoTab" class="tab-content active">
                    <div class="info-section">
                        <h3><i class="fas fa-user"></i> Personal Information</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <label>Full Name</label>
                                <p id="infoName">-</p>
                            </div>
                            <div class="info-item">
                                <label>Email Address</label>
                                <p id="infoEmail">-</p>
                            </div>
                            <div class="info-item">
                                <label>Phone Number</label>
                                <p id="infoPhone">Not set</p>
                            </div>
                            <div class="info-item">
                                <label>Account Type</label>
                                <p id="infoAccountType">-</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-section">
                        <h3><i class="fas fa-shield-alt"></i> Account Status</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <label>Member Since</label>
                                <p id="infoMemberSince">-</p>
                            </div>
                            <div class="info-item">
                                <label>Email Verified</label>
                                <p id="infoEmailVerified">-</p>
                            </div>
                            <div class="info-item">
                                <label>User ID</label>
                                <p id="infoUserId">-</p>
                            </div>
                            <div class="info-item">
                                <label>Last Login</label>
                                <p id="infoLastLogin">-</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Bookings Tab -->
                <div id="bookingsTab" class="tab-content">
                    <div class="tab-header">
                        <h3><i class="fas fa-calendar-check"></i> My Bookings</h3>
                        <a href="rent.html" class="btn-small btn-primary">
                            <i class="fas fa-plus"></i> New Booking
                        </a>
                    </div>
                    <div id="bookingsList">
                        <div class="loading">
                            <i class="fas fa-spinner fa-spin"></i> Loading bookings...
                        </div>
                    </div>
                </div>
                
                <!-- Messages Tab - NEW -->
                <div id="messagesTab" class="tab-content">
                    <div class="tab-header">
                        <h3><i class="fas fa-comments"></i> My Messages</h3>
                    </div>
                    <div id="messagesList">
                        <div class="loading">
                            <i class="fas fa-spinner fa-spin"></i> Loading messages...
                        </div>
                    </div>
                </div>
                
                <!-- Vehicles Tab -->
                <div id="vehiclesTab" class="tab-content">
                    <div class="tab-header">
                        <h3><i class="fas fa-car"></i> My Vehicles</h3>
                        <a href="list-your-vehicle.html" class="btn-small btn-primary">
                            <i class="fas fa-plus"></i> List Vehicle
                        </a>
                    </div>
                    <div id="vehiclesList">
                        <div class="loading">
                            <i class="fas fa-spinner fa-spin"></i> Loading vehicles...
                        </div>
                    </div>
                </div>
                
                <!-- Settings Tab -->
                <div id="settingsTab" class="tab-content">
                    <div class="settings-section">
                        <h3><i class="fas fa-bell"></i> Notifications</h3>
                        <div class="settings-group">
                            <label class="switch-label">
                                <input type="checkbox" checked>
                                <span class="slider"></span>
                                Email notifications
                            </label>
                            <label class="switch-label">
                                <input type="checkbox" checked>
                                <span class="slider"></span>
                                Booking updates
                            </label>
                        </div>
                    </div>
                    
                    <div class="settings-section">
                        <h3><i class="fas fa-lock"></i> Privacy</h3>
                        <div class="settings-group">
                            <label class="switch-label">
                                <input type="checkbox">
                                <span class="slider"></span>
                                Show profile to other users
                            </label>
                            <label class="switch-label">
                                <input type="checkbox">
                                <span class="slider"></span>
                                Share booking history
                            </label>
                        </div>
                    </div>
                    
                    <div class="danger-zone">
                        <h3><i class="fas fa-exclamation-triangle"></i> Danger Zone</h3>
                        <button class="btn-danger" onclick="handleDeleteAccount()">
                            <i class="fas fa-trash"></i> Delete Account
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="profile-footer">
                <button class="btn btn-secondary" onclick="closeProfileModal()">
                    <i class="fas fa-times"></i> Close
                </button>
                <button class="btn btn-danger" onclick="handleLogout()">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>
        </div>
    `;
    
    return modal;
}

// Add necessary CSS animations and booking detail styles
const profileStyles = document.createElement('style');
profileStyles.textContent = `
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes fadeInScale {
        from {
            opacity: 0;
            transform: scale(0.9);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    .booking-card {
        background: white;
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 1rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
        cursor: pointer;
        border-left: 4px solid #ff6b35;
    }
    
    .booking-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(255,107,53,0.2);
        border-left-color: #ff8555;
    }
    
    .booking-header {
        display: flex;
        justify-content: space-between;
        align-items: start;
        margin-bottom: 1rem;
    }
    
    .booking-header h4 {
        margin: 0 0 0.5rem 0;
        font-size: 1.2rem;
        color: #333;
    }
    
    .booking-price {
        font-size: 1.5rem;
        font-weight: bold;
        color: #ff6b35;
    }
    
    .booking-details {
        display: flex;
        gap: 1.5rem;
        margin: 1rem 0;
        flex-wrap: wrap;
    }
    
    .detail-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #666;
        font-size: 0.95rem;
    }
    
    .detail-item i {
        color: #ff6b35;
    }
    
    .booking-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #eee;
    }
    
    .booking-id, .booking-user {
        color: #999;
        font-size: 0.85rem;
    }
    
    /* Booking Details Modal */
    .booking-details-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 10001;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .booking-details-modal.active {
        opacity: 1;
    }
    
    .booking-details-content {
        background: white;
        border-radius: 20px;
        max-width: 700px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        transform: translateY(20px);
        transition: transform 0.3s ease;
    }
    
    .booking-details-modal.active .booking-details-content {
        transform: translateY(0);
    }
    
    .booking-detail-header {
        background: linear-gradient(135deg, #ff6b35 0%, #ff8555 100%);
        color: white;
        padding: 2rem;
        border-radius: 20px 20px 0 0;
        position: relative;
    }
    
    .booking-detail-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        transition: all 0.3s ease;
    }
    
    .booking-detail-close:hover {
        background: rgba(255,255,255,0.3);
        transform: rotate(90deg);
    }
    
    .booking-detail-title {
        font-size: 1.8rem;
        margin: 0 0 0.5rem 0;
        font-weight: 600;
    }
    
    .booking-detail-subtitle {
        opacity: 0.9;
        font-size: 0.95rem;
    }
    
    .booking-detail-body {
        padding: 2rem;
    }
    
    .detail-section {
        margin-bottom: 2rem;
    }
    
    .detail-section h3 {
        color: #333;
        font-size: 1.1rem;
        margin: 0 0 1rem 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .detail-section h3 i {
        color: #ff6b35;
    }
    
    .detail-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
    }
    
    .detail-field {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 10px;
    }
    
    .detail-field label {
        display: block;
        color: #666;
        font-size: 0.85rem;
        margin-bottom: 0.3rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .detail-field p {
        margin: 0;
        color: #333;
        font-size: 1rem;
        font-weight: 500;
    }
    
    .vehicle-preview {
        display: flex;
        gap: 1.5rem;
        background: #f8f9fa;
        padding: 1.5rem;
        border-radius: 12px;
        align-items: center;
    }
    
    .vehicle-preview-img {
        width: 150px;
        height: 100px;
        border-radius: 10px;
        object-fit: cover;
    }
    
    .vehicle-preview-info h4 {
        margin: 0 0 0.5rem 0;
        color: #333;
    }
    
    .vehicle-preview-info p {
        margin: 0.25rem 0;
        color: #666;
        font-size: 0.9rem;
    }
    
    .owner-contact-section {
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        padding: 1.5rem;
        border-radius: 12px;
        text-align: center;
    }
    
    .owner-info {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }
    
    .owner-avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #ff6b35 0%, #ff8555 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.5rem;
    }
    
    .owner-details h4 {
        margin: 0 0 0.3rem 0;
        color: #333;
    }
    
    .owner-details p {
        margin: 0;
        color: #666;
        font-size: 0.9rem;
    }
    
    .contact-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
    }
    
    .btn-contact {
        padding: 0.8rem 1.5rem;
        border: none;
        border-radius: 25px;
        font-size: 0.95rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .btn-contact:disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }
    
    .btn-contact-primary {
        background: linear-gradient(135deg, #ff6b35 0%, #ff8555 100%);
        color: white;
    }
    
    .btn-contact-primary:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(255,107,53,0.3);
    }
    
    .btn-contact-secondary {
        background: white;
        color: #ff6b35;
        border: 2px solid #ff6b35;
    }
    
    .btn-contact-secondary:hover:not(:disabled) {
        background: #ff6b35;
        color: white;
    }
    
    .status-timeline {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 2rem 0;
        position: relative;
    }
    
    .status-timeline::before {
        content: '';
        position: absolute;
        top: 20px;
        left: 0;
        right: 0;
        height: 2px;
        background: #e0e0e0;
        z-index: 0;
    }
    
    .timeline-step {
        text-align: center;
        position: relative;
        z-index: 1;
        flex: 1;
    }
    
    .timeline-dot {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #e0e0e0;
        margin: 0 auto 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.2rem;
        transition: all 0.3s ease;
    }
    
    .timeline-step.active .timeline-dot {
        background: linear-gradient(135deg, #ff6b35 0%, #ff8555 100%);
        box-shadow: 0 4px 12px rgba(255,107,53,0.3);
    }
    
    .timeline-label {
        font-size: 0.85rem;
        color: #999;
    }
    
    .timeline-step.active .timeline-label {
        color: #ff6b35;
        font-weight: 600;
    }
    
    .available-badge {
        color: #28a745;
        font-size: 0.85rem;
    }
    
    .unavailable-badge {
        color: #dc3545;
        font-size: 0.85rem;
    }
    
    .vehicle-card-profile {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .vehicle-card-profile:hover {
        transform: translateY(-4px);
        box-shadow: 0 6px 16px rgba(0,0,0,0.15);
    }
    
    .vehicle-img {
        height: 200px;
        background-size: cover;
        background-position: center;
        position: relative;
    }
    
    .vehicles-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1.5rem;
    }
    
    .empty-state {
        text-align: center;
        padding: 3rem 1rem;
    }
    
    .empty-state i {
        font-size: 4rem;
        color: #ddd;
        margin-bottom: 1rem;
    }
    
    .empty-state h4 {
        color: #333;
        margin-bottom: 0.5rem;
    }
    
    .empty-state p {
        color: #666;
        margin-bottom: 1.5rem;
    }
    
    .chat-list-item {
        background: white;
        border-radius: 12px;
        padding: 1rem;
        margin-bottom: 0.75rem;
        cursor: pointer;
        transition: all 0.3s ease;
        border-left: 4px solid #ff6b35;
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .chat-list-item:hover {
        transform: translateX(5px);
        box-shadow: 0 4px 12px rgba(255,107,53,0.15);
    }
    
    .chat-avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #ff6b35 0%, #ff8555 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.2rem;
        font-weight: 600;
        flex-shrink: 0;
    }
    
    .chat-info {
        flex: 1;
        min-width: 0;
    }
    
    .chat-name {
        font-weight: 600;
        color: #333;
        margin-bottom: 0.25rem;
    }
    
    .chat-vehicle {
        color: #666;
        font-size: 0.85rem;
        margin-bottom: 0.25rem;
    }
    
    .chat-preview {
        color: #999;
        font-size: 0.9rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
    .chat-meta {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 0.25rem;
    }
    
    .chat-time {
        color: #999;
        font-size: 0.75rem;
    }
    
    .chat-unread {
        background: #ff6b35;
        color: white;
        padding: 0.2rem 0.6rem;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
    }
    
    @media (max-width: 768px) {
        .booking-details-content {
            width: 95%;
            max-height: 95vh;
        }
        
        .detail-grid {
            grid-template-columns: 1fr;
        }
        
        .vehicle-preview {
            flex-direction: column;
            text-align: center;
        }
        
        .contact-buttons {
            flex-direction: column;
        }
        
        .btn-contact {
            width: 100%;
            justify-content: center;
        }
    }
`;
document.head.appendChild(profileStyles);

async function loadUserProfile() {
    if (!profileUser) return;
    
    try {
        document.getElementById('profileName').textContent = profileUser.displayName || 'User';
        document.getElementById('profileEmail').textContent = profileUser.email;
        
        document.getElementById('infoName').textContent = profileUser.displayName || 'Not set';
        document.getElementById('infoEmail').textContent = profileUser.email;
        document.getElementById('infoEmailVerified').innerHTML = profileUser.emailVerified 
            ? '<span class="badge-success"><i class="fas fa-check-circle"></i> Verified</span>' 
            : '<span class="badge-warning"><i class="fas fa-exclamation-circle"></i> Not Verified</span>';
        document.getElementById('infoUserId').textContent = profileUser.uid.substring(0, 12) + '...';
        document.getElementById('infoLastLogin').textContent = new Date(profileUser.metadata.lastSignInTime).toLocaleDateString();
        
        const userDoc = await firebase.firestore()
            .collection('users')
            .doc(profileUser.uid)
            .get();
        
        if (userDoc.exists) {
            const userData = userDoc.data();
            
            if (userData.phone) {
                document.getElementById('infoPhone').textContent = userData.phone;
            }
            
            document.getElementById('infoAccountType').innerHTML = 
                '<span class="badge-primary">' + (userData.accountType || 'Both Renter & Owner') + '</span>';
            
            if (userData.createdAt) {
                const createdDate = userData.createdAt.toDate();
                document.getElementById('infoMemberSince').textContent = createdDate.toLocaleDateString();
                
                const daysSince = Math.floor((Date.now() - createdDate) / (1000 * 60 * 60 * 24));
                document.getElementById('memberDays').textContent = daysSince;
            }
        }
        
        loadStats();
        
        // Load unread message count
        if (typeof updateUnreadBadge === 'function') {
            updateUnreadBadge();
        }
        
    } catch (error) {
        console.error('Error loading profile:', error);
        showNotification({
            type: 'error',
            title: 'Profile Load Error',
            message: 'Unable to load some profile information',
            duration: 3000
        });
    }
}

async function loadStats() {
    try {
        const bookingsSnap = await firebase.firestore()
            .collection('bookings')
            .where('userId', '==', profileUser.uid)
            .get();
        document.getElementById('totalBookings').textContent = bookingsSnap.size;
        
        const vehiclesSnap = await firebase.firestore()
            .collection('vehicles')
            .where('ownerId', '==', profileUser.uid)
            .get();
        document.getElementById('totalVehicles').textContent = vehiclesSnap.size;
        
    } catch (error) {
        console.error('Error loading stats:', error);
        try {
            const allBookings = await firebase.firestore()
                .collection('bookings')
                .get();
            
            let userBookingsCount = 0;
            allBookings.forEach(doc => {
                if (doc.data().userId === profileUser.uid) {
                    userBookingsCount++;
                }
            });
            document.getElementById('totalBookings').textContent = userBookingsCount;
        } catch (e) {
            console.error('Fallback also failed:', e);
        }
        
        try {
            const allVehicles = await firebase.firestore()
                .collection('vehicles')
                .get();
            
            let userVehiclesCount = 0;
            allVehicles.forEach(doc => {
                if (doc.data().ownerId === profileUser.uid) {
                    userVehiclesCount++;
                }
            });
            document.getElementById('totalVehicles').textContent = userVehiclesCount;
        } catch (e) {
            console.error('Fallback also failed:', e);
        }
    }
}

async function loadUserBookings() {
    if (!profileUser) return;
    
    const bookingsList = document.getElementById('bookingsList');
    bookingsList.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';
    
    try {
        console.log('Loading bookings for user:', profileUser.uid);
        
        let snapshot;
        try {
            snapshot = await firebase.firestore()
                .collection('bookings')
                .where('userId', '==', profileUser.uid)
                .get();
            
            console.log('Query successful, found:', snapshot.size, 'bookings');
        } catch (queryError) {
            console.warn('Query with where failed, trying to get all:', queryError);
            
            const allBookings = await firebase.firestore()
                .collection('bookings')
                .get();
            
            console.log('Total bookings in database:', allBookings.size);
            
            const userBookings = [];
            allBookings.forEach(doc => {
                const data = doc.data();
                console.log('Checking booking:', doc.id, 'userId:', data.userId, 'vs', profileUser.uid);
                if (data.userId === profileUser.uid) {
                    userBookings.push({ id: doc.id, data: data });
                }
            });
            
            console.log('User bookings found:', userBookings.length);
            
            userBookings.sort((a, b) => {
                const aTime = a.data.createdAt ? a.data.createdAt.toMillis() : 0;
                const bTime = b.data.createdAt ? b.data.createdAt.toMillis() : 0;
                return bTime - aTime;
            });
            
            snapshot = {
                empty: userBookings.length === 0,
                size: userBookings.length,
                forEach: function(callback) {
                    userBookings.forEach(item => {
                        callback({
                            id: item.id,
                            data: () => item.data
                        });
                    });
                }
            };
        }
        
        if (snapshot.empty) {
            bookingsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-times"></i>
                    <h4>No bookings yet</h4>
                    <p>You haven't made any bookings yet. Start exploring our vehicles!</p>
                    <a href="rent.html" class="btn btn-primary">Browse Vehicles</a>
                </div>
            `;
            
            showNotification({
                type: 'info',
                title: 'No Bookings',
                message: 'You haven\'t made any bookings yet',
                duration: 3000
            });
            return;
        }
        
        let html = '';
        let bookingCount = 0;
        snapshot.forEach(doc => {
            const booking = doc.data();
            bookingCount++;
            
            console.log('Displaying booking:', doc.id, booking);
            
            const statusColors = {
                pending: 'warning',
                confirmed: 'info',
                active: 'success',
                completed: 'success',
                cancelled: 'danger'
            };
            
            const bookingStatus = booking.status || 'pending';
            const statusColor = statusColors[bookingStatus] || 'info';
            
            html += `
                <div class="booking-card" onclick="openBookingDetails('${doc.id}')" style="animation: slideInLeft 0.3s ease ${bookingCount * 0.1}s both;">
                    <div class="booking-header">
                        <div>
                            <h4>${booking.vehicleName || 'Vehicle'}</h4>
                            <span class="badge-${statusColor}">${bookingStatus.toUpperCase()}</span>
                        </div>
                        <div class="booking-price">$${(booking.totalPrice || 0).toFixed(2)}</div>
                    </div>
                    <div class="booking-details">
                        <div class="detail-item">
                            <i class="fas fa-calendar"></i>
                            <span>${booking.pickupDate || 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-arrow-right"></i>
                            <span>${booking.returnDate || 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-clock"></i>
                            <span>${booking.rentalDays || 0} days</span>
                        </div>
                    </div>
                    <div class="booking-footer">
                        <div class="booking-id">ID: ${doc.id.substring(0, 10)}</div>
                        <div class="booking-user">
                            <i class="fas fa-user"></i> ${booking.userName || 'User'}
                        </div>
                    </div>
                </div>
            `;
        });
        
        bookingsList.innerHTML = html;
        
        showNotification({
            type: 'success',
            title: 'Bookings Loaded',
            message: `Found ${bookingCount} booking${bookingCount !== 1 ? 's' : ''}`,
            duration: 2000
        });
        
    } catch (error) {
        console.error('Error loading bookings:', error);
        bookingsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-circle"></i>
                <h4>Unable to Load Bookings</h4>
                <p>There was an error loading your bookings. Please try again later.</p>
            </div>
        `;
        
        showNotification({
            type: 'error',
            title: 'Load Failed',
            message: 'Unable to load bookings. Please try again.',
            duration: 4000
        });
    }
}

// NEW: Open booking details modal
window.openBookingDetails = async function(bookingId) {
    console.log('🔍 Opening booking details for:', bookingId);
    
    try {
        const bookingDoc = await firebase.firestore()
            .collection('bookings')
            .doc(bookingId)
            .get();
        
        if (!bookingDoc.exists) {
            throw new Error('Booking not found');
        }
        
        const booking = bookingDoc.data();
        console.log('📋 Booking data:', booking);
        
        // Get vehicle details
        let vehicleData = null;
        if (booking.vehicleId) {
            console.log('🚗 Fetching vehicle:', booking.vehicleId);
            const vehicleDoc = await firebase.firestore()
                .collection('vehicles')
                .doc(booking.vehicleId)
                .get();
            if (vehicleDoc.exists) {
                vehicleData = vehicleDoc.data();
                console.log('✅ Vehicle found:', vehicleData.name);
            } else {
                console.warn('⚠️ Vehicle not found');
            }
        }
        
        // Get owner details - try multiple fields
        let ownerData = null;
        let ownerId = booking.ownerId || booking.vehicleOwnerId || vehicleData?.ownerId;
        
        console.log('👤 Looking for owner ID:', ownerId);
        
        if (ownerId) {
            const ownerDoc = await firebase.firestore()
                .collection('users')
                .doc(ownerId)
                .get();
            if (ownerDoc.exists) {
                ownerData = ownerDoc.data();
                ownerData.uid = ownerId; // Store the ID
                console.log('✅ Owner found:', ownerData.displayName || ownerData.email);
            } else {
                console.warn('⚠️ Owner document not found');
            }
        } else {
            console.warn('⚠️ No owner ID in booking or vehicle data');
        }
        
        createBookingDetailsModal(bookingId, booking, vehicleData, ownerData, ownerId);
        
    } catch (error) {
        console.error('❌ Error loading booking details:', error);
        showNotification({
            type: 'error',
            title: 'Error',
            message: 'Unable to load booking details',
            duration: 3000
        });
    }
};

function createBookingDetailsModal(bookingId, booking, vehicleData, ownerData, ownerId) {
    let modal = document.getElementById('bookingDetailsModal');
    if (modal) {
        modal.remove();
    }
    
    modal = document.createElement('div');
    modal.id = 'bookingDetailsModal';
    modal.className = 'booking-details-modal';
    
    const statusColors = {
        pending: { color: '#ffc107', icon: 'clock' },
        confirmed: { color: '#17a2b8', icon: 'check' },
        active: { color: '#28a745', icon: 'car' },
        completed: { color: '#28a745', icon: 'check-circle' },
        cancelled: { color: '#dc3545', icon: 'times-circle' }
    };
    
    const status = booking.status || 'pending';
    const statusInfo = statusColors[status] || statusColors.pending;
    
    const vehicleImage = (vehicleData?.images && vehicleData.images[0]) || vehicleData?.image || '/RideShare/imge/default.png';
    
    // ALWAYS show owner section, even if data is missing
    const ownerName = ownerData?.displayName || ownerData?.email?.split('@')[0] || 'Vehicle Owner';
    const ownerPhone = ownerData?.phone || null;
    const ownerEmail = ownerData?.email || null;
    
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeBookingDetails()"></div>
        <div class="booking-details-content">
            <div class="booking-detail-header">
                <button class="booking-detail-close" onclick="closeBookingDetails()">
                    <i class="fas fa-times"></i>
                </button>
                <h2 class="booking-detail-title">${booking.vehicleName || 'Booking Details'}</h2>
                <p class="booking-detail-subtitle">Booking ID: ${bookingId.substring(0, 12)}...</p>
            </div>
            
            <div class="booking-detail-body">
                <!-- Status Timeline -->
                <div class="status-timeline">
                    <div class="timeline-step ${status === 'pending' || status === 'confirmed' || status === 'active' || status === 'completed' ? 'active' : ''}">
                        <div class="timeline-dot">
                            <i class="fas fa-check"></i>
                        </div>
                        <div class="timeline-label">Booked</div>
                    </div>
                    <div class="timeline-step ${status === 'confirmed' || status === 'active' || status === 'completed' ? 'active' : ''}">
                        <div class="timeline-dot">
                            <i class="fas fa-check"></i>
                        </div>
                        <div class="timeline-label">Confirmed</div>
                    </div>
                    <div class="timeline-step ${status === 'active' || status === 'completed' ? 'active' : ''}">
                        <div class="timeline-dot">
                            <i class="fas fa-car"></i>
                        </div>
                        <div class="timeline-label">Active</div>
                    </div>
                    <div class="timeline-step ${status === 'completed' ? 'active' : ''}">
                        <div class="timeline-dot">
                            <i class="fas fa-flag-checkered"></i>
                        </div>
                        <div class="timeline-label">Completed</div>
                    </div>
                </div>
                
                <!-- Booking Information -->
                <div class="detail-section">
                    <h3><i class="fas fa-info-circle"></i> Booking Information</h3>
                    <div class="detail-grid">
                        <div class="detail-field">
                            <label>Status</label>
                            <p style="color: ${statusInfo.color}">
                                <i class="fas fa-${statusInfo.icon}"></i> ${status.toUpperCase()}
                            </p>
                        </div>
                        <div class="detail-field">
                            <label>Total Price</label>
                            <p style="color: #ff6b35; font-size: 1.3rem;">${(booking.totalPrice || 0).toFixed(2)}</p>
                        </div>
                        <div class="detail-field">
                            <label>Pickup Date</label>
                            <p><i class="fas fa-calendar"></i> ${booking.pickupDate || 'N/A'}</p>
                        </div>
                        <div class="detail-field">
                            <label>Return Date</label>
                            <p><i class="fas fa-calendar"></i> ${booking.returnDate || 'N/A'}</p>
                        </div>
                        <div class="detail-field">
                            <label>Rental Duration</label>
                            <p><i class="fas fa-clock"></i> ${booking.rentalDays || 0} days</p>
                        </div>
                        <div class="detail-field">
                            <label>Booked On</label>
                            <p>${booking.createdAt ? new Date(booking.createdAt.toDate()).toLocaleDateString() : 'N/A'}</p>
                        </div>
                    </div>
                </div>
                
                <!-- Vehicle Information -->
                ${vehicleData ? `
                <div class="detail-section">
                    <h3><i class="fas fa-car"></i> Vehicle Details</h3>
                    <div class="vehicle-preview">
                        <img src="${vehicleImage}" alt="${vehicleData.name}" class="vehicle-preview-img" onerror="this.src='/RideShare/imge/default.png'">
                        <div class="vehicle-preview-info">
                            <h4>${vehicleData.name || 'Vehicle'}</h4>
                            <p><i class="fas fa-map-marker-alt"></i> ${vehicleData.district || vehicleData.location || 'Location'}</p>
                            <p><i class="fas fa-tag"></i> ${vehicleData.pricePerDay || 0}/day</p>
                            ${vehicleData.category ? `<p><i class="fas fa-car-side"></i> ${vehicleData.category}</p>` : ''}
                        </div>
                    </div>
                </div>
                ` : ''}
                
                <!-- Owner Contact Section - ALWAYS SHOW -->
                <div class="detail-section">
                    <h3><i class="fas fa-user"></i> Vehicle Owner</h3>
                    <div class="owner-contact-section">
                        <div class="owner-info">
                            <div class="owner-avatar">
                                <i class="fas fa-user"></i>
                            </div>
                            <div class="owner-details">
                                <h4>${ownerName}</h4>
                                <p>${ownerPhone ? ownerPhone : (ownerEmail || 'Contact available after confirmation')}</p>
                            </div>
                        </div>
                        <div class="contact-buttons">
                            ${ownerId ? `
                                <button class="btn-contact btn-contact-primary" onclick="contactOwnerMessage('${ownerId}', '${bookingId}', '${ownerName.replace(/'/g, "\\'")}', '${booking.vehicleName?.replace(/'/g, "\\'") || 'Vehicle'}')">
                                    <i class="fas fa-comments"></i> Send Message
                                </button>
                            ` : `
                                <button class="btn-contact btn-contact-primary" disabled style="opacity: 0.6; cursor: not-allowed;">
                                    <i class="fas fa-comments"></i> Message (Owner info pending)
                                </button>
                            `}
                            ${ownerPhone && status !== 'pending' ? `
                                <button class="btn-contact btn-contact-secondary" onclick="contactOwnerPhone('${ownerPhone}')">
                                    <i class="fas fa-phone"></i> Call Owner
                                </button>
                            ` : status === 'pending' ? `
                                <button class="btn-contact btn-contact-secondary" disabled style="opacity: 0.6; cursor: not-allowed;">
                                    <i class="fas fa-phone"></i> Available after confirmation
                                </button>
                            ` : ''}
                        </div>
                        ${!ownerId ? `
                            <p style="color: #666; font-size: 0.9rem; margin-top: 1rem; text-align: center;">
                                <i class="fas fa-info-circle"></i> Owner contact will be available once the booking is confirmed
                            </p>
                        ` : ''}
                    </div>
                </div>
                
                <!-- Additional Information -->
                ${booking.notes ? `
                <div class="detail-section">
                    <h3><i class="fas fa-sticky-note"></i> Additional Notes</h3>
                    <div class="detail-field">
                        <p>${booking.notes}</p>
                    </div>
                </div>
                ` : ''}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }, 10);
}

window.closeBookingDetails = function() {
    const modal = document.getElementById('bookingDetailsModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            modal.remove();
        }, 300);
    }
};

window.contactOwnerPhone = function(phone) {
    window.location.href = `tel:${phone}`;
};

// Load user messages/chats
async function loadUserMessages() {
    if (!profileUser) return;
    
    const messagesList = document.getElementById('messagesList');
    messagesList.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading messages...</div>';
    
    try {
        console.log('📨 Loading messages for user:', profileUser.uid);
        
        let chatsSnapshot;
        
        // Try with orderBy first
        try {
            chatsSnapshot = await firebase.firestore()
                .collection('chats')
                .where('participants', 'array-contains', profileUser.uid)
                .orderBy('lastMessageTime', 'desc')
                .get();
            
            console.log('✅ Query with orderBy successful, found:', chatsSnapshot.size, 'chats');
        } catch (indexError) {
            console.warn('⚠️ Index not found, trying without orderBy:', indexError.message);
            
            // If index error, show link to create index
            if (indexError.code === 'failed-precondition' || indexError.message.includes('index')) {
                const indexUrl = indexError.message.match(/https:\/\/[^\s]+/);
                if (indexUrl) {
                    messagesList.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-exclamation-triangle" style="color: #ffc107;"></i>
                            <h4>Index Required</h4>
                            <p>Please create a database index to enable messages.</p>
                            <a href="${indexUrl[0]}" target="_blank" class="btn btn-primary" style="margin-top: 1rem;">
                                <i class="fas fa-external-link-alt"></i> Create Index
                            </a>
                            <p style="margin-top: 1rem; font-size: 0.85rem;">After creating the index, refresh this page.</p>
                        </div>
                    `;
                    return;
                }
            }
            
            // Fallback: Get all chats without ordering
            chatsSnapshot = await firebase.firestore()
                .collection('chats')
                .where('participants', 'array-contains', profileUser.uid)
                .get();
            
            console.log('✅ Query without orderBy successful, found:', chatsSnapshot.size, 'chats');
        }
        
        if (chatsSnapshot.empty) {
            messagesList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-comments"></i>
                    <h4>No messages yet</h4>
                    <p>Your conversations will appear here</p>
                    <p style="margin-top: 1rem; font-size: 0.9rem; color: #666;">
                        <i class="fas fa-info-circle"></i> Messages from bookings will show up here
                    </p>
                </div>
            `;
            return;
        }
        
        // Convert to array and sort manually if needed
        let chats = [];
        chatsSnapshot.forEach(doc => {
            chats.push({ id: doc.id, data: doc.data() });
        });
        
        // Sort by lastMessageTime if available
        chats.sort((a, b) => {
            const aTime = a.data.lastMessageTime ? a.data.lastMessageTime.toMillis() : 0;
            const bTime = b.data.lastMessageTime ? b.data.lastMessageTime.toMillis() : 0;
            return bTime - aTime;
        });
        
        let html = '';
        
        for (const chat of chats) {
            const chatData = chat.data;
            
            // Determine who the other person is
            const otherUserId = chatData.participants.find(id => id !== profileUser.uid);
            
            if (!otherUserId) {
                console.warn('⚠️ Could not find other user in chat:', chat.id);
                continue;
            }
            
            // Get other user's info
            let otherUserName = 'User';
            try {
                const otherUserDoc = await firebase.firestore()
                    .collection('users')
                    .doc(otherUserId)
                    .get();
                
                if (otherUserDoc.exists) {
                    const userData = otherUserDoc.data();
                    otherUserName = userData.displayName || userData.email?.split('@')[0] || 'User';
                }
            } catch (e) {
                console.warn('Could not get user info:', e);
            }
            
            // Check for unread messages - show actual count
            let unreadCount = 0;
            try {
                const unreadSnapshot = await firebase.firestore()
                    .collection('chats')
                    .doc(chat.id)
                    .collection('messages')
                    .where('senderId', '==', otherUserId)
                    .where('read', '==', false)
                    .get();
                unreadCount = unreadSnapshot.size;
                
                console.log(`Chat ${chat.id} has ${unreadCount} unread messages`);
            } catch (e) {
                console.warn('Could not get unread count:', e);
            }
            
            // Format time
            const lastMessageTime = chatData.lastMessageTime 
                ? formatChatTime(chatData.lastMessageTime.toDate())
                : 'Recently';
            
            const initial = otherUserName.charAt(0).toUpperCase();
            
            html += `
                <div class="chat-list-item" onclick="openChatFromList('${otherUserId}', '${chat.id}', '${otherUserName.replace(/'/g, "\\'")}', '${chatData.vehicleName?.replace(/'/g, "\\'") || 'Vehicle'}')">
                    <div class="chat-avatar">${initial}</div>
                    <div class="chat-info">
                        <div class="chat-name">${otherUserName}</div>
                        <div class="chat-vehicle"><i class="fas fa-car"></i> ${chatData.vehicleName || 'Vehicle'}</div>
                        <div class="chat-preview">${chatData.lastMessage || 'No messages yet'}</div>
                    </div>
                    <div class="chat-meta">
                        <div class="chat-time">${lastMessageTime}</div>
                        ${unreadCount > 0 ? `<div class="chat-unread">${unreadCount}</div>` : ''}
                    </div>
                </div>
            `;
        }
        
        if (html) {
            messagesList.innerHTML = html;
            console.log('✅ Messages loaded successfully');
        } else {
            messagesList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-comments"></i>
                    <h4>No messages yet</h4>
                    <p>Your conversations will appear here</p>
                </div>
            `;
        }
        
    } catch (error) {
        console.error('❌ Error loading messages:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
        let errorMessage = 'Please try again later';
        let errorIcon = 'exclamation-circle';
        
        if (error.code === 'permission-denied') {
            errorMessage = 'Permission denied. Please check Firebase rules.';
            errorIcon = 'lock';
        } else if (error.code === 'failed-precondition') {
            errorMessage = 'Database index required. Check console for link.';
            errorIcon = 'database';
        }
        
        messagesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-${errorIcon}" style="color: #dc3545;"></i>
                <h4>Unable to Load Messages</h4>
                <p>${errorMessage}</p>
                <button class="btn btn-primary" onclick="loadUserMessages()" style="margin-top: 1rem;">
                    <i class="fas fa-redo"></i> Try Again
                </button>
            </div>
        `;
    }
}

// Format chat time
function formatChatTime(date) {
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date >= today) {
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date >= yesterday) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Open chat from messages list
window.openChatFromList = function(otherUserId, chatId, otherUserName, vehicleName) {
    console.log('💬 Opening chat from list:', { otherUserId, chatId, otherUserName, vehicleName });
    
    // IMMEDIATELY hide the unread badge from this specific chat (visual feedback)
    const chatItems = document.querySelectorAll('.chat-list-item');
    chatItems.forEach(item => {
        if (item.onclick && item.onclick.toString().includes(chatId)) {
            const unreadBadge = item.querySelector('.chat-unread');
            if (unreadBadge) {
                unreadBadge.classList.add('hiding');
                setTimeout(() => {
                    if (unreadBadge && unreadBadge.parentNode) {
                        unreadBadge.remove();
                    }
                }, 300);
            }
        }
    });
    
    // Also immediately update the main badge (optimistic update)
    const currentBadge = document.querySelector('.unread-badge');
    if (currentBadge) {
        const currentCount = parseInt(currentBadge.textContent) || 0;
        if (currentCount > 1) {
            currentBadge.textContent = currentCount - 1;
        } else {
            currentBadge.classList.add('hiding');
            setTimeout(() => {
                if (currentBadge && currentBadge.parentNode) {
                    currentBadge.remove();
                }
            }, 300);
        }
    }
    
    if (typeof openChatModal === 'function') {
        openChatModal(otherUserId, chatId, otherUserName, vehicleName);
    } else {
        console.error('❌ Chat system not loaded');
        showNotification({
            type: 'error',
            title: 'Error',
            message: 'Chat system not loaded. Please refresh the page.',
            duration: 3000
        });
    }
};

async function loadUserVehicles() {
    if (!profileUser) return;
    
    const vehiclesList = document.getElementById('vehiclesList');
    vehiclesList.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';
    
    try {
        console.log('Loading vehicles for user:', profileUser.uid);
        
        let snapshot;
        try {
            snapshot = await firebase.firestore()
                .collection('vehicles')
                .where('ownerId', '==', profileUser.uid)
                .get();
                
            console.log('Query successful, found:', snapshot.size, 'vehicles');
        } catch (queryError) {
            console.warn('Query with where failed, trying to get all:', queryError);
            
            const allVehicles = await firebase.firestore()
                .collection('vehicles')
                .get();
            
            console.log('Total vehicles in database:', allVehicles.size);
            
            const userVehicles = [];
            allVehicles.forEach(doc => {
                const data = doc.data();
                console.log('Checking vehicle:', doc.id, 'ownerId:', data.ownerId, 'vs', profileUser.uid);
                if (data.ownerId === profileUser.uid) {
                    userVehicles.push({ id: doc.id, data: data });
                }
            });
            
            console.log('User vehicles found:', userVehicles.length);
            
            userVehicles.sort((a, b) => {
                const aTime = a.data.createdAt ? a.data.createdAt.toMillis() : 0;
                const bTime = b.data.createdAt ? b.data.createdAt.toMillis() : 0;
                return bTime - aTime;
            });
            
            snapshot = {
                empty: userVehicles.length === 0,
                size: userVehicles.length,
                forEach: function(callback) {
                    userVehicles.forEach(item => {
                        callback({
                            id: item.id,
                            data: () => item.data
                        });
                    });
                }
            };
        }
        
        if (snapshot.empty) {
            vehiclesList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-car"></i>
                    <h4>No vehicles listed</h4>
                    <p>You haven't listed any vehicles yet. Start earning by listing your first vehicle!</p>
                    <a href="list-your-vehicle.html" class="btn btn-primary">List a Vehicle</a>
                </div>
            `;
            
            showNotification({
                type: 'info',
                title: 'No Vehicles',
                message: 'You haven\'t listed any vehicles yet',
                duration: 3000
            });
            return;
        }
        
        let html = '<div class="vehicles-grid">';
        let vehicleCount = 0;
        
        snapshot.forEach(doc => {
            const vehicle = doc.data();
            vehicleCount++;
            
            console.log('Displaying vehicle:', doc.id, vehicle);
            
            const statusColors = {
                pending: 'warning',
                approved: 'success',
                rejected: 'danger'
            };
            
            const vehicleStatus = vehicle.status || 'pending';
            const statusColor = statusColors[vehicleStatus] || 'warning';
            const imageUrl = (vehicle.images && vehicle.images[0]) || vehicle.image || '/RideShare/imge/default.png';
            
            html += `
                <div class="vehicle-card-profile" style="animation: fadeInScale 0.3s ease ${vehicleCount * 0.1}s both;">
                    <div class="vehicle-img" style="background-image: url('${imageUrl}')">
                        <span class="badge-${statusColor}">${vehicleStatus.toUpperCase()}</span>
                    </div>
                    <div class="vehicle-details">
                        <h4>${vehicle.name || 'Vehicle'}</h4>
                        <div class="vehicle-meta">
                            <span><i class="fas fa-tag"></i> $${vehicle.pricePerDay || 0}/day</span>
                            <span><i class="fas fa-map-marker-alt"></i> ${vehicle.district || vehicle.location || 'Location'}</span>
                        </div>
                        <div class="vehicle-stats">
                            <span><i class="fas fa-star"></i> ${vehicle.rating || 0}</span>
                            <span><i class="fas fa-comment"></i> ${vehicle.reviewCount || 0} reviews</span>
                            ${vehicle.available ? '<span class="available-badge"><i class="fas fa-check-circle"></i> Available</span>' : '<span class="unavailable-badge"><i class="fas fa-times-circle"></i> Unavailable</span>'}
                        </div>
                        <div class="vehicle-actions">
                            <button class="btn-edit-vehicle" onclick="editVehicle('${doc.id}')">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn-toggle-availability" onclick="toggleAvailability('${doc.id}', ${vehicle.available})">
                                <i class="fas fa-${vehicle.available ? 'pause' : 'play'}-circle"></i> 
                                ${vehicle.available ? 'Disable' : 'Enable'}
                            </button>
                            <button class="btn-delete-vehicle" onclick="deleteVehicleConfirm('${doc.id}', '${vehicle.name}')">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        
        vehiclesList.innerHTML = html;
        
        showNotification({
            type: 'success',
            title: 'Vehicles Loaded',
            message: `Found ${vehicleCount} vehicle${vehicleCount !== 1 ? 's' : ''}`,
            duration: 2000
        });
        
    } catch (error) {
        console.error('Error loading vehicles:', error);
        vehiclesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-circle"></i>
                <h4>Unable to Load Vehicles</h4>
                <p>There was an error loading your vehicles. Please try again later.</p>
            </div>
        `;
        
        showNotification({
            type: 'error',
            title: 'Load Failed',
            message: 'Unable to load vehicles. Please try again.',
            duration: 4000
        });
    }
}

window.showProfileTab = function(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    document.querySelector(`.tab-btn[onclick="showProfileTab('${tabName}')"]`).classList.add('active');
    
    if (tabName === 'info') {
        document.getElementById('infoTab').classList.add('active');
    } else if (tabName === 'bookings') {
        document.getElementById('bookingsTab').classList.add('active');
        loadUserBookings();
    } else if (tabName === 'messages') {
        document.getElementById('messagesTab').classList.add('active');
        loadUserMessages();
        // Update badge when viewing messages tab
        if (typeof updateUnreadBadge === 'function') {
            setTimeout(() => updateUnreadBadge(), 500);
        }
    } else if (tabName === 'vehicles') {
        document.getElementById('vehiclesTab').classList.add('active');
        loadUserVehicles();
    } else if (tabName === 'settings') {
        document.getElementById('settingsTab').classList.add('active');
    }
};

window.closeProfileModal = function() {
    const modal = document.getElementById('profileModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
};

window.handleLogout = function() {
    showNotification({
        type: 'warning',
        title: 'Confirm Logout',
        message: 'Are you sure you want to logout?',
        duration: 5000,
        action: {
            text: 'Logout',
            onClick: function() {
                firebase.auth().signOut().then(() => {
                    closeProfileModal();
                    showNotification({
                        type: 'success',
                        title: 'Logged Out',
                        message: 'You have been logged out successfully',
                        duration: 2000
                    });
                    setTimeout(() => {
                        window.location.href = 'home.html';
                    }, 1500);
                }).catch(error => {
                    console.error('Logout error:', error);
                    showNotification({
                        type: 'error',
                        title: 'Logout Failed',
                        message: 'Unable to logout. Please try again.',
                        duration: 3000
                    });
                });
            }
        }
    });
};

window.handleDeleteAccount = function() {
    showNotification({
        type: 'error',
        title: 'Delete Account',
        message: 'Account deletion feature coming soon. Contact support for assistance.',
        duration: 5000
    });
};

window.editVehicle = async function(vehicleId) {
    try {
        showNotification({
            type: 'info',
            title: 'Loading Vehicle',
            message: 'Preparing vehicle data for editing...',
            duration: 2000
        });
        
        const vehicleDoc = await firebase.firestore()
            .collection('vehicles')
            .doc(vehicleId)
            .get();
        
        if (!vehicleDoc.exists) {
            throw new Error('Vehicle not found');
        }
        
        const vehicle = vehicleDoc.data();
        
        sessionStorage.setItem('editVehicle', JSON.stringify({
            id: vehicleId,
            ...vehicle
        }));
        
        showNotification({
            type: 'success',
            title: 'Redirecting',
            message: 'Opening vehicle editor...',
            duration: 1500
        });
        
        setTimeout(() => {
            window.location.href = `list-your-vehicle.html?edit=${vehicleId}`;
        }, 1500);
        
    } catch (error) {
        console.error('Error editing vehicle:', error);
        showNotification({
            type: 'error',
            title: 'Edit Failed',
            message: 'Unable to edit vehicle. Please try again.',
            duration: 4000
        });
    }
};

window.toggleAvailability = async function(vehicleId, currentStatus) {
    try {
        const newStatus = !currentStatus;
        
        showNotification({
            type: 'info',
            title: 'Updating',
            message: 'Changing vehicle availability...',
            duration: 2000
        });
        
        if (typeof window.updateVehicle === 'function') {
            await window.updateVehicle(vehicleId, { available: newStatus });
        } else {
            await firebase.firestore()
                .collection('vehicles')
                .doc(vehicleId)
                .update({
                    available: newStatus,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
        }
        
        showNotification({
            type: 'success',
            title: 'Updated',
            message: `Vehicle is now ${newStatus ? 'available' : 'unavailable'} for rent`,
            duration: 3000
        });
        
        loadUserVehicles();
        
    } catch (error) {
        console.error('Error toggling availability:', error);
        showNotification({
            type: 'error',
            title: 'Update Failed',
            message: error.message || 'Unable to change availability. Please try again.',
            duration: 4000
        });
    }
};

window.deleteVehicleConfirm = async function(vehicleId, vehicleName) {
    console.log('🗑️ Delete requested for:', vehicleId, vehicleName);
    
    showNotification({
        type: 'warning',
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete "${vehicleName}"? This action cannot be undone.`,
        duration: 0,
        action: {
            text: 'Delete Vehicle',
            onClick: async function() {
                try {
                    console.log('🔄 Starting delete process...');
                    
                    showNotification({
                        type: 'info',
                        title: 'Deleting Vehicle',
                        message: 'Please wait while we remove your vehicle...',
                        duration: 3000
                    });
                    
                    await firebase.firestore()
                        .collection('vehicles')
                        .doc(vehicleId)
                        .delete();
                    
                    console.log('✅ Vehicle deleted from Firebase');
                    
                    try {
                        await firebase.firestore()
                            .collection('users')
                            .doc(profileUser.uid)
                            .collection('vehicles')
                            .doc(vehicleId)
                            .delete();
                        console.log('✅ Vehicle deleted from user subcollection');
                    } catch (subError) {
                        console.log('ℹ️ User subcollection delete not needed:', subError.message);
                    }
                    
                    showNotification({
                        type: 'success',
                        title: 'Vehicle Deleted',
                        message: `"${vehicleName}" has been removed successfully`,
                        duration: 4000
                    });
                    
                    console.log('🔄 Reloading vehicles list...');
                    setTimeout(() => {
                        loadUserVehicles();
                        loadStats();
                    }, 500);
                    
                } catch (error) {
                    console.error('❌ Error deleting vehicle:', error);
                    
                    showNotification({
                        type: 'error',
                        title: 'Delete Failed',
                        message: `Failed to delete "${vehicleName}". Please try again.`,
                        duration: 5000
                    });
                }
            }
        }
    });
};

// Add this CSS to the existing profileStyles in profile-modal.js
const idVerificationStyles = `
    .verification-alert {
        background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
        border-left: 4px solid #ffc107;
        padding: 1rem;
        border-radius: 8px;
        margin-top: 1.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        animation: slideInLeft 0.4s ease;
    }
    
    .verification-alert i {
        font-size: 2rem;
        color: #ff6b35;
    }
    
    .verification-alert strong {
        display: block;
        color: #333;
        margin-bottom: 0.25rem;
    }
    
    .verification-alert p {
        color: #666;
        margin: 0;
        font-size: 0.9rem;
    }
    
    .btn-verify {
        background: linear-gradient(135deg, #ff6b35 0%, #ff8555 100%);
        color: white;
        border: none;
        padding: 0.6rem 1.2rem;
        border-radius: 20px;
        cursor: pointer;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.3s ease;
        white-space: nowrap;
    }
    
    .btn-verify:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
    }
    
    .badge-pending {
        background: #ffc107;
        color: #333;
        padding: 0.3rem 0.8rem;
        border-radius: 12px;
        font-size: 0.85rem;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
    }
    
    .badge-approved {
        background: #28a745;
        color: white;
        padding: 0.3rem 0.8rem;
        border-radius: 12px;
        font-size: 0.85rem;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
    }
    
    .badge-rejected {
        background: #dc3545;
        color: white;
        padding: 0.3rem 0.8rem;
        border-radius: 12px;
        font-size: 0.85rem;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
    }
    
    .badge-not-verified {
        background: #6c757d;
        color: white;
        padding: 0.3rem 0.8rem;
        border-radius: 12px;
        font-size: 0.85rem;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
    }
`;

// REPLACE the createEnhancedProfileModal function with this updated version:
function createEnhancedProfileModal() {
    const modal = document.createElement('div');
    modal.id = 'profileModal';
    modal.className = 'profile-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeProfileModal()"></div>
        <div class="modal-content">
            <button class="modal-close" onclick="closeProfileModal()">
                <i class="fas fa-times"></i>
            </button>
            
            <div class="profile-header">
                <div class="profile-avatar">
                    <i class="fas fa-user-circle"></i>
                </div>
                <h2 id="profileName">Loading...</h2>
                <p id="profileEmail"></p>
                <div class="profile-stats">
                    <div class="stat-item">
                        <span class="stat-number" id="totalBookings">0</span>
                        <span class="stat-label">Bookings</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number" id="totalVehicles">0</span>
                        <span class="stat-label">Vehicles</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number" id="memberDays">0</span>
                        <span class="stat-label">Days</span>
                    </div>
                </div>
            </div>
            
            <div class="profile-tabs">
                <button class="tab-btn active" onclick="showProfileTab('info')">
                    <i class="fas fa-info-circle"></i> Profile
                </button>
                <button class="tab-btn" onclick="showProfileTab('bookings')">
                    <i class="fas fa-calendar-check"></i> Bookings
                </button>
                <button class="tab-btn" onclick="showProfileTab('messages')">
                    <i class="fas fa-comments"></i> Messages
                </button>
                <button class="tab-btn" onclick="showProfileTab('vehicles')">
                    <i class="fas fa-car"></i> Vehicles
                </button>
                <button class="tab-btn" onclick="showProfileTab('settings')">
                    <i class="fas fa-cog"></i> Settings
                </button>
            </div>
            
            <div class="profile-body">
                <!-- Profile Info Tab -->
                <div id="infoTab" class="tab-content active">
                    <div class="info-section">
                        <h3><i class="fas fa-user"></i> Personal Information</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <label>Full Name</label>
                                <p id="infoName">-</p>
                            </div>
                            <div class="info-item">
                                <label>Email Address</label>
                                <p id="infoEmail">-</p>
                            </div>
                            <div class="info-item">
                                <label>Phone Number</label>
                                <p id="infoPhone">Not set</p>
                            </div>
                            <div class="info-item">
                                <label>Account Type</label>
                                <p id="infoAccountType">-</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-section">
                        <h3><i class="fas fa-shield-alt"></i> Account Status</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <label>Member Since</label>
                                <p id="infoMemberSince">-</p>
                            </div>
                            <div class="info-item">
                                <label>Email Verified</label>
                                <p id="infoEmailVerified">-</p>
                            </div>
                            <div class="info-item">
                                <label>ID Verification</label>
                                <p id="infoIdVerified">-</p>
                            </div>
                            <div class="info-item">
                                <label>User ID</label>
                                <p id="infoUserId">-</p>
                            </div>
                            <div class="info-item">
                                <label>Last Login</label>
                                <p id="infoLastLogin">-</p>
                            </div>
                        </div>
                        
                        <!-- ID Verification Alert -->
                        <div id="idVerificationAlert" class="verification-alert" style="display: none;">
                            <i class="fas fa-exclamation-triangle"></i>
                            <div>
                                <strong>ID Verification Required</strong>
                                <p>Complete ID verification to access all features</p>
                            </div>
                            <button class="btn-verify" onclick="goToVerification()">
                                <i class="fas fa-id-card"></i> Verify Now
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Bookings Tab -->
                <div id="bookingsTab" class="tab-content">
                    <div class="tab-header">
                        <h3><i class="fas fa-calendar-check"></i> My Bookings</h3>
                        <a href="rent.html" class="btn-small btn-primary">
                            <i class="fas fa-plus"></i> New Booking
                        </a>
                    </div>
                    <div id="bookingsList">
                        <div class="loading">
                            <i class="fas fa-spinner fa-spin"></i> Loading bookings...
                        </div>
                    </div>
                </div>
                
                <!-- Messages Tab -->
                <div id="messagesTab" class="tab-content">
                    <div class="tab-header">
                        <h3><i class="fas fa-comments"></i> My Messages</h3>
                    </div>
                    <div id="messagesList">
                        <div class="loading">
                            <i class="fas fa-spinner fa-spin"></i> Loading messages...
                        </div>
                    </div>
                </div>
                
                <!-- Vehicles Tab -->
                <div id="vehiclesTab" class="tab-content">
                    <div class="tab-header">
                        <h3><i class="fas fa-car"></i> My Vehicles</h3>
                        <a href="list-your-vehicle.html" class="btn-small btn-primary">
                            <i class="fas fa-plus"></i> List Vehicle
                        </a>
                    </div>
                    <div id="vehiclesList">
                        <div class="loading">
                            <i class="fas fa-spinner fa-spin"></i> Loading vehicles...
                        </div>
                    </div>
                </div>
                
                <!-- Settings Tab -->
                <div id="settingsTab" class="tab-content">
                    <div class="settings-section">
                        <h3><i class="fas fa-bell"></i> Notifications</h3>
                        <div class="settings-group">
                            <label class="switch-label">
                                <input type="checkbox" checked>
                                <span class="slider"></span>
                                Email notifications
                            </label>
                            <label class="switch-label">
                                <input type="checkbox" checked>
                                <span class="slider"></span>
                                Booking updates
                            </label>
                        </div>
                    </div>
                    
                    <div class="settings-section">
                        <h3><i class="fas fa-lock"></i> Privacy</h3>
                        <div class="settings-group">
                            <label class="switch-label">
                                <input type="checkbox">
                                <span class="slider"></span>
                                Show profile to other users
                            </label>
                            <label class="switch-label">
                                <input type="checkbox">
                                <span class="slider"></span>
                                Share booking history
                            </label>
                        </div>
                    </div>
                    
                    <div class="danger-zone">
                        <h3><i class="fas fa-exclamation-triangle"></i> Danger Zone</h3>
                        <button class="btn-danger" onclick="handleDeleteAccount()">
                            <i class="fas fa-trash"></i> Delete Account
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="profile-footer">
                <button class="btn btn-secondary" onclick="closeProfileModal()">
                    <i class="fas fa-times"></i> Close
                </button>
                <button class="btn btn-danger" onclick="handleLogout()">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>
        </div>
    `;
    
    return modal;
}

// REPLACE the loadUserProfile function with this updated version:
async function loadUserProfile() {
    if (!profileUser) return;
    
    try {
        document.getElementById('profileName').textContent = profileUser.displayName || 'User';
        document.getElementById('profileEmail').textContent = profileUser.email;
        
        document.getElementById('infoName').textContent = profileUser.displayName || 'Not set';
        document.getElementById('infoEmail').textContent = profileUser.email;
        document.getElementById('infoEmailVerified').innerHTML = profileUser.emailVerified 
            ? '<span class="badge-success"><i class="fas fa-check-circle"></i> Verified</span>' 
            : '<span class="badge-warning"><i class="fas fa-exclamation-circle"></i> Not Verified</span>';
        document.getElementById('infoUserId').textContent = profileUser.uid.substring(0, 12) + '...';
        document.getElementById('infoLastLogin').textContent = new Date(profileUser.metadata.lastSignInTime).toLocaleDateString();
        
        const userDoc = await firebase.firestore()
            .collection('users')
            .doc(profileUser.uid)
            .get();
        
        if (userDoc.exists) {
            const userData = userDoc.data();
            
            if (userData.phone) {
                document.getElementById('infoPhone').textContent = userData.phone;
            }
            
            document.getElementById('infoAccountType').innerHTML = 
                '<span class="badge-primary">' + (userData.accountType || 'Both Renter & Owner') + '</span>';
            
            if (userData.createdAt) {
                const createdDate = userData.createdAt.toDate();
                document.getElementById('infoMemberSince').textContent = createdDate.toLocaleDateString();
                
                const daysSince = Math.floor((Date.now() - createdDate) / (1000 * 60 * 60 * 24));
                document.getElementById('memberDays').textContent = daysSince;
            }
            
            // Load ID Verification Status
            const idVerificationStatus = userData.idVerificationStatus || 'not_verified';
            const idVerificationAlert = document.getElementById('idVerificationAlert');
            const infoIdVerified = document.getElementById('infoIdVerified');
            
            switch(idVerificationStatus) {
                case 'approved':
                    infoIdVerified.innerHTML = '<span class="badge-approved"><i class="fas fa-check-circle"></i> Verified</span>';
                    if (idVerificationAlert) idVerificationAlert.style.display = 'none';
                    break;
                    
                case 'pending':
                    infoIdVerified.innerHTML = '<span class="badge-pending"><i class="fas fa-clock"></i> Pending Review</span>';
                    if (idVerificationAlert) {
                        idVerificationAlert.style.display = 'none'; // Hide alert when pending
                    }
                    break;
                    
                case 'rejected':
                    infoIdVerified.innerHTML = '<span class="badge-rejected"><i class="fas fa-times-circle"></i> Rejected</span>';
                    if (idVerificationAlert) {
                        idVerificationAlert.style.display = 'flex';
                        idVerificationAlert.querySelector('strong').textContent = 'ID Verification Rejected';
                        idVerificationAlert.querySelector('p').textContent = 'Please resubmit your ID verification documents';
                    }
                    break;
                    
                case 'skipped':
                    infoIdVerified.innerHTML = '<span class="badge-not-verified"><i class="fas fa-exclamation-circle"></i> Skipped</span>';
                    if (idVerificationAlert) idVerificationAlert.style.display = 'flex';
                    break;
                    
                default: // not_verified
                    infoIdVerified.innerHTML = '<span class="badge-not-verified"><i class="fas fa-times-circle"></i> Not Verified</span>';
                    if (idVerificationAlert) idVerificationAlert.style.display = 'flex';
            }
        }
        
        loadStats();
        
        // Load unread message count
        if (typeof updateUnreadBadge === 'function') {
            updateUnreadBadge();
        }
        
    } catch (error) {
        console.error('Error loading profile:', error);
        showNotification({
            type: 'error',
            title: 'Profile Load Error',
            message: 'Unable to load some profile information',
            duration: 3000
        });
    }
}

// ADD this new function to navigate to verification page:
window.goToVerification = function() {
    closeProfileModal();
    window.location.href = 'verify-id.html';
};

// Make sure to add the new styles to the existing profileStyles
const existingStyles = document.head.querySelector('style[data-profile-styles]');
if (existingStyles) {
    existingStyles.textContent += idVerificationStyles;
} else {
    const styleElement = document.createElement('style');
    styleElement.setAttribute('data-profile-styles', 'true');
    styleElement.textContent = profileStyles.textContent + idVerificationStyles;
    document.head.appendChild(styleElement);
}

console.log('✅ ID Verification status integrated into profile');
console.log('✔ Enhanced profile system with booking details loaded');
// Navigate to verification page
window.goToVerification = function() {
    closeProfileModal();
    window.location.href = 'verify-id.html';
};
