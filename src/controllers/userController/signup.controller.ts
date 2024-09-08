import queryFn from "../../utils/queryFunction";
import { passwordHash } from '../../utils/bcryptHashing';
import generateToken from "../../service/generateToken";
import { successResponse, errorResponse } from "../../utils/customResponse";
import { Request, Response, NextFunction } from "express";

// SQL Queries
const existingUser = `
    SELECT 
        email 
    FROM 
        users 
    WHERE 
        email = ?;
`;

const _signupUserQuery = `
    INSERT INTO 
        users (
            user_id,
            first_name, 
            last_name, 
            email, 
            phone_no,
            role,
            password
        ) 
    VALUES 
        (?);
`;

const getUserById = `
    SELECT 
        user_id, 
        first_name, 
        last_name, 
        email, 
        phone_no, 
        role 
    FROM 
        users 
    WHERE 
        user_id = ?; 
`;

// Signup function
const signup = async (req: Request, res: Response, next: NextFunction) => {
    const { userId, firstName, lastName, email, phoneNo, role, password } = req.body; 

    try {
        const [checkExistingUser] = await queryFn(existingUser, [email]);
        if (checkExistingUser) {
            return res.json(errorResponse(400, "User already exists with this email."));
        }

        const hashedPassword = await passwordHash(password);
        const values = [
            [userId, firstName, lastName, email, phoneNo, role, hashedPassword],
        ];

        await queryFn(_signupUserQuery, values);

        const [user] = await queryFn(getUserById, [userId]); // Get user by userId

        if (!user) {
            return res.json(errorResponse(403, "User not found after registration.")); // Changed to res.json
        }

        const token = generateToken(user); // Use the first user object for token generation

        const payload = { role: user.role, userId: user.user_id, email: user.email, id: user.id };
        res.json(successResponse(201, "User and Token created successfully", { user: payload, token }));

    } catch (error) {
        return next(error);
    }
};

export default signup; // Use ES module export