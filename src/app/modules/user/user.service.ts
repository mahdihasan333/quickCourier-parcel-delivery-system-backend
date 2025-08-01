// user.service.ts
import bcryptjs from 'bcryptjs';
import httpStatus from 'http-status-codes';
import { envVars } from '../../config/env';
import { IAuthProvider, IUser, Role } from './user.interface';
import { User } from './user.model';
import AppError from '../../utils/AppError';

const createUser = async (payload: Partial<IUser>) => {
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

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: IUser) => {
  const ifUserExist = await User.findById(userId);
  if (!ifUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found');
  }

  if (payload.role) {
    if (decodedToken.role === Role.SENDER || decodedToken.role === Role.RECEIVER) {
      throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized');
    }
    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized');
    }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.SENDER || decodedToken.role === Role.RECEIVER) {
      throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized');
    }
  }

  if (payload.password) {
    payload.password = await bcryptjs.hash(payload.password, Number(envVars.BCRYPT_SALT_ROUND));
  }

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true });
  return newUpdatedUser;
};

const getAllUsers = async () => {
  const users = await User.find({ isDeleted: false });
  const totalUsers = await User.countDocuments({ isDeleted: false });
  return {
    data: users,
    meta: {
      total: totalUsers,
    },
  };
};

const deleteUser = async (userId: string, decodedToken: IUser) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found');
  }

  if (decodedToken.role !== Role.ADMIN && decodedToken.role !== Role.SUPER_ADMIN) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to delete users');
  }

  if (user.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
    throw new AppError(httpStatus.FORBIDDEN, 'Admins cannot delete Super Admins');
  }

  if (user._id.toString() === decodedToken._id?.toString()) {
    throw new AppError(httpStatus.FORBIDDEN, 'You cannot delete your own account');
  }

  await User.findByIdAndUpdate(userId, { isDeleted: true }, { new: true });
  return { message: 'User deleted successfully' };
};

export const UserServices = {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
};