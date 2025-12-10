// chat-system.js - Real-Time Chat for Bookings

let currentChatListener = null;
let currentChatData = null;

// Add chat styles
const chatStyles = document.createElement('style');
chatStyles.textContent = `
    .chat-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 10002;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .chat-modal.active {
        opacity: 1;
    }
    
    .chat-container {
        background: white;
        border-radius: 20px;
        width: 90%;
        max-width: 600px;
        height: 80vh;
        max-height: 700px;
        display: flex;
        flex-direction: column;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        transform: translateY(20px);
        transition: transform 0.3s ease;
    }
    
    .chat-modal.active .chat-container {
        transform: translateY(0);
    }
    
    .chat-header {
        background: linear-gradient(135deg, #ff6b35 0%, #ff8555 100%);
        color: white;
        padding: 1.5rem;
        border-radius: 20px 20px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .chat-header-info h3 {
        margin: 0 0 0.3rem 0;
        font-size: 1.3rem;
    }
    
    .chat-header-info p {
        margin: 0;
        opacity: 0.9;
        font-size: 0.9rem;
    }
    
    .chat-close-btn {
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
    
    .chat-close-btn:hover {
        background: rgba(255,255,255,0.3);
        transform: rotate(90deg);
    }
    
    .chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 1.5rem;
        background: #f8f9fa;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .chat-message {
        display: flex;
        gap: 0.8rem;
        animation: slideInMessage 0.3s ease;
    }
    
    @keyframes slideInMessage {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .chat-message.own-message {
        flex-direction: row-reverse;
    }
    
    .message-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #ff6b35 0%, #ff8555 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 600;
        flex-shrink: 0;
    }
    
    .message-avatar.owner-avatar {
        background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
    }
    
    .message-content {
        max-width: 70%;
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
    }
    
    .message-sender {
        font-size: 0.85rem;
        color: #666;
        font-weight: 500;
    }
    
    .message-bubble {
        background: white;
        padding: 0.8rem 1.2rem;
        border-radius: 18px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        word-wrap: break-word;
    }
    
    .chat-message.own-message .message-bubble {
        background: linear-gradient(135deg, #ff6b35 0%, #ff8555 100%);
        color: white;
    }
    
    .chat-message.own-message .message-sender {
        text-align: right;
    }
    
    .message-time {
        font-size: 0.75rem;
        color: #999;
    }
    
    .chat-message.own-message .message-time {
        text-align: right;
    }
    
    .chat-input-container {
        padding: 1.5rem;
        background: white;
        border-top: 1px solid #e0e0e0;
        border-radius: 0 0 20px 20px;
    }
    
    .chat-input-wrapper {
        display: flex;
        gap: 0.8rem;
        align-items: center;
    }
    
    .chat-input {
        flex: 1;
        padding: 0.9rem 1.2rem;
        border: 2px solid #e0e0e0;
        border-radius: 25px;
        font-size: 0.95rem;
        font-family: inherit;
        transition: all 0.3s ease;
    }
    
    .chat-input:focus {
        outline: none;
        border-color: #ff6b35;
        box-shadow: 0 0 0 3px rgba(255,107,53,0.1);
    }
    
    .chat-send-btn {
        background: linear-gradient(135deg, #ff6b35 0%, #ff8555 100%);
        color: white;
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        transition: all 0.3s ease;
    }
    
    .chat-send-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(255,107,53,0.3);
    }
    
    .chat-send-btn:active {
        transform: scale(0.95);
    }
    
    .chat-empty-state {
        text-align: center;
        padding: 3rem 1rem;
        color: #999;
    }
    
    .chat-empty-state i {
        font-size: 3rem;
        margin-bottom: 1rem;
        opacity: 0.5;
    }
    
    .chat-empty-state h4 {
        margin: 0 0 0.5rem 0;
        color: #666;
    }
    
    .chat-empty-state p {
        margin: 0;
    }
    
    .typing-indicator {
        display: flex;
        gap: 0.3rem;
        padding: 0.8rem 1.2rem;
        background: white;
        border-radius: 18px;
        width: fit-content;
    }
    
    .typing-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #999;
        animation: typingAnimation 1.4s infinite;
    }
    
    .typing-dot:nth-child(2) {
        animation-delay: 0.2s;
    }
    
    .typing-dot:nth-child(3) {
        animation-delay: 0.4s;
    }
    
    @keyframes typingAnimation {
        0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.7;
        }
        30% {
            transform: translateY(-8px);
            opacity: 1;
        }
    }
    
    @media (max-width: 768px) {
        .chat-container {
            width: 100%;
            height: 100vh;
            max-height: 100vh;
            border-radius: 0;
        }
        
        .chat-header {
            border-radius: 0;
        }
        
        .chat-input-container {
            border-radius: 0;
        }
        
        .message-content {
            max-width: 80%;
        }
    }
`;
document.head.appendChild(chatStyles);

// Open chat modal
window.openChatModal = function(ownerId, bookingId, ownerName, vehicleName) {
    console.log('💬 Opening chat with owner:', ownerId);
    
    currentChatData = {
        ownerId: ownerId,
        bookingId: bookingId,
        ownerName: ownerName,
        vehicleName: vehicleName
    };
    
    let modal = document.getElementById('chatModal');
    if (modal) {
        modal.remove();
    }
    
    modal = document.createElement('div');
    modal.id = 'chatModal';
    modal.className = 'chat-modal';
    
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeChatModal()"></div>
        <div class="chat-container">
            <div class="chat-header">
                <div class="chat-header-info">
                    <h3><i class="fas fa-comments"></i> Chat with ${ownerName}</h3>
                    <p>${vehicleName}</p>
                </div>
                <button class="chat-close-btn" onclick="closeChatModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="chat-messages" id="chatMessages">
                <div class="chat-empty-state">
                    <i class="fas fa-comments"></i>
                    <h4>Start a conversation</h4>
                    <p>Send a message to the vehicle owner</p>
                </div>
            </div>
            
            <div class="chat-input-container">
                <div class="chat-input-wrapper">
                    <input 
                        type="text" 
                        class="chat-input" 
                        id="chatInput" 
                        placeholder="Type your message..."
                        onkeypress="handleChatKeyPress(event)"
                    >
                    <button class="chat-send-btn" onclick="sendChatMessage()">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('active');
            loadChatMessages(bookingId);
            document.getElementById('chatInput').focus();
        }, 10);
    }, 10);
};

// Close chat modal
window.closeChatModal = function() {
    const modal = document.getElementById('chatModal');
    if (modal) {
        modal.classList.remove('active');
        
        // Stop listening to messages
        if (currentChatListener) {
            currentChatListener();
            currentChatListener = null;
        }
        
        setTimeout(() => {
            modal.style.display = 'none';
            modal.remove();
        }, 300);
        
        // Update unread badge immediately when closing chat
        if (typeof updateUnreadBadge === 'function') {
            setTimeout(() => {
                updateUnreadBadge();
                console.log('🔄 Badge updated after closing chat');
            }, 100);
        }
        
        // If on messages tab, refresh the list to update individual chat badges
        const messagesTab = document.getElementById('messagesTab');
        if (messagesTab && messagesTab.classList.contains('active')) {
            setTimeout(() => {
                if (typeof loadUserMessages === 'function') {
                    loadUserMessages();
                }
            }, 400);
        }
    }
    
    currentChatData = null;
};

// Handle Enter key press
window.handleChatKeyPress = function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendChatMessage();
    }
};

// Load chat messages with real-time updates
function loadChatMessages(bookingId) {
    const messagesContainer = document.getElementById('chatMessages');
    
    if (!messagesContainer) return;
    
    console.log('📨 Loading messages for booking:', bookingId);
    
    // Stop previous listener if exists
    if (currentChatListener) {
        currentChatListener();
    }
    
    // Real-time listener for messages
    currentChatListener = firebase.firestore()
        .collection('chats')
        .doc(bookingId)
        .collection('messages')
        .orderBy('timestamp', 'asc')
        .onSnapshot((snapshot) => {
            console.log('📬 Messages updated, count:', snapshot.size);
            
            if (snapshot.empty) {
                messagesContainer.innerHTML = `
                    <div class="chat-empty-state">
                        <i class="fas fa-comments"></i>
                        <h4>Start a conversation</h4>
                        <p>Send a message to the vehicle owner</p>
                    </div>
                `;
                return;
            }
            
            let html = '';
            
            snapshot.forEach((doc) => {
                const message = doc.data();
                const isOwnMessage = message.senderId === profileUser.uid;
                const senderName = isOwnMessage ? 'You' : (message.senderName || 'Owner');
                const avatarInitial = senderName.charAt(0).toUpperCase();
                
                const timestamp = message.timestamp 
                    ? formatMessageTime(message.timestamp.toDate()) 
                    : 'Just now';
                
                html += `
                    <div class="chat-message ${isOwnMessage ? 'own-message' : ''}">
                        <div class="message-avatar ${isOwnMessage ? '' : 'owner-avatar'}">
                            ${avatarInitial}
                        </div>
                        <div class="message-content">
                            <div class="message-sender">${senderName}</div>
                            <div class="message-bubble">${escapeHtml(message.message)}</div>
                            <div class="message-time">${timestamp}</div>
                        </div>
                    </div>
                `;
            });
            
            messagesContainer.innerHTML = html;
            
            // Auto-scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, (error) => {
            console.error('❌ Error loading messages:', error);
            messagesContainer.innerHTML = `
                <div class="chat-empty-state">
                    <i class="fas fa-exclamation-circle"></i>
                    <h4>Error loading messages</h4>
                    <p>Please try again</p>
                </div>
            `;
        });
}

// Send message
window.sendChatMessage = async function() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message || !currentChatData) {
        console.warn('⚠️ No message or chat data');
        return;
    }
    
    if (!profileUser) {
        console.error('❌ User not logged in');
        showNotification({
            type: 'error',
            title: 'Not Logged In',
            message: 'Please log in to send messages',
            duration: 3000
        });
        return;
    }
    
    console.log('📤 Sending message:', message);
    console.log('📋 Chat data:', currentChatData);
    
    try {
        // Disable input while sending
        input.disabled = true;
        
        const messageData = {
            senderId: profileUser.uid,
            senderName: profileUser.displayName || profileUser.email.split('@')[0],
            receiverId: currentChatData.ownerId,
            message: message,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            read: false
        };
        
        console.log('💾 Saving message to Firestore...');
        
        // Save to chat collection
        await firebase.firestore()
            .collection('chats')
            .doc(currentChatData.bookingId)
            .collection('messages')
            .add(messageData);
        
        console.log('✅ Message added to subcollection');
        
        // Update chat metadata
        await firebase.firestore()
            .collection('chats')
            .doc(currentChatData.bookingId)
            .set({
                bookingId: currentChatData.bookingId,
                participants: [profileUser.uid, currentChatData.ownerId],
                lastMessage: message,
                lastMessageTime: firebase.firestore.FieldValue.serverTimestamp(),
                vehicleName: currentChatData.vehicleName
            }, { merge: true });
        
        console.log('✅ Chat metadata updated');
        console.log('✅ Message sent successfully');
        
        // Clear input
        input.value = '';
        input.disabled = false;
        input.focus();
        
    } catch (error) {
        console.error('❌ Error sending message:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
        let errorMessage = 'Unable to send message. Please try again.';
        
        if (error.code === 'permission-denied') {
            errorMessage = 'Permission denied. Please check Firebase rules.';
        } else if (error.code === 'unauthenticated') {
            errorMessage = 'You must be logged in to send messages.';
        }
        
        showNotification({
            type: 'error',
            title: 'Send Failed',
            message: errorMessage,
            duration: 4000
        });
        
        input.disabled = false;
    }
};

// Format message timestamp
function formatMessageTime(date) {
    const now = new Date();
    const diff = now - date;
    
    // Less than 1 minute
    if (diff < 60000) {
        return 'Just now';
    }
    
    // Less than 1 hour
    if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return `${minutes}m ago`;
    }
    
    // Less than 24 hours
    if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `${hours}h ago`;
    }
    
    // Show date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date >= today) {
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    
    // Yesterday
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date >= yesterday) {
        return 'Yesterday';
    }
    
    // Older dates
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Update the contact owner message function to use the new chat modal
window.contactOwnerMessage = function(ownerId, bookingId, ownerName, vehicleName) {
    console.log('💬 Opening chat modal...');
    console.log('📋 Data:', { ownerId, bookingId, ownerName, vehicleName });
    
    // Validate inputs
    if (!ownerId || !bookingId) {
        console.error('❌ Missing required data:', { ownerId, bookingId });
        showNotification({
            type: 'error',
            title: 'Cannot Open Chat',
            message: 'Missing owner or booking information',
            duration: 3000
        });
        return;
    }
    
    // Check if user is logged in
    if (!profileUser) {
        console.error('❌ User not logged in');
        showNotification({
            type: 'error',
            title: 'Not Logged In',
            message: 'Please log in to send messages',
            duration: 3000
        });
        return;
    }
    
    // Close booking details modal first (optional)
    const bookingModal = document.getElementById('bookingDetailsModal');
    if (bookingModal) {
        bookingModal.classList.remove('active');
        setTimeout(() => {
            bookingModal.style.display = 'none';
        }, 300);
    }
    
    // Open chat modal
    openChatModal(ownerId, bookingId, ownerName || 'Owner', vehicleName || 'Vehicle');
};

console.log('✅ Chat system loaded successfully');