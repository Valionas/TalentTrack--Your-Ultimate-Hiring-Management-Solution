// middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

interface JwtPayload {
  id: string;
}

export interface AuthenticatedRequest extends Request {
  user: IUser;
}

export const authProtection = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as JwtPayload;

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      // Now downstream handlers can do (req as AuthenticatedRequest).user
      (req as AuthenticatedRequest).user = user;
      next();
    } catch (err) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
