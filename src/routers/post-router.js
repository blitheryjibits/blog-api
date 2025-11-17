import { Router } from 'express';
import * as postController from '../controllers/post-controller.js';
import { authenticateToken } from '../middleware/authenticate-token.mjs';
import { postSchema, postIdParam } from '../utils/validation-shemas.mjs'

const router = Router();

router.post('/', authenticateToken, postSchema, postController.createPost);
router.get('/', postController.getAllPublishedPosts); // Accessible to public
router.get('/:postId', authenticateToken, postIdParam, postController.getPostById);
router.get('/search', postController.getPostBySearch);
router.put('/:postId', authenticateToken, postSchema, postIdParam, postController.updatePost);
router.delete('/:postId', authenticateToken, postIdParam, postController.deletePost);
export default router;