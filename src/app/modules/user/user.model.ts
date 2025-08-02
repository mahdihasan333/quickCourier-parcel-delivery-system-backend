import { Schema, model } from 'mongoose';
import { IUser, Role, IsActive, IAuthProvider } from './user.interface';

const authProviderSchema = new Schema<IAuthProvider>({
  provider: { type: String, enum: ['google', 'credentials'], required: true },
  providerId: { type: String, required: true },
});

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phone: { type: String },
    picture: { type: String },
    address: { type: String },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: String, enum: Object.values(IsActive), default: IsActive.ACTIVE },
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: Object.values(Role), required: true },
    auths: { type: [authProviderSchema], default: [] },
  },
  { timestamps: true },
);

export const User = model<IUser>('User', userSchema);