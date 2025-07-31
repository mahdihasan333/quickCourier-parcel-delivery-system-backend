import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status-codes';
import AppError from '../utils/AppError';

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err instanceof AppError ? err.statusCode : httpStatus.INTERNAL_SERVER_ERROR;
  const message = err instanceof AppError ? err.message : 'Internal Server Error';
  const errors = err.errors ? err.errors : undefined;

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};