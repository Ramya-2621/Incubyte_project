// Customer Management JavaScript
class CustomerManager {
    constructor() {
        this.customers = JSON.parse(localStorage.getItem('customers')) || [];
        this.filteredCustomers = [...this.customers];
        this.init();
    }

    init() {
        if (this.customers.length === 0) {
            this.generateSampleCustomers();
        }
        this.renderCustomers();
        this.updateStats();
        this.initEventListeners();
    }

    generateSampleCustomers() {
        const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Lisa', 'Tom', 'Emma', 'Chris', 'Anna', 'James', 'Emily', 'Robert', 'Jessica', 'William'];
        const lastNames = ['Smith', 'Johnson', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Garcia'];
        const emailDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
        const customerTypes = ['regular', 'vip'];

        for (let i = 0; i < 75; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${emailDomains[Math.floor(Math.random() * emailDomains.length)]}`;
            const joinDate = new Date();
            joinDate.setDate(joinDate.getDate() - Math.floor(Math.random() * 365));

            this.customers.push({
                id: `customer_${i + 1}`,
                firstName,
                lastName,
                email,
                phone: `(555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
                address: `${Math.floor(Math.random() * 9999) + 1} ${['Main St', 'Oak Ave', 'Pine Rd', 'Maple Dr', 'Cedar Ln'][Math.floor(Math.random() * 5)]}`,
                type: Math.random() > 0.8 ? 'vip' : 'regular',
                totalOrders: Math.floor(Math.random() * 25) + 1,
                totalSpent: Math.floor(Math.random() * 2000) + 100,
                joinDate: joinDate.toISOString(),
                birthdate: `${Math.floor(Math.random() * 12) + 1}/${Math.floor(Math.random() * 28) + 1}/${Math.floor(Math.random() * 50) + 1960}`,
                status: Math.random() > 0.1 ? 'active' : 'inactive',
                lastOrderDate: new Date(joinDate.getTime() + Math.random() * (Date.now() - joinDate.getTime())).toISOString()
            });
        }

        this.saveCustomers();
    }

    renderCustomers() {
        const tbody = document.getElementById('customersTableBody');
        if (!tbody) return;

        tbody.innerHTML = this.filteredCustomers.map(customer => `
            <tr data-id="${customer.id}">
                <td>
                    <div class="customer-info">
                        <div class="customer-avatar">${customer.firstName.charAt(0)}${customer.lastName.charAt(0)}</div>
                        <div>
                            <strong>${customer.firstName} ${customer.lastName}</strong>
                            <div style="font-size: 0.85em; color: var(--neutral-500);">
                                Joined ${new Date(customer.joinDate).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <a href="mailto:${customer.email}" style="color: var(--primary-color);">${customer.email}</a>
                </td>
                <td>
                    <a href="tel:${customer.phone}" style="color: var(--primary-color);">${customer.phone}</a>
                </td>
                <td>
                    <span class="type-badge ${customer.type === 'vip' ? 'vip' : 'regular'}">${customer.type.toUpperCase()}</span>
                </td>
                <td><strong>${customer.totalOrders}</strong></td>
                <td><strong>$${customer.totalSpent.toLocaleString()}</strong></td>
                <td>
                    <span class="status-badge ${customer.status === 'active' ? 'status-active' : 'status-inactive'}">
                        ${customer.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td>
                    <div class="action-buttons" style="display: flex; gap: 8px;">
                        <button class="btn-icon" onclick="customerManager.viewCustomer('${customer.id}')" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon" onclick="customerManager.editCustomer('${customer.id}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon" onclick="customerManager.sendEmail('${customer.email}')" title="Send Email">
                            <i class="fas fa-envelope"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    updateStats() {
        const totalCustomers = this.customers.length;
        const activeCustomers = this.customers.filter(c => c.status === 'active').length;
        const vipCustomers = this.customers.filter(c => c.type === 'vip').length;
        
        const thisMonth = new Date();
        thisMonth.setMonth(thisMonth.getMonth() - 1);
        const newCustomers = this.customers.filter(c => new Date(c.joinDate) >= thisMonth).length;

        document.getElementById('totalCustomers').textContent = totalCustomers;
        document.getElementById('activeCustomers').textContent = activeCustomers;
        document.getElementById('newCustomers').textContent = newCustomers;
        document.getElementById('vipCustomers').textContent = vipCustomers;
    }

    initEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchCustomers');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterCustomers());
        }

        // Filter functionality
        const typeFilter = document.getElementById('customerTypeFilter');
        const statusFilter = document.getElementById('statusFilter');
        
        if (typeFilter) typeFilter.addEventListener('change', () => this.filterCustomers());
        if (statusFilter) statusFilter.addEventListener('change', () => this.filterCustomers());

        // Form submission
        const addForm = document.getElementById('addCustomerForm');
        if (addForm) {
            addForm.addEventListener('submit', (e) => this.handleAddCustomer(e));
        }
    }

    filterCustomers() {
        const search = document.getElementById('searchCustomers')?.value?.toLowerCase() || '';
        const type = document.getElementById('customerTypeFilter')?.value || '';
        const status = document.getElementById('statusFilter')?.value || '';

        this.filteredCustomers = this.customers.filter(customer => {
            const matchesSearch = customer.firstName.toLowerCase().includes(search) ||
                                customer.lastName.toLowerCase().includes(search) ||
                                customer.email.toLowerCase().includes(search) ||
                                customer.phone.includes(search);
            
            const matchesType = !type || customer.type === type;
            const matchesStatus = !status || customer.status === status;

            return matchesSearch && matchesType && matchesStatus;
        });

        this.renderCustomers();
    }

    handleAddCustomer(e) {
        e.preventDefault();
        
        const customerData = {
            id: `customer_${Date.now()}`,
            firstName: document.getElementById('customerFirstName').value,
            lastName: document.getElementById('customerLastName').value,
            email: document.getElementById('customerEmail').value,
            phone: document.getElementById('customerPhone').value,
            address: document.getElementById('customerAddress').value,
            type: document.getElementById('customerType').value,
            birthdate: document.getElementById('customerBirthdate').value,
            joinDate: new Date().toISOString(),
            totalOrders: 0,
            totalSpent: 0,
            status: 'active',
            lastOrderDate: null
        };

        this.customers.push(customerData);
        this.saveCustomers();
        // Update filtered list and re-render so new customer appears
        this.filterCustomers();
        this.updateStats();
        this.closeAddCustomerModal();
        this.showNotification('Customer added successfully!', 'success');
    }

    viewCustomer(customerId) {
        const customer = this.customers.find(c => c.id === customerId);
        if (!customer) return;

        // Generate some order history for demo
        const orderHistory = this.generateOrderHistory(customer);
        const recentActivity = this.generateRecentActivity(customer);

        const modalContent = `
            <div class="customer-details-content">
                <div class="customer-header">
                    <div class="customer-avatar-large">${customer.firstName.charAt(0)}${customer.lastName.charAt(0)}</div>
                    <div class="customer-info">
                        <h3>${customer.firstName} ${customer.lastName}</h3>
                        <span class="type-badge ${customer.type === 'vip' ? 'vip' : 'regular'}">${customer.type.toUpperCase()} Customer</span>
                        <div class="customer-meta">
                            <p><i class="fas fa-envelope"></i> ${customer.email}</p>
                            <p><i class="fas fa-phone"></i> ${customer.phone}</p>
                            <p><i class="fas fa-map-marker-alt"></i> ${customer.address}</p>
                            <p><i class="fas fa-calendar-alt"></i> Joined ${new Date(customer.joinDate).toLocaleDateString()}</p>
                            ${customer.birthdate ? `<p><i class="fas fa-birthday-cake"></i> Birthday: ${customer.birthdate}</p>` : ''}
                        </div>
                    </div>
                </div>

                <div class="customer-stats">
                    <div class="stat-item">
                        <h4>${customer.totalOrders}</h4>
                        <span>Total Orders</span>
                    </div>
                    <div class="stat-item">
                        <h4>$${customer.totalSpent.toLocaleString()}</h4>
                        <span>Total Spent</span>
                    </div>
                    <div class="stat-item">
                        <h4>$${(customer.totalSpent / Math.max(customer.totalOrders, 1)).toFixed(2)}</h4>
                        <span>Avg Order Value</span>
                    </div>
                    <div class="stat-item">
                        <h4>${customer.status === 'active' ? 'Active' : 'Inactive'}</h4>
                        <span>Status</span>
                    </div>
                </div>

                <div class="customer-sections">
                    <div class="section">
                        <h4>Recent Orders</h4>
                        <div class="order-history">
                            ${orderHistory.map(order => `
                                <div class="order-item">
                                    <div class="order-info">
                                        <strong>Order #${order.id}</strong>
                                        <span>${order.date}</span>
                                    </div>
                                    <div class="order-total">$${order.total}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="section">
                        <h4>Recent Activity</h4>
                        <div class="activity-history">
                            ${recentActivity.map(activity => `
                                <div class="activity-item">
                                    <i class="${activity.icon}"></i>
                                    <div>
                                        <span>${activity.description}</span>
                                        <small>${activity.date}</small>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div class="customer-actions">
                    <button class="btn-primary" onclick="customerManager.sendEmail('${customer.email}')">
                        <i class="fas fa-envelope"></i> Send Email
                    </button>
                    <button class="btn-secondary" onclick="customerManager.editCustomer('${customer.id}')">
                        <i class="fas fa-edit"></i> Edit Customer
                    </button>
                    <button class="btn-secondary" onclick="customerManager.createOrder('${customer.id}')">
                        <i class="fas fa-shopping-cart"></i> New Order
                    </button>
                </div>
            </div>
        `;

        this.showCustomerModal(modalContent);
    }

    generateOrderHistory(customer) {
        const orders = [];
        for (let i = 0; i < Math.min(customer.totalOrders, 5); i++) {
            const orderDate = new Date();
            orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 90));
            
            orders.push({
                id: 1000 + i,
                date: orderDate.toLocaleDateString(),
                total: (Math.random() * 150 + 20).toFixed(2)
            });
        }
        return orders;
    }

    generateRecentActivity(customer) {
        return [
            { icon: 'fas fa-shopping-cart', description: 'Placed an order', date: '2 days ago' },
            { icon: 'fas fa-star', description: 'Left a 5-star review', date: '1 week ago' },
            { icon: 'fas fa-envelope', description: 'Subscribed to newsletter', date: '2 weeks ago' },
            { icon: 'fas fa-gift', description: 'Used birthday discount', date: '3 weeks ago' }
        ];
    }

    editCustomer(customerId) {
        // For demo purposes, just show an edit form in modal
        this.showNotification('Edit customer functionality would open here', 'info');
    }

    sendEmail(email) {
        // Open default email client
        window.location.href = `mailto:${email}?subject=Sweet Delights - Customer Service&body=Dear Customer,%0A%0AThank you for choosing Sweet Delights!%0A%0ABest regards,%0ASweet Delights Team`;
    }

    createOrder(customerId) {
        // Redirect to sales page with customer pre-selected
        localStorage.setItem('preSelectedCustomer', customerId);
        window.location.href = 'sales.html';
    }

    showCustomerModal(content) {
        const modal = document.getElementById('customerDetailsModal');
        const modalContent = document.getElementById('customerDetailsContent');
        
        if (modal && modalContent) {
            modalContent.innerHTML = content;
            modal.style.display = 'block';
        }
    }

    closeCustomerDetailsModal() {
        document.getElementById('customerDetailsModal').style.display = 'none';
    }

    closeAddCustomerModal() {
        document.getElementById('addCustomerModal').style.display = 'none';
        document.getElementById('addCustomerForm').reset();
    }

    saveCustomers() {
        localStorage.setItem('customers', JSON.stringify(this.customers));
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

// Global functions
function openAddCustomerModal() {
    document.getElementById('addCustomerModal').style.display = 'block';
}

function closeAddCustomerModal() {
    customerManager.closeAddCustomerModal();
}

function closeCustomerDetailsModal() {
    customerManager.closeCustomerDetailsModal();
}

function refreshCustomers() {
    customerManager.renderCustomers();
    customerManager.updateStats();
    customerManager.showNotification('Customer data refreshed!', 'success');
}

function exportCustomers() {
    const data = customerManager.customers;
    const csv = [
        ['Name', 'Email', 'Phone', 'Type', 'Total Orders', 'Total Spent', 'Status', 'Join Date'],
        ...data.map(c => [
            `${c.firstName} ${c.lastName}`,
            c.email,
            c.phone,
            c.type.toUpperCase(),
            c.totalOrders,
            c.totalSpent,
            c.status,
            new Date(c.joinDate).toLocaleDateString()
        ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
}

// Initialize customer manager
document.addEventListener('DOMContentLoaded', () => {
    window.customerManager = new CustomerManager();
});

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    const addModal = document.getElementById('addCustomerModal');
    const detailsModal = document.getElementById('customerDetailsModal');
    
    if (event.target === addModal) {
        addModal.style.display = 'none';
    }
    if (event.target === detailsModal) {
        detailsModal.style.display = 'none';
    }
});