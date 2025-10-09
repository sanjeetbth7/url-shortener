import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import urlRoutes from "./routes/url.js";
import { redirectUrl } from "./controllers/urlController.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.static("public"));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

mongoose.connect(process.env.DBLINK_Local)
.then(() => console.log("Database is connected"))
.catch((err) => console.log(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/url', urlRoutes);
app.get('/:shortUrl', redirectUrl);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
