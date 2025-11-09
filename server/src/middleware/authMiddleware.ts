import jwt, { type JwtPayload } from 'jsonwebtoken';
import { type Response, type NextFunction } from 'express';
import User from '../models/User';
import { type AuthRequest } from '../types/AuthRequest';

export const protect = async (
  req: AuthRequest, // <-- Use AuthRequest
  res: Response,
  next: NextFunction
) => {
  let token;
  const secret = process.env.JWT_SECRET || 'supersecret';

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, secret) as JwtPayload;

      if (!decoded.id) {
        return res.status(401).json({ message: 'Not authorized, token invalid' });
      }
      
      req.user = await User.findById(decoded.id).select('-password') || undefined;

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};