// Main JavaScript for Dashboard Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Sidebar Toggle Functionality
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    let overlay;
    
    // Create overlay element for mobile view
    function createOverlay() {
        overlay = document.createElement('div');
        overlay.className = 'overlay';
        document.body.appendChild(overlay);
        
        overlay.addEventListener('click', function() {
            toggleSidebar();
        });
    }
    
    createOverlay();
    
    function toggleSidebar() {
        const isMobile = window.innerWidth <= 992;
        
        if (isMobile) {
            sidebar.classList.toggle('expanded');
            overlay.classList.toggle('active');
        } else {
            sidebar.classList.toggle('collapsed');
        }
    }
    
    sidebarToggle.addEventListener('click', function(e) {
        e.preventDefault();
        toggleSidebar();
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        const isMobile = window.innerWidth <= 992;
        
        if (isMobile) {
            sidebar.classList.remove('collapsed');
            sidebar.classList.remove('expanded');
            overlay.classList.remove('active');
        } else {
            overlay.classList.remove('active');
        }
    });
    
    // Notification Bell Functionality
    const notificationBell = document.querySelector('.notification-bell');
    
    notificationBell.addEventListener('click', function() {
        // Add notification panel functionality here
        alert('Notifications panel will be shown here');
    });
    
    // User Profile Dropdown
    const userProfile = document.querySelector('.user-profile');
    
    userProfile.addEventListener('click', function() {
        // Add user dropdown functionality here
        alert('User profile dropdown will be shown here');
    });
    
    // Search Functionality
    const searchBar = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    
    searchButton.addEventListener('click', function() {
        performSearch();
    });
    
    searchBar.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    function performSearch() {
        const searchTerm = searchBar.value.trim();
        if (searchTerm) {
            // Add search functionality here
            alert(`Searching for: ${searchTerm}`);
        }
    }
    
    // View All Buttons Functionality
    const viewAllButtons = document.querySelectorAll('.view-all');
    
    viewAllButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const cardTitle = this.closest('.card-header').querySelector('h2').textContent;
            alert(`View all ${cardTitle} will be shown here`);
        });
    });
    
    // Quick Action Buttons Functionality
    const quickActionButtons = document.querySelectorAll('.quick-action-btn');
    
    quickActionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Don't prevent default here to allow navigation to the linked pages
            const actionName = this.querySelector('span').textContent;
            console.log(`Quick action: ${actionName}`);
        });
    });
    
    // Logout Button Functionality
const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.addEventListener('click', function(e) {
    e.preventDefault();
    if (confirm('Are you sure you want to logout?')) {
        // Remove this alert
        // Directly navigate to the login page
        window.location.href = 'Auth.html';
    }
});
    
    // Add active class to current page in sidebar
    function setActivePage() {
        const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
        const sidebarLinks = document.querySelectorAll('.sidebar-menu li a');
        
        sidebarLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.parentElement.classList.remove('active');
            
            if (href === currentPage) {
                link.parentElement.classList.add('active');
            }
        });
    }
    
    setActivePage();
    
    // Sample animations for dashboard elements
    function animateDashboard() {
        const statCards = document.querySelectorAll('.stat-card');
        const dashboardCards = document.querySelectorAll('.dashboard-card');
        
        // Add animation classes or styles
        statCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 * index);
        });
        
        dashboardCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 300 + (100 * index));
        });
    }
    
    // Add initial styles for animations
    function setupAnimations() {
        const statCards = document.querySelectorAll('.stat-card');
        const dashboardCards = document.querySelectorAll('.dashboard-card');
        
        statCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.3s ease-in-out';
        });
        
        dashboardCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.3s ease-in-out';
        });
    }
    
    setupAnimations();
    
    // Run animations after a small delay
    setTimeout(animateDashboard, 100);
});


// main.js - Common functionality across the application

document.addEventListener('DOMContentLoaded', function() {
    // Initialize sidebar functionality
    initSidebar();
    
    // Initialize notification functionality
    initNotifications();
    
    // Initialize user profile dropdown
    initUserProfile();
});

/**
 * Sidebar Toggle Functionality
 */
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const menuItems = document.querySelectorAll('.sidebar-menu li a');

    // Toggle sidebar on button click
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            
            // On mobile, we need a different class
            if (window.innerWidth <= 576) {
                sidebar.classList.toggle('open');
            }
        });
    }

    // Close sidebar on mobile when clicking a menu item
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 576 && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        });
    });

    // Handle responsive behavior
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 576) {
            sidebar.classList.remove('collapsed');
            sidebar.classList.add('sidebar-mobile');
        } else {
            sidebar.classList.remove('open', 'sidebar-mobile');
        }
    });

    // Initialize on load
    if (window.innerWidth <= 576) {
        sidebar.classList.add('sidebar-mobile');
    }
}

/**
 * Notification Functionality
 */
function initNotifications() {
    const notificationBell = document.getElementById('notificationBell');
    
    if (notificationBell) {
        // Load notifications count from API
        fetchNotificationsCount();
        
        // Set up click event for notification bell
        notificationBell.addEventListener('click', function() {
            // This would typically open a notification dropdown
            // For now, we'll just mark all as read
            markNotificationsAsRead();
        });
    }
}

/**
 * Fetch notification count from backend
 */
function fetchNotificationsCount() {
    // This would typically be an API call
    // For now, we'll simulate it
    const notificationCount = document.getElementById('notificationCount');
    
    if (notificationCount) {
        // Simulate API call
        setTimeout(() => {
            // Update count with data from "backend"
            fetchFromBackend('/api/notifications/count')
                .then(data => {
                    notificationCount.textContent = data.count || 0;
                    if (data.count > 0) {
                        notificationCount.style.display = 'flex';
                    } else {
                        notificationCount.style.display = 'none';
                    }
                })
                .catch(error => {
                    console.error('Error fetching notification count:', error);
                    notificationCount.style.display = 'none';
                });
        }, 500);
    }
}

/**
 * Mark notifications as read
 */
function markNotificationsAsRead() {
    const notificationCount = document.getElementById('notificationCount');
    
    // Simulate API call to mark notifications as read
    fetchFromBackend('/api/notifications/mark-read', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
    .then(() => {
        // Update UI
        if (notificationCount) {
            notificationCount.textContent = '0';
            notificationCount.style.display = 'none';
        }
    })
    .catch(error => {
        console.error('Error marking notifications as read:', error);
    });
}

/**
 * User Profile Dropdown
 */
function initUserProfile() {
    const userProfile = document.getElementById('userProfile');
    
    if (userProfile) {
        userProfile.addEventListener('click', function() {
            // This would typically toggle a user dropdown menu
            // You can implement this based on your UI requirements
        });
    }
}

/**
 * Utility function to get CSRF token from cookies
 * Required for POST requests in Django
 */
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

/**
 * Simulated backend fetch - replace with actual API calls
 * When integrating with Django, this would use fetch to call your Django views
 */
function fetchFromBackend(url, options = {}) {
    // In a real application, this would be a real API call
    // For now, we'll simulate responses
    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            // Mock responses based on URL   
            if (url.includes('/api/notifications/count')) {
                resolve({ count: Math.floor(Math.random() * 5) }); // Random count between 0-4
            } else if (url.includes('/api/notifications/mark-read')) {
                resolve({ success: true });
            } else {
                reject(new Error('Unknown API endpoint'));
            }
        }, 300);
    });
}

/**
 * Show error message to user
 */
function showError(message) {
    // You can implement a toast or notification system
    console.error(message);
    // For now, we'll just alert
    alert(message);
}

/**
 * Show success message to user
 */
function showSuccess(message) {
    // You can implement a toast or notification system
    console.log(message);
    // For now, we'll just alert
    alert(message);
}