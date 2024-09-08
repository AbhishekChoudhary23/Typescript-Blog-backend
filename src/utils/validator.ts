import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const validate = (schema: Joi.Schema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return next(error); // Pass validation error to the next middleware
        }
        next(); // Proceed to next middleware or route handler
    };
};

export default validate; // Use ES module export