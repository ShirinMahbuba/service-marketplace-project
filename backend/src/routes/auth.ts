import { Router, Request, Response } from 'express';
import { MOCK_USERS, SESSION_COOKIE } from '../lib/auth';
import { signToken } from '../middleware/authenticate';
import { prisma } from '../lib/prisma';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  // Check mock users first, then database
  let user = MOCK_USERS.find((u) => u.email === email);

  if (!user) {
    const dbUser = await prisma.user.findUnique({ where: { email } });
    if (!dbUser) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    user = {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role as 'ADMIN' | 'VENDOR' | 'END_USER',
    };
  }

  const token = signToken({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  res.cookie(SESSION_COOKIE, encodeURIComponent(JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  })), {
    httpOnly: false,
    path: '/',
    maxAge: 60 * 60 * 24 * 1000,
    sameSite: 'lax',
  });

  return res.json({ success: true, token, user });
});

router.post('/signup', async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const validRoles = ['END_USER', 'VENDOR'];
  const userRole = validRoles.includes(role) ? role : 'END_USER';

  // Check if email already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      role: userRole,
    },
  });

  // If vendor, create vendor profile
  if (userRole === 'VENDOR') {
    await prisma.vendorProfile.create({
      data: {
        userId: newUser.id,
        bio: '',
        phone: '',
      },
    });
  }

  const token = signToken({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role as 'ADMIN' | 'VENDOR' | 'END_USER',
  });

  res.cookie(SESSION_COOKIE, encodeURIComponent(JSON.stringify({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
  })), {
    httpOnly: false,
    path: '/',
    maxAge: 60 * 60 * 24 * 1000,
    sameSite: 'lax',
  });

  return res.status(201).json({ success: true, token, user: newUser });
});

router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie(SESSION_COOKIE, { path: '/' });
  res.json({ success: true });
});

export default router;
