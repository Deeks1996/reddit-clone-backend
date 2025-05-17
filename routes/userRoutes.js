
import express from 'express';
import { getUserByClerkId } from '../controllers/userController.js';

const router = express.Router();

router.get('/by-clerkId/:clerkUserId', getUserByClerkId);

export default router;
