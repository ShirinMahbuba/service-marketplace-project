import { Router, Request, Response } from 'express';
import { MOCK_USERS, SESSION_COOKIE } from '../lib/auth';
import { signToken } from '../middleware/authenticate';

const router = Router();

router.post('/login', (req: Request, res: Response) => {
  const { email } = req.body;

  const user = MOCK_USERS.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials.' });
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

router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie(SESSION_COOKIE, { path: '/' });
  res.json({ success: true });
});

export default router;
