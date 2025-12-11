# Bookstore Management System

A modern, full-stack bookstore management system built with the MERN stack (MongoDB, Express, React, Node.js) featuring advanced genre filtering, search functionality, and a beautiful, responsive user interface.

## Features

- 📚 **Book Management**: Add, edit, delete, and view books
- 🎯 **Genre Filtering**: Filter books by 20+ genres with dynamic filter UI
- 🔍 **Search Functionality**: Search books by title, author, or description
- 📱 **Responsive Design**: Beautiful, modern UI that works on all devices
- 🎨 **Modern UI/UX**: Gradient designs, smooth animations, and intuitive interface
- 📊 **Stock Management**: Track inventory with stock levels
- 🔢 **Pagination**: Efficient pagination for large book collections
- ⚡ **Fast Performance**: Optimized queries and efficient data loading

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB

### Frontend
- **React** - UI library
- **React Router** - Routing
- **Axios** - HTTP client
- **CSS3** - Modern styling with CSS variables

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bookstore
   ```

2. **Install dependencies**
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

3. **Configure environment variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/bookstore
   ```
   
   For MongoDB Atlas, use:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bookstore
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system. If using MongoDB Atlas, skip this step.

5. **Run the application**
   
   From the root directory:
   ```bash
   npm run dev
   ```
   
   This will start both the server (port 5000) and client (port 3000) concurrently.
   
   Or run them separately:
   ```bash
   # Terminal 1 - Start server
   npm run server
   
   # Terminal 2 - Start client
   npm run client
   ```

6. **Access the application**
   
   Open your browser and navigate to:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

## API Endpoints

### Books
- `GET /api/books` - Get all books (supports query params: genre, search, page, limit)
- `GET /api/books/genres` - Get all unique genres
- `GET /api/books/:id` - Get a single book by ID
- `POST /api/books` - Create a new book
- `PUT /api/books/:id` - Update a book
- `DELETE /api/books/:id` - Delete a book

### Example API Usage
```javascript
// Get all books
GET /api/books

// Filter by genre
GET /api/books?genre=Fiction

// Search books
GET /api/books?search=harry potter

// Combined filters with pagination
GET /api/books?genre=Mystery&search=detective&page=1&limit=10
```

## Book Schema

```javascript
{
  title: String (required),
  author: String (required),
  genre: String (required, enum),
  isbn: String (optional, unique),
  price: Number (required, min: 0),
  stock: Number (required, min: 0),
  description: String (optional),
  publishedYear: Number (optional),
  coverImage: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

## Available Genres

- Fiction
- Non-Fiction
- Mystery
- Thriller
- Romance
- Science Fiction
- Fantasy
- Horror
- Biography
- History
- Self-Help
- Business
- Technology
- Philosophy
- Poetry
- Drama
- Comedy
- Adventure
- Young Adult
- Children

## Project Structure

```
bookstore/
├── server/
│   ├── models/
│   │   └── Book.js
│   ├── routes/
│   │   └── books.js
│   ├── index.js
│   ├── package.json
│   └── .env
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BookCard.js
│   │   │   ├── BookForm.js
│   │   │   ├── BookList.js
│   │   │   ├── GenreFilter.js
│   │   │   ├── Header.js
│   │   │   ├── LoadingSpinner.js
│   │   │   └── SearchBar.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── package.json
└── README.md
```

## Features in Detail

### Genre Filtering
- Dynamic genre buttons that update based on available books
- Color-coded genre badges
- "All" option to show all books
- Smooth transitions and active state indicators

### Search Functionality
- Real-time search with debouncing
- Searches across title, author, and description
- Clear button for easy reset
- Works in combination with genre filters

### Book Management
- Add new books with comprehensive form validation
- Edit existing books
- Delete books with confirmation
- View book details in beautiful card layout

### Responsive Design
- Mobile-first approach
- Adaptive grid layout
- Touch-friendly buttons and inputs
- Optimized for tablets and desktops

## Development

### Adding New Features
1. Backend changes: Modify files in `server/` directory
2. Frontend changes: Modify files in `client/src/` directory
3. API changes: Update routes in `server/routes/books.js`

### Code Style
- Use consistent indentation (2 spaces)
- Follow React best practices
- Use meaningful variable and function names
- Add comments for complex logic

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or MongoDB Atlas connection string is correct
- Check firewall settings if using MongoDB Atlas
- Verify credentials in `.env` file

### Port Already in Use
- Change PORT in server `.env` file
- Or kill the process using the port:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  ```

### CORS Issues
- Ensure backend CORS is configured correctly
- Check that API_URL in frontend matches backend port

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on the repository.

