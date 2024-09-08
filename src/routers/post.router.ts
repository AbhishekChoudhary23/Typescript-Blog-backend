import express, { Router } from 'express';

import { postSchema } from '../middleware/joiValidation';
import validator from '../utils/validator';
import authenticateToken from '../middleware/authMiddleware';
import isAdmin from '../middleware/isAdmin';

import createPost from '../controllers/postController/createPost.controller';
import getAllPosts from '../controllers/postController/getAllPosts.controller';
import getMyPost from '../controllers/postController/getMyPost.controller';
import getPostById from '../controllers/postController/getPostById.controller';
import searchPosts from '../controllers/postController/search.controller';
import voteOnPost from '../controllers/postController/upDownVote.controller';
import updatePost from '../controllers/postController/updatePost.controller';
import deletePost from '../controllers/postController/deletePost.controller';
// import updatePost from '../controllers/postController/updatePost.controller';

const router: Router = express.Router();

router.post("/search", searchPosts);
router.post("/createpost", authenticateToken, validator(postSchema), createPost);
router.post("/vote/:post_id", authenticateToken, voteOnPost);
router.get("/allposts", getAllPosts);
router.get("/mypost", authenticateToken, getMyPost);
router.delete('/deletepost/:post_id', authenticateToken, isAdmin, deletePost);
router.patch('/updatepost/:post_id', authenticateToken, isAdmin, updatePost);
router.get('/:post_id', getPostById);

export default router;