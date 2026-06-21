import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, serviceId, amount, paymentMethod } = req.body;

    if (!userId || !serviceId || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        serviceId,
        amount,
        status: 'Paid',
        paymentMethod: paymentMethod || 'bKash',
      },
      include: {
        service: true,
        user: true,
      },
    });

    return res.json({ success: true, transaction });
  } catch (error) {
    console.error('Checkout error:', error);
    return res.status(500).json({ error: 'Payment processing failed' });
  }
});

export default router;
