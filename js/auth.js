/**
 * Authentication Module for EsiCareerBridge
 * Manages user session, login state, and authentication flow
 */

// Initialize database on page load
window.addEventListener('load', function() {
    if (typeof initializeStorage === 'function') {
        initializeStorage();
    }
    setTimeout(setupAuthUI, 100);
});

/**
 * Get current logged-in user
 * @returns {Object|null} Current user object or null if not logged in
 */
function getCurrentUser() {
    try {
        const userJSON = localStorage.getItem('current_user');
        return userJSON ? JSON.parse(userJSON) : null;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

/**
 * Set current user session
 * @param {Object} user - User object to set as current
 */
function setCurrentUser(user) {
    try {
        localStorage.setItem('current_user', JSON.stringify(user));
        setupAuthUI();
    } catch (error) {
        console.error('Error setting current user:', error);
    }
}

/**
 * Logout current user
 */
function logoutUser() {
    try {
        localStorage.removeItem('current_user');
        setupAuthUI();
        alert('Vous avez été déconnecté avec succès');
        window.location.href = 'accueil.html';
    } catch (error) {
        console.error('Error logging out:', error);
    }
}

/**
 * Setup authentication UI based on login state
 * Updates navbar to show user status
 */
function setupAuthUI() {
    const user = getCurrentUser();
    console.log('setupAuthUI: Current user =', user);
    
    // Find navbar button (look for button in header with Se connecter text)
    const headerBtn = document.querySelector('header button.cta-button');
    
    if (headerBtn) {
        if (user) {
            // User logged in - show name
            const userName = user.fullName || user.full_name || user.email || 'User';
            headerBtn.innerHTML = '👤 ' + userName;
            headerBtn.style.backgroundColor = '#3498db';
            headerBtn.onclick = function(e) {
                e.preventDefault();
                logoutUser();
            };
            headerBtn.setAttribute('title', 'Cliquez pour se déconnecter');
            console.log('✓ Updated button to show user name:', userName);
        } else {
            // Not logged in - show login
            headerBtn.innerHTML = 'Se connecter';
            headerBtn.style.backgroundColor = '#e74c3c';
            headerBtn.onclick = function() {
                window.location.href = 'login.html';
            };
            console.log('✓ Reset button to Se connecter');
        }
        return;
    }
    
    // Fallback: look for link in nav-links
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        const loginLink = navLinks.querySelector('a[href="login.html"]');
        if (loginLink) {
            const parentLi = loginLink.parentElement;
            if (user) {
                const userName = user.fullName || user.full_name || user.email || 'User';
                parentLi.innerHTML = '<span style="color: #2c3e50; font-weight: 500; cursor: pointer;" onclick="logoutUser()">👤 ' + userName + '</span>';
                console.log('✓ Updated nav link to show user name:', userName);
            } else {
                parentLi.innerHTML = '<a href="login.html">Se connecter</a>';
                console.log('✓ Reset nav link to Se connecter');
            }
            return;
        }
    }
    
    console.warn('⚠ Could not find auth element in navbar');
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is logged in
 */
function isAuthenticated() {
    return getCurrentUser() !== null;
}

/**
 * Redirect to login if not authenticated
 * Use this on pages that require authentication
 */
function requireAuth() {
    if (!isAuthenticated()) {
        alert('Veuillez vous connecter pour accéder à cette page');
        window.location.href = 'login.html';
    }
}

/**
 * Update user profile
 * @param {string} userId - User ID to update
 * @param {Object} updates - Object with fields to update
 * @returns {Object} Result object with success status and message
 */
function updateUserSession(updates) {
    const user = getCurrentUser();
    if (!user) return { success: false, message: 'Utilisateur non connecté' };
    
    const updatedUser = { ...user, ...updates };
    setCurrentUser(updatedUser);
    return { success: true, message: 'Profil mis à jour' };
}

/**
 * Format date for display
 * @param {string|number} dateValue - Date to format
 * @returns {string} Formatted date string
 */
function formatDate(dateValue) {
    const date = new Date(dateValue);
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Format time for display
 * @param {string|number} timeValue - Time to format
 * @returns {string} Formatted time string
 */
function formatTime(timeValue) {
    const date = new Date(timeValue);
    return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Show notification to user
 * @param {string} message - Message to show
 * @param {string} type - Type of notification (success, error, info, warning)
 * @param {number} duration - Duration in milliseconds (default 3000)
 */
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        max-width: 400px;
        word-wrap: break-word;
    `;
    
    // Color based on type
    const colors = {
        success: { bg: '#d4edda', text: '#155724', border: '#c3e6cb' },
        error: { bg: '#f8d7da', text: '#721c24', border: '#f5c6cb' },
        info: { bg: '#d1ecf1', text: '#0c5460', border: '#bee5eb' },
        warning: { bg: '#fff3cd', text: '#856404', border: '#ffeeba' }
    };
    
    const color = colors[type] || colors.info;
    notification.style.backgroundColor = color.bg;
    notification.style.color = color.text;
    notification.style.border = `2px solid ${color.border}`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
