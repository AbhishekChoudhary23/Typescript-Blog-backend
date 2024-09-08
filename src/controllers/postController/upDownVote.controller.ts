import queryFn from '../../utils/queryFunction';
import { errorResponse, successResponse } from '../../utils/customResponse';
import { Request, Response } from 'express';
import CustomRequest from '../../types/express';

// Upsert query for user votes
const _upsertVote = `
    INSERT INTO user_votes (
        user_id,   
        post_id, 
        vote_value
    )
    VALUES 
        (?)
    ON DUPLICATE KEY UPDATE 
        vote_value = VALUES(vote_value);`;

const _checkVoteExists = `
    SELECT 
        vote_value 
    FROM 
        user_votes
    WHERE  
        user_id = ? 
    AND 
        post_id = ?`;

const _deleteVote = `
    DELETE FROM 
        user_votes
    WHERE 
        user_id = ?
    AND 
        post_id = ?`;

const _updatePostVotes = `
    UPDATE 
        posts
    SET 
        up_downVote = (
            SELECT COALESCE(SUM(vote_value), 0) FROM user_votes WHERE post_id = ?
        ), 
        no_of_votes = (
            SELECT COUNT(*) FROM user_votes WHERE post_id = ?
        )
    WHERE 
        post_id = ?`;

interface Vote {
    vote_value: number;
}

interface UserVote {
    user_id: string;
    post_id: string;
    vote_value: number;
}

type VoteArray = Vote[];

// Function to vote on a post
const voteOnPost = async (req: any, res: Response) => {
    const { id } = req.user;
    const { post_id } = req.params;
    const { voteValue } = req.body as { voteValue: number | null };

    try {
        const [existingVote]: VoteArray = await queryFn(_checkVoteExists, [id, post_id]);

        // If voteValue is null, remove the vote
        if (voteValue === null) {
            if (existingVote) {
                // Remove the vote
                await queryFn(_deleteVote, [id, post_id]);
                // Update post with the new vote totals
                await queryFn(_updatePostVotes, [post_id, post_id, post_id]);
                return res.json(successResponse(200, "Vote removed successfully"));
            } else {
                throw new Error("No vote to remove");
            }
        }

        // Check if the user has already voted with the same value
        if (existingVote && existingVote.vote_value === voteValue) {
            throw new Error("User has already voted with the same value");
        }

        // Prepare values for the upsert query
        const values = [
            [id, post_id, voteValue]
        ];

        // Use upsert query to insert or update the vote
        await queryFn(_upsertVote, values);

        // Update post with the new vote totals
        await queryFn(_updatePostVotes, [post_id, post_id, post_id]);

        return res.json(successResponse(201, "Vote successfully recorded"));
    } catch (error) {
        console.error("Error processing vote:", error);
        res.json(errorResponse(400, "Something Went wrong..."));
    }
};

export default voteOnPost; // Use ES module export