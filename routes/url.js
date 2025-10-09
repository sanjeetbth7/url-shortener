import express from 'express';
import { shortenUrl, getUserUrls, updateUrl, deleteUrl } from '../controllers/urlController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/shorten', auth, shortenUrl);
router.get('/my-urls', auth, getUserUrls);
router.put('/:id', auth, updateUrl);
router.delete('/:id', auth, deleteUrl);

export default router;