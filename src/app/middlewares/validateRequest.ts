import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import httpStatus from 'http-status-codes';
import AppError from '../utils/AppError';

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Validation failed', error.errors);
    }
  };
};