import { Router } from 'express';
import * as commentController from '../controllers/comment-controller.js'
import { authenticateToken } from '../middleware/authenticate-token.mjs';
import { commentSchema, postIdParam, commentIdParam } from '../utils/validation-shemas.mjs';

const router = Router();

router.get('/:postId/:commentId', postIdParam, commentIdParam, commentController.getSinglePostComment);
router.get('/:postId', postIdParam, commentController.getPostComments);
router.get('/', commentController.getAllComments);

router.post('/:postId', authenticateToken, postIdParam, commentSchema, commentController.createComment);
router.put('/:postId/:commentId', authenticateToken, postIdParam, commentIdParam, commentSchema, commentController.updateComment);
router.delete('/:postId/:commentId', authenticateToken, postIdParam, commentIdParam, commentController.deleteCommentById);

export default router;