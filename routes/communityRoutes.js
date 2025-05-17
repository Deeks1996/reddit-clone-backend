import express from 'express';
import {
  createCommunity,
  getAllCommunities,
  getCommunityByName
} from '../controllers/communityController.js';

const router = express.Router();

router.post('/create', createCommunity);
router.get('/', getAllCommunities);
router.get('/:communityName', getCommunityByName);

export default router;
