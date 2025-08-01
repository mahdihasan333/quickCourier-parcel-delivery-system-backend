/* eslint-disable @typescript-eslint/no-explicit-any */

class AppError extends Error {
  public statusCode: number;
  public errors?: any;

  constructor(statusCode: number, message: string, errors?: any) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
    this.errors = errors;
  }
}

export default AppError;