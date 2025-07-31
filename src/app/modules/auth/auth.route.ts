import { Router } from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { AuthControllers } from './auth.controller';
import { createUserZodSchema, loginUserZodSchema } from './auth.validation';

const router = Router();

router.post('/register', validateRequest(createUserZodSchema), AuthControllers.registerUser);
router.post('/login', validateRequest(loginUserZodSchema), AuthControllers.loginUser);

export const AuthRoutes = router;