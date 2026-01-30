import { Request, Response, NextFunction } from "express";

export const enrichRequestWithUserId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (req.user && req.user.user_id) {
      if (!req.body.userId) {
        req.body.userId = String(req.user.user_id);
      }
      
      if (!req.body.username && req.user.username) {
        req.body.username = req.user.username;
      }
    }

    next();
  } catch (error) {
    next();
  }
};