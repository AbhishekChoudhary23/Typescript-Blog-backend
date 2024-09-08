import jwt from 'jsonwebtoken';

interface User {
    role: string;
    user_id: string; // Assuming this is the unique identifier for the user
    email: string;
    id: string; // This can be the same as user_id or a different unique identifier
}

// Function to generate a JWT token
const generateToken = (user: User): string => {
    const payload = {
        role: user.role,
        user_id: user.user_id,
        email: user.email,
        id: user.id
    };

    // Ensure that SECRET_KEY and EXPIRATION_TIME are defined
    const secretKey = process.env.SECRET_KEY;
    const expirationTime = process.env.EXPIRATION_TIME;

    if (!secretKey) {
        throw new Error("SECRET_KEY is not defined in the environment variables.");
    }

    if (!expirationTime) {
        throw new Error("EXPIRATION_TIME is not defined in the environment variables.");
    }

    const token = jwt.sign(payload, secretKey, {
        expiresIn: expirationTime
    });

    return token;
};

export default generateToken; // Use ES module export