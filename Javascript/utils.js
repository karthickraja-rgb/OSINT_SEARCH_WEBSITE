// Utility functions for OSINT operations
const Utils = {
    // Validate email format
    isValidEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Validate phone number format
    isValidPhone: (phone) => {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    },

    // Validate username format
    isValidUsername: (username) => {
        const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
        return usernameRegex.test(username);
    },

    // Format phone number
    formatPhone: (phone) => {
        return phone.replace(/[\s\-\(\)]/g, '');
    },

    // Sanitize input
    sanitizeInput: (input) => {
        const temp = document.createElement('div');
        temp.textContent = input;
        return temp.innerHTML;
    },

    // Generate random delay
    randomDelay: (min = 1000, max = 3000) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    // Create result card HTML
    createResultCard: (platform, status, data) => {
        const statusClass = status === 'found' ? 'found' : status === 'error' ? 'error' : 'not-found';
        const statusText = status === 'found' ? 'Found' : status === 'error' ? 'Error' : 'Not Found';
        const safeContent = Utils.sanitizeInput(data.content || 'No additional information available.');
        const safeInfo = data.info ? Utils.sanitizeInput(data.info) : '';
        return `
            <div class="result-card">
                <div class="result-header">
                    <div class="platform-badge ${platform.toLowerCase()}">
                    <i class="fab fa-${platform.toLowerCase()}"></i>
                    <strong>${platform}</strong>
                    </div>
                    <div class="status-badge ${statusClass}">
                        ${statusText}
                    </div>
                </div>
                <div class="result-content">
                    ${safeContent}
                </div>
                <div class="result-actions">
                    ${data.url ? `<a href="${encodeURI(data.url)}" target="_blank" class="btn-small btn-visit">
                        <i class="fas fa-external-link-alt"></i> Visit
                    </a>` : ''}
                    ${safeInfo ? `<button class="btn-small btn-info" onclick="Utils.showInfo('${safeInfo}')">
                        <i class="fas fa-info-circle"></i> Details
                    </button>` : ''}
                </div>
            </div>
        `;
    },

    // Show information modal
    showInfo: (info) => {
        alert(info); // Simple implementation - could be enhanced with modal
    },

    // Export data as JSON
    exportAsJSON: (data) => {
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `osint-results-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    },

    // Export data as CSV
    exportAsCSV: (data) => {
        const headers = ['Platform', 'Status', 'URL', 'Description'];
        const csvContent = [
            headers.join(','),
            ...data.map(item => [
                item.platform,
                item.status,
                item.url || '',
                item.description || ''
            ].map(field => `"${field}"`).join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `osint-results-${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    },

    // Show notification
    showNotification: (message, type = 'info') => {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            background: ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#1e3c72'};
            color: white;
            border-radius: 8px;
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
};
