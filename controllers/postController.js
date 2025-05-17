import prisma from '../prisma/client.js';
import cloudinary from '../utils/cloudinary.js';
import multer from 'multer';

// Set up Multer for parsing multipart form data
const upload = multer({ storage: multer.memoryStorage() }).single('image');

export const createPost = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ error: 'Image upload error' });
    }

    const { title, content, authorId: clerkUserId, communityId } = req.body;
    let imageUrl;

    try {
      // Upload image to Cloudinary if present
      if (req.file) {
        const result = await cloudinary.uploader.upload_stream(
          { resource_type: 'image', folder: 'posts' },
          async (error, result) => {
            if (error) throw error;
            imageUrl = result.secure_url;

            const user = await prisma.user.findUnique({
              where: { clerkUserId },
            });

            if (!user) {
              return res.status(404).json({ error: 'User not found' });
            }

            const post = await prisma.post.create({
              data: {
                title,
                content,
                imageUrl,
                authorId: user.id,
                communityId,
              },
            });

            res.status(201).json({ post });
          }
        );

        result.end(req.file.buffer);
      } else {
        // No image case
        const user = await prisma.user.findUnique({
          where: { clerkUserId },
        });

        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        const post = await prisma.post.create({
          data: {
            title,
            content,
            imageUrl: null,
            authorId: user.id,
            communityId,
          },
        });

        res.status(201).json({ post });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create post' });
    }
  });
};


export const getPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        community: true,
      },
    });

    if (!post) return res.status(404).json({ error: 'Post not found' });

    res.json({ post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
};

// get all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        community: true, 
        author: true,    
      },
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

//get posts Filtered by userId
export const getUserPosts = async (req, res) => {
  const userId = req.params.userId; 
  
  try {
    const posts = await prisma.post.findMany({
      where: {
        authorId: userId, // Filter by userId
      },
      include: {
        community: true,
        author: true,
      },
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ error: 'Failed to fetch user posts' });
  }
};