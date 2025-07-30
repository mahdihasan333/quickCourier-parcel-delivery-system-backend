import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import httpStatus from 'http-status-codes';
import AppError from '../utils/AppError';

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error: any) {
      throw new AppError(httpStatus.BAD_REQUEST, error.errors[0].message);
    }
  };
};