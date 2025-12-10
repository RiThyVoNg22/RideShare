// notification-system.js - Beautiful notification system for all pages

// Add notification styles
function initNotificationSystem() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from {
                transform: translate(-50%, -150%);
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
                transform: translate(-50%, -150%);
                opacity: 0;
            }
        }
        
        .notification-bar {
            position: fixed;
            top: 90px;
            left: 50%;
            transform: translateX(-50%);
            min-width: 400px;
            max-width: 600px;
            padding: 20px 24px;
            border-radius: 16px;
            display: flex;
            align-items: flex-start;
            gap: 16px;
            z-index: 99999;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25), 0 4px 8px rgba(0, 0, 0, 0.15);
            animation: slideDown 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            backdrop-filter: blur(10px);
        }
        
        .notification-bar.closing {
            animation: slideUp 0.4s cubic-bezier(0.6, -0.28, 0.735, 0.045);
        }
        
        .notification-bar.error {
            background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
            color: white;
            border: 2px solid rgba(255, 255, 255, 0.2);
        }
        
        .notification-bar.success {
            background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
            color: white;
            border: 2px solid rgba(255, 255, 255, 0.2);
        }
        
        .notification-bar.warning {
            background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
            color: white;
            border: 2px solid rgba(255, 255, 255, 0.2);
        }
        
        .notification-bar.info {
            background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
            color: white;
            border: 2px solid rgba(255, 255, 255, 0.2);
        }
        
        .notification-icon {
            font-size: 28px;
            flex-shrink: 0;
            animation: iconPop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.2s both;
        }
        
        @keyframes iconPop {
            0% {
                transform: scale(0) rotate(-180deg);
                opacity: 0;
            }
            50% {
                transform: scale(1.3) rotate(10deg);
            }
            100% {
                transform: scale(1) rotate(0deg);
                opacity: 1;
            }
        }
        
        .notification-content {
            flex: 1;
            min-width: 0;
        }
        
        .notification-title {
            font-weight: 700;
            font-size: 17px;
            margin-bottom: 6px;
            line-height: 1.3;
        }
        
        .notification-message {
            font-size: 14px;
            opacity: 0.95;
            line-height: 1.5;
            word-wrap: break-word;
        }
        
        .notification-close {
            background: rgba(255, 255, 255, 0.25);
            border: none;
            color: inherit;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            flex-shrink: 0;
            font-size: 16px;
        }
        
        .notification-close:hover {
            background: rgba(255, 255, 255, 0.4);
            transform: rotate(90deg) scale(1.1);
        }
        
        .notification-action-btn {
            background: rgba(255, 255, 255, 0.95);
            border: none;
            padding: 10px 18px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            margin-top: 12px;
            transition: all 0.3s ease;
            display: inline-block;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
        
        .notification-bar.error .notification-action-btn {
            color: #e74c3c;
        }
        
        .notification-bar.success .notification-action-btn {
            color: #27ae60;
        }
        
        .notification-bar.warning .notification-action-btn {
            color: #e67e22;
        }
        
        .notification-bar.info .notification-action-btn {
            color: #2980b9;
        }
        
        .notification-action-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
        }
        
        .notification-action-btn:active {
            transform: translateY(0);
        }
        
        @media (max-width: 768px) {
            .notification-bar {
                min-width: auto;
                left: 16px;
                right: 16px;
                max-width: calc(100% - 32px);
                transform: translateX(0);
                padding: 16px 18px;
            }
            
            .notification-bar {
                top: 80px;
            }
            
            .notification-icon {
                font-size: 24px;
            }
            
            .notification-title {
                font-size: 16px;
            }
            
            .notification-message {
                font-size: 13px;
            }
        }
    `;
    document.head.appendChild(style);
}

// Show notification
function showNotification(options) {
    const {
        type = 'info', // error, success, warning, info
        title = '',
        message = '',
        duration = 5000,
        action = null // { text: 'Button Text', onClick: function() {} }
    } = options;
    
    // Remove existing notification
    const existing = document.querySelector('.notification-bar');
    if (existing) {
        closeNotification(existing);
    }
    
    // Icon mapping
    const icons = {
        error: '<i class="fas fa-exclamation-circle"></i>',
        success: '<i class="fas fa-check-circle"></i>',
        warning: '<i class="fas fa-exclamation-triangle"></i>',
        info: '<i class="fas fa-info-circle"></i>'
    };
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification-bar ${type}`;
    
    let actionButton = '';
    if (action && action.text) {
        const actionId = 'action_' + Date.now();
        actionButton = `<button class="notification-action-btn" id="${actionId}">${action.text}</button>`;
    }
    
    notification.innerHTML = `
        <div class="notification-icon">
            ${icons[type] || icons.info}
        </div>
        <div class="notification-content">
            ${title ? `<div class="notification-title">${title}</div>` : ''}
            <div class="notification-message">${message}</div>
            ${actionButton}
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Setup close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => closeNotification(notification));
    
    // Setup action button
    if (action && action.text && action.onClick) {
        const actionBtn = notification.querySelector('.notification-action-btn');
        if (actionBtn) {
            actionBtn.addEventListener('click', () => {
                action.onClick();
                closeNotification(notification);
            });
        }
    }
    
    // Auto close
    if (duration > 0) {
        setTimeout(() => {
            closeNotification(notification);
        }, duration);
    }
}

// Close notification with animation
function closeNotification(element) {
    const notification = element.closest ? element.closest('.notification-bar') : element;
    if (notification && notification.parentElement) {
        notification.classList.add('closing');
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 400);
    }
}

// Make functions globally accessible
window.showNotification = showNotification;
window.closeNotification = closeNotification;

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNotificationSystem);
} else {
    initNotificationSystem();
}

console.log('✓ Notification system loaded');