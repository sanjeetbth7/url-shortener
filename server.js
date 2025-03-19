import express from "express";
import mongoose from "mongoose";
import shortid from "shortid";
import dotenv from "dotenv";
import path from "path";


dotenv.config();
const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use(express.static("public")); // Serve frontend files

mongoose.connect(process.env.DBLINK_Local) // use DBLINK to connect to mongodb atlas
.then(()=>{
    console.log("Database is connected")
}
).catch((err)=>{ console.log(err)})

const UrlSchema = new mongoose.Schema({
  originalUrl: { type: String, unique: true },
  shortUrl: { type: String, unique: true },
});

const Url = mongoose.model("Url", UrlSchema);

// API to shorten URL
app.post("/shorten", async (req, res) => {
  const { originalUrl } = req.body;

  let urlEntry = await Url.findOne({ originalUrl });
  if (urlEntry) return res.json({ shortUrl: urlEntry.shortUrl });

  const shortUrl = shortid.generate();
  urlEntry = await Url.create({ originalUrl, shortUrl });

  res.json({ shortUrl });
});

// API to redirect shortened URL
app.get("/:shortUrl", async (req, res) => {
  const urlEntry = await Url.findOne({ shortUrl: req.params.shortUrl });
  if (urlEntry) return res.redirect(urlEntry.originalUrl);
  
  res.status(404).json({ error: "URL not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
