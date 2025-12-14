// Dashboard JavaScript functionality
class Dashboard {
    constructor() {
        this.data = {
            todayRevenue: 0,
            todayOrders: 0,
            totalCustomers: 0,
            lowStockItems: 0,
            salesData: [],
            activities: []
        };
        this.charts = {};
        this.init();
    }

    async init() {
        await this.loadData();
        this.updateStats();
        this.initCharts();
        this.loadActivities();
        this.startRealTimeUpdates();
    }

    async loadData() {
        try {
            // Simulate API calls with localStorage or generate sample data
            const stored = localStorage.getItem('sweetDelightsData');
            if (stored) {
                this.data = { ...this.data, ...JSON.parse(stored) };
            } else {
                // Generate initial sample data
                this.generateSampleData();
            }
        } catch (error) {
            console.error('Error loading data:', error);
            this.generateSampleData();
        }
    }

    generateSampleData() {
        // Generate realistic sample data for a sweet shop
        this.data = {
            todayRevenue: Math.floor(Math.random() * 2000) + 800,
            todayOrders: Math.floor(Math.random() * 50) + 25,
            totalCustomers: Math.floor(Math.random() * 500) + 200,
            lowStockItems: Math.floor(Math.random() * 8) + 2,
            salesData: this.generateSalesData(),
            activities: this.generateActivities()
        };
        this.saveData();
    }

    generateSalesData() {
        const data = [];
        const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        labels.forEach(label => {
            data.push({
                label,
                sales: Math.floor(Math.random() * 1500) + 500,
                orders: Math.floor(Math.random() * 40) + 15
            });
        });
        return data;
    }

    generateActivities() {
        const activities = [
            { icon: 'fas fa-shopping-cart', text: 'New order #1001', time: '2 minutes ago' },
            { icon: 'fas fa-user-plus', text: 'New customer registered: Priya Singh', time: '5 minutes ago' },
            { icon: 'fas fa-exclamation-triangle', text: 'Low stock alert: Kaju Katli', time: '12 minutes ago' },
            { icon: 'fas fa-rupee-sign', text: 'Payment received: ₹2,350', time: '18 minutes ago' },
            { icon: 'fas fa-box', text: 'Inventory updated: Rasgulla restocked', time: '25 minutes ago' }
        ];
        return activities;
    }

    updateStats() {
        // Update dashboard statistics
        document.getElementById('todayRevenue').textContent = `₹${this.data.todayRevenue.toLocaleString('en-IN')}`;
        document.getElementById('todayOrders').textContent = this.data.todayOrders;
        document.getElementById('totalCustomers').textContent = this.data.totalCustomers;
        document.getElementById('lowStockItems').textContent = this.data.lowStockItems;

        // Add smooth counting animation
        this.animateCounters();
    }

    animateCounters() {
        const counters = document.querySelectorAll('.stat-value');
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
            const increment = target / 50;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = counter.textContent.includes('₹') 
                        ? `₹${target.toLocaleString('en-IN')}` 
                        : target.toString();
                    clearInterval(timer);
                } else {
                    counter.textContent = counter.textContent.includes('₹') 
                        ? `₹${Math.floor(current).toLocaleString('en-IN')}` 
                        : Math.floor(current).toString();
                }
            }, 20);
        });
    }

    initCharts() {
        this.initSalesChart();
        this.initProductsChart();
    }

    initSalesChart() {
        const ctx = document.getElementById('salesChart');
        if (!ctx) return;

        this.charts.sales = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.data.salesData.map(d => d.label),
                datasets: [{
                    label: 'Daily Sales',
                    data: this.data.salesData.map(d => d.sales),
                    borderColor: '#FF8C00',
                    backgroundColor: 'rgba(255, 140, 0, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#FF8C00',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.05)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '₹' + value.toLocaleString('en-IN');
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    initProductsChart() {
        const ctx = document.getElementById('productsChart');
        if (!ctx) return;

        const products = ['Chocolates', 'Candies', 'Cakes', 'Cookies', 'Beverages'];
        const sales = products.map(() => Math.floor(Math.random() * 100) + 50);

        this.charts.products = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: products,
                datasets: [{
                    data: sales,
                    backgroundColor: [
                        '#8B4513',
                        '#D2691E',
                        '#FF8C00',
                        '#228B22',
                        '#FFD700'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    loadActivities() {
        const activityList = document.getElementById('activityList');
        if (!activityList) return;

        activityList.innerHTML = this.data.activities.map(activity => `
            <div class="activity-item fade-in">
                <i class="${activity.icon}"></i>
                <div>
                    <p><strong>${activity.text}</strong></p>
                    <span>${activity.time}</span>
                </div>
            </div>
        `).join('');
    }

    startRealTimeUpdates() {
        // Simulate real-time updates every 30 seconds
        setInterval(() => {
            this.updateRealTimeData();
        }, 30000);
    }

    updateRealTimeData() {
        // Simulate new orders and revenue
        const newRevenue = Math.floor(Math.random() * 100) + 20;
        this.data.todayRevenue += newRevenue;
        this.data.todayOrders += Math.random() > 0.7 ? 1 : 0;

        // Add new activity
        const newActivity = {
            icon: 'fas fa-shopping-cart',
            text: `New order #${1000 + this.data.todayOrders}`,
            time: 'Just now'
        };
        this.data.activities.unshift(newActivity);
        this.data.activities = this.data.activities.slice(0, 5);

        this.updateStats();
        this.loadActivities();
        this.saveData();
    }

    saveData() {
        try {
            localStorage.setItem('sweetDelightsData', JSON.stringify(this.data));
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});

// Quick sale button functionality
function openQuickSale() {
    // Redirect to sales page
    window.location.href = 'pages/sales.html';
}

// Add smooth scroll to stats cards
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.stat-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
    });
});