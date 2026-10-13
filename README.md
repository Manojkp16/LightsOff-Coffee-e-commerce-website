# ☕ LightsOff Artisan Coffee E-Commerce Web Application

**Author**: [Manoj K P](https://www.linkedin.com/in/manoj-k-p-9bb2b3288)  
**LinkedIn**: [`www.linkedin.com/in/manoj-k-p-9bb2b3288`](https://www.linkedin.com/in/manoj-k-p-9bb2b3288)  
**Tech Stack**: HTML5 • CSS3 • JavaScript • Node.js • Express.js • MongoDB

A full-stack, specialty coffee e-commerce web application crafted with pure **HTML5**, **CSS3**, and **Vanilla JavaScript** on the frontend, powered by **Node.js** and **Express.js** on the backend, and backed by **MongoDB** with **Mongoose**.

---

## 🌟 Features Overview

### 🛍️ Customer Experience
- **Interactive Coffee Quiz**: "Find Your Perfect Morning Cup" in 3 sensory questions (Roast level, brew method, flavor notes) and get an instant coffee match.
- **Dynamic Roastery Catalog**: Filter coffees by **Category** (*Single Origin*, *Espresso Blends*, *Cold Brew*, *Decaf*, *Artisan Gear*) and **Roast Level** (*Light*, *Medium*, *Medium-Dark*, *Dark*), plus price range slider and instant live search.
- **Rich Coffee Profiles**: High-resolution gallery, roast meter visualizer (1-5 dots), origin elevation & process specs, tasting & aroma notes pills.
- **Grind & Size Customizer**: Choose whole bean or specific grind settings (Espresso, Drip/Pour Over, French Press), and bag sizes (250g, 500g, 1kg) with real-time price multiplier updates.
- **Slide-Over Bag Drawer & Full Bag Page**: Free shipping threshold progress bar (*"Add $12 more for Free Shipping!"*), quantity adjusters, and persistent state using `localStorage`.
- **Checkout & Multi-Payment Simulation**: Seamless checkout with delivery details, promo discount calculation (`COFFEE10` for 10% off, `BEAN20` for 20% off, `FREESHIP` for free delivery), and simulated Card, UPI, and Cash on Delivery payments.
- **Live Order Tracking**: Visual 4-stage stepper (*Placed &rarr; Roasting &rarr; Shipped &rarr; Delivered*), tracking numbers, and account purchase history.
- **Customer Ratings & Reviews**: Post reviews and calculate average ratings dynamically.

### ⚙️ Roaster Administration Dashboard
- **Sales Analytics Counters**: Total Revenue, Total Orders, Active Roasts in Catalog, Registered Accounts.
- **Order Fulfillment Stepper**: Live dropdown to update order status (*Placed*, *Roasting*, *Shipped*, *Delivered*, *Cancelled*).
- **Product Management (CRUD)**: Add new coffees with tasting notes, roast level, origin, stock, and imagery. Delete or edit existing items.
### 🌐 Social & Showcase Features
- **LinkedIn Integration**: Connect buttons in footers, direct "Share Roast on LinkedIn" one-click button on product details.
- **LinkedIn Portfolio Kit**: Complete copy-paste post, project descriptions, skills tags, and resume bullets in [`LINKEDIN_SHOWCASE.md`](file:///E:/coffee-ecommerce/LINKEDIN_SHOWCASE.md).

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, Modern CSS3 (CSS Variables, Flexbox, CSS Grid, Glassmorphism), Vanilla ES6+ JavaScript.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (via Mongoose ODM).
- **Security & Auth**: JWT (JSON Web Tokens), `bcryptjs` password hashing.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
Ensure you have Node.js and MongoDB installed and running on your system.
*(MongoDB runs by default on `mongodb://127.0.0.1:27017`)*

### 2. Install Dependencies
Dependencies are already configured. If needed, install via:
```bash
npm install
```

### 3. Seed Sample Database
Populate the database with authentic single-origins, espresso blends, customer reviews, and test accounts:
```bash
npm run seed
```

### 4. Start the Application
Run:
```bash
npm start
```
The application will launch at: **`http://localhost:5000`**

---

## 🔑 Pre-Configured Test Accounts

| Role | Email | Password | Features Accessible |
| :--- | :--- | :--- | :--- |
| **Admin Roaster** | `admin@beancraft.com` | `adminpassword123` | Full Admin Dashboard, Sales Metrics, Order Status Updates, Product Creation |
| **Customer** | `sarah@example.com` | `coffeeuser123` | Cart, Checkout, Order History, Review Submission |

*(You can also use the 1-click test autofill buttons inside the Sign In modal!)*

---

## 🎟️ Active Promo Codes

- **`COFFEE10`** : 10% off entire order
- **`BEAN20`** : 20% off entire order
- **`FREESHIP`** : Free shipping regardless of order amount

---

## 🌐 API Route Endpoints

### Products
- `GET /api/products` - List products with query filters (`category`, `roastLevel`, `minPrice`, `maxPrice`, `search`, `sort`)
- `GET /api/products/featured` - List curated featured roasts
- `GET /api/products/:id` - Get single product details
- `GET /api/products/:id/reviews` - Get customer reviews
- `POST /api/products/:id/reviews` - Submit review
- `POST /api/products` - Admin create new roast
- `DELETE /api/products/:id` - Admin delete roast

### Orders
- `POST /api/orders` - Place new order (supports guest and authenticated)
- `GET /api/orders/track/:orderNumber` - Track order and get fulfillment timeline
- `GET /api/orders/my-orders` - Get current customer's order history

### Authentication
- `POST /api/auth/register` - Create customer account
- `POST /api/auth/login` - Sign in and get JWT token
- `GET /api/auth/me` - Current user profile

### Admin Operations
- `GET /api/admin/stats` - Total revenue, orders, products, users
- `GET /api/admin/orders` - Filtered list of all orders
- `PUT /api/admin/orders/:id/status` - Update order stage
- `POST /api/admin/seed-reset` - Reset database to sample dataset
