import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const bookService = {
  // Get all books with filters
  getBooks: async (params = {}) => {
    const response = await api.get('/books', { params });
    return response.data;
  },

  // Get all genres
  getGenres: async () => {
    const response = await api.get('/books/genres');
    return response.data;
  },

  // Get book by ID
  getBookById: async (id) => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  // Create a new book
  createBook: async (bookData) => {
    const response = await api.post('/books', bookData);
    return response.data;
  },

  // Update a book
  updateBook: async (id, bookData) => {
    const response = await api.put(`/books/${id}`, bookData);
    return response.data;
  },

  // Delete a book
  deleteBook: async (id) => {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  },

  // Upload PDF file
  uploadPDF: async (file) => {
    const formData = new FormData();
    formData.append('pdfFile', file);
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/books/upload-pdf`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type - let browser set it with boundary
      },
    });
    return response.data;
  },

  // Upload cover image
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('coverImageFile', file);
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/books/upload-image`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type - let browser set it with boundary
      },
    });
    return response.data;
  },
};

export const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
  register: async (username, email, password) => {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  },
};

export const reviewService = {
  createReview: async (bookId, rating, comment) => {
    const response = await api.post('/reviews', { bookId, rating, comment });
    return response.data;
  },
  getBookReviews: async (bookId) => {
    const response = await api.get(`/reviews/book/${bookId}`);
    return response.data;
  },
  getMyReview: async (bookId) => {
    const response = await api.get(`/reviews/book/${bookId}/my-review`);
    return response.data;
  },
};

export const orderService = {
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },
  getMyOrders: async () => {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },
  getAllOrders: async () => {
    const response = await api.get('/orders/all');
    return response.data;
  },
  getOrder: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },
  updateOrderStatus: async (orderId, status) => {
    const response = await api.put(`/orders/${orderId}/status`, { status });
    return response.data;
  },
};


export const bookRequestService = {
  createRequest: async (requestData) => {
    const response = await api.post('/book-requests', requestData);
    return response.data;
  },
  getMyRequests: async () => {
    const response = await api.get('/book-requests/my-requests');
    return response.data;
  },
  getAllRequests: async () => {
    const response = await api.get('/book-requests');
    return response.data;
  },
  updateRequestStatus: async (id, status) => {
    const response = await api.put(`/book-requests/${id}`, { status });
    return response.data;
  },
};

export default api;

