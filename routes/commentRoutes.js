import express from 'express';
import {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
  getCommentsByPostId ,
  getCommentsByUserId
} from '../controllers/commentController.js';

const router = express.Router();

router.post('/', createComment);
router.get('/post/:postId', getCommentsByPostId);
router.get('/:postId', getCommentsByPost);
router.put('/:commentId', updateComment);
router.delete('/:commentId', deleteComment);
router.get('/user/:userId', getCommentsByUserId);

export default router;
