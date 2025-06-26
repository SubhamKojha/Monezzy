// UI Enhancements Script - Updated for new layout
document.addEventListener('DOMContentLoaded', function() {
    
    // Sidebar functionality
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const mainContent = document.getElementById('mainContent');

    function toggleSidebar() {
        sidebar.classList.toggle('open');
        sidebarOverlay.classList.toggle('active');
        sidebarToggle.classList.toggle('active');
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
        sidebarToggle.classList.remove('active');
    }

    sidebarToggle.addEventListener('click', toggleSidebar);
    sidebarOverlay.addEventListener('click', closeSidebar);

    // Close sidebar on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('open')) {
            closeSidebar();
        }
    });

    // Sidebar navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navLinks.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Close sidebar on mobile after selection
            if (window.innerWidth <= 768) {
                closeSidebar();
            }
        });
    });

    // Modal functionality
    const addExpenseBtn = document.getElementById('addExpenseBtn');
    const addExpenseModal = document.getElementById('addExpenseModal');
    const closeAddExpenseModal = document.getElementById('closeAddExpenseModal');
    const cancelAddExpense = document.getElementById('cancelAddExpense');

    const downloadBtn = document.getElementById('downloadBtn');
    const downloadModal = document.getElementById('downloadModal');
    const closeDownloadModal = document.getElementById('closeDownloadModal');
    const cancelDownload = document.getElementById('cancelDownload');
    const confirmDownload = document.getElementById('confirmDownload');

    // Add Expense Modal
    function openAddExpenseModal() {
        addExpenseModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Set default date
        const dateInput = document.getElementById('date');
        if (dateInput && !dateInput.value) {
            dateInput.valueAsDate = new Date();
        }
        // Focus first input
        setTimeout(() => {
            document.getElementById('title').focus();
        }, 100);
    }

    function closeAddExpenseModalFunc() {
        addExpenseModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        // Reset form
        document.getElementById('expenseForm').reset();
        document.getElementById('recurringMonthsGroup').style.display = 'none';
    }

    addExpenseBtn.addEventListener('click', openAddExpenseModal);
    closeAddExpenseModal.addEventListener('click', closeAddExpenseModalFunc);
    cancelAddExpense.addEventListener('click', closeAddExpenseModalFunc);

    // Download Modal
    function openDownloadModal() {
        downloadModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Set default dates (last 30 days)
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        
        document.getElementById('downloadStart').valueAsDate = startDate;
        document.getElementById('downloadEnd').valueAsDate = endDate;
    }

    function closeDownloadModalFunc() {
        downloadModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    downloadBtn.addEventListener('click', openDownloadModal);
    closeDownloadModal.addEventListener('click', closeDownloadModalFunc);
    cancelDownload.addEventListener('click', closeDownloadModalFunc);

    // Download confirmation
    confirmDownload.addEventListener('click', function() {
        const startDate = document.getElementById('downloadStart').value;
        const endDate = document.getElementById('downloadEnd').value;
        
        if (!startDate || !endDate) {
            showNotification('Please select both start and end dates', 'error');
            return;
        }
        
        if (new Date(startDate) > new Date(endDate)) {
            showNotification('Start date cannot be after end date', 'error');
            return;
        }
        
        // Show loading state
        this.innerHTML = 'Preparing...';
        this.disabled = true;
        
        // Trigger download
        const url = `/api/expenses/download?startDate=${startDate}&endDate=${endDate}`;
        window.open(url, "_blank");
        
        // Reset button and close modal
        setTimeout(() => {
            this.innerHTML = 'Download';
            this.disabled = false;
            closeDownloadModalFunc();
            showNotification('Download started successfully!', 'success');
        }, 1000);
    });

    // Close modals when clicking outside
    addExpenseModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeAddExpenseModalFunc();
        }
    });

    downloadModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeDownloadModalFunc();
        }
    });

    // Recurring checkbox functionality
    const recurringCheckbox = document.getElementById('isRecurring');
    const recurringMonthsGroup = document.getElementById('recurringMonthsGroup');
    const recurringMonthsInput = document.getElementById('recurringMonthsInput');

    recurringCheckbox.addEventListener('change', function() {
        if (this.checked) {
            recurringMonthsGroup.style.display = 'block';
            recurringMonthsInput.required = true;
        } else {
            recurringMonthsGroup.style.display = 'none';
            recurringMonthsInput.required = false;
            recurringMonthsInput.value = '';
        }
    });

    // Form validation and enhancement
    const expenseForm = document.getElementById('expenseForm');
    const titleInput = document.getElementById('title');
    const amountInput = document.getElementById('amount');
    const categoryInput = document.getElementById('category');

    // Amount input formatting
    if (amountInput) {
        amountInput.addEventListener('input', function() {
            let value = this.value.replace(/[^0-9.]/g, '');
            const parts = value.split('.');
            if (parts.length > 2) {
                value = parts[0] + '.' + parts.slice(1).join('');
            }
            if (parts[1] && parts[1].length > 2) {
                value = parts[0] + '.' + parts[1].substring(0, 2);
            }
            this.value = value;
        });
    }

    // Category suggestions
    if (categoryInput) {
        const commonCategories = [
            'Food & Dining', 'Transportation', 'Shopping', 'Entertainment',
            'Bills & Utilities', 'Healthcare', 'Education', 'Travel',
            'Groceries', 'Gas', 'Insurance', 'Rent', 'Subscriptions'
        ];

        const datalist = document.createElement('datalist');
        datalist.id = 'categoryList';
        commonCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            datalist.appendChild(option);
        });
        document.body.appendChild(datalist);
        categoryInput.setAttribute('list', 'categoryList');
    }

    // Form submission
    if (expenseForm) {
        expenseForm.addEventListener('submit', function(e) {
            const amount = parseFloat(amountInput.value);
            const title = titleInput.value.trim();
            
            if (isNaN(amount) || amount <= 0) {
                e.preventDefault();
                showNotification('Please enter a valid amount greater than 0', 'error');
                amountInput.focus();
                return;
            }

            if (title.length < 2) {
                e.preventDefault();
                showNotification('Please enter a descriptive title (at least 2 characters)', 'error');
                titleInput.focus();
                return;
            }

            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.innerHTML = 'Adding...';
                submitBtn.disabled = true;
            }
        });
    }

    // Delete confirmation
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const form = this.closest('form');
            
            showConfirmDialog(
                'Delete Expense',
                'Are you sure you want to delete this expense? This action cannot be undone.',
                () => {
                    if (form) form.submit();
                }
            );
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + N for new expense
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            openAddExpenseModal();
        }
        
        // Ctrl/Cmd + D for download
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            openDownloadModal();
        }
    });

    // Responsive sidebar behavior
    function handleResize() {
        if (window.innerWidth >= 1200) {
            sidebar.classList.add('open');
            sidebarOverlay.classList.remove('active');
            sidebarToggle.classList.remove('active');
        } else {
            sidebar.classList.remove('open');
            sidebarOverlay.classList.remove('active');
            sidebarToggle.classList.remove('active');
        }
    }

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

    console.log('UI Enhancements loaded successfully! ✨');
});

// Utility functions
function showNotification(message, type = 'info', duration = 4000) {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 3000;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
        font-size: 14px;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, duration);
}

function getNotificationIcon(type) {
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#6366f1'
    };
    return colors[type] || colors.info;
}

function showConfirmDialog(title, message, onConfirm, onCancel = null) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 3000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease-out;
    `;

    const dialog = document.createElement('div');
    dialog.style.cssText = `
        background: #1a1a1a;
        border: 1px solid #2a2a2a;
        border-radius: 12px;
        padding: 24px;
        max-width: 400px;
        width: 90%;
        color: white;
        animation: scaleIn 0.3s ease-out;
    `;

    dialog.innerHTML = `
        <h3 style="margin: 0 0 12px 0; font-size: 1.2rem;">${title}</h3>
        <p style="margin: 0 0 20px 0; color: #9ca3af; line-height: 1.5;">${message}</p>
        <div style="display: flex; gap: 12px; justify-content: flex-end;">
            <button class="cancel-btn" style="background: #374151; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">Cancel</button>
            <button class="confirm-btn" style="background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">Delete</button>
        </div>
    `;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    dialog.querySelector('.cancel-btn').addEventListener('click', () => {
        overlay.remove();
        if (onCancel) onCancel();
    });

    dialog.querySelector('.confirm-btn').addEventListener('click', () => {
        overlay.remove();
        if (onConfirm) onConfirm();
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
            if (onCancel) onCancel();
        }
    });
}

// Add required CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes scaleIn {
        from {
            transform: scale(0.9);
            opacity: 0;
        }
        to {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    }
    
    .notification-close:hover {
        opacity: 0.7;
    }
`;
document.head.appendChild(style);