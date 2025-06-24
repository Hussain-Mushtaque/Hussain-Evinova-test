import { Request, Response, NextFunction } from 'express';

const defaultHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error('Error:', err);
  res.status(500).json({ success: false });
};

const notFound = (req: Request, res: Response, next: NextFunction): void => {
  res.status(404).json({ success: false, message: 'Route not found' });
};

export {
  defaultHandler,
  notFound,
};