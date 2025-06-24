import app from '../app';

const { PORT } = process.env;
const port = PORT ? parseInt(PORT, 10) : 3000;

app.listen(port, () => {
  console.log(`Express listening on port ${port}`);
});
import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

router.get('/greet', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ success: true, message: 'hi' });
});

export default router;