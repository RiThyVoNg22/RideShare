// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCcwIlirbJGictLHCYOU6-1hwLTVVMlelY",
    authDomain: "rideshare-local-d1078.firebaseapp.com",
    projectId: "rideshare-local-d1078",
    storageBucket: "rideshare-local-d1078.firebasestorage.app",
    messagingSenderId: "159642923065",
    appId: "1:159642923065:web:07d56f61abafdade7e1de8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Enable offline persistence for Firestore
db.enablePersistence()
    .catch((err) => {
        if (err.code === 'failed-precondition') {
            console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code === 'unimplemented') {
            console.log('The current browser does not support offline persistence');
        }
    });

// Authentication state observer
let currentFirebaseUser = null;

auth.onAuthStateChanged((user) => {
    currentFirebaseUser = user;
    if (user) {
        // User is signed in
        console.log('User logged in:', user.email);
        updateUIForAuthenticatedUser(user);
    } else {
        // User is signed out
        console.log('User logged out');
        updateUIForUnauthenticatedUser();
    }
});

// Helper function to update UI for authenticated user
function updateUIForAuthenticatedUser(user) {
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
        getUserProfile(user.uid).then(profile => {
            const displayName = profile?.firstName || user.email.split('@')[0];
            authButtons.innerHTML = `
                <div class="user-menu">
                    <span class="user-greeting">Welcome, ${displayName}</span>
                    <button class="btn btn-secondary" onclick="handleLogout()">Logout</button>
                </div>
            `;
        });
    }
}

// Helper function to update UI for unauthenticated user
function updateUIForUnauthenticatedUser() {
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
        authButtons.innerHTML = `
            <a href="auth.html" class="btn btn-secondary">Sign Up / Log In</a>
        `;
    }
}