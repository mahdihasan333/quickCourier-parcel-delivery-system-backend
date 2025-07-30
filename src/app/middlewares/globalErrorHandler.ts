import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status-codes';
import AppError from '../utils/AppError';

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err instanceof AppError ? err.statusCode : httpStatus.INTERNAL_SERVER_ERROR;
  const message = err instanceof AppError ? err.message : 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};