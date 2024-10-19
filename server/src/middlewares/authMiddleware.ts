import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

interface JwtPayload {
  id: string;
}

interface AuthenticatedRequest extends Request {
  user?: any;  // Or you can replace 'any' with a specific type, like IUser
}

export const authProtection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

      // Fetch user from the token and attach it to req.user
      (req as AuthenticatedRequest).user = await User.findById(decoded.id).select('-password');

      if (!(req as AuthenticatedRequest).user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      next(); // Pass control to the next middleware/controller
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
