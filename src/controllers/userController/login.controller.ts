import queryFn from "../../utils/queryFunction";
import { comparePassword } from "../../utils/bcryptHashing";
import generateToken from "../../service/generateToken";
import { errorResponse, successResponse } from "../../utils/customResponse";
import {Request, Response, NextFunction} from 'express'

// SQL query to login user
const _loginUser = `
    SELECT 
        user_id, 
        password, 
        id, 
        email,
        role
    FROM 
        users 
    WHERE 
        user_id = ?`;

// Define the User interface
interface User {
    user_id: string;
    password: string;
    id: string;
    email: string;
    role: string;
}

type UserArray = User[];

// Login function
const login = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id, password } = req.body;

    try {
        const [user]: UserArray = await queryFn(_loginUser, [user_id]);
        console.log(user);
        
        if (!user) {
            return res.json(errorResponse(401, "Invalid user_id or password"));
        }

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.json(errorResponse(401, "Invalid user_id or password")); // throw exception error
        }

        // Use the generateToken function to create a token
        const token = generateToken(user);

        const payload = { role: user.role, userId: user.user_id, email: user.email, id: user.id };
        res.json(successResponse(200, "Login successful", { user: payload, token }));
    } catch (error) {
        return next(error);
    }
};

export default login; // Use ES module export