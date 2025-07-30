import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status-codes';
import { envVars } from '../config/env';
import AppError from '../utils/AppError';
import { Role } from '../modules/user/user.interface';

export interface AuthRequest extends Request {
  user?: { id: string; role: Role };
}

export const checkAuth = (...roles: Role[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'No token provided');
    }

    try {
      const decoded = jwt.verify(token, envVars.JWT_ACCESS_SECRET) as { id: string; role: Role };
      if (roles.length && !roles.includes(decoded.role)) {
        throw new AppError(httpStatus.FORBIDDEN, 'Access denied');
      }
      req.user = decoded;
      next();
    } catch (error) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token');
    }
  };
};