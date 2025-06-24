import { Router } from 'express';
import { defaultHandler, notFound } from './errorHandler';
import api from './api';

const router = Router();

router.use('/api', api);
router.use(notFound);
router.use(defaultHandler);

export default router;