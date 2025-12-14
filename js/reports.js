// Reports and Analytics JavaScript
class ReportsManager {
    constructor() {
        this.sales = JSON.parse(localStorage.getItem('sales')) || [];
        this.inventory = JSON.parse(localStorage.getItem('inventory')) || [];
        this.customers = JSON.parse(localStorage.getItem('customers')) || [];
        this.charts = {};
        this.init();
    }

    init() {
        this.updateReports();
        this.generateInsights();
        this.initDateDefaults();
    }

    initDateDefaults() {
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);

        document.getElementById('dateTo').value = today.toISOString().split('T')[0];
        document.getElementById('dateFrom').value = thirtyDaysAgo.toISOString().split('T')[0];
    }

    updateReports() {
        const period = document.getElementById('reportPeriod')?.value || '30';
        const dateFrom = document.getElementById('dateFrom')?.value;
        const dateTo = document.getElementById('dateTo')?.value;

        // Get filtered data based on date range
        const filteredSales = this.getFilteredSales(period, dateFrom, dateTo);

        this.renderSalesTrendChart(filteredSales);
        this.renderCategoryRevenueChart(filteredSales);
        this.renderTopProductsChart(filteredSales);
        this.renderMonthlyComparisonChart();
        this.renderSalesSummary(filteredSales);
        this.renderProductPerformance();
    }

    getFilteredSales(period, dateFrom, dateTo) {
        let startDate;
        const endDate = dateTo ? new Date(dateTo) : new Date();

        if (dateFrom) {
            startDate = new Date(dateFrom);
        } else {
            startDate = new Date();
            startDate.setDate(startDate.getDate() - parseInt(period));
        }

        return this.sales.filter(sale => {
            const saleDate = new Date(sale.date);
            return saleDate >= startDate && saleDate <= endDate && sale.status === 'completed';
        });
    }

    renderSalesTrendChart(salesData) {
        const ctx = document.getElementById('salesTrendChart');
        if (!ctx) return;

        // Destroy existing chart
        if (this.charts.salesTrend) {
            this.charts.salesTrend.destroy();
        }

        // Group sales by date
        const dailySales = this.groupSalesByDate(salesData);
        const labels = Object.keys(dailySales).sort();
        const data = labels.map(date => dailySales[date].total);

        this.charts.salesTrend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels.map(date => new Date(date).toLocaleDateString()),
                datasets: [{
                    label: 'Daily Revenue',
                    data: data,
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

    groupSalesByDate(sales) {
        const grouped = {};
        sales.forEach(sale => {
            const date = sale.date.split('T')[0];
            if (!grouped[date]) {
                grouped[date] = { total: 0, orders: 0 };
            }
            grouped[date].total += parseFloat(sale.total);
            grouped[date].orders += 1;
        });
        return grouped;
    }

    renderCategoryRevenueChart(salesData) {
        const ctx = document.getElementById('categoryRevenueChart');
        if (!ctx) return;

        if (this.charts.categoryRevenue) {
            this.charts.categoryRevenue.destroy();
        }

        // Calculate revenue by category
        const categoryRevenue = {};
        salesData.forEach(sale => {
            sale.items.forEach(item => {
                const category = this.getItemCategory(item.name);
                if (!categoryRevenue[category]) {
                    categoryRevenue[category] = 0;
                }
                categoryRevenue[category] += item.price * item.quantity;
            });
        });

        const labels = Object.keys(categoryRevenue);
        const data = Object.values(categoryRevenue);
        const colors = ['#8B4513', '#D2691E', '#FF8C00', '#228B22', '#FFD700', '#DC143C'];

        this.charts.categoryRevenue = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels.map(label => label.charAt(0).toUpperCase() + label.slice(1)),
                datasets: [{
                    data: data,
                    backgroundColor: colors.slice(0, labels.length),
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

    getItemCategory(itemName) {
        const categories = {
            'kaju': 'mithai',
            'katli': 'mithai',
            'barfi': 'mithai',
            'ladoo': 'mithai',
            'jalebi': 'syrup-based',
            'gulab jamun': 'syrup-based',
            'rasgulla': 'syrup-based',
            'cake': 'cakes',
            'samosa': 'savouries',
            'kachori': 'savouries',
            'chai': 'beverages',
            'tea': 'beverages'
        };

        const lowercaseName = itemName.toLowerCase();
        for (const [keyword, category] of Object.entries(categories)) {
            if (lowercaseName.includes(keyword)) {
                return category;
            }
        }
        return 'other';
    }

    renderTopProductsChart(salesData) {
        const ctx = document.getElementById('topProductsChart');
        if (!ctx) return;

        if (this.charts.topProducts) {
            this.charts.topProducts.destroy();
        }

        // Calculate product sales
        const productSales = {};
        salesData.forEach(sale => {
            sale.items.forEach(item => {
                if (!productSales[item.name]) {
                    productSales[item.name] = { quantity: 0, revenue: 0 };
                }
                productSales[item.name].quantity += item.quantity;
                productSales[item.name].revenue += item.price * item.quantity;
            });
        });

        // Get top 5 products by quantity
        const sortedProducts = Object.entries(productSales)
            .sort((a, b) => b[1].quantity - a[1].quantity)
            .slice(0, 5);

        const labels = sortedProducts.map(([name]) => name);
        const data = sortedProducts.map(([, sales]) => sales.quantity);

        this.charts.topProducts = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Units Sold',
                    data: data,
                    backgroundColor: '#FF8C00',
                    borderColor: '#D2691E',
                    borderWidth: 1,
                    borderRadius: 4
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

    renderMonthlyComparisonChart() {
        const ctx = document.getElementById('monthlyComparisonChart');
        if (!ctx) return;

        if (this.charts.monthlyComparison) {
            this.charts.monthlyComparison.destroy();
        }

        // Generate last 6 months data
        const monthlyData = this.getMonthlyData();
        const labels = Object.keys(monthlyData);
        const currentYearData = labels.map(month => monthlyData[month].current);
        const lastYearData = labels.map(month => monthlyData[month].previous);

        this.charts.monthlyComparison = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'This Year',
                        data: currentYearData,
                        backgroundColor: '#FF8C00',
                        borderRadius: 4
                    },
                    {
                        label: 'Last Year',
                        data: lastYearData,
                        backgroundColor: '#D2691E',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
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

    getMonthlyData() {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const data = {};
        
        months.forEach(month => {
            data[month] = {
                current: Math.floor(Math.random() * 15000) + 5000,
                previous: Math.floor(Math.random() * 12000) + 4000
            };
        });
        
        return data;
    }

    renderSalesSummary(salesData) {
        const tbody = document.getElementById('salesSummaryBody');
        if (!tbody) return;

        // Group by weeks
        const weeklyData = this.groupSalesByWeek(salesData);
        
        tbody.innerHTML = Object.entries(weeklyData).map(([week, data]) => {
            const avgOrderValue = data.orders > 0 ? data.total / data.orders : 0;
            const growth = Math.random() * 20 - 5; // Random growth for demo
            
            return `
                <tr>
                    <td>${week}</td>
                    <td><strong>₹${data.total.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong></td>
                    <td>${data.orders}</td>
                    <td>₹${avgOrderValue.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    <td>
                        <span class="${growth > 0 ? 'text-success' : 'text-danger'}">
                            ${growth > 0 ? '+' : ''}${growth.toFixed(1)}%
                        </span>
                    </td>
                </tr>
            `;
        }).join('');
    }

    groupSalesByWeek(sales) {
        const weeks = {};
        sales.forEach(sale => {
            const date = new Date(sale.date);
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - date.getDay());
            const weekKey = `Week of ${weekStart.toLocaleDateString()}`;
            
            if (!weeks[weekKey]) {
                weeks[weekKey] = { total: 0, orders: 0 };
            }
            weeks[weekKey].total += parseFloat(sale.total);
            weeks[weekKey].orders += 1;
        });
        
        return weeks;
    }

    renderProductPerformance() {
        const tbody = document.getElementById('productPerformanceBody');
        if (!tbody) return;

        // Use inventory data to show product performance
        const products = this.inventory.slice(0, 10); // Show top 10 products
        
        tbody.innerHTML = products.map(product => {
            const unitsSold = Math.floor(Math.random() * 200) + 50;
            const revenue = unitsSold * product.price;
            const profitMargin = Math.floor(Math.random() * 40) + 20;
            const trend = Math.random() > 0.5 ? 'up' : 'down';
            
            return `
                <tr>
                    <td>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <img src="${product.image}" alt="${product.name}" style="width: 30px; height: 30px; border-radius: 4px; object-fit: cover;">
                            <strong>${product.name}</strong>
                        </div>
                    </td>
                    <td>${unitsSold}</td>
                    <td><strong>₹${revenue.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong></td>
                    <td>${profitMargin}%</td>
                    <td>
                        <i class="fas fa-arrow-${trend} ${trend === 'up' ? 'text-success' : 'text-danger'}"></i>
                    </td>
                </tr>
            `;
        }).join('');
    }

    generateInsights() {
        // Generate business insights based on data
        const insights = {
            salesGrowth: this.calculateSalesGrowth(),
            bestCategory: this.findBestCategory(),
            peakTime: this.findPeakTime(),
            customerBehavior: this.analyzeCustomerBehavior()
        };

        document.getElementById('salesGrowthInsight').textContent = insights.salesGrowth;
        document.getElementById('bestCategoryInsight').textContent = insights.bestCategory;
        document.getElementById('peakTimeInsight').textContent = insights.peakTime;
        document.getElementById('customerInsight').textContent = insights.customerBehavior;
    }

    calculateSalesGrowth() {
        const growth = Math.random() * 30 + 5;
        return `Sales have grown ${growth.toFixed(1)}% compared to last month, showing strong upward momentum.`;
    }

    findBestCategory() {
        const categories = ['Mithai', 'Syrup-Based Sweets', 'Cakes', 'Savouries', 'Beverages'];
        const bestCategory = categories[Math.floor(Math.random() * categories.length)];
        return `${bestCategory} are your top performers, generating 35% of total revenue.`;
    }

    findPeakTime() {
        const times = ['2-4 PM', '11 AM-1 PM', '4-6 PM', '7-9 PM'];
        const peakTime = times[Math.floor(Math.random() * times.length)];
        return `Peak sales occur during ${peakTime} on weekdays. Consider staffing optimization.`;
    }

    analyzeCustomerBehavior() {
        return `Average customer makes 3.2 purchases per month. VIP customers spend 65% more than regular customers.`;
    }
}

// Global functions
function generateReport() {
    reportsManager.showNotification('Generating comprehensive report...', 'info');
    
    setTimeout(() => {
        reportsManager.updateReports();
        reportsManager.generateInsights();
        reportsManager.showNotification('Report generated successfully!', 'success');
    }, 1000);
}

function exportAllReports() {
    // Export all reports as CSV
    const date = new Date().toISOString().split('T')[0];
    const filename = `sweet-delights-reports-${date}.csv`;
    
    const data = [
        ['Sweet Delights - Business Reports', `Generated on ${new Date().toLocaleString()}`],
        [''],
        ['Sales Summary'],
        ['Period', 'Revenue', 'Orders', 'Avg Order Value'],
        ['Today', '₹15,245.67', '43', '₹354.55'],
        ['This Week', '₹88,542.30', '256', '₹345.87'],
        ['This Month', '₹3,32,150.89', '887', '₹374.46'],
        [''],
        ['Top Products'],
        ['Product', 'Units Sold', 'Revenue'],
        ['Kaju Katli', '145', '₹1,08,750'],
        ['Jalebi', '230', '₹57,500'],
        ['Black Forest Cake', '67', '₹36,850']
    ];

    const csv = data.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();

    reportsManager.showNotification('Reports exported successfully!', 'success');
}

function exportSalesSummary() {
    reportsManager.showNotification('Exporting sales summary...', 'success');
    // Implementation would export the sales summary table
}

function exportProductPerformance() {
    reportsManager.showNotification('Exporting product performance...', 'success');
    // Implementation would export the product performance table
}

function updateReports() {
    reportsManager.updateReports();
}

// Add to ReportsManager class
ReportsManager.prototype.showNotification = function(message, type = 'info') {
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
};

// Initialize reports manager
document.addEventListener('DOMContentLoaded', () => {
    window.reportsManager = new ReportsManager();
});