// user.route.ts
import { Router, RequestHandler } from 'express';
import { UserControllers } from './user.controller';
import { Role } from './user.interface';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { updateUserZodSchema } from './user.validation';
import { createUserZodSchema } from '../auth/auth.validation';

const router = Router();

// `createUser` রুটে `Request` ব্যবহৃত হয়, কারণ এটি অথেনটিকেশন ছাড়া
router.post('/register', validateRequest(createUserZodSchema), UserControllers.createUser as RequestHandler);

// `getAllUsers`, `updateUser`, এবং `deleteUser` রুটে `AuthRequest` ব্যবহৃত হয়
router.get('/all-users', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserControllers.getAllUsers as RequestHandler);
router.patch('/:id', validateRequest(updateUserZodSchema), checkAuth(...Object.values(Role)), UserControllers.updateUser as RequestHandler);
router.delete('/:id', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserControllers.deleteUser as RequestHandler);

export const UserRoutes = router;