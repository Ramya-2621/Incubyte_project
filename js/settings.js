// Settings Management JavaScript
class SettingsManager {
    constructor() {
        this.settings = JSON.parse(localStorage.getItem('sweetDelightsSettings')) || this.getDefaultSettings();
        this.init();
    }

    getDefaultSettings() {
        return {
            general: {
                currency: 'USD',
                timezone: 'America/New_York',
                dateFormat: 'MM/DD/YYYY',
                language: 'en',
                darkMode: false
            },
            business: {
                name: 'Sweet Delights',
                phone: '+1 (555) 123-4567',
                address: '123 Sweet Street, Candy City, CC 12345',
                email: 'info@sweetdelights.com',
                website: 'https://sweetdelights.com',
                taxRate: 8.5,
                receiptNote: 'Thank you for your business!'
            },
            notifications: {
                lowStockAlert: true,
                outOfStockAlert: true,
                stockThreshold: 10,
                dailySalesReport: true,
                weeklySalesReport: false,
                largeOrderAlert: true,
                newCustomerAlert: true,
                customerBirthday: false
            }
        };
    }

    init() {
        this.loadSettings();
        this.initEventListeners();
    }

    loadSettings() {
        // Load general settings
        document.getElementById('currency').value = this.settings.general.currency;
        document.getElementById('timezone').value = this.settings.general.timezone;
        document.getElementById('dateFormat').value = this.settings.general.dateFormat;
        document.getElementById('language').value = this.settings.general.language;
        document.getElementById('darkMode').checked = this.settings.general.darkMode;

        // Load business settings
        document.getElementById('businessName').value = this.settings.business.name;
        document.getElementById('businessPhone').value = this.settings.business.phone;
        document.getElementById('businessAddress').value = this.settings.business.address;
        document.getElementById('businessEmail').value = this.settings.business.email;
        document.getElementById('businessWebsite').value = this.settings.business.website;
        document.getElementById('taxRate').value = this.settings.business.taxRate;
        document.getElementById('receiptNote').value = this.settings.business.receiptNote;

        // Load notification settings
        document.getElementById('lowStockAlert').checked = this.settings.notifications.lowStockAlert;
        document.getElementById('outOfStockAlert').checked = this.settings.notifications.outOfStockAlert;
        document.getElementById('stockThreshold').value = this.settings.notifications.stockThreshold;
        document.getElementById('dailySalesReport').checked = this.settings.notifications.dailySalesReport;
        document.getElementById('weeklySalesReport').checked = this.settings.notifications.weeklySalesReport;
        document.getElementById('largeOrderAlert').checked = this.settings.notifications.largeOrderAlert;
        document.getElementById('newCustomerAlert').checked = this.settings.notifications.newCustomerAlert;
        document.getElementById('customerBirthday').checked = this.settings.notifications.customerBirthday;

        // Apply dark mode if enabled
        if (this.settings.general.darkMode) {
            this.enableDarkMode();
        }
    }

    initEventListeners() {
        // Dark mode toggle
        document.getElementById('darkMode')?.addEventListener('change', (e) => {
            if (e.target.checked) {
                this.enableDarkMode();
            } else {
                this.disableDarkMode();
            }
        });

        // Real-time settings updates
        const settingsInputs = document.querySelectorAll('#general input, #general select, #business input, #business textarea, #notifications input');
        settingsInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.updateSettings();
                this.showNotification('Settings updated automatically', 'success');
            });
        });
    }

    updateSettings() {
        // Update general settings
        this.settings.general = {
            currency: document.getElementById('currency').value,
            timezone: document.getElementById('timezone').value,
            dateFormat: document.getElementById('dateFormat').value,
            language: document.getElementById('language').value,
            darkMode: document.getElementById('darkMode').checked
        };

        // Update business settings
        this.settings.business = {
            name: document.getElementById('businessName').value,
            phone: document.getElementById('businessPhone').value,
            address: document.getElementById('businessAddress').value,
            email: document.getElementById('businessEmail').value,
            website: document.getElementById('businessWebsite').value,
            taxRate: parseFloat(document.getElementById('taxRate').value),
            receiptNote: document.getElementById('receiptNote').value
        };

        // Update notification settings
        this.settings.notifications = {
            lowStockAlert: document.getElementById('lowStockAlert').checked,
            outOfStockAlert: document.getElementById('outOfStockAlert').checked,
            stockThreshold: parseInt(document.getElementById('stockThreshold').value),
            dailySalesReport: document.getElementById('dailySalesReport').checked,
            weeklySalesReport: document.getElementById('weeklySalesReport').checked,
            largeOrderAlert: document.getElementById('largeOrderAlert').checked,
            newCustomerAlert: document.getElementById('newCustomerAlert').checked,
            customerBirthday: document.getElementById('customerBirthday').checked
        };

        this.saveSettings();
    }

    saveSettings() {
        localStorage.setItem('sweetDelightsSettings', JSON.stringify(this.settings));
    }

    enableDarkMode() {
        document.body.classList.add('dark-mode');
        document.documentElement.style.setProperty('--neutral-100', '#1a1a1a');
        document.documentElement.style.setProperty('--neutral-200', '#2d2d2d');
        document.documentElement.style.setProperty('--neutral-800', '#ffffff');
    }

    disableDarkMode() {
        document.body.classList.remove('dark-mode');
        document.documentElement.style.setProperty('--neutral-100', '#FDF6E8');
        document.documentElement.style.setProperty('--neutral-200', '#F5F5DC');
        document.documentElement.style.setProperty('--neutral-800', '#2C1810');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success-color)' : 'var(--primary-color)'};
            color: white;
            padding: 12px 24px;
            border-radius: 6px;
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Tab functionality
function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));

    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => button.classList.remove('active'));

    // Show selected tab content
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

// Settings actions
function saveAllSettings() {
    settingsManager.updateSettings();
    settingsManager.showNotification('All settings saved successfully!', 'success');
}

function resetSettings() {
    if (confirm('Are you sure you want to reset all settings to defaults? This action cannot be undone.')) {
        settingsManager.settings = settingsManager.getDefaultSettings();
        settingsManager.loadSettings();
        settingsManager.saveSettings();
        settingsManager.showNotification('Settings reset to defaults', 'success');
    }
}

// Export functions
function exportInventory() {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const csv = [
        ['Name', 'Category', 'SKU', 'Price', 'Stock', 'Min Stock'],
        ...inventory.map(p => [p.name, p.category, p.sku, p.price, p.stock, p.minStock])
    ].map(row => row.join(',')).join('\n');

    downloadCSV(csv, 'inventory-export.csv');
    settingsManager.showNotification('Inventory exported successfully!', 'success');
}

function exportCustomers() {
    const customers = JSON.parse(localStorage.getItem('customers')) || [];
    const csv = [
        ['Name', 'Email', 'Phone', 'Type', 'Total Orders', 'Total Spent'],
        ...customers.map(c => [
            `${c.firstName} ${c.lastName}`,
            c.email,
            c.phone,
            c.type,
            c.totalOrders,
            c.totalSpent
        ])
    ].map(row => row.join(',')).join('\n');

    downloadCSV(csv, 'customers-export.csv');
    settingsManager.showNotification('Customers exported successfully!', 'success');
}

function exportSales() {
    const sales = JSON.parse(localStorage.getItem('sales')) || [];
    const csv = [
        ['Order #', 'Date', 'Customer', 'Total', 'Payment Method', 'Status'],
        ...sales.map(s => [
            s.id,
            new Date(s.date).toLocaleDateString(),
            s.customerName,
            s.total,
            s.paymentMethod,
            s.status
        ])
    ].map(row => row.join(',')).join('\n');

    downloadCSV(csv, 'sales-export.csv');
    settingsManager.showNotification('Sales exported successfully!', 'success');
}

function exportAll() {
    const date = new Date().toISOString().split('T')[0];
    
    // Create a comprehensive export
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const customers = JSON.parse(localStorage.getItem('customers')) || [];
    const sales = JSON.parse(localStorage.getItem('sales')) || [];
    
    const allData = {
        exportDate: new Date().toISOString(),
        businessInfo: settingsManager.settings.business,
        inventory,
        customers,
        sales,
        settings: settingsManager.settings
    };

    const jsonData = JSON.stringify(allData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sweet-delights-complete-backup-${date}.json`;
    a.click();

    settingsManager.showNotification('Complete backup exported successfully!', 'success');
}

// Import functionality
function importData() {
    const fileInput = document.getElementById('importFile');
    const importType = document.getElementById('importType').value;
    
    if (!fileInput.files.length) {
        settingsManager.showNotification('Please select a file to import', 'warning');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            let data;
            
            if (file.type === 'application/json' || file.name.endsWith('.json')) {
                data = JSON.parse(e.target.result);
                handleJSONImport(data, importType);
            } else {
                data = parseCSV(e.target.result);
                handleCSVImport(data, importType);
            }
            
            settingsManager.showNotification(`${importType} data imported successfully!`, 'success');
        } catch (error) {
            settingsManager.showNotification('Error importing data: ' + error.message, 'error');
        }
    };
    
    reader.readAsText(file);
}

function handleJSONImport(data, importType) {
    switch (importType) {
        case 'inventory':
            if (data.inventory) {
                localStorage.setItem('inventory', JSON.stringify(data.inventory));
            } else {
                localStorage.setItem('inventory', JSON.stringify(data));
            }
            break;
        case 'customers':
            if (data.customers) {
                localStorage.setItem('customers', JSON.stringify(data.customers));
            } else {
                localStorage.setItem('customers', JSON.stringify(data));
            }
            break;
        case 'sales':
            if (data.sales) {
                localStorage.setItem('sales', JSON.stringify(data.sales));
            } else {
                localStorage.setItem('sales', JSON.stringify(data));
            }
            break;
    }
}

function handleCSVImport(data, importType) {
    // Basic CSV import - would need more sophisticated parsing for production
    settingsManager.showNotification('CSV import feature would be implemented here', 'info');
}

function parseCSV(text) {
    const lines = text.split('\n');
    const headers = lines[0].split(',');
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const row = {};
        headers.forEach((header, index) => {
            row[header.trim()] = values[index]?.trim();
        });
        data.push(row);
    }
    
    return data;
}

function confirmSystemReset() {
    const confirmation = confirm(
        'WARNING: This will permanently delete ALL data including:\n' +
        '- All inventory items\n' +
        '- All customer records\n' +
        '- All sales history\n' +
        '- All settings\n\n' +
        'This action CANNOT be undone. Are you absolutely sure?'
    );
    
    if (confirmation) {
        const secondConfirmation = confirm('Last chance! This will wipe everything. Continue?');
        if (secondConfirmation) {
            performSystemReset();
        }
    }
}

function performSystemReset() {
    // Clear all localStorage data
    const keysToRemove = [
        'inventory',
        'customers', 
        'sales',
        'sweetDelightsData',
        'sweetDelightsSettings'
    ];
    
    keysToRemove.forEach(key => {
        localStorage.removeItem(key);
    });
    
    settingsManager.showNotification('System has been reset to factory defaults', 'success');
    
    // Reload the page after a delay
    setTimeout(() => {
        window.location.reload();
    }, 2000);
}

// Helper function to download CSV
function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
}

// Initialize settings manager
document.addEventListener('DOMContentLoaded', () => {
    window.settingsManager = new SettingsManager();
});