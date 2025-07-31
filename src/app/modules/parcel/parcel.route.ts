import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { ParcelControllers } from './parcel.controller';
import { Role } from '../user/user.interface';
import { createParcelZodSchema, updateParcelStatusZodSchema } from './parcel.validation';

const router = Router();

router.post('/', validateRequest(createParcelZodSchema), checkAuth(Role.SENDER), ParcelControllers.createParcel);
router.patch('/cancel/:id', checkAuth(Role.SENDER), ParcelControllers.cancelParcel);
router.patch('/confirm/:id', checkAuth(Role.RECEIVER), ParcelControllers.confirmDelivery);
router.patch('/status/:id', validateRequest(updateParcelStatusZodSchema), checkAuth(Role.ADMIN, Role.SUPER_ADMIN), ParcelControllers.updateStatus);
router.get('/me', checkAuth(Role.SENDER, Role.RECEIVER, Role.ADMIN, Role.SUPER_ADMIN), ParcelControllers.getParcels);
router.patch('/block/:id', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), ParcelControllers.blockParcel);
router.patch('/unblock/:id', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), ParcelControllers.unblockParcel);

export const ParcelRoutes = router;