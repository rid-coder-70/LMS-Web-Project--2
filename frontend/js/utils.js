// Utility Functions

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Format currency
function formatCurrency(amount) {
    if (amount === null || amount === undefined || isNaN(amount)) return '$0.00';
    return `$${Number(amount).toFixed(2)}`;
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Get user from localStorage
function getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// Check if user is authenticated
function isAuthenticated() {
    return !!localStorage.getItem('token');
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Protect page (redirect if not authenticated)
function protectPage() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
    }
}

// Redirect based on role
function redirectDashboard() {
    const user = getUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    if (user.role === 'learner') {
        window.location.href = 'learner-dashboard.html';
    } else if (user.role === 'instructor') {
        window.location.href = 'instructor-dashboard.html';
    } else {
        window.location.href = 'index.html';
    }
}

// Show/hide loading spinner
function showLoading(element) {
    element.innerHTML = '<div class="spinner" style="margin: 2rem auto;"></div>';
}

// Create modal
function createModal(title, content, onConfirm) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
    <div class="modal-content">
      <h3 class="mb-2">${title}</h3>
      <div>${content}</div>
      <div style="display: flex; gap: var(--spacing-sm); margin-top: var(--spacing-lg); justify-content: flex-end;">
        <button class="btn btn-outline" onclick="this.closest('.modal').remove()">Cancel</button>
        <button class="btn btn-primary" id="confirmBtn">Confirm</button>
      </div>
    </div>
  `;

    document.body.appendChild(modal);

    document.getElementById('confirmBtn').addEventListener('click', () => {
        if (onConfirm) onConfirm();
        modal.remove();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Update navbar based on auth status
function updateNavbar() {
    const navbar = document.querySelector('.navbar-menu');
    if (!navbar) return;

    if (isAuthenticated()) {
        const user = getUser();
        const dashboardLink = user.role === 'learner' ? 'learner-dashboard.html' : 'instructor-dashboard.html';

        navbar.innerHTML = `
      <li><a href="courses.html" class="navbar-link">Courses</a></li>
      <li><a href="${dashboardLink}" class="navbar-link">Dashboard</a></li>
      <li><button onclick="logout()" class="btn btn-outline">Logout</button></li>
    `;
    }
}

// Call updateNavbar on page load
if (document.querySelector('.navbar')) {
    updateNavbar();
}
