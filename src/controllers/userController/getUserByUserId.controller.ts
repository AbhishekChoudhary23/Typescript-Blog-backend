import queryFn from '../../utils/queryFunction';
import { Request, Response } from 'express';
import { errorResponse } from '../../utils/customResponse';

interface User {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_no: number;
    created_at: string;
    role: string;
    deleted_at: string | null;
    is_archived: number;
}

// SQL query to get user by ID
const _getUserById =
    `SELECT 
        user_id, 
        first_name, 
        last_name, 
        email, 
        phone_no, 
        created_at, 
        role,
        deleted_at, 
        is_archived
    FROM 
        users 
    WHERE
        user_id = ?
    AND 
        is_archived = 0`;

// Function to get user by user ID
const getUserByUserId = async (req: Request, res: Response) => {
    const { user_id } = req.params;

    try {
        interface User {
            user_id: string;
            first_name: string;
            last_name: string;
            email: string;
            phone_no: number;
            created_at: string;
            role: string;
            deleted_at?: string; // Optional, as it might be null if not deleted
            is_archived: number; // Assuming it's a boolean-like integer (0 or 1)
        }
        
        type UserArray = User[];
        // Call queryFn with the correct generic type
        const result: UserArray = await queryFn(_getUserById, [user_id]);
        
        // Check if result is empty
        if (result.length === 0) {
            return res.status(404).send("User not found");
        }
        
        // Return the first user found
        res.json(result[0]);
    } catch (err) {
        console.error("Error fetching user:", err);
        return res.json(errorResponse(400, "Something went wrong."));
    }
};

export default getUserByUserId; // Use ES module export