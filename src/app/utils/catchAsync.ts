// catchAsync.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
// import { AuthRequest } from '../middlewares/checkAuth';
import AppError from './AppError';
import httpStatus from 'http-status-codes';

// জেনেরিক টাইপ ব্যবহার করে Request বা AuthRequest সাপোর্ট করা
export const catchAsync = <T extends Request>(
  fn: (req: T, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: T, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err: any) => {
      if (err instanceof AppError) {
        return res.status(err.statusCode).json({
          success: false,
          statusCode: err.statusCode,
          message: err.message,
          errors: err.errors,
        });
      }
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      });
    });
  };
};