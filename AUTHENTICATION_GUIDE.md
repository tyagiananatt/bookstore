# Authentication & User Flow Guide

## 🔐 How Users Can Login

### For Regular Users:

1. **Access the Application**
   - Open http://localhost:3000
   - If not logged in, you'll be automatically redirected to `/login`

2. **Sign Up (New Users)**
   - Click "Sign Up" button on the login page
   - Fill in:
     - **Username** (required)
     - **Email** (required)
     - **Password** (required)
   - Click "Sign Up"
   - You'll be automatically logged in and redirected to the dashboard

3. **Sign In (Existing Users)**
   - Enter your **Username** (or email)
   - Enter your **Password**
   - Click "Sign In"
   - You'll be redirected to your dashboard

### For Admin:

1. **Admin Login**
   - Go to `/login`
   - Use these credentials:
     - **Username:** `admin`
     - **Password:** `admin123`
   - Click "Sign In"
   - You'll be redirected to the admin dashboard

## 🎯 User Features (After Login)

Once logged in as a regular user, you can:

- ✅ **Dashboard** - Personalized homepage with trending and recommended books
- ✅ **Book Store** - Browse, search, and filter books by genre
- ✅ **Open Library** - Read free books online
- ✅ **Shopping Cart** - Add paid books to cart
- ✅ **Orders** - View order history and track delivery status
- ✅ **Dark Mode** - Toggle between light and dark themes

## 👨‍💼 Admin Features (After Login)

Once logged in as admin, you can:

- ✅ **Admin Dashboard** - View statistics (total books, orders, revenue)
- ✅ **Manage Books** - Add, edit, and delete books
  - Add new books with all details (title, author, genre, price, PDF, etc.)
  - Mark books as free (for Open Library)
  - Upload PDF URLs for books
  - Set stock levels
- ✅ **Manage Orders** - View all user orders and update order status
  - Change status: Pending → Packed → Shipped → Delivered
  - View order details

## 🔒 Protected Routes

### User Routes (Require Login):
- `/` - User Dashboard
- `/store` - Book Store
- `/library` - Open Library
- `/cart` - Shopping Cart
- `/orders` - Order History

### Admin Routes (Require Admin Role):
- `/admin` - Admin Dashboard
- `/admin/books` - Manage Books
- `/admin/books/add` - Add New Book
- `/admin/books/edit/:id` - Edit Book
- `/admin/orders` - Manage Orders

### Public Routes:
- `/login` - Login/Register Page

## 🚀 Authentication Flow

1. **Unauthenticated User**
   - Tries to access any protected route
   - Automatically redirected to `/login`
   - Can sign up or sign in

2. **After Login**
   - Token stored in localStorage
   - User data stored in localStorage
   - Redirected based on role:
     - Admin → `/admin`
     - User → `/`

3. **Already Logged In**
   - If accessing `/login` while logged in:
     - Admin → Redirected to `/admin`
     - User → Redirected to `/`

4. **Logout**
   - Click logout button in header
   - Token and user data cleared
   - Redirected to `/login`

## 📝 Admin Book Management

### Adding a Book:
1. Login as admin
2. Go to "Admin" → "Books"
3. Click "Add New Book"
4. Fill in:
   - Title, Author, Genre (required)
   - Price, Stock (required)
   - Cover Image URL
   - PDF URL (for reading)
   - Check "Free Book" if it should be in Open Library
   - Description, ISBN, Published Year (optional)
5. Click "Add Book"
6. Book is added and you're redirected to books list

### Editing a Book:
1. Go to "Admin" → "Books"
2. Click edit icon (pencil) on any book
3. Modify the fields
4. Click "Update Book"

### Deleting a Book:
1. Go to "Admin" → "Books"
2. Click delete icon (trash) on any book
3. Confirm deletion
4. Book is removed

## 🛡️ Security Features

- ✅ JWT token-based authentication
- ✅ Password hashing with bcrypt
- ✅ Protected routes with role-based access
- ✅ Token expiration (7 days)
- ✅ Automatic token inclusion in API requests
- ✅ Admin-only routes protection

## 💡 Tips

- **First Time Admin Login:** The admin account is automatically created on first login
- **Session Persistence:** Login persists for 7 days (token expiration)
- **Role-Based Redirects:** Users are automatically redirected to appropriate dashboards
- **Free Books:** Books marked as "Free" appear in the Open Library section
- **PDF URLs:** Add PDF URLs to enable reading books in the Open Library

