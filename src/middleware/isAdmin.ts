import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/customResponse';

// Middleware to check if the user is an admin
const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;

    if (!user) {
        return res.json(errorResponse(401, "Unauthorized"));
    }

    const { role } = user;

    if (role === 'ADMIN') {
        next();
    } else {
        return res.json(errorResponse(403, "Access denied. Only admins can perform this action."));
    }
};

export default isAdmin;