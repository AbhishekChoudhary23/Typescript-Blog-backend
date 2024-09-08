import queryFn from '../../utils/queryFunction';
import { errorResponse, successResponse } from '../../utils/customResponse';
import { Request, Response } from 'express';

// SQL query to delete a post
const _deletePost = `
    UPDATE 
        posts 
    SET 
        deleted_at = current_timestamp,
        is_archived = true
    WHERE 
        post_id = ? AND created_by = ? AND is_archived = 0`;

        
// Function to delete a post
const deletePost = async (req: Request, res: Response) => {
    if(!req.user){
        return res.json(errorResponse(401, "User not found"))
    }
    const { id } = req.user
    const { post_id } = req.params;

    try {
        const result = await queryFn(_deletePost, [post_id, id]);
        
        if (result.affectedRows === 0) {
            return res.json(errorResponse(404, "Post not found"));
        }
        
        res.json(successResponse(200, "Post deleted successfully"));
    } catch (err) {
        console.error("Error deleting the post:", err);
        return res.json(errorResponse(400, "Something went wrong."));
    }
};

export default deletePost; // Use ES module export