import queryFn from '../../utils/queryFunction';
import { errorResponse, successResponse } from '../../utils/customResponse';
import { Request, Response, NextFunction } from 'express';

// SQL query to search posts
const _searchPosts = `
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
    p.is_archived = 0 AND
    (p.title LIKE ? OR 
    p.topics LIKE ?
    )`;

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
// Function to search posts
const searchPosts = async (req: Request, res: Response, next: NextFunction) => {
    const { searchTerm } = req.body as { searchTerm: string | undefined };

    if (!searchTerm) {
        return res.json(errorResponse(400, "Search term is required."));
    }

    const minSearchTermLength = process.env.MIN_SEARCH_TERM_LENGTH;
    if (!minSearchTermLength) {
        return res.json(errorResponse(500, "Internal Server Error: MIN_SEARCH_TERM_LENGTH environment variable is not set."));
    }

    const minSearchTermLengthNumber = parseInt(minSearchTermLength, 10);
    if (isNaN(minSearchTermLengthNumber)) {
        return res.json(errorResponse(500, "Internal Server Error: MIN_SEARCH_TERM_LENGTH environment variable must be a number."));
    }

    if (searchTerm.length < minSearchTermLengthNumber) {
        return res.json(errorResponse(400, `Search term must be at least ${minSearchTermLengthNumber} characters long.`));
    }

    // Prepare the search term for SQL LIKE (case-insensitive)
    const searchPattern = `%${searchTerm}%`; // Wrap the search term with wildcards

    try {
        const results: PostArray = await queryFn(_searchPosts, [searchPattern, searchPattern]);

        if (results.length === 0) {
            return res.json(errorResponse(404, "No posts found matching the search criteria."));
        }

        res.json(successResponse(200, "Posts retrieved successfully.", results));
    } catch (err) {
        console.error("Error searching posts:", err);
        return res.json(errorResponse(400, "Something went wrong."));
    }
};

export default searchPosts; // Use ES module export