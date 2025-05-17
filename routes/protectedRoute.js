import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/api/protected-route', requireAuth, async (req, res) => {
  res.status(200).json({ message: 'Access granted to protected route', userId: req.userId });
});

export default router;
