import { createClerkClient } from '@clerk/backend';
import prisma from '../prisma/client.js';

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

// ✅ Signup Controller
export const signupUser = async (req, res) => {
  const { email, password, fullName } = req.body;

  try {
    // Check if user already exists in your DB
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists in app database' });
    }

    // Check if user already exists in Clerk
    const clerkUsers = await clerkClient.users.getUserList({ emailAddress: [email] });
    if (clerkUsers.length > 0) {
      return res.status(400).json({ error: 'User already exists in Clerk' });
    }

    // Create user in Clerk
    const clerkUser = await clerkClient.users.createUser({
      emailAddress: [email],
      password,
      firstName: fullName?.split(' ')[0] || '',
      lastName: fullName?.split(' ').slice(1).join(' ') || '',
    });

    if (!clerkUser?.id) {
      return res.status(500).json({ error: 'Failed to create user in Clerk' });
    }

    // Store user in your DB
    const user = await prisma.user.create({
      data: {
        email: clerkUser.emailAddresses[0]?.emailAddress || email,
        fullName,
        clerkUserId: clerkUser.id,
      },
    });

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


//signin controller
export const signinUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data: users } = await clerkClient.users.getUserList({ emailAddress: [email] });

    if (!users || users.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const clerkUser = users[0];

    const appUser = await prisma.user.findUnique({ where: { email } });

    if (!appUser) {
      return res.status(400).json({ error: 'User not found in application database' });
    }

    const isMatch = await bcrypt.compare(password, appUser.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Create a session
    const session = await clerkClient.sessions.createSession({
      userId: clerkUser.id,
    });

    // Send the session ID or token in the response
    res.status(200).json({
      message: 'Sign-in successful',
      token: session.id,  // Use session ID as the token here
      user: {
        id: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress,
      },
    });
  } catch (error) {
    console.error('Sign-in error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
