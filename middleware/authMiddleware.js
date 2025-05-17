import { createClerkClient } from '@clerk/backend';

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const session = await clerk.sessions.verifySession(token);

    if (!session || !session.userId) {
      return res.status(401).json({ error: 'Unauthorized: Invalid session' });
    }

    req.userId = session.userId; // attach for use in route
    next();
  } catch (err) {
    console.error('Clerk token verification failed:', err);
    return res.status(401).json({ error: 'Unauthorized' });
  }
};
