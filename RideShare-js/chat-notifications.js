// chat-notifications.js - Real-time Chat Notification System

let messageListener = null;
let unreadCount = 0;

// Initialize notification system when user logs in
window.addEventListener('load', function() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log('🔔 Starting notification listener for:', user.uid);
            startMessageNotifications(user.uid);
        } else {
            stopMessageNotifications();
        }
    });
});

// Start listening for new messages
function startMessageNotifications(userId) {
    if (messageListener) {
        messageListener();
    }
    
    // Listen to all chats where user is a participant
    messageListener = firebase.firestore()
        .collection('chats')
        .where('participants', 'array-contains', userId)
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'modified') {
                    const chat = change.doc.data();
                    
                    // Check if there's a new message (lastMessageTime changed)
                    // Only notify if not the current user's message
                    if (chat.lastMessage && chat.lastMessageTime) {
                        const otherUserId = chat.participants.find(id => id !== userId);
                        
                        // Get the last message to check if it's from the other user
                        firebase.firestore()
                            .collection('chats')
                            .doc(change.doc.id)
                            .collection('messages')
                            .orderBy('timestamp', 'desc')
                            .limit(1)
                            .get()
                            .then((msgSnapshot) => {
                                if (!msgSnapshot.empty) {
                                    const lastMsg = msgSnapshot.docs[0].data();
                                    
                                    // Only notify if message is from other user
                                    if (lastMsg.senderId === otherUserId) {
                                        showChatNotification(chat, lastMsg, change.doc.id);
                                        updateUnreadBadge();
                                    }
                                }
                            });
                    }
                }
            });
        });
}

// Stop listening
function stopMessageNotifications() {
    if (messageListener) {
        messageListener();
        messageListener = null;
    }
}

// Show notification for new message
function showChatNotification(chat, message, chatId) {
    console.log('🔔 New message notification:', message.message);
    
    // Don't show notification if chat is currently open
    const chatModal = document.getElementById('chatModal');
    if (chatModal && chatModal.classList.contains('active')) {
        return;
    }
    
    // Play notification sound
    playNotificationSound();
    
    // Show in-app notification
    showNotification({
        type: 'info',
        title: `New message from ${message.senderName}`,
        message: message.message.substring(0, 50) + (message.message.length > 50 ? '...' : ''),
        duration: 5000,
        action: {
            text: 'View',
            onClick: function() {
                // Open the chat
                openChatFromNotification(chatId, chat);
            }
        }
    });
    
    // Browser notification (if permission granted)
    showBrowserNotification(message.senderName, message.message, chat.vehicleName);
}

// Update unread message badge
async function updateUnreadBadge() {
    if (!profileUser) return;
    
    try {
        // Count unread messages
        const chatsSnapshot = await firebase.firestore()
            .collection('chats')
            .where('participants', 'array-contains', profileUser.uid)
            .get();
        
        let unreadTotal = 0;
        
        for (const doc of chatsSnapshot.docs) {
            const chat = doc.data();
            const otherUserId = chat.participants.find(id => id !== profileUser.uid);
            
            // Get unread messages from this chat
            const unreadSnapshot = await firebase.firestore()
                .collection('chats')
                .doc(doc.id)
                .collection('messages')
                .where('senderId', '==', otherUserId)
                .where('read', '==', false)
                .get();
            
            unreadTotal += unreadSnapshot.size;
        }
        
        unreadCount = unreadTotal;
        
        // Update badge on Messages tab
        const messagesTab = document.querySelector('.tab-btn[onclick="showProfileTab(\'messages\')"]');
        if (messagesTab) {
            let badge = messagesTab.querySelector('.unread-badge');
            
            if (unreadTotal > 0) {
                if (!badge) {
                    badge = document.createElement('span');
                    badge.className = 'unread-badge';
                    messagesTab.appendChild(badge);
                }
                badge.textContent = unreadTotal > 99 ? '99+' : unreadTotal;
            } else if (badge) {
                badge.remove();
            }
        }
        
    } catch (error) {
        console.error('Error updating unread badge:', error);
    }
}

// Play notification sound
function playNotificationSound() {
    try {
        // Create a simple notification sound using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
        console.warn('Could not play notification sound:', error);
    }
}

// Show browser notification
function showBrowserNotification(senderName, message, vehicleName) {
    // Check if browser supports notifications
    if (!('Notification' in window)) {
        console.log('Browser does not support notifications');
        return;
    }
    
    // Check permission
    if (Notification.permission === 'granted') {
        createNotification(senderName, message, vehicleName);
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                createNotification(senderName, message, vehicleName);
            }
        });
    }
}

// Create browser notification
function createNotification(senderName, message, vehicleName) {
    const notification = new Notification(`${senderName} - ${vehicleName}`, {
        body: message,
        icon: '/RideShare/imge/logo.png', // Update with your logo path
        badge: '/RideShare/imge/logo.png',
        tag: 'chat-message',
        requireInteraction: false,
        silent: false
    });
    
    notification.onclick = function() {
        window.focus();
        notification.close();
        openProfileModal();
        setTimeout(() => {
            showProfileTab('messages');
        }, 300);
    };
    
    // Auto close after 5 seconds
    setTimeout(() => notification.close(), 5000);
}

// Open chat from notification
function openChatFromNotification(chatId, chat) {
    const otherUserId = chat.participants.find(id => id !== profileUser.uid);
    
    // Get other user's name
    firebase.firestore()
        .collection('users')
        .doc(otherUserId)
        .get()
        .then(doc => {
            const otherUserName = doc.exists 
                ? (doc.data().displayName || doc.data().email?.split('@')[0] || 'User')
                : 'User';
            
            // Open profile modal first
            if (!document.getElementById('profileModal')) {
                openProfileModal();
            }
            
            // Wait a bit then open chat
            setTimeout(() => {
                if (typeof openChatModal === 'function') {
                    openChatModal(otherUserId, chatId, otherUserName, chat.vehicleName || 'Vehicle');
                }
            }, 300);
        });
}

// Mark messages as read when chat is opened
window.markMessagesAsRead = async function(chatId, otherUserId) {
    try {
        const unreadMessages = await firebase.firestore()
            .collection('chats')
            .doc(chatId)
            .collection('messages')
            .where('senderId', '==', otherUserId)
            .where('read', '==', false)
            .get();
        
        const batch = firebase.firestore().batch();
        
        unreadMessages.forEach(doc => {
            batch.update(doc.ref, { read: true });
        });
        
        await batch.commit();
        
        console.log('✅ Marked messages as read');
        
        // Update badge
        updateUnreadBadge();
        
    } catch (error) {
        console.error('Error marking messages as read:', error);
    }
};

// Add styles for unread badge
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .unread-badge {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: #ff6b35;
        color: white;
        font-size: 0.7rem;
        font-weight: 600;
        padding: 0.2rem 0.5rem;
        border-radius: 10px;
        min-width: 18px;
        text-align: center;
        animation: badgePulse 2s infinite;
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
    
    .unread-badge.hiding {
        opacity: 0;
        transform: scale(0.5);
    }
    
    @keyframes badgePulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
    }
    
    .tab-btn {
        position: relative;
    }
    
    .chat-unread {
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
    
    .chat-unread.hiding {
        opacity: 0;
        transform: scale(0.5);
    }
`;
document.head.appendChild(notificationStyles);

// Request notification permission on first interaction
document.addEventListener('click', function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('✅ Notification permission granted');
            }
        });
    }
    document.removeEventListener('click', requestNotificationPermission);
}, { once: true });

// Update unread badge every 30 seconds
setInterval(() => {
    if (profileUser) {
        updateUnreadBadge();
    }
}, 30000);

console.log('✅ Chat notification system loaded');