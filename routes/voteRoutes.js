import express from 'express'
import { createVote, getPostVotes } from '../controllers/voteController.js'

const router = express.Router()

router.post('/', createVote)
router.get('/post/:postId', getPostVotes)

export default router
