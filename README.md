# ⚡ URL Shortener

A modern, full-stack URL shortener application with a clean UI and robust backend. Transform long URLs into short, shareable links with just one click.

> **Live Demo (Full Stack):** https://url-shortener-j7r3.onrender.com/
> 
> **Frontend Only:** https://sanjeetbth7.github.io/url-shortener//public/

## 🚀 Features

### Core Functionality
- **URL Shortening**: Convert long URLs into short, memorable links using ShortID
- **Instant Redirect**: Seamless redirection from short URLs to original destinations with click tracking
- **Click Analytics**: Track and display how many times each link has been accessed
- **Duplicate Prevention**: Returns existing short URL for same original URL per user

### User Management
- **JWT Authentication**: Secure user registration and login with encrypted passwords
- **User Dashboard**: View and manage all your shortened URLs in one place
- **Inline Editing**: Edit URLs directly in the list without popups or prompts
- **URL Management**: Delete unwanted links with confirmation dialogs
- **User Profile**: Display user avatar (initials) and full name in navigation
- **Session Persistence**: Stay logged in across browser sessions using localStorage

### User Experience
- **Dark/Light Theme**: Toggle between themes with persistent preference storage
- **Copy to Clipboard**: One-click copying of shortened URLs with success feedback
- **Mobile-First Design**: Fully responsive design optimized for all device sizes
- **Real-time Validation**: Input validation with visual error feedback
- **Intuitive Navigation**: Easy switching between URL creation and dashboard
- **Professional Interface**: Clean, modern design with hover effects and animations

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment with ES6 modules
- **Express.js** - Web framework with RESTful API design
- **MongoDB** - Database for URL storage and user management
- **Mongoose** - MongoDB object modeling with schema validation
- **JWT (jsonwebtoken)** - Stateless authentication tokens
- **bcryptjs** - Password hashing and security
- **ShortID** - Cryptographically secure unique URL generation
- **dotenv** - Environment variable management
- **CORS** - Cross-origin resource sharing configuration

### Frontend
- **HTML5** - Semantic markup with accessibility features
- **CSS3** - Modern styling with flexbox, CSS Grid, and custom properties
- **Vanilla JavaScript** - Client-side functionality with ES6+ features
- **Fetch API** - Modern HTTP requests with async/await
- **LocalStorage** - Client-side data persistence for auth and preferences
- **Clipboard API** - Modern copy-to-clipboard functionality
- **CSS Media Queries** - Mobile-first responsive design

### Architecture
- **MVC Pattern** - Modular backend with Models, Views, Controllers
- **RESTful APIs** - Standard HTTP methods and status codes
- **JWT Authentication** - Stateless token-based security
- **Single Page Application** - Dynamic content switching without page reloads

## 📁 Project Structure

```
url-shortener/
├── models/
│   ├── User.js             # User schema with authentication
│   └── Url.js              # URL schema with user relationships
├── controllers/
│   ├── authController.js   # Authentication logic (register/login)
│   └── urlController.js    # URL CRUD operations
├── routes/
│   ├── auth.js            # Authentication endpoints
│   └── url.js             # URL management endpoints
├── middleware/
│   └── auth.js            # JWT verification middleware
├── public/
│   ├── index.html         # Frontend HTML structure
│   ├── script.js          # Client-side JavaScript with auth
│   └── styles.css         # Responsive CSS styling
├── server.js              # Main application entry point
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables
├── README.md              # Project documentation
├── interview.md           # Interview preparation guide
├── frontend-explain.md    # Frontend architecture explanation
├── backend-explain.md     # Backend architecture explanation
└── technical-deep-dive.md # Technical implementation details
```

## 🔌 API Endpoints

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": ""
  }
}
```

#### POST `/api/auth/login`
Authenticate existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:** Same as registration

### URL Management Endpoints (Protected)

#### POST `/api/url/shorten`
Shorten a URL for authenticated user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "originalUrl": "https://example.com/very/long/url"
}
```

**Response:**
```json
{
  "shortUrl": "abc123def"
}
```

#### GET `/api/url/my-urls`
Get all URLs created by authenticated user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
[
  {
    "_id": "url123",
    "originalUrl": "https://example.com/long/url",
    "shortUrl": "abc123def",
    "clicks": 42,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### PUT `/api/url/:id`
Update an existing URL.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "originalUrl": "https://example.com/updated/url"
}
```

#### DELETE `/api/url/:id`
Delete a URL.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "message": "URL deleted successfully"
}
```

### Public Endpoint

#### GET `/:shortUrl`
Redirect to original URL and increment click counter.

**Example:** `GET /abc123def` → Redirects to `https://example.com/very/long/url`

**Response:**
- **302 Redirect** - Successful redirection to original URL
- **404 Not Found** - Short URL doesn't exist

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd url-shortener
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   
   **Dependencies installed:**
   - express (web framework)
   - mongoose (MongoDB ODM)
   - jsonwebtoken (JWT authentication)
   - bcryptjs (password hashing)
   - shortid (unique ID generation)
   - dotenv (environment variables)

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   DBLINK_Local=mongodb://localhost:27017/urlshortener
   # OR for MongoDB Atlas:
   # DBLINK=mongodb+srv://username:password@cluster.mongodb.net/urlshortener
   JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
   PORT=5000
   ```

4. **Start the application**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Access the application**
   Open your browser and navigate to `http://localhost:5000`

## 🎯 Usage

### Getting Started
1. **Register Account**: Create a new account with your name, email, and password
2. **Login**: Sign in to access the URL shortening features
3. **Shorten URLs**: Enter long URLs and get short, shareable links
4. **Manage URLs**: View, edit, and delete your shortened URLs in the dashboard

### Features Guide
1. **URL Shortening**: Enter a long URL and click "Shorten" to get a short link
2. **Copy to Clipboard**: Click "Copy" button for instant clipboard copying
3. **Dashboard Access**: Click your profile (name/avatar) to view all your URLs
4. **Inline Editing**: Click "Edit" to modify URLs directly in the list
5. **Click Analytics**: See how many times each link has been accessed
6. **Theme Toggle**: Switch between dark and light modes
7. **Mobile Support**: Full functionality on all device sizes

## 🔧 Configuration

### Environment Variables
- `DBLINK_Local`: MongoDB connection string for local database
- `DBLINK`: MongoDB Atlas connection string for cloud database  
- `JWT_SECRET`: Secret key for JWT token signing (use a long, secure string)
- `PORT`: Server port (default: 5000)

### Database Schema

#### User Collection
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, bcrypt hashed),
  avatar: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

#### URL Collection
```javascript
{
  originalUrl: String (required),
  shortUrl: String (required, unique),
  userId: ObjectId (reference to User),
  clicks: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Deployment

### Frontend Only (GitHub Pages)
The frontend can run independently using the live demo link for API calls.

### Full Stack Deployment
1. **Heroku/Railway/Vercel**: Deploy the entire application
2. **MongoDB Atlas**: Use cloud database for production
3. **Environment Variables**: Configure production environment variables

## 🔮 Future Enhancements

### Analytics & Insights
- [ ] **Advanced Analytics**: Geographic data, referrer tracking, device statistics
- [ ] **Click Heatmaps**: Visual representation of link performance
- [ ] **Export Reports**: Download analytics as CSV/PDF
- [ ] **Real-time Dashboard**: Live click tracking and statistics

### URL Management
- [ ] **Custom Short URLs**: Allow users to create branded short codes
- [ ] **Bulk Operations**: Upload CSV files, bulk delete, mass edit
- [ ] **Link Categories**: Organize URLs with tags and folders
- [ ] **Link Expiration**: Set automatic expiry dates for URLs
- [ ] **Password Protection**: Add password gates to sensitive links
- [ ] **URL Preview Pages**: Show destination preview before redirecting

### User Experience
- [ ] **QR Code Generation**: Generate downloadable QR codes for URLs
- [ ] **Browser Extension**: Chrome/Firefox extension for quick shortening
- [ ] **Mobile App**: Native iOS/Android applications
- [ ] **Custom Domains**: Branded short links (company.co/abc123)
- [ ] **Team Workspaces**: Collaborative URL management

### Technical Improvements
- [ ] **API Rate Limiting**: Prevent abuse with request throttling
- [ ] **Redis Caching**: Faster URL lookups and better performance
- [ ] **CDN Integration**: Global content delivery for faster redirects
- [ ] **A/B Testing**: Multiple destination URLs for testing
- [ ] **Webhook Integration**: Real-time notifications for clicks
- [ ] **API Documentation**: Interactive API docs with Swagger

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🐛 Issues & Support

If you encounter any issues or have questions, please open an issue on the repository.

---

**Made with ❤️ using Node.js, Express.js, MongoDB, and Vanilla JavaScript**

## 📚 Documentation

- **[Interview Guide](interview.md)** - Comprehensive interview preparation
- **[Frontend Architecture](frontend-explain.md)** - HTML, CSS, JavaScript explanation
- **[Backend Architecture](backend-explain.md)** - Node.js, Express, MongoDB details
- **[Technical Deep Dive](technical-deep-dive.md)** - ShortID algorithm and comparisons

## 🏆 Key Achievements

- **Full-Stack Development** - Complete MERN-like stack implementation
- **Security Implementation** - JWT authentication with bcrypt password hashing
- **Mobile-First Design** - Responsive UI that works on all devices
- **Modern JavaScript** - ES6+ features, async/await, modules
- **Database Design** - Proper relationships and data modeling
- **User Experience** - Intuitive navigation and inline editing
- **Performance Optimization** - LocalStorage caching and efficient queries

---
> UI link without backend : https://sanjeetbth7.github.io/url-shortener//public/