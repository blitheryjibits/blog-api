import { Router } from 'express';
import * as authController from '../controllers/auth-controller.js';
import { authSchema } from '../utils/validation-shemas.mjs'
import { authenticateToken } from '../middleware/authenticate-token.mjs'

const router = Router();

router.post('/register', authSchema, authController.register);

router.post('/login', authSchema, authController.login);

router.post('/admin/login', authSchema, authController.adminLogin);

router.patch('/update', authenticateToken, authSchema, authController.updateUser);

export default router;