import httpStatus from 'http-status-codes';
import { Parcel } from './parcel.model';
import { User } from '../user/user.model';
import { generateTrackingId } from '../../utils/generateTrackingId';
import AppError from '../../utils/AppError';
import { IParcel, ParcelStatus } from './parcel.interface';
import { Role } from '../user/user.interface';

const createParcel = async (payload: Partial<IParcel>, senderId: string) => {
  const { receiver, type, weight, senderAddress, receiverAddress, fee } = payload;
  const sender = await User.findById(senderId);
  const receiverUser = await User.findById(receiver);
  if (!sender || sender.isActive === 'BLOCKED') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Sender is invalid or blocked');
  }
  if (!receiverUser || receiverUser.isActive === 'BLOCKED') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Receiver is invalid or blocked');
  }
  const trackingId = generateTrackingId();
  const parcel = await Parcel.create({
    trackingId,
    sender: senderId,
    receiver,
    type,
    weight,
    senderAddress,
    receiverAddress,
    fee,
    status: ParcelStatus.REQUESTED,
    statusLogs: [{ status: ParcelStatus.REQUESTED, timestamp: new Date(), note: 'Parcel created' }],
  });
  return parcel;
};

const cancelParcel = async (parcelId: string, senderId: string) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found');
  }
  if (parcel.sender.toString() !== senderId) {
    throw new AppError(httpStatus.FORBIDDEN, 'Unauthorized: Not the sender');
  }
  if (parcel.status !== ParcelStatus.REQUESTED) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Cannot cancel dispatched parcel');
  }
  if (parcel.isBlocked) {
    throw new AppError(httpStatus.FORBIDDEN, 'Parcel is blocked');
  }
  parcel.status = ParcelStatus.CANCELLED;
  parcel.statusLogs.push({ status: ParcelStatus.CANCELLED, timestamp: new Date(), note: 'Cancelled by sender' });
  await parcel.save();
  return parcel;
};

const confirmDelivery = async (parcelId: string, receiverId: string) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found');
  }
  if (parcel.receiver.toString() !== receiverId) {
    throw new AppError(httpStatus.FORBIDDEN, 'Unauthorized: Not the receiver');
  }
  if (parcel.status !== ParcelStatus.IN_TRANSIT) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Parcel not in transit');
  }
  if (parcel.isBlocked) {
    throw new AppError(httpStatus.FORBIDDEN, 'Parcel is blocked');
  }
  parcel.status = ParcelStatus.DELIVERED;
  parcel.statusLogs.push({ status: ParcelStatus.DELIVERED, timestamp: new Date(), note: 'Confirmed by receiver' });
  await parcel.save();
  return parcel;
};

const updateStatus = async (parcelId: string, status: ParcelStatus, updatedBy: string) => {
  const validStatusFlow: { [key in ParcelStatus]?: ParcelStatus[] } = {
    [ParcelStatus.REQUESTED]: [ParcelStatus.APPROVED, ParcelStatus.CANCELLED],
    [ParcelStatus.APPROVED]: [ParcelStatus.DISPATCHED],
    [ParcelStatus.DISPATCHED]: [ParcelStatus.IN_TRANSIT],
    [ParcelStatus.IN_TRANSIT]: [ParcelStatus.DELIVERED],
  };
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found');
  }
  if (parcel.isBlocked) {
    throw new AppError(httpStatus.FORBIDDEN, 'Parcel is blocked');
  }
  if (!validStatusFlow[parcel.status]?.includes(status)) {
    throw new AppError(httpStatus.BAD_REQUEST, `Invalid status transition from ${parcel.status} to ${status}`);
  }
  parcel.status = status;
  parcel.statusLogs.push({ status, timestamp: new Date(), updatedBy, note: `Status updated to ${status}` });
  await parcel.save();
  return parcel;
};

const getParcelsByUser = async (userId: string, role: Role) => {
  let parcels;
  if (role === Role.ADMIN || role === Role.SUPER_ADMIN) {
    parcels = await Parcel.find().populate('sender receiver');
  } else if (role === Role.SENDER) {
    parcels = await Parcel.find({ sender: userId }).populate('receiver');
  } else if (role === Role.RECEIVER) {
    parcels = await Parcel.find({ receiver: userId }).populate('sender');
  } else {
    throw new AppError(httpStatus.FORBIDDEN, 'Invalid role');
  }
  const totalParcels = parcels.length;
  return {
    data: parcels,
    meta: {
      total: totalParcels,
    },
  };
};

const blockParcel = async (parcelId: string) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found');
  }
  parcel.isBlocked = true;
  await parcel.save();
  return parcel;
};

const unblockParcel = async (parcelId: string) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found');
  }
  parcel.isBlocked = false;
  await parcel.save();
  return parcel;
};

const deleteParcel = async (parcelId: string, userId: string, role: Role) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found');
  }
  if (role !== Role.ADMIN && role !== Role.SUPER_ADMIN && parcel.sender.toString() !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, 'Unauthorized: Only sender or admin can delete');
  }
  if (parcel.status !== ParcelStatus.REQUESTED) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Cannot delete dispatched parcel');
  }
  if (parcel.isBlocked) {
    throw new AppError(httpStatus.FORBIDDEN, 'Parcel is blocked');
  }
  await parcel.deleteOne();
  return { message: 'Parcel deleted successfully' };
};

export const ParcelServices = {
  createParcel,
  cancelParcel,
  confirmDelivery,
  updateStatus,
  getParcelsByUser,
  blockParcel,
  unblockParcel,
  deleteParcel,
};