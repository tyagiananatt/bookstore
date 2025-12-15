# Bookstore Management System - Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

Create a `.env` file in the `server` directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bookstore
JWT_SECRET=your-secret-key-change-in-production
```

### 3. Start MongoDB

Make sure MongoDB is running on your system.

### 4. Run the Application

From the root directory:
```bash
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend on http://localhost:3000


## 📁 Project Structure

```
bookstore/
├── server/
│   ├── models/          # MongoDB models (Book, User, Order, Review)
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   └── index.js         # Server entry point
├── client/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React contexts (Auth, Cart, Theme)
│   │   └── services/    # API services
│   └── public/
└── package.json
```

## ✨ Features Implemented

### User Features
- ✅ User Dashboard with personalized content
- ✅ Book Store with genre filtering and search
- ✅ Open Library for free books
- ✅ Shopping Cart with animations
- ✅ Order Management
- ✅ Dark Mode
- ✅ Responsive Design

### Admin Features
- ✅ Admin Dashboard
- ✅ Book Management (Add/Edit/Delete)
- ✅ Order Management
- ✅ Protected Routes

### UI/UX
- ✅ Modern gradient designs
- ✅ Framer Motion animations
- ✅ Glassmorphism effects
- ✅ Responsive layouts
- ✅ Dark mode support

## 🎨 UI Highlights

- **Modern Design:** Gradient backgrounds, smooth animations
- **3D Effects:** Hover animations on book cards
- **Dark Mode:** Toggle between light and dark themes
- **Responsive:** Works on mobile, tablet, and desktop
- **Animations:** Framer Motion for smooth transitions

## 📝 Next Steps (Optional Enhancements)

1. **PDF Viewer:** Add react-pdf for reading books in Open Library
2. **Reviews & Ratings:** Implement full review system
3. **Wishlist:** Add wishlist functionality
4. **Payment Integration:** Add payment gateway
5. **Image Upload:** Add multer for book cover uploads
6. **Email Notifications:** Send order confirmations
7. **Advanced Search:** Add filters for price, rating, etc.

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify MongoDB port (default: 27017)

### Port Already in Use
- Change PORT in server `.env`
- Or kill the process using the port

### CORS Issues
- Backend CORS is configured for localhost:3000
- Update if using different port

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register

### Books
- `GET /api/books` - Get all books (with filters)
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Create book (admin)
- `PUT /api/books/:id` - Update book (admin)
- `DELETE /api/books/:id` - Delete book (admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/all` - Get all orders (admin)
- `PUT /api/orders/:id/status` - Update order status (admin)

### Reviews
- `POST /api/reviews` - Create/update review
- `GET /api/reviews/book/:bookId` - Get book reviews

## 🎯 Usage

1. **Login/Register:** Create an account or login as admin
2. **Browse Books:** Use the Store page to browse and search books
3. **Free Books:** Check Open Library for free books
4. **Add to Cart:** Add paid books to cart
5. **Checkout:** Complete order from cart
6. **Admin Panel:** Login as admin to manage books and orders

## 📦 Dependencies

### Backend
- express
- mongoose
- bcryptjs
- jsonwebtoken
- cors
- dotenv

### Frontend
- react
- react-router-dom
- framer-motion
- axios
- react-icons
- react-toastify
- react-pdf (for future PDF viewing)

