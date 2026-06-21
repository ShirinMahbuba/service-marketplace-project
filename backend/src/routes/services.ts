import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      include: {
        vendorProfile: {
          include: { user: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(services);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch services' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const service = await prisma.service.findUnique({
      where: { id: req.params.id },
      include: {
        vendorProfile: { include: { user: true } },
      },
    });
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    return res.json(service);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch service' });
  }
});

export default router;
