import queryFn from '../../utils/queryFunction';
import { successResponse, errorResponse } from '../../utils/customResponse';
import { Request, Response } from 'express';

// SQL query to get all posts
const _getAllPosts = `
SELECT 
    p.post_id AS postId,
    p.title,
    p.content,
    p.topics,
    p.up_downVote AS upDownVote,
    p.no_of_votes AS noOfVotes,
    u.user_id AS createdBy,
    p.created_at AS createdAt
FROM 
    posts p
JOIN 
    users u ON p.created_by = u.id  
WHERE 
    p.is_archived = 0
LIMIT ? OFFSET ?`;

// Function to get all posts
const getAllPosts = async (req: Request, res: Response) => {
    const defaultLimit = 10;
    const defaultPage = 1;
    const page = parseInt(req.query.page as string, 10) || defaultPage;
    const limit = parseInt(req.query.limit as string, 10) || defaultLimit;

    if (page < 1 || limit < 1) {
        return res.json(errorResponse(400, 'Invalid page or limit values'));
    }
    const offset = (page - 1) * limit;

    try {
        interface Post {
            postId: string;
            title: string;
            content: string;
            topics: string;
            upDownVote: number;
            noOfVotes: number;
            createdBy: string;
            createdAt: string;
        }
        
        type PostArray = Post[];
        
        const posts: PostArray = await queryFn(_getAllPosts, [limit, offset]);
        console.log('Fetched all posts');

        res.json(successResponse(200, "Posts fetched successfully", {
            length: posts.length,
            posts,
            page,
            limit
        }));
    } catch (err) {
        console.error("Error fetching posts:", err);
        return res.json(errorResponse(400, "Something went wrong."));
    }
};

export default getAllPosts; // Use ES module export