import queryFn from '../../utils/queryFunction';
import { errorResponse, successResponse } from '../../utils/customResponse';
import { Request, Response, NextFunction } from 'express';

// SQL query to get a post by ID
const postSql = `
    SELECT 
        post_id,
        title,
        content,
        topics,
        up_downVote,
        no_of_votes,
        created_by,
        created_at 
    FROM 
        posts 
    WHERE 
        post_id = ?`;

// SQL query to create a comment
const commentSql = `
    INSERT INTO comments (
        post_id, 
        created_by, 
        comment_body
    ) 
    VALUES (?)`;

interface Post {
    post_id: string;
    title: string;
    content: string;
    topics: string;
    up_downVote: number;
    no_of_votes: number;
    created_by: string;
    created_at: string;
}

interface Comment {
    post_id: string;
    created_by: string;
    comment_body: string;
}

type PostArray = Post[];
type CommentArray = Comment[];

// Function to create a comment
const createComment = async (req: Request, res: Response, next: NextFunction) => {
    const { post_id } = req.params;
    const { comment_body } = req.body as { comment_body: string };
    const { id } = req.user as { id: string };

    console.log('User ID:', id);
    console.log('Post ID:', post_id);
    console.log('Comment Text:', comment_body);

    // Validate input
    if (!comment_body) {
        return res.json(errorResponse(403, 'Comment text is required'));
    }

    try {
        const [post]: PostArray = await queryFn(postSql, [post_id]);
        
        if (!post) {
            return res.json(errorResponse(404, 'Post not found'));
        }

        const values = [[post_id, id, comment_body]];
        const result = await queryFn(commentSql, values);
        
        if (result.affectedRows === 0) {
            return res.json(errorResponse(400, 'Failed to create comment'));
        }

        res.json(successResponse(201, 'Comment created successfully', {
            comment: {
                post_id,
                created_by: id,
                comment_body
            }
        }));
    } catch (error) {
        console.error('Error creating comment:', error);
        return res.json(errorResponse(400, "Something went wrong."));
    }
};

export default createComment; // Use ES module export