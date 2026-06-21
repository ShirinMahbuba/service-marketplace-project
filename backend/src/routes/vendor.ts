import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

router.post('/services', async (req: Request, res: Response) => {
  try {
    const { vendorProfileId, name, description, price, category } = req.body;

    const service = await prisma.service.create({
      data: { vendorProfileId, name, description, price, category },
    });

    return res.json({ success: true, service });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create service' });
  }
});

router.get('/profile', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId },
      include: {
        services: {
          include: {
            transactions: {
              include: { user: true },
              orderBy: { createdAt: 'desc' as const },
            },
          },
        },
      },
    });

    if (!vendorProfile) {
      return res.status(404).json({ error: 'Vendor profile not found' });
    }

    return res.json(vendorProfile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch vendor profile' });
  }
});

router.get('/services-list', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId },
      include: {
        services: { orderBy: { createdAt: 'desc' as const } },
      },
    });

    if (!vendorProfile) {
      return res.status(404).json({ error: 'Vendor profile not found' });
    }

    return res.json(vendorProfile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch vendor services' });
  }
});

export default router;
