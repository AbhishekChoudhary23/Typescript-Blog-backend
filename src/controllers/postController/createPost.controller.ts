import { postSchema } from "../../middleware/joiValidation";
import { errorResponse, successResponse } from "../../utils/customResponse";
import queryFn from "../../utils/queryFunction";
import { Request, Response, NextFunction } from 'express';

// SQL query to create a post
const _createPost = `
    INSERT INTO posts (
        title,
        content,
        topics,
        created_by
    )
    VALUES (?);
`;

// Function to create a post
const createPost = async (req: Request, res: Response, next: NextFunction) => {
    const { id, role, user_id } = req.user as { id: string; role: string; user_id: string };
    const { title, content, topics } = req.body as { title: string; content: string; topics: string[] };

    if (role !== 'ADMIN') {
        return res.json(errorResponse(403, "Access denied. Only admins can create posts."));
    }

    const values = [[title, content, JSON.stringify(topics), id]];

    try {
        const result = await queryFn(_createPost, values);
        if (result.affectedRows === 0) {
            return res.json(errorResponse(404, "Post could not be created. Please check your input."));
        }
        res.json(successResponse(201, "Post created successfully", {
            post: {
                title,
                content,
                topics: topics,
                created_by: user_id
            }
        }));
    } catch (err) {
        console.error("Error creating post:", err);
        return res.json(errorResponse(400, "Something went wrong."));
    }
};

export default createPost; // Use ES module export