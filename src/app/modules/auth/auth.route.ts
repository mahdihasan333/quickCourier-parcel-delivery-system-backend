import { Router } from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { AuthControllers } from './auth.controller';
import { createUserZodSchema } from '../user/user.validation';

const router = Router();

router.post('/register', validateRequest(createUserZodSchema), AuthControllers.registerUser);
router.post('/login', AuthControllers.loginUser);

export const AuthRoutes = router;