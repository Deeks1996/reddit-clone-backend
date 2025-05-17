import prisma from '../prisma/client.js';

// Create a new comment
export const createComment = async (req, res) => {
  try {
    const { content, authorId, postId } = req.body;

    // Step 1: Check if user exists in the User table based on clerkUserId (authorId)
    const user = await prisma.user.findUnique({
      where: { clerkUserId: authorId },
    });

    if (!user) {
      return res.status(400).json({ error: 'User not found in the database' });
    }

    // Step 2: If user exists, create the comment
    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: user.id, // use the user ID from the User table
        postId,
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error('Failed to create comment:', error);
    res.status(500).json({ error: 'Failed to create comment', details: error.message });
  }
};



// Get all comments for a post
export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await prisma.comment.findMany({
      where: { postId },
      include: { author: true },
      orderBy: { createdAt: 'asc' },
    });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments', details: error.message });
  }
};

// Update a comment
export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required for update' });
    }

    const existingComment = await prisma.comment.findUnique({ where: { id: commentId } });

    if (!existingComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
    });

    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update comment', details: error.message });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const existingComment = await prisma.comment.findUnique({ where: { id: commentId } });

    if (!existingComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    await prisma.comment.delete({ where: { id: commentId } });

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete comment', details: error.message });
  }
};


export const getCommentsByPostId = async (req, res) => {
  const { postId } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: { postId },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({ comments });
  } catch (error) {
    console.error('Failed to get comments:', error);
    res.status(500).json({ error: 'Failed to load comments' });
  }
};

export const getCommentsByUserId = async (req, res) => {
  const userId = req.params.userId;
  try {
    const comments = await Comment.find({ authorId: userId });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user comments" });
  }
};
