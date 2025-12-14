# Sweet Delights - Management Dashboard

A comprehensive management dashboard for Sweet Delights, an Indian sweet shop. This application helps manage inventory, sales, customers, and provides insightful reports with Firebase authentication integration.

![Sweet Delights Dashboard](https://img.shields.io/badge/Status-Active-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🍬 Features

### Authentication
- **Firebase Integration**: Secure user authentication with email/password
- **Google Sign-in**: Quick login with Google account
- **User Management**: Signup and login functionality
- **Demo Accounts**: Quick access demo credentials

### Dashboard
- **Real-time Metrics**: Today's revenue, orders, customers, and inventory alerts
- **Interactive Charts**: Sales trends, product performance, and category analysis
- **Recent Activities**: Live activity feed with latest transactions
- **Quick Actions**: Fast access to common tasks

### Inventory Management
- **Product Catalog**: Complete inventory with Indian sweets and snacks
- **Stock Tracking**: Real-time stock levels with low-stock alerts
- **Categories**: Organized by Mithai, Syrup-based, Cakes, Savouries, Beverages
- **Image Support**: Product images with automatic categorization
- **Export/Import**: CSV export functionality

### Sales Management
- **Point of Sale**: Quick sale processing with cart functionality
- **Order History**: Complete sales transaction records
- **Payment Methods**: Multiple payment options tracking
- **Customer Integration**: Link sales to customer records

### Customer Management
- **Customer Database**: Complete customer profiles with Indian names/details
- **Order History**: Individual customer purchase history
- **VIP/Regular**: Customer type classification
- **Contact Management**: Email integration and contact details

### Reports & Analytics
- **Sales Reports**: Daily, weekly, monthly sales analysis
- **Product Performance**: Best sellers and revenue analysis
- **Business Insights**: AI-powered business recommendations
- **Export Functionality**: PDF and CSV export options

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Authentication**: Firebase Auth
- **Charts**: Chart.js for data visualization
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Poppins)
- **Storage**: localStorage for demo data persistence

## 📁 Project Structure

```
Sweet-Delights/
├── index.html              # Login page
├── login.html               # Signup page
├── afterlogin.html          # Main dashboard
├── style.css               # Login/Signup styles
├── README.md               # Project documentation
├── css/
│   └── style.css           # Dashboard styles
├── js/
│   ├── dashboard.js        # Dashboard functionality
│   ├── inventory.js        # Inventory management
│   ├── customers.js        # Customer management
│   ├── reports.js          # Reports and analytics
│   └── data-manager.js     # Data handling utilities
├── pages/
│   ├── inventory.html      # Inventory management page
│   ├── sales.html          # Sales management page
│   ├── customers.html      # Customer management page
│   ├── reports.html        # Reports and analytics page
│   └── settings.html       # Settings page
└── img/                    # Images and assets
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for Firebase and CDN resources)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd sweet-delights
   ```

2. **Open the application:**
   ```bash
   # Open index.html in your browser
   open index.html
   # or
   python -m http.server 8000  # For local server
   ```

3. **Firebase Configuration:**
   - The app uses a pre-configured Firebase project
   - For production, replace the Firebase config in JavaScript files

### Demo Accounts

**Quick Login Options:**
- **Demo User**: `user@demo.com` / `demo123`
- **Admin Demo**: `admin@demo.com` / `admin123`

## 💰 Indian Context Features

### Currency
- All prices displayed in Indian Rupees (₹)
- Proper Indian number formatting (1,23,456.78)
- Localized currency calculations

### Products
- **Mithai**: Kaju Katli, Ladoo, Barfi
- **Syrup-based**: Jalebi, Gulab Jamun, Rasgulla
- **Savouries**: Samosa, Kachori
- **Beverages**: Masala Chai Mix
- **Cakes**: Black Forest, and other popular varieties

### Customer Data
- Indian names and addresses
- Indian phone number format (+91)
- Regional city names and locations

## 📊 Features Overview

### Dashboard Analytics
- Revenue tracking in INR
- Order volume monitoring
- Customer growth metrics
- Inventory alerts

### Inventory Features
- Product categorization
- Stock level monitoring
- Automatic reorder alerts
- Price management
- Image gallery

### Sales Processing
- Quick checkout process
- Multiple payment methods
- Order history
- Receipt generation
- Customer linking

### Customer Management
- Profile management
- Purchase history
- Loyalty tracking
- Communication tools

### Reporting Tools
- Sales trend analysis
- Product performance
- Customer behavior insights
- Export capabilities

## 🎨 Design Features

### Color Scheme
- **Primary**: `#8B4513` (Saddle Brown)
- **Secondary**: `#D2691E` (Chocolate)
- **Accent**: `#FF8C00` (Dark Orange)
- **Background**: `#FDF6E8` (Cream)

### Responsive Design
- Mobile-first approach
- Tablet optimization
- Desktop enhancement
- Print-friendly styles

### User Experience
- Intuitive navigation
- Quick actions
- Search and filter
- Notifications
- Loading states

## 🔧 Configuration

### Firebase Setup
```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-domain.firebaseapp.com",
  projectId: "your-project-id",
  // ... other config
};
```

### Environment Variables
- No environment variables required for demo
- All configuration is in JavaScript files

## 📱 Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 🔮 Future Enhancements

- [ ] Mobile app version
- [ ] Advanced analytics
- [ ] Multi-location support
- [ ] Integration with payment gateways
- [ ] Barcode scanning
- [ ] Supplier management
- [ ] Staff management
- [ ] Advanced reporting
- [ ] WhatsApp integration
- [ ] SMS notifications

## 📈 Performance

- **Load Time**: <2 seconds
- **Bundle Size**: ~500KB
- **Mobile Performance**: Optimized
- **Offline Support**: Planned for future

---

**Sweet Delights** - Sweetening your business management experience! 🍭


