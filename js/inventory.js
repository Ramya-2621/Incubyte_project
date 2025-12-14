// Inventory Management JavaScript
class InventoryManager {
    constructor() {
        this.products = JSON.parse(localStorage.getItem('inventory')) || [];
        this.filteredProducts = [...this.products];
        this.categories = ['chocolates', 'candies', 'cakes', 'cookies', 'beverages'];
        this.init();
    }

    init() {
        if (this.products.length === 0) {
            this.generateSampleProducts();
        }
        this.renderProducts();
        this.updateStats();
        this.initEventListeners();
        this.loadProductImages();
    }

    generateSampleProducts() {
        const sampleProducts = [
            { name: 'Kaju Katli', category: 'mithai', sku: 'MITH001', price: 750, stock: 45, minStock: 10, description: 'Classic cashew-based diamond-shaped sweet' },
            { name: 'Jalebi', category: 'syrup-based', sku: 'SYRP001', price: 250, stock: 120, minStock: 20, description: 'Crispy, chewy, spiral-shaped sweet soaked in syrup' },
            { name: 'Gulab Jamun', category: 'syrup-based', sku: 'SYRP002', price: 300, stock: 80, minStock: 20, description: 'Soft berry-sized balls made of milk solids, deep-fried and soaked in syrup' },
            { name: 'Chocolate Barfi', category: 'mithai', sku: 'MITH002', price: 600, stock: 3, minStock: 15, description: 'A fusion sweet combining chocolate and traditional barfi' },
            { name: 'Samosa', category: 'savouries', sku: 'SAV001', price: 150, stock: 75, minStock: 25, description: 'Crispy pastry filled with spiced potatoes and peas (per dozen)' },
            { name: 'Ladoo', category: 'mithai', sku: 'MITH003', price: 400, stock: 0, minStock: 30, description: 'Sphere-shaped sweets made of flour, fat and sugar' },
            { name: 'Rasgulla', category: 'syrup-based', sku: 'SYRP003', price: 350, stock: 200, minStock: 50, description: 'Spongy white balls of chenna (Indian cheese) soaked in sugar syrup' },
            { name: 'Black Forest Cake', category: 'cakes', sku: 'CAKE001', price: 550, stock: 12, minStock: 5, description: 'Classic black forest cake (1/2 kg)' },
            { name: 'Kachori', category: 'savouries', sku: 'SAV002', price: 200, stock: 85, minStock: 20, description: 'Spicy snack, round flattened ball made of fine flour filled with a stuffing of baked mixture of yellow moong dal (per dozen)' },
            { name: 'Masala Chai Mix', category: 'beverages', sku: 'BEV001', price: 250, stock: 60, minStock: 15, description: 'Instant mix for authentic Indian masala chai' }
        ];

        this.products = sampleProducts.map((product, index) => ({
            ...product,
            id: Date.now() + index,
            image: this.getProductImage(product.category)
        }));
        
        this.saveProducts();
    }

    getProductImage(category) {
        const images = {
            mithai: 'https://images.pexels.com/photos/1070930/pexels-photo-1070930.jpeg?auto=compress&cs=tinysrgb&w=300',
            'syrup-based': 'https://images.pexels.com/photos/65882/chocolate-dark-coffee-confiserie-65882.jpeg?auto=compress&cs=tinysrgb&w=300',
            cakes: 'https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg?auto=compress&cs=tinysrgb&w=300',
            savouries: 'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=300',
            beverages: 'https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg?auto=compress&cs=tinysrgb&w=300'
        };
        return images[category] || 'https://images.pexels.com/photos/1070930/pexels-photo-1070930.jpeg?auto=compress&cs=tinysrgb&w=300';
    }

    renderProducts() {
        const tbody = document.getElementById('inventoryTableBody');
        if (!tbody) return;

        tbody.innerHTML = this.filteredProducts.map(product => `
            <tr data-id="${product.id}">
                <td>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <img src="${product.image}" alt="${product.name}" style="width: 40px; height: 40px; border-radius: 6px; object-fit: cover;">
                        <div>
                            <strong>${product.name}</strong>
                        </div>
                    </div>
                </td>
                <td><span class="category-badge">${this.formatCategory(product.category)}</span></td>
                <td><code>${product.sku}</code></td>
                <td>
                    <span class="${this.getStockStatus(product)}">${product.stock}</span>
                    ${product.stock <= product.minStock ? '<i class="fas fa-exclamation-triangle" style="color: var(--warning-color); margin-left: 8px;"></i>' : ''}
                </td>
                <td><strong>₹${product.price.toLocaleString('en-IN')}</strong></td>
                <td><span class="status-badge ${this.getStatusClass(product)}">${this.getStatus(product)}</span></td>
                <td>
                    <div class="action-buttons" style="display: flex; gap: 8px;">
                        <button class="btn-icon" onclick="inventoryManager.editProduct(${product.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon" onclick="inventoryManager.adjustStock(${product.id})" title="Adjust Stock">
                            <i class="fas fa-plus-minus"></i>
                        </button>
                        <button class="btn-icon danger" onclick="inventoryManager.deleteProduct(${product.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    formatCategory(category) {
        return category.charAt(0).toUpperCase() + category.slice(1);
    }

    getStockStatus(product) {
        if (product.stock === 0) return 'text-danger';
        if (product.stock <= product.minStock) return 'text-warning';
        return 'text-success';
    }

    getStatus(product) {
        if (product.stock === 0) return 'Out of Stock';
        if (product.stock <= product.minStock) return 'Low Stock';
        return 'In Stock';
    }

    getStatusClass(product) {
        if (product.stock === 0) return 'status-out';
        if (product.stock <= product.minStock) return 'status-low';
        return 'status-active';
    }

    updateStats() {
        const totalProducts = this.products.length;
        const lowStock = this.products.filter(p => p.stock > 0 && p.stock <= p.minStock).length;
        const outOfStock = this.products.filter(p => p.stock === 0).length;
        const totalValue = this.products.reduce((sum, p) => sum + (p.stock * p.price), 0);

        document.getElementById('totalProducts').textContent = totalProducts;
        document.getElementById('lowStockCount').textContent = lowStock;
        document.getElementById('outOfStockCount').textContent = outOfStock;
        document.getElementById('totalValue').textContent = `₹${totalValue.toLocaleString('en-IN')}`;
    }

    initEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.filterProducts());
        }

        // Category filter
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.filterProducts());
        }

        // Stock filter
        const stockFilter = document.getElementById('stockFilter');
        if (stockFilter) {
            stockFilter.addEventListener('change', () => this.filterProducts());
        }

        // Form submissions
        const addForm = document.getElementById('addProductForm');
        if (addForm) {
            addForm.addEventListener('submit', (e) => this.handleAddProduct(e));
        }

        const editForm = document.getElementById('editProductForm');
        if (editForm) {
            editForm.addEventListener('submit', (e) => this.handleEditProduct(e));
        }
    }

    filterProducts() {
        const search = document.getElementById('searchInput')?.value.toLowerCase() || '';
        const category = document.getElementById('categoryFilter')?.value || '';
        const stockStatus = document.getElementById('stockFilter')?.value || '';

        this.filteredProducts = this.products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(search) || 
                                product.sku.toLowerCase().includes(search);
            const matchesCategory = !category || product.category === category;
            let matchesStock = true;

            if (stockStatus === 'in-stock') matchesStock = product.stock > product.minStock;
            else if (stockStatus === 'low-stock') matchesStock = product.stock > 0 && product.stock <= product.minStock;
            else if (stockStatus === 'out-of-stock') matchesStock = product.stock === 0;

            return matchesSearch && matchesCategory && matchesStock;
        });

        this.renderProducts();
    }

    handleAddProduct(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const productData = {
            id: Date.now(),
            name: document.getElementById('productName').value,
            category: document.getElementById('productCategory').value,
            sku: document.getElementById('productSKU').value,
            price: parseFloat(document.getElementById('productPrice').value),
            stock: parseInt(document.getElementById('productStock').value),
            minStock: parseInt(document.getElementById('productMinStock').value),
            description: document.getElementById('productDescription').value,
            image: this.getProductImage(document.getElementById('productCategory').value)
        };

        this.products.push(productData);
        this.saveProducts();
        this.renderProducts();
        this.updateStats();
        this.closeAddProductModal();
        this.showNotification('Product added successfully!', 'success');
    }

    handleEditProduct(e) {
        e.preventDefault();
        
        const id = parseInt(document.getElementById('editProductId').value);
        const productIndex = this.products.findIndex(p => p.id === id);
        
        if (productIndex !== -1) {
            this.products[productIndex] = {
                ...this.products[productIndex],
                name: document.getElementById('editProductName').value,
                category: document.getElementById('editProductCategory').value,
                sku: document.getElementById('editProductSKU').value,
                price: parseFloat(document.getElementById('editProductPrice').value),
                stock: parseInt(document.getElementById('editProductStock').value),
                minStock: parseInt(document.getElementById('editProductMinStock').value),
                description: document.getElementById('editProductDescription').value,
                image: this.getProductImage(document.getElementById('editProductCategory').value)
            };

            this.saveProducts();
            this.renderProducts();
            this.updateStats();
            this.closeEditProductModal();
            this.showNotification('Product updated successfully!', 'success');
        }
    }

    editProduct(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) return;

        document.getElementById('editProductId').value = product.id;
        document.getElementById('editProductName').value = product.name;
        document.getElementById('editProductCategory').value = product.category;
        document.getElementById('editProductSKU').value = product.sku;
        document.getElementById('editProductPrice').value = product.price;
        document.getElementById('editProductStock').value = product.stock;
        document.getElementById('editProductMinStock').value = product.minStock;
        document.getElementById('editProductDescription').value = product.description;

        document.getElementById('editProductModal').style.display = 'block';
    }

    adjustStock(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) return;

        const adjustment = prompt(`Current stock: ${product.stock}\nEnter adjustment (+/- amount):`, '0');
        if (adjustment !== null && !isNaN(adjustment)) {
            const newStock = Math.max(0, product.stock + parseInt(adjustment));
            product.stock = newStock;
            this.saveProducts();
            this.renderProducts();
            this.updateStats();
            this.showNotification('Stock adjusted successfully!', 'success');
        }
    }

    deleteProduct(id) {
        if (confirm('Are you sure you want to delete this product?')) {
            this.products = this.products.filter(p => p.id !== id);
            this.saveProducts();
            this.renderProducts();
            this.updateStats();
            this.showNotification('Product deleted successfully!', 'success');
        }
    }

    saveProducts() {
        localStorage.setItem('inventory', JSON.stringify(this.products));
    }

    loadProductImages() {
        // Preload images for better performance
        this.products.forEach(product => {
            const img = new Image();
            img.src = product.image;
        });
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
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    closeAddProductModal() {
        document.getElementById('addProductModal').style.display = 'none';
        document.getElementById('addProductForm').reset();
    }

    closeEditProductModal() {
        document.getElementById('editProductModal').style.display = 'none';
    }
}

// Modal functions
function openAddProductModal() {
    document.getElementById('addProductModal').style.display = 'block';
}

function closeAddProductModal() {
    document.getElementById('addProductModal').style.display = 'none';
    document.getElementById('addProductForm').reset();
}

function closeEditProductModal() {
    document.getElementById('editProductModal').style.display = 'none';
}

function refreshInventory() {
    inventoryManager.renderProducts();
    inventoryManager.updateStats();
    inventoryManager.showNotification('Inventory refreshed!', 'success');
}

function exportInventory() {
    const data = inventoryManager.products;
    const csv = [
        ['Name', 'Category', 'SKU', 'Price', 'Stock', 'Min Stock', 'Status'],
        ...data.map(p => [
            p.name, 
            p.category, 
            p.sku, 
            p.price, 
            p.stock, 
            p.minStock,
            p.stock === 0 ? 'Out of Stock' : (p.stock <= p.minStock ? 'Low Stock' : 'In Stock')
        ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
}

// Initialize inventory manager
document.addEventListener('DOMContentLoaded', () => {
    window.inventoryManager = new InventoryManager();
});

// Close modals when clicking outside
window.onclick = function(event) {
    const addModal = document.getElementById('addProductModal');
    const editModal = document.getElementById('editProductModal');
    
    if (event.target === addModal) {
        addModal.style.display = 'none';
    }
    if (event.target === editModal) {
        editModal.style.display = 'none';
    }
};