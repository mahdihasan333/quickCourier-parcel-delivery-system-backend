import z from 'zod';
import { ParcelStatus } from './parcel.interface';

export const createParcelZodSchema = z.object({
  receiver: z.string({ invalid_type_error: 'Receiver must be a valid ID' }).regex(/^[0-9a-fA-F]{24}$/, {
    message: 'Invalid receiver ID',
  }),
  type: z
    .string({ invalid_type_error: 'Type must be string' })
    .min(2, { message: 'Type must be at least 2 characters long.' })
    .max(50, { message: 'Type cannot exceed 50 characters.' }),
  weight: z.number({ invalid_type_error: 'Weight must be a number' }).min(0.1, { message: 'Weight must be at least 0.1 kg' }),
  senderAddress: z
    .string({ invalid_type_error: 'Sender address must be string' })
    .min(5, { message: 'Sender address must be at least 5 characters long.' }),
  receiverAddress: z
    .string({ invalid_type_error: 'Receiver address must be string' })
    .min(5, { message: 'Receiver address must be at least 5 characters long.' }),
  fee: z.number({ invalid_type_error: 'Fee must be a number' }).min(0, { message: 'Fee cannot be negative' }),
});

export const updateParcelStatusZodSchema = z.object({
  status: z.enum(Object.values(ParcelStatus) as [string], { invalid_type_error: 'Invalid status' }),
});