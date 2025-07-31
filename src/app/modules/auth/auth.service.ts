import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status-codes';
import { envVars } from '../../config/env';
import { IAuthProvider, IUser } from '../user/user.interface';
import { User } from '../user/user.model';
import AppError from '../../utils/AppError';

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
  const token = jwt.sign({ id: user._id, role: user.role }, envVars.JWT_ACCESS_SECRET, {
    expiresIn: envVars.JWT_ACCESS_EXPIRES,
  });
  return { token, user };
};

const registerUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;
  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User Already Exist');
  }
  const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND));
  const authProvider: IAuthProvider = { provider: 'credentials', providerId: email as string };
  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });
  return user;
};

export const AuthServices = {
  loginUser,
  registerUser,
};