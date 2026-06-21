import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const [userCount, vendorCount, serviceCount, transactions] = await Promise.all([
      prisma.user.count({ where: { role: 'END_USER' } }),
      prisma.user.count({ where: { role: 'VENDOR' } }),
      prisma.service.count(),
      prisma.transaction.findMany({
        include: {
          user: true,
          service: { include: { vendorProfile: { include: { user: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    return res.json({ userCount, vendorCount, serviceCount, transactions });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

router.get('/users', async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        vendorProfile: { include: { services: true } },
        transactions: true,
      },
      orderBy: { createdAt: 'asc' },
    });
    return res.json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export default router;
