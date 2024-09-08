import Joi from 'joi';

// --------- USER SCHEMA ---------
const userSchema = Joi.object({
    userId: Joi.string().required(),
    firstName: Joi.string().max(100).required(),
    lastName: Joi.string().max(100).required(),
    email: Joi.string().email().max(100).required(),
    phoneNo: Joi.number().integer().required(),
    createdAt: Joi.date().timestamp(),
    role: Joi.string().valid('ADMIN', 'VIEWER').required(),
    password: Joi.string().max(30).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Passwords do not match'
    })
});

// --------- LOGIN SCHEMA ---------
const loginSchema = Joi.object({
    user_id: Joi.string().required(),
    password: Joi.string().max(30).required(),
});

// --------- POST SCHEMA ---------
const postSchema = Joi.object({
    title: Joi.string().max(50).required(),
    content: Joi.string().max(500).required(),
    topics: Joi.array().items(Joi.string()).optional(),
});

// --------- COMMENT SCHEMA ---------
const commentSchema = Joi.object({
    comment_body: Joi.string().max(300).required()
});

export { userSchema, loginSchema, postSchema, commentSchema }; // Use ES module export