// notification.js - Beautiful Notification System for RideShare Local

function showNotification({ type = 'info', title = '', message = '', duration = 3000 }) {
    // Create notification container if it doesn't exist
    let notificationContainer = document.getElementById('notificationContainer');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notificationContainer';
        notificationContainer.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
            pointer-events: none;
        `;
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification element
    const notificationId = 'notif_' + Date.now();
    const notification = document.createElement('div');
    notification.id = notificationId;
    notification.className = 'notification';
    
    // Icon and color based on type
    const configs = {
        'success': {
            icon: 'fas fa-check-circle',
            bgColor: '#28a745',
            iconColor: '#ffffff'
        },
        'error': {
            icon: 'fas fa-exclamation-circle',
            bgColor: '#dc3545',
            iconColor: '#ffffff'
        },
        'warning': {
            icon: 'fas fa-exclamation-triangle',
            bgColor: '#ffc107',
            iconColor: '#333333'
        },
        'info': {
            icon: 'fas fa-info-circle',
            bgColor: '#1e3a5f',
            iconColor: '#ffffff'
        }
    };
    
    const config = configs[type] || configs['info'];
    
    notification.innerHTML = `
        <div class="notification-icon" style="color: ${config.iconColor};">
            <i class="${config.icon}"></i>
        </div>
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close" onclick="closeNotification('${notificationId}')">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    notification.style.cssText = `
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        padding: 1.25rem;
        margin-bottom: 1rem;
        border-radius: 12px;
        background: ${config.bgColor};
        color: ${type === 'warning' ? '#333333' : '#ffffff'};
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        opacity: 0;
        transform: translateX(400px);
        transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        pointer-events: auto;
        position: relative;
        overflow: hidden;
    `;
    
    // Add progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'notification-progress';
    progressBar.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        height: 4px;
        background: ${type === 'warning' ? '#333333' : 'rgba(255, 255, 255, 0.7)'};
        width: 100%;
        transform-origin: left;
        animation: notificationProgress ${duration}ms linear;
    `;
    notification.appendChild(progressBar);
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto-hide
    setTimeout(() => {
        closeNotification(notificationId);
    }, duration);
    
    // Add animation styles if not exists
    if (!document.querySelector('#notificationStyles')) {
        const style = document.createElement('style');
        style.id = 'notificationStyles';
        style.textContent = `
            @keyframes notificationProgress {
                from { transform: scaleX(1); }
                to { transform: scaleX(0); }
            }
            
            .notification-icon {
                font-size: 1.5rem;
                flex-shrink: 0;
            }
            
            .notification-content {
                flex: 1;
            }
            
            .notification-title {
                font-weight: 700;
                font-size: 1rem;
                margin-bottom: 0.25rem;
            }
            
            .notification-message {
                font-size: 0.9rem;
                opacity: 0.95;
                line-height: 1.4;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: inherit;
                cursor: pointer;
                padding: 0.25rem;
                opacity: 0.8;
                transition: opacity 0.2s ease;
                flex-shrink: 0;
            }
            
            .notification-close:hover {
                opacity: 1;
            }
            
            @media (max-width: 480px) {
                #notificationContainer {
                    left: 10px;
                    right: 10px;
                    top: 80px;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function closeNotification(notificationId) {
    const notification = document.getElementById(notificationId);
    if (notification) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 400);
    }
}

// Export to window for global access
window.showNotification = showNotification;
window.closeNotification = closeNotification;