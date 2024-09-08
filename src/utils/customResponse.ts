// Define a generic type for success response data
interface SuccessResponse<T = null> {
    statusCode: number;
    message: string;
    data?: T | null; // Allow data to be of type T or null
}

interface ErrorResponse {
    statusCode: number;
    message: string;
    timeStamp: string;
}

// Function to create a success response
const successResponse = <T = null>(statusCode: number, message: string, data: T | null = null): SuccessResponse<T> => {
    return {
        statusCode,
        message,
        data,
    };
};

// Function to create an error response
const errorResponse = (statusCode: number, message: string): ErrorResponse => {
    return {
        statusCode,
        message,
        timeStamp: new Date().toISOString(),
    };
};

export { successResponse, errorResponse }; // Use ES module export