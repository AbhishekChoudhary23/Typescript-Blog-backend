import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// Middleware to authenticate JWT
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, process.env.SECRET_KEY as string, (err: any, user: any) => {
        if (err) return res.sendStatus(403); // Forbidden
        (req as any).user = user;
        next();
    });
};

export default authenticateToken;