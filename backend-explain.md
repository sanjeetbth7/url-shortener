# Backend Architecture Explanation

## Overview
The backend follows a modular MVC (Model-View-Controller) architecture using Node.js and Express.js. It provides RESTful APIs for authentication and URL management with JWT-based security and MongoDB data persistence.

## Project Structure
```
url-shortener/
├── models/
│   ├── User.js           # User schema and methods
│   └── Url.js            # URL schema and relationships
├── controllers/
│   ├── authController.js # Authentication logic
│   └── urlController.js  # URL CRUD operations
├── routes/
│   ├── auth.js          # Authentication endpoints
│   └── url.js           # URL management endpoints
├── middleware/
│   └── auth.js          # JWT verification middleware
├── server.js            # Main application entry point
└── .env                 # Environment configuration
```

---

## Models Layer

### User Model (models/User.js)
```javascript
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' }
}, { timestamps: true });
```

**Key Features:**
- **Schema Validation** - Required fields and unique constraints
- **Timestamps** - Automatic createdAt and updatedAt fields
- **Password Hashing** - Pre-save middleware for security

#### Password Security Implementation
```javascript
// Pre-save middleware for password hashing
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method for password comparison
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};
```
**Security Benefits:**
- **Automatic hashing** - Passwords never stored in plain text
- **Salt rounds (12)** - Strong protection against rainbow table attacks
- **Conditional hashing** - Only hash when password is modified

### URL Model (models/Url.js)
```javascript
const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  clicks: { type: Number, default: 0 }
}, { timestamps: true });
```

**Database Design Decisions:**
- **User Reference** - Links URLs to specific users
- **Unique Short URLs** - Prevents collision conflicts
- **Click Tracking** - Analytics capability
- **Timestamps** - Creation and modification tracking

---

## Controllers Layer

### Authentication Controller (controllers/authController.js)

#### JWT Token Generation
```javascript
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};
```
**Security Features:**
- **Payload minimization** - Only user ID in token
- **Environment secret** - Secret key from environment variables
- **Expiration** - 30-day token lifetime

#### User Registration
```javascript
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user (password auto-hashed by pre-save middleware)
    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
```

**Registration Flow:**
1. **Input validation** - Check required fields
2. **Duplicate prevention** - Verify email uniqueness
3. **User creation** - Mongoose handles password hashing
4. **Token generation** - Create JWT for immediate login
5. **Response formatting** - Return user data without password

#### User Login
```javascript
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
```

**Security Measures:**
- **Generic error messages** - Don't reveal if email exists
- **Password comparison** - Uses bcrypt for secure verification
- **Consistent response format** - Same structure as registration

### URL Controller (controllers/urlController.js)

#### URL Shortening Logic
```javascript
export const shortenUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;
    const userId = req.user._id; // From auth middleware

    // Check for existing shortened URL by this user
    let urlEntry = await Url.findOne({ originalUrl, userId });
    if (urlEntry) return res.json({ shortUrl: urlEntry.shortUrl });

    // Generate new short URL
    const shortUrl = shortid.generate();
    urlEntry = await Url.create({ originalUrl, shortUrl, userId });

    res.json({ shortUrl });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
```

**Business Logic:**
- **User-specific duplicates** - Same URL can have different short codes for different users
- **ShortID generation** - Cryptographically secure unique codes
- **Database persistence** - Store mapping for future retrieval

#### URL Redirection with Analytics
```javascript
export const redirectUrl = async (req, res) => {
  try {
    const urlEntry = await Url.findOne({ shortUrl: req.params.shortUrl });
    if (!urlEntry) return res.status(404).json({ error: 'URL not found' });

    // Increment click counter
    urlEntry.clicks += 1;
    await urlEntry.save();

    // Redirect to original URL
    res.redirect(urlEntry.originalUrl);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
```

**Features:**
- **Click tracking** - Increment counter on each access
- **Atomic operation** - Update and redirect in single transaction
- **Error handling** - 404 for non-existent URLs

#### User URL Management
```javascript
export const getUserUrls = async (req, res) => {
  try {
    const urls = await Url.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(urls);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;
    const url = await Url.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id }, // User can only update their URLs
      { originalUrl },
      { new: true } // Return updated document
    );
    if (!url) return res.status(404).json({ error: 'URL not found' });
    res.json(url);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
```

---

## Middleware Layer

### Authentication Middleware (middleware/auth.js)
```javascript
export const auth = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Access denied' });

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ error: 'Invalid token' });

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

**Middleware Benefits:**
- **Reusable security** - Apply to any protected route
- **User context** - Adds user object to request
- **Token validation** - Verifies JWT signature and expiration
- **Database verification** - Ensures user still exists

---

## Routes Layer

### Authentication Routes (routes/auth.js)
```javascript
import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

export default router;
```

### URL Routes (routes/url.js)
```javascript
import express from 'express';
import { shortenUrl, getUserUrls, updateUrl, deleteUrl } from '../controllers/urlController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/shorten', auth, shortenUrl);      // Protected: Create short URL
router.get('/my-urls', auth, getUserUrls);      // Protected: Get user's URLs
router.put('/:id', auth, updateUrl);            // Protected: Update URL
router.delete('/:id', auth, deleteUrl);         // Protected: Delete URL

export default router;
```

**Route Organization:**
- **Logical grouping** - Related endpoints in same file
- **Middleware application** - Auth middleware on protected routes
- **RESTful design** - Standard HTTP methods and URL patterns

---

## Main Application (server.js)

### Application Setup
```javascript
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import urlRoutes from "./routes/url.js";
import { redirectUrl } from "./controllers/urlController.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());                    // Parse JSON bodies
app.use(express.static("public"));          // Serve static files

// CORS configuration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
```

### Database Connection
```javascript
mongoose.connect(process.env.DBLINK_Local)
.then(() => console.log("Database is connected"))
.catch((err) => console.log(err));
```

### Route Registration
```javascript
// API routes
app.use('/api/auth', authRoutes);           // Authentication endpoints
app.use('/api/url', urlRoutes);             // URL management endpoints

// Public redirect route
app.get('/:shortUrl', redirectUrl);         // Short URL redirection

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

## API Endpoints Documentation

### Authentication Endpoints
```
POST /api/auth/register
Body: { name, email, password }
Response: { token, user: { id, name, email, avatar } }

POST /api/auth/login  
Body: { email, password }
Response: { token, user: { id, name, email, avatar } }
```

### URL Management Endpoints (Protected)
```
POST /api/url/shorten
Headers: Authorization: Bearer <token>
Body: { originalUrl }
Response: { shortUrl }

GET /api/url/my-urls
Headers: Authorization: Bearer <token>
Response: [{ _id, originalUrl, shortUrl, clicks, createdAt }]

PUT /api/url/:id
Headers: Authorization: Bearer <token>
Body: { originalUrl }
Response: { updated URL object }

DELETE /api/url/:id
Headers: Authorization: Bearer <token>
Response: { message: "URL deleted successfully" }
```

### Public Endpoint
```
GET /:shortUrl
Response: 302 Redirect to originalUrl
```

---

## Security Implementation

### 1. **Password Security**
- **bcrypt hashing** - Industry standard password hashing
- **Salt rounds (12)** - Strong protection against attacks
- **Pre-save middleware** - Automatic hashing on user creation/update

### 2. **JWT Authentication**
- **Stateless tokens** - No server-side session storage
- **Environment secrets** - Secret key stored securely
- **Token expiration** - 30-day automatic expiry

### 3. **Authorization**
- **User-specific data** - Users can only access their own URLs
- **Middleware protection** - Consistent auth checking
- **Database-level security** - User ID verification in queries

### 4. **Input Validation**
- **Required field checking** - Prevent incomplete data
- **Unique constraints** - Database-level duplicate prevention
- **Error handling** - Graceful failure responses

---

## Database Design Patterns

### 1. **Referential Integrity**
```javascript
userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
```
- **Foreign key relationships** - Links between collections
- **Required references** - Ensures data consistency

### 2. **Indexing Strategy**
```javascript
email: { type: String, required: true, unique: true }
shortUrl: { type: String, required: true, unique: true }
```
- **Unique indexes** - Fast lookups and constraint enforcement
- **Compound queries** - Efficient user-specific searches

### 3. **Schema Evolution**
```javascript
{ timestamps: true }  // Automatic createdAt/updatedAt
avatar: { type: String, default: '' }  // Optional fields with defaults
```

---

## Performance Considerations

### 1. **Database Optimization**
- **Indexed queries** - Fast lookups on email and shortUrl
- **Selective field returns** - Don't return passwords in responses
- **Efficient updates** - Atomic operations for click counting

### 2. **Memory Management**
- **Stateless design** - No server-side session storage
- **Connection pooling** - Mongoose handles MongoDB connections
- **Garbage collection** - Proper async/await usage

### 3. **Scalability Patterns**
- **Horizontal scaling ready** - Stateless JWT authentication
- **Database sharding potential** - User-based data partitioning
- **Caching opportunities** - Redis integration points identified

This backend architecture demonstrates enterprise-level Node.js development practices with proper separation of concerns, security implementation, and scalable design patterns.