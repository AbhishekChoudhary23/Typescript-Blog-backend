import queryFn from '../../utils/queryFunction';
import { successResponse, errorResponse } from '../../utils/customResponse';
import { Request, Response, NextFunction } from 'express';

// SQL query to get post by ID
const _getPostById = `
    SELECT
        p.post_id AS postId,
        p.title,
        p.content,
        p.topics,
        p.up_downVote AS upDownVotes,
        p.no_of_votes AS noOfVotes,
        u.user_id AS createdBy,
        p.created_at AS createdAt
    FROM
        posts p
    JOIN 
        users u ON p.created_by = u.id  
    WHERE
        p.post_id = ?`;

// SQL query to fetch comments by post ID
const _fetchCommentsByPostId = `
    SELECT
        c.comment_id AS commentId,
        c.comment_body AS commentBody,
        u.user_id AS createdByUserId,
        c.created_at AS createdAt
    FROM
        comments c
    JOIN 
        users u ON c.created_by = u.id  
    WHERE
        c.post_id = ? 
    AND 
        c.is_archived = 0 
    AND 
        c.deleted_at IS NULL`;

        
        interface Post {
            postId: string;
            title: string;
    content: string;
    topics: string;
    upDownVotes: number;
    noOfVotes: number;
    createdBy: string;
    createdAt: string;
}

interface Comment {
    commentId: string;
    commentBody: string;
    createdByUserId: string;
    createdAt: string;
}

type PostArray = Post[];
type CommentArray = Comment[];


// Function to get post by ID
const getPostById = async (req: Request, res: Response, next: NextFunction) => {
    const { post_id } = req.params;

    try {
        const [post]: PostArray = await queryFn(_getPostById, [post_id]);
        
        // Check if the post exists
        if (!post) {
            return res.json(errorResponse(400, 'Post not found'));
        }

        const comments: CommentArray = await queryFn(_fetchCommentsByPostId, [post_id]);

        const response = {
            ...post,
            comments
        };

        // Return the post
        res.json(successResponse(200, "Fetched Post by ID", response));
    } catch (error) {
        console.error("Error retrieving the post:", error);
        res.json(errorResponse(400, 'Error retrieving the post'));
    }
};

export default getPostById; // Use ES module export