// src/app/modules/user/user.route.ts
import { Router } from 'express';
import { UserControllers } from './user.controller';
import { Role } from './user.interface';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { updateUserZodSchema } from './user.validation';
import { createUserZodSchema } from '../auth/auth.validation';

const router = Router();

router.post('/register', validateRequest(createUserZodSchema), UserControllers.createUser);
router.get('/all-users', checkAuth('ADMIN'), UserControllers.getAllUsers);
router.patch('/:id', validateRequest(updateUserZodSchema), checkAuth(Object.values(Role)), UserControllers.updateUser);
router.delete('/:id', checkAuth([Role.ADMIN, Role.SUPER_ADMIN]), UserControllers.deleteUser);

export const UserRoutes = router;