/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express';

interface ResponseData {
  success: boolean;
  statusCode: number;
  message: string;
  data?: any;
  meta?: any;
}

export const sendResponse = (res: Response, data: ResponseData) => {
  res.status(data.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    data: data.data,
    meta: data.meta,
  });
};