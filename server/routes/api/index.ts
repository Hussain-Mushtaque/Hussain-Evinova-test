import { Router, Request, Response, NextFunction } from "express";

const router = Router();

router.get(
  "/greet",
  (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ success: true, message: "hi" });
  }
);

export default router;
