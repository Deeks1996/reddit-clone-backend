import prisma from '../prisma/client.js';

export const createVote = async (req, res) => {
  const { userId, postId, value } = req.body; // userId should be the Clerk's user id, not prisma user id

  try {
    // Check if the user exists by their Clerk user id (which should match the clerkUserId in User table)
    const userExists = await prisma.user.findUnique({
      where: { clerkUserId: userId }, // We search by the Clerk userId
    });

    if (!userExists) {
      return res.status(400).json({ error: 'User does not exist' });
    }

    // Check if the user has already voted on the post
    const existingVote = await prisma.vote.findFirst({
      where: { userId: userExists.id, postId },
    });

    if (existingVote) {
      // If the user has already voted, update the vote value
      await prisma.vote.update({
        where: { id: existingVote.id },
        data: { value },
      });
    } else {
      // Otherwise, create a new vote
      await prisma.vote.create({
        data: { userId: userExists.id, postId, value },
      });
    }

    return res.status(200).json({ message: 'Vote registered' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const getPostVotes = async (req, res) => {
  const { postId } = req.params;

  try {
    // Fetch all votes for the post
    const votes = await prisma.vote.findMany({
      where: { postId },
    });

    // Calculate the total score based on the vote value (upvotes + downvotes)
    const score = votes.reduce((acc, vote) => acc + vote.value, 0);

    res.status(200).json({ score });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch votes' });
  }
};
