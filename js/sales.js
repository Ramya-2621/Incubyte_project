// Sales Management JavaScript
class SalesManager {
    constructor() {
        this.sales = JSON.parse(localStorage.getItem('sales')) || [];
        this.customers = JSON.parse(localStorage.getItem('customers')) || [];
        this.inventory = JSON.parse(localStorage.getItem('inventory')) || [];
        this.cart = [];
        this.currentSale = null;
        this.init();
    }

    init() {
        if (this.sales.length === 0) {
            this.generateSampleSales();
        }
        this.renderSales();
        this.updateStats();
        this.initEventListeners();
        this.loadCustomersForSelect();
    }

    generateSampleSales() {
        const paymentMethods = ['cash', 'card', 'mobile'];
        const statuses = ['completed', 'pending', 'cancelled'];
        
        for (let i = 0; i < 20; i++) {
            const orderDate = new Date();
            orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 30));
            
            const items = this.generateRandomOrderItems();
            const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const tax = subtotal * 0.08;
            const total = subtotal + tax;

            this.sales.push({
                id: 1000 + i,
                date: orderDate.toISOString(),
                customerId: Math.random() > 0.3 ? `customer_${Math.floor(Math.random() * 50)}` : null,
                customerName: Math.random() > 0.3 ? this.generateCustomerName() : 'Walk-in Customer',
                items,
                subtotal: subtotal.toFixed(2),
                tax: tax.toFixed(2),
                total: total.toFixed(2),
                paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
                status: statuses[Math.floor(Math.random() * statuses.length)]
            });
        }
        
        this.saveSales();
    }

    generateRandomOrderItems() {
        const items = [];
        const numItems = Math.floor(Math.random() * 4) + 1;
        const productNames = ['Chocolate Truffles', 'Gummy Bears', 'Red Velvet Cake', 'Cookies', 'Hot Chocolate'];
        
        for (let i = 0; i < numItems; i++) {
            items.push({
                name: productNames[Math.floor(Math.random() * productNames.length)],
                price: Math.random() * 25 + 5,
                quantity: Math.floor(Math.random() * 3) + 1,
                sku: `SKU${String(Math.floor(Math.random() * 999)).padStart(3, '0')}`
            });
        }
        
        return items;
    }

    generateCustomerName() {
        const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Lisa', 'Tom', 'Emma', 'Chris', 'Anna'];
        const lastNames = ['Smith', 'Johnson', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas'];
        
        return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    }

    renderSales() {
        const tbody = document.getElementById('salesTableBody');
        if (!tbody) return;

        const filteredSales = this.getFilteredSales();
        
        tbody.innerHTML = filteredSales.map(sale => `
            <tr data-id="${sale.id}">
                <td><strong>#${sale.id}</strong></td>
                <td>${new Date(sale.date).toLocaleDateString()}</td>
                <td>${sale.customerName}</td>
                <td>
                    <span class="items-summary">${sale.items.length} item${sale.items.length > 1 ? 's' : ''}</span>
                    <div class="items-detail" style="font-size: 0.8em; color: var(--neutral-500); margin-top: 2px;">
                        ${sale.items.slice(0, 2).map(item => `${item.quantity}x ${item.name}`).join(', ')}
                        ${sale.items.length > 2 ? ` +${sale.items.length - 2} more` : ''}
                    </div>
                </td>
                <td><strong>$${sale.total}</strong></td>
                <td><span class="payment-method">${this.formatPaymentMethod(sale.paymentMethod)}</span></td>
                <td><span class="status-badge ${this.getStatusClass(sale.status)}">${this.formatStatus(sale.status)}</span></td>
                <td>
                    <div class="action-buttons" style="display: flex; gap: 8px;">
                        <button class="btn-icon" onclick="salesManager.viewSale(${sale.id})" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon" onclick="salesManager.printReceipt(${sale.id})" title="Print Receipt">
                            <i class="fas fa-print"></i>
                        </button>
                        ${sale.status === 'pending' ? `
                            <button class="btn-icon success" onclick="salesManager.completeSale(${sale.id})" title="Complete">
                                <i class="fas fa-check"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `).join('');
    }

    getFilteredSales() {
        const search = document.getElementById('searchSales')?.value.toLowerCase() || '';
        const dateFrom = document.getElementById('dateFrom')?.value || '';
        const dateTo = document.getElementById('dateTo')?.value || '';
        const status = document.getElementById('statusFilter')?.value || '';

        return this.sales.filter(sale => {
            const matchesSearch = sale.id.toString().includes(search) || 
                                sale.customerName.toLowerCase().includes(search);
            
            let matchesDate = true;
            if (dateFrom || dateTo) {
                const saleDate = new Date(sale.date).toISOString().split('T')[0];
                if (dateFrom) matchesDate = saleDate >= dateFrom;
                if (dateTo) matchesDate = matchesDate && saleDate <= dateTo;
            }

            const matchesStatus = !status || sale.status === status;

            return matchesSearch && matchesDate && matchesStatus;
        }).sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    formatPaymentMethod(method) {
        const methods = {
            cash: 'Cash',
            card: 'Card',
            mobile: 'Mobile'
        };
        return methods[method] || method;
    }

    formatStatus(status) {
        return status.charAt(0).toUpperCase() + status.slice(1);
    }

    getStatusClass(status) {
        const classes = {
            completed: 'status-active',
            pending: 'status-low',
            cancelled: 'status-out'
        };
        return classes[status] || 'status-active';
    }

    updateStats() {
        const today = new Date().toDateString();
        const thisWeek = new Date();
        thisWeek.setDate(thisWeek.getDate() - 7);

        const todaySales = this.sales.filter(sale => 
            new Date(sale.date).toDateString() === today && sale.status === 'completed'
        );
        
        const weekSales = this.sales.filter(sale => 
            new Date(sale.date) >= thisWeek && sale.status === 'completed'
        );

        const todayRevenue = todaySales.reduce((sum, sale) => sum + parseFloat(sale.total), 0);
        const weekRevenue = weekSales.reduce((sum, sale) => sum + parseFloat(sale.total), 0);
        const avgOrder = todaySales.length > 0 ? todayRevenue / todaySales.length : 0;

        document.getElementById('todaySales').textContent = `$${todayRevenue.toFixed(2)}`;
        document.getElementById('todayOrders').textContent = todaySales.length;
        document.getElementById('averageOrder').textContent = `$${avgOrder.toFixed(2)}`;
        document.getElementById('weekSales').textContent = `$${weekRevenue.toFixed(2)}`;
        
        // Update change indicators
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdaySales = this.sales.filter(sale => 
            new Date(sale.date).toDateString() === yesterday.toDateString() && sale.status === 'completed'
        );
        const yesterdayRevenue = yesterdaySales.reduce((sum, sale) => sum + parseFloat(sale.total), 0);
        
        const revenueChange = yesterdayRevenue > 0 ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue * 100) : 0;
        const ordersChange = todaySales.length - yesterdaySales.length;
        
        document.getElementById('todayChange').textContent = `${revenueChange > 0 ? '+' : ''}${revenueChange.toFixed(1)}% from yesterday`;
        document.getElementById('ordersChange').textContent = `${ordersChange > 0 ? '+' : ''}${ordersChange} orders`;
    }

    initEventListeners() {
        // Search and filter functionality
        ['searchSales', 'dateFrom', 'dateTo', 'statusFilter'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener(id === 'searchSales' ? 'input' : 'change', () => {
                    this.renderSales();
                });
            }
        });

        // Product search in new sale modal
        const productSearch = document.getElementById('productSearch');
        if (productSearch) {
            productSearch.addEventListener('input', (e) => this.searchProducts(e.target.value));
        }
    }

    loadCustomersForSelect() {
        const select = document.getElementById('customerSelect');
        if (!select) return;

        // Generate some sample customers if none exist
        if (this.customers.length === 0) {
            this.generateSampleCustomers();
        }

        select.innerHTML = '<option value="">Select Customer (Optional)</option>' +
            this.customers.slice(0, 20).map(customer => 
                `<option value="${customer.id}">${customer.name}</option>`
            ).join('');
    }

    generateSampleCustomers() {
        for (let i = 0; i < 50; i++) {
            this.customers.push({
                id: `customer_${i}`,
                name: this.generateCustomerName(),
                email: `customer${i}@example.com`,
                phone: `(555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`
            });
        }
        localStorage.setItem('customers', JSON.stringify(this.customers));
    }

    searchProducts(query) {
        const resultsDiv = document.getElementById('productResults');
        if (!resultsDiv || !query) {
            if (resultsDiv) resultsDiv.innerHTML = '';
            return;
        }

        // Use inventory from inventory manager or sample data
        let products = this.inventory;
        if (products.length === 0) {
            products = [
                { id: 1, name: 'Chocolate Truffles', price: 24.99, stock: 45, sku: 'CHO001' },
                { id: 2, name: 'Gummy Bears', price: 8.99, stock: 120, sku: 'CAN001' },
                { id: 3, name: 'Red Velvet Cake', price: 35.99, stock: 8, sku: 'CAK001' },
                { id: 4, name: 'Chocolate Chip Cookies', price: 12.99, stock: 65, sku: 'COO001' },
                { id: 5, name: 'Hot Chocolate Mix', price: 15.99, stock: 75, sku: 'BEV001' }
            ];
        }

        const filtered = products.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase()) && 
            product.stock > 0
        ).slice(0, 5);

        resultsDiv.innerHTML = filtered.map(product => `
            <div class="product-result" onclick="salesManager.addToCart(${product.id}, '${product.name}', ${product.price})">
                <div>
                    <strong>${product.name}</strong>
                    <div>$${product.price.toFixed(2)} - Stock: ${product.stock}</div>
                </div>
                <i class="fas fa-plus"></i>
            </div>
        `).join('');
    }

    addToCart(id, name, price) {
        const existingItem = this.cart.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id,
                name,
                price,
                quantity: 1
            });
        }

        this.renderCart();
        this.calculateTotal();
        
        // Clear search
        document.getElementById('productSearch').value = '';
        document.getElementById('productResults').innerHTML = '';
    }

    renderCart() {
        const cartDiv = document.getElementById('cartItems');
        if (!cartDiv) return;

        if (this.cart.length === 0) {
            cartDiv.innerHTML = '<p>No items in cart</p>';
            return;
        }

        cartDiv.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <div class="item-info">
                    <strong>${item.name}</strong>
                    <div>$${item.price.toFixed(2)} each</div>
                </div>
                <div class="quantity-controls">
                    <button onclick="salesManager.updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="salesManager.updateQuantity(${item.id}, 1)">+</button>
                </div>
                <div class="item-total">$${(item.price * item.quantity).toFixed(2)}</div>
                <button class="remove-item" onclick="salesManager.removeFromCart(${item.id})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }

    updateQuantity(id, change) {
        const item = this.cart.find(item => item.id === id);
        if (!item) return;

        item.quantity += change;
        if (item.quantity <= 0) {
            this.removeFromCart(id);
        } else {
            this.renderCart();
            this.calculateTotal();
        }
    }

    removeFromCart(id) {
        this.cart = this.cart.filter(item => item.id !== id);
        this.renderCart();
        this.calculateTotal();
    }

    calculateTotal() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.08;
        const total = subtotal + tax;

        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    }

    viewSale(saleId) {
        const sale = this.sales.find(s => s.id === saleId);
        if (!sale) return;

        // Create and show sale details modal
        const modalContent = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Sale Details - Order #${sale.id}</h2>
                    <span class="close" onclick="this.closest('.modal').style.display='none'">&times;</span>
                </div>
                <div class="sale-details">
                    <div class="detail-row"><strong>Date:</strong> ${new Date(sale.date).toLocaleString()}</div>
                    <div class="detail-row"><strong>Customer:</strong> ${sale.customerName}</div>
                    <div class="detail-row"><strong>Payment Method:</strong> ${this.formatPaymentMethod(sale.paymentMethod)}</div>
                    <div class="detail-row"><strong>Status:</strong> <span class="status-badge ${this.getStatusClass(sale.status)}">${this.formatStatus(sale.status)}</span></div>
                    
                    <h3>Items Ordered:</h3>
                    <table style="width: 100%; margin: 16px 0;">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Qty</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${sale.items.map(item => `
                                <tr>
                                    <td>${item.name}</td>
                                    <td>${item.quantity}</td>
                                    <td>$${item.price.toFixed(2)}</td>
                                    <td>$${(item.price * item.quantity).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    
                    <div class="total-summary">
                        <div><strong>Subtotal: $${sale.subtotal}</strong></div>
                        <div><strong>Tax: $${sale.tax}</strong></div>
                        <div style="font-size: 1.2em; color: var(--primary-color);"><strong>Total: $${sale.total}</strong></div>
                    </div>
                </div>
            </div>
        `;

        this.showModal(modalContent);
    }

    printReceipt(saleId) {
        const sale = this.sales.find(s => s.id === saleId);
        if (!sale) return;

        const receiptWindow = window.open('', '_blank');
        receiptWindow.document.write(`
            <html>
                <head>
                    <title>Receipt - Order #${sale.id}</title>
                    <style>
                        body { font-family: monospace; max-width: 300px; margin: 0 auto; padding: 20px; }
                        .header { text-align: center; margin-bottom: 20px; }
                        .order-info { margin-bottom: 20px; }
                        .items { margin-bottom: 20px; }
                        .total { border-top: 2px solid #000; padding-top: 10px; }
                        .footer { text-align: center; margin-top: 20px; font-size: 0.9em; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h2>🍭 Sweet Delights</h2>
                        <p>123 Sweet Street<br>Candy City, CC 12345<br>(555) 123-4567</p>
                    </div>
                    
                    <div class="order-info">
                        <p><strong>Order #${sale.id}</strong></p>
                        <p>Date: ${new Date(sale.date).toLocaleString()}</p>
                        <p>Customer: ${sale.customerName}</p>
                        <p>Payment: ${this.formatPaymentMethod(sale.paymentMethod)}</p>
                    </div>
                    
                    <div class="items">
                        <p><strong>Items:</strong></p>
                        ${sale.items.map(item => `
                            <p>${item.quantity}x ${item.name}<br>
                            &nbsp;&nbsp;&nbsp;$${item.price.toFixed(2)} each = $${(item.price * item.quantity).toFixed(2)}</p>
                        `).join('')}
                    </div>
                    
                    <div class="total">
                        <p>Subtotal: $${sale.subtotal}</p>
                        <p>Tax (8%): $${sale.tax}</p>
                        <p><strong>Total: $${sale.total}</strong></p>
                    </div>
                    
                    <div class="footer">
                        <p>Thank you for your business!<br>Visit us again soon! 🍬</p>
                    </div>
                </body>
            </html>
        `);
        receiptWindow.document.close();
        receiptWindow.print();
    }

    completeSale(saleId) {
        const sale = this.sales.find(s => s.id === saleId);
        if (sale) {
            sale.status = 'completed';
            this.saveSales();
            this.renderSales();
            this.updateStats();
            this.showNotification('Sale completed successfully!', 'success');
        }
    }

    showModal(content) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        modal.innerHTML = content;
        document.body.appendChild(modal);

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    saveSales() {
        localStorage.setItem('sales', JSON.stringify(this.sales));
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-color);
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
function openNewSaleModal() {
    document.getElementById('newSaleModal').style.display = 'block';
}

function closeNewSaleModal() {
    document.getElementById('newSaleModal').style.display = 'none';
    if (salesManager) {
        salesManager.cart = [];
        salesManager.renderCart();
        salesManager.calculateTotal();
    }
}

function completeSale() {
    if (!salesManager.cart.length) {
        salesManager.showNotification('Please add items to the cart', 'warning');
        return;
    }

    const customerSelect = document.getElementById('customerSelect');
    const paymentMethod = document.getElementById('paymentMethod').value;
    
    const subtotal = salesManager.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    const newSale = {
        id: Math.max(...salesManager.sales.map(s => s.id)) + 1,
        date: new Date().toISOString(),
        customerId: customerSelect.value || null,
        customerName: customerSelect.value ? 
            salesManager.customers.find(c => c.id === customerSelect.value)?.name || 'Unknown Customer' : 
            'Walk-in Customer',
        items: [...salesManager.cart],
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
        paymentMethod,
        status: 'completed'
    };

    salesManager.sales.unshift(newSale);
    salesManager.saveSales();
    salesManager.renderSales();
    salesManager.updateStats();
    
    closeNewSaleModal();
    salesManager.showNotification(`Sale completed! Order #${newSale.id}`, 'success');
    
    // Optionally print receipt
    if (confirm('Would you like to print the receipt?')) {
        salesManager.printReceipt(newSale.id);
    }
}

function refreshSales() {
    salesManager.renderSales();
    salesManager.updateStats();
    salesManager.showNotification('Sales data refreshed!', 'success');
}

function exportSales() {
    const data = salesManager.sales;
    const csv = [
        ['Order #', 'Date', 'Customer', 'Items', 'Total', 'Payment', 'Status'],
        ...data.map(s => [
            s.id,
            new Date(s.date).toLocaleDateString(),
            s.customerName,
            s.items.length + ' items',
            s.total,
            salesManager.formatPaymentMethod(s.paymentMethod),
            salesManager.formatStatus(s.status)
        ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
}

// Initialize sales manager
document.addEventListener('DOMContentLoaded', () => {
    window.salesManager = new SalesManager();
});