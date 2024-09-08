import queryFn from '../../utils/queryFunction';
import { successResponse, errorResponse } from '../../utils/customResponse';
import { Request, Response } from 'express';
// import { CustomRequest } from '../../types/express';

// SQL query to update a post
const _updatePost = `
    UPDATE 
        posts
    SET 
        title = ?, 
        content = ?, 
        topics = ?
    WHERE 
        post_id = ? 
        AND created_by = ? 
        AND is_archived = 0;`;
        
interface PostUpdateRequest {
    title: string;
    content: string;
    topics: string[];
}

interface PostUpdateResponse {
    affectedRows: number;
    // Add other properties if necessary
}
        
// Function to update a post
const updatePost = async (req: Request, res: Response) => {
    if(!req.user) {
        return res.json(errorResponse(401, "User not found"))
    }
    const { id, role } = req.user;
    const { post_id } = req.params;
    const { title, content, topics }: PostUpdateRequest = req.body;

    if (role !== 'ADMIN') {
        return res.json(errorResponse(403, "Access denied. Only admins can update posts."));
    }

    try {
        const result: PostUpdateResponse = await queryFn(_updatePost, [title, content, JSON.stringify(topics), post_id, id]);
        
        if (result.affectedRows === 0) {
            return res.json(errorResponse(400, "Post not found"));
        }
        
        res.json(successResponse(200, "Post Updated successfully"));
    } catch (err) {
        console.error("Error updating the post:", err);
        return res.json(errorResponse(400, "Something went wrong."));
    }
};

export default updatePost; // Use ES module export