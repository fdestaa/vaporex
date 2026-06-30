# VapoRex 💨

VapoRex is a modern, full-stack e-commerce and Point of Sale (POS) application built specifically for vape stores. It features a beautiful, responsive storefront for customers, and a powerful hidden dashboard for store admins and cashiers to manage products, track online orders, and process offline in-store purchases.

## 🚀 Features

- **Customer Storefront:** Browse products, view categories, manage cart, and checkout seamlessly.
- **Midtrans Payment Gateway:** Fully integrated with Midtrans for secure online payments (QRIS, GoPay, Bank Transfer, etc).
- **Admin Dashboard:** Comprehensive metrics, revenue charts, and recent order tracking.
- **POS System (Cashier):** A dedicated Point of Sale terminal for in-store purchases, automatically syncing inventory with the online store.
- **Inventory & Order Management:** Add, edit, or delete products and track order statuses.
- **Role-based Access Control:** Secure authentication with JWT for Admins, Cashiers, and Customers.

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, React Router, Zustand, Vanilla CSS
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL with Prisma ORM (Supabase)
- **Payments:** Midtrans API
- **Deployment:** Vercel (Frontend & Serverless Functions)

## 🔑 Demo Accounts

You can test the live application using the following demo accounts.

**Admin Account** (Full access to dashboard, inventory, users, and POS)
- **Login URL:** `/admin`
- **Email:** `admin@vaporex.id`
- **Password:** `admin`

**Kasir / Cashier Account** (Access to POS for in-store transactions)
- **Login URL:** `/admin`
- **Email:** `kasir@vaporex.id`
- **Password:** `vaporexid`

**Customer Account** (Standard online shopping and checkout)
- **Login URL:** `/login`
- **Email:** `rex@vaporex.id`
- **Password:** `vaporexid`

## 📦 Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/vaporex-store.git
   cd vaporex-store
   ```

2. **Install dependencies:**
   ```bash
   npm install
   cd server && npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the `server` folder with:
   ```env
   DATABASE_URL="your_supabase_postgresql_url"
   DIRECT_URL="your_supabase_direct_url"
   JWT_SECRET="your_super_secret_key"
   MIDTRANS_SERVER_KEY="your_midtrans_server_key"
   MIDTRANS_CLIENT_KEY="your_midtrans_client_key"
   ```

4. **Database Setup:**
   ```bash
   cd server
   npx prisma db push
   node seed.js
   ```

5. **Run the Application:**
   Open two terminals:
   - Terminal 1 (Frontend): `npm run dev`
   - Terminal 2 (Backend): `cd server && npm run dev`
