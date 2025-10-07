# ⚡ URL Shortener

A modern, full-stack URL shortener application with a clean UI and robust backend. Transform long URLs into short, shareable links with just one click.

> **Live Demo (Full Stack):** https://url-shortener-j7r3.onrender.com/
> 
> **Frontend Only:** https://sanjeetbth7.github.io/url-shortener//public/

## 🚀 Features

- **URL Shortening**: Convert long URLs into short, memorable links
- **Instant Redirect**: Seamless redirection from short URLs to original destinations
- **Dark/Light Theme**: Toggle between themes with persistent preference storage
- **Copy to Clipboard**: One-click copying of shortened URLs
- **Duplicate Prevention**: Automatically returns existing short URL for duplicate requests
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Real-time Validation**: Input validation with visual feedback

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database for URL storage
- **Mongoose** - MongoDB object modeling
- **ShortID** - Unique short URL generation
- **dotenv** - Environment variable management

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with flexbox and CSS variables
- **Vanilla JavaScript** - Client-side functionality
- **Fetch API** - HTTP requests to backend
- **LocalStorage** - Theme preference persistence

## 📁 Project Structure

```
url-shortener/
├── public/
│   ├── index.html      # Frontend HTML
│   ├── script.js       # Client-side JavaScript
│   └── styles.css      # CSS styling
├── server.js           # Express server and API routes
├── package.json        # Dependencies and scripts
├── .env               # Environment variables
└── README.md          # Project documentation
```

## 🔌 API Endpoints

### POST `/shorten`
Shortens a long URL and returns the short code.

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

**Features:**
- Validates URL format
- Returns existing short URL if already shortened
- Generates unique short codes using ShortID
- Stores URL mapping in MongoDB

### GET `/:shortUrl`
Redirects to the original URL using the short code.

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

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   DBLINK_Local=mongodb://localhost:27017/urlshortener
   # OR for MongoDB Atlas:
   # DBLINK=mongodb+srv://username:password@cluster.mongodb.net/urlshortener
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

1. **Shorten URL**: Enter a long URL in the input field and click "Shorten"
2. **Copy Link**: Click the "Copy" button to copy the shortened URL
3. **Access Original**: Click the shortened link or visit it directly to redirect
4. **Toggle Theme**: Use the theme toggle button for dark/light mode

## 🔧 Configuration

### Environment Variables
- `DBLINK_Local`: MongoDB connection string for local database
- `DBLINK`: MongoDB Atlas connection string for cloud database
- `PORT`: Server port (default: 5000)

### Database Schema
```javascript
{
  originalUrl: String (unique),
  shortUrl: String (unique)
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

- [ ] **Analytics Dashboard**: Track click counts, geographic data, and usage statistics
- [ ] **Custom Short URLs**: Allow users to create custom short codes
- [ ] **QR Code Generation**: Generate QR codes for shortened URLs
- [ ] **Expiration Dates**: Set expiration times for shortened URLs
- [ ] **User Authentication**: User accounts with URL management
- [ ] **Bulk URL Shortening**: Process multiple URLs at once
- [ ] **API Rate Limiting**: Prevent abuse with rate limiting
- [ ] **URL Preview**: Show preview of destination before redirecting
- [ ] **Password Protection**: Add password protection to sensitive URLs
- [ ] **Link Categories**: Organize URLs with tags and categories
- [ ] **Export/Import**: Backup and restore URL collections
- [ ] **Browser Extension**: Chrome/Firefox extension for quick shortening

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

**Made with ❤️ using Node.js and MongoDB**

---
> UI link without backend : https://sanjeetbth7.github.io/url-shortener//public/