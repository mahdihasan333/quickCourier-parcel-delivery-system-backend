import { Types } from 'mongoose';

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  SENDER = 'SENDER',
  RECEIVER = 'RECEIVER',
}

export interface IAuthProvider {
  provider: 'google' | 'credentials';
  providerId: string;
}

export enum IsActive {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
}

export interface IUser {
  _id?: Types.ObjectId;
  id?: string; // For req.user.id
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  address?: string;
  isDeleted: boolean;
  isActive?: IsActive;
  isVerified?: boolean;
  role: Role;
  auths: IAuthProvider[];
}