import prisma from '../prisma/client.js';

export const getUserByClerkId = async (req, res) => {
  const { clerkUserId } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
      select: { id: true }, 
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ prismaUserId: user.id });
  } catch (error) {
    console.error('Error fetching user by clerkUserId:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
