import express from 'express';
import { createPost, getPostById , getAllPosts, getUserPosts  } from '../controllers/postController.js';

const router = express.Router();

router.post('/', createPost);
router.get('/:id', getPostById);
router.get('/', getAllPosts);
router.get('/user/:userId', getUserPosts);

export default router;
