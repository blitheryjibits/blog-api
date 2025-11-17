import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import authRouter from './auth-router.js';
import postRouter from './post-router.js';
import commentRouter from './comment-router.js'

const router = Router();

router.use('/auth', authRouter);
router.use('/posts', postRouter);
router.use('/comments', commentRouter);

export default router;