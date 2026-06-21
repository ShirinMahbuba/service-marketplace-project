import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { authenticate } from './middleware/authenticate';
import { authorize } from './middleware/authorize';

import authRoutes from './routes/auth';
import checkoutRoutes from './routes/checkout';
import servicesRoutes from './routes/services';
import vendorRoutes from './routes/vendor';
import adminRoutes from './routes/admin';
import transactionRoutes from './routes/transactions';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Public routes (no auth required)
app.use('/api/auth', authRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Protected routes — require valid JWT
// Services: browseable by END_USER and ADMIN
app.use('/api/services', authenticate, authorize('END_USER', 'ADMIN'), servicesRoutes);

// Checkout: END_USER only
app.use('/api/checkout', authenticate, authorize('END_USER'), checkoutRoutes);

// Vendor routes: VENDOR only
app.use('/api/vendor', authenticate, authorize('VENDOR'), vendorRoutes);

// Admin routes: ADMIN only
app.use('/api/admin', authenticate, authorize('ADMIN'), adminRoutes);

// Transactions: END_USER only
app.use('/api/transactions', authenticate, authorize('END_USER'), transactionRoutes);

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
