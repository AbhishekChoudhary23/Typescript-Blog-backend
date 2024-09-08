import queryFn from '../../utils/queryFunction';
import { Request, Response } from 'express';
import { errorResponse } from '../../utils/customResponse';

// SQL query to get user by ID
const _getUserById = `
    SELECT 
        user_id, 
        first_name, 
        last_name, 
        email, 
        phone_no, 
        created_at, 
        role
    FROM 
        users 
    WHERE
        user_id = ?
    AND 
        is_archived = 0`;

// Function to get the current user
const getMe = async (req: Request, res: Response) => {
    const { user_id } = req.user!; 

    interface User {
        user_id: string;
        first_name: string;
        last_name: string;
        email: string;
        phone_no: number;
        created_at: string;
        role: string;
    }
    
    type UserArray = User[];

    try {
        const result: UserArray = await queryFn(_getUserById, [user_id]);
        if (result.length === 0) {
            return res.status(404).send("User not found");
        }
        
        res.json(result[0]);
    } catch (err) {
        console.error("Error fetching user:", err);
        return res.json(errorResponse(400, "Something went wrong."));
    }
};

export default getMe; // Use ES module export