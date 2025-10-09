import shortid from 'shortid';
import Url from '../models/Url.js';

export const shortenUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;
    const userId = req.user._id;

    let urlEntry = await Url.findOne({ originalUrl, userId });
    if (urlEntry) return res.json({ shortUrl: urlEntry.shortUrl });

    const shortUrl = shortid.generate();
    urlEntry = await Url.create({ originalUrl, shortUrl, userId });

    res.json({ shortUrl });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const redirectUrl = async (req, res) => {
  try {
    const urlEntry = await Url.findOne({ shortUrl: req.params.shortUrl });
    if (!urlEntry) return res.status(404).json({ error: 'URL not found' });

    urlEntry.clicks += 1;
    await urlEntry.save();

    res.redirect(urlEntry.originalUrl);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

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
      { _id: req.params.id, userId: req.user._id },
      { originalUrl },
      { new: true }
    );
    if (!url) return res.status(404).json({ error: 'URL not found' });
    res.json(url);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteUrl = async (req, res) => {
  try {
    const url = await Url.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!url) return res.status(404).json({ error: 'URL not found' });
    res.json({ message: 'URL deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};