/* eslint-disable @typescript-eslint/no-explicit-any */
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status-codes';
import { envVars } from '../../config/env';
import { UserServices } from '../user/user.service';
import AppError from '../../utils/AppError';
import { User } from '../user/user.model';
import { SignOptions } from 'jsonwebtoken';
import { IUser } from '../user/user.interface';

const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid email or password');
  }

  if (user.isActive === 'BLOCKED') {
    throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
  }

  const isMatch = await bcryptjs.compare(password, user.password || '');
  if (!isMatch) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid email or password');
  }

  if (!envVars.JWT_ACCESS_SECRET) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'JWT_ACCESS_SECRET is not defined');
  }

  const tokenPayload = {
    id: user._id.toString(),
    role: user.role,
  };

  const tokenOptions: SignOptions = {
    expiresIn: envVars.JWT_ACCESS_EXPIRES || '1h', 
  };

  const token = jwt.sign(tokenPayload, envVars.JWT_ACCESS_SECRET, tokenOptions);

  return { token, user };
};

const registerUser = async (payload: Partial<IUser>) => {
  return await UserServices.createUser(payload);
};

export const AuthServices = {
  loginUser,
  registerUser,
};