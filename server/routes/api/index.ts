import { Router } from 'express';
import pokemonRoutes from './pokemon';

const router = Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'pokemon-battle-api',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

router.get('/greet', (req, res) => {
  res.status(200).json({ success: true, message: 'Pokemon Battle API is ready!' });
});

router.use('/', pokemonRoutes);

export default router;
