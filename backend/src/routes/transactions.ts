import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: {
        service: {
          include: { vendorProfile: { include: { user: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json(transactions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

export default router;
