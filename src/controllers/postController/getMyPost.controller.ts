import queryFn from '../../utils/queryFunction';
import { successResponse, errorResponse } from '../../utils/customResponse';
import { Request, Response } from 'express';
import CustomRequest from '../../types/express';

// SQL query to get my posts
const _getMyPost = `
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
    p.created_by = ?
AND 
    p.is_archived = 0
`;

// Function to get my posts
const getMyPost = async (req: Request, res: Response) => {
    if(!req.user || !req.user.id){
        return res.json(errorResponse(401, "User not found"))
    }
    const { id } = req.user;

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

        const results: PostArray = await queryFn(_getMyPost, [id]);
        console.log('Here are your posts');
        res.json(successResponse(200, "Fetched all Posts", results));
    } catch (err) {
        console.error("Error fetching posts:", err);
        return res.json(errorResponse(400, "Something went wrong."));
    }
};

export default getMyPost; // Use ES module export