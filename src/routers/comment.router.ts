import express, { Router } from 'express';
import authenticateToken from '../middleware/authMiddleware';
import { commentSchema } from '../middleware/joiValidation';
import validator from '../utils/validator';
import createComment from '../controllers/commentController/createComment.controller';
import deleteComment from '../controllers/commentController/deleteComment.controller';

const router: Router = express.Router();

router.post('/create/:post_id', validator(commentSchema), authenticateToken, createComment);
router.delete('/delete/:comment_id', authenticateToken, deleteComment);

export default router;