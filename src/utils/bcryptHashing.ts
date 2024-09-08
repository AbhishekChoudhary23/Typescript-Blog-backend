import bcrypt from 'bcrypt';

// Hashing function
const passwordHash = async (password: string): Promise<string> => {
    const saltRounds = parseInt(process.env.SALT_ROUNDS as string);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword; // Return the hashed password
};

// Comparison function
const comparePassword = async (password: string, userPassword: string): Promise<boolean> => {
    const match = await bcrypt.compare(password, userPassword);
    return match; // Return true if passwords match, false otherwise
};

export { passwordHash, comparePassword };