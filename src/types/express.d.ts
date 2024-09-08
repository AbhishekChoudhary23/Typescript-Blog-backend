import { Request } from 'express';

interface CustomRequest extends Request{
        user_id: string;
        id: string;
        role: string;
};

declare global {
    namespace Express {
        interface Request {
            user?: CustomRequest
        }
    }
}


export default CustomRequest;