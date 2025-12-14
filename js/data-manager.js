class DataManager {
    constructor() {
        this.dataPath = './data/';
        this.csvData = {
            sales: [],
            inventory: [],
            customers: []
        };
        this.loadAllData();
    }

    // Load all CSV data into memory
    async loadAllData() {
        try {
            await Promise.all([
                this.loadCSV('sales'),
                this.loadCSV('inventory'),
                this.loadCSV('customers')
            ]);
        } catch (error) {
            console.error('Error loading data:', error);
            this.initializeDefaultData();
        }
    }

    // Load specific CSV file
    async loadCSV(fileName) {
        try {
            const response = await fetch(`${this.dataPath}${fileName}.csv`);
            if (!response.ok) throw new Error(`Failed to load ${fileName}.csv`);
            
            const csvText = await response.text();
            this.csvData[fileName] = this.parseCSV(csvText);
        } catch (error) {
            console.warn(`Could not load ${fileName}.csv, using default data`);
            this.csvData[fileName] = this.getDefaultData(fileName);
        }
    }

    // Parse CSV text to JavaScript objects
    parseCSV(csvText) {
        const lines = csvText.trim().split('\n');
        if (lines.length < 2) return [];

        const headers = lines[0].split(',').map(h => h.trim());
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            if (values.length === headers.length) {
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index];
                });
                data.push(row);
            }
        }
        return data;
    }

    // Parse CSV line handling commas in quoted strings
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current.trim());
        return result;
    }

    // Convert JavaScript objects back to CSV
    arrayToCSV(data, headers) {
        if (!data || data.length === 0) return headers.join(',') + '\n';
        
        const csvRows = [headers.join(',')];
        
        data.forEach(row => {
            const values = headers.map(header => {
                let value = row[header] || '';
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                    value = `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            });
            csvRows.push(values.join(','));
        });
        
        return csvRows.join('\n');
    }

    // Save data to CSV (simulation - in real app would need server-side)
    saveCSV(fileName, data, headers) {
        const csvContent = this.arrayToCSV(data, headers);
        
        // Store in localStorage as backup since we can't write files directly
        localStorage.setItem(`csv_${fileName}`, csvContent);
        
        // For demo purposes, log the CSV content
        console.log(`Saving ${fileName}.csv:`, csvContent);
        
        // Download file for user to save manually
        this.downloadCSV(csvContent, `${fileName}.csv`);
        
        return true;
    }

    // Download CSV file
    downloadCSV(csvContent, filename) {
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }

    // Get data by type
    getData(type) {
        return this.csvData[type] || [];
    }

    // Add new record
    addRecord(type, record) {
        if (!this.csvData[type]) this.csvData[type] = [];
        
        // Generate ID if not provided
        if (!record.id) {
            const maxId = Math.max(0, ...this.csvData[type].map(r => parseInt(r.id) || 0));
            record.id = maxId + 1;
        }
        
        // Add timestamp
        record.created_at = new Date().toISOString();
        
        this.csvData[type].push(record);
        this.saveToStorage(type);
        return record;
    }

    // Update record
    updateRecord(type, id, updates) {
        const records = this.csvData[type] || [];
        const index = records.findIndex(r => r.id == id);
        
        if (index !== -1) {
            this.csvData[type][index] = { ...records[index], ...updates };
            this.saveToStorage(type);
            return this.csvData[type][index];
        }
        return null;
    }

    // Delete record
    deleteRecord(type, id) {
        const records = this.csvData[type] || [];
        const index = records.findIndex(r => r.id == id);
        
        if (index !== -1) {
            const deleted = records.splice(index, 1);
            this.saveToStorage(type);
            return deleted[0];
        }
        return null;
    }

    // Save to localStorage
    saveToStorage(type) {
        const headers = this.getHeaders(type);
        const csvContent = this.arrayToCSV(this.csvData[type], headers);
        localStorage.setItem(`csv_${type}`, csvContent);
    }

    // Get CSV headers for each data type
    getHeaders(type) {
        const headerMap = {
            sales: ['id', 'date', 'customer_name', 'customer_phone', 'items', 'total_amount', 'payment_method', 'status', 'created_at'],
            inventory: ['id', 'product_name', 'category', 'price', 'stock_quantity', 'min_stock_level', 'supplier', 'last_updated'],
            customers: ['id', 'name', 'phone', 'email', 'address', 'total_orders', 'last_order_date', 'created_at']
        };
        return headerMap[type] || [];
    }

    // Initialize default data if CSV files not found
    initializeDefaultData() {
        this.csvData = {
            sales: [
                {
                    id: 1,
                    date: '2024-01-15',
                    customer_name: 'John Doe',
                    customer_phone: '9876543210',
                    items: 'Chocolate Cake,Vanilla Cupcakes',
                    total_amount: '₹850',
                    payment_method: 'Cash',
                    status: 'Completed',
                    created_at: '2024-01-15T10:30:00'
                }
            ],
            inventory: [
                {
                    id: 1,
                    product_name: 'Chocolate Cake',
                    category: 'Cakes',
                    price: '₹450',
                    stock_quantity: '25',
                    min_stock_level: '5',
                    supplier: 'Sweet Suppliers',
                    last_updated: '2024-01-15'
                }
            ],
            customers: [
                {
                    id: 1,
                    name: 'John Doe',
                    phone: '9876543210',
                    email: 'john@example.com',
                    address: '123 Main St, Mumbai',
                    total_orders: '5',
                    last_order_date: '2024-01-15',
                    created_at: '2024-01-01'
                }
            ]
        };
    }

    getDefaultData(type) {
        this.initializeDefaultData();
        return this.csvData[type];
    }

    // Dashboard analytics
    getDashboardStats() {
        const sales = this.getData('sales');
        const inventory = this.getData('inventory');
        const customers = this.getData('customers');

        const today = new Date().toISOString().split('T')[0];
        const todaySales = sales.filter(sale => sale.date === today);
        
        return {
            todayRevenue: todaySales.reduce((sum, sale) => {
                const amount = parseInt(sale.total_amount.replace('₹', '')) || 0;
                return sum + amount;
            }, 0),
            todayOrders: todaySales.length,
            totalCustomers: customers.length,
            lowStockItems: inventory.filter(item => 
                parseInt(item.stock_quantity) <= parseInt(item.min_stock_level)
            ).length
        };
    }

    // Export all data
    exportAllData() {
        const timestamp = new Date().toISOString().split('T')[0];
        
        Object.keys(this.csvData).forEach(type => {
            const headers = this.getHeaders(type);
            this.saveCSV(`${type}_${timestamp}`, this.csvData[type], headers);
        });
    }
}

// Initialize global data manager
window.dataManager = new DataManager();
