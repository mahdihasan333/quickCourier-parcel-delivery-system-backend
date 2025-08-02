import { Router, RequestHandler } from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { ParcelControllers } from './parcel.controller';
import { Role } from '../user/user.interface';
import { createParcelZodSchema, updateParcelStatusZodSchema } from './parcel.validation';
// import { AuthRequest } from '../../middlewares/checkAuth';

const router = Router();

// RequestHandler টাইপ কাস্টিং করে AuthRequest সাপোর্ট করা
router.post('/', validateRequest(createParcelZodSchema), checkAuth(Role.SENDER), ParcelControllers.createParcel as RequestHandler);
router.patch('/cancel/:id', checkAuth(Role.SENDER), ParcelControllers.cancelParcel as RequestHandler);
router.patch('/confirm/:id', checkAuth(Role.RECEIVER), ParcelControllers.confirmDelivery as RequestHandler);
router.patch('/status/:id', validateRequest(updateParcelStatusZodSchema), checkAuth(Role.ADMIN, Role.SUPER_ADMIN), ParcelControllers.updateStatus as RequestHandler);
router.get('/me', checkAuth(Role.SENDER, Role.RECEIVER, Role.ADMIN, Role.SUPER_ADMIN), ParcelControllers.getParcels as RequestHandler);
router.patch('/block/:id', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), ParcelControllers.blockParcel as RequestHandler);
router.patch('/unblock/:id', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), ParcelControllers.unblockParcel as RequestHandler);
router.delete('/:id', checkAuth(Role.SENDER, Role.ADMIN, Role.SUPER_ADMIN), ParcelControllers.deleteParcel as RequestHandler);

export const ParcelRoutes = router;