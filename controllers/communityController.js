import prisma from '../prisma/client.js'; 

export const createCommunity = async (req, res) => {
  const { name, description } = req.body;
  try {
    const community = await prisma.community.create({
      data: { name, description },
    });
    res.status(201).json({ community });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create community' });
  }
};

export const getAllCommunities = async (req, res) => {
  try {
    const communities = await prisma.community.findMany();
    res.status(200).json({ communities });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch communities' });
  }
};

export const getCommunityByName = async (req, res) => {
  const { communityName } = req.params;
  try {
    const community = await prisma.community.findUnique({
      where: { name: communityName },
      include: { posts: true },
    });
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }
    res.status(200).json({ community });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching community' });
  }
};
