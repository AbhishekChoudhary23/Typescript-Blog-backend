import express, { Express } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

// Import user routes
import userRoutes from './routers/user.router';
import postRouter from './routers/post.router';
import commentRouter from './routers/comment.router';
// import errorHandler from './middleware/errorHandler';

dotenv.config();

const app: Express = express();
const port: number = Number(process.env.PORT) || 5000; // Ensure port is a number

// -----------------------------    Middleware to parse JSON bodies     -----------------------------
app.use(bodyParser.json());
// generate reqId( uuid ) {Create Middleware}
// -----------------------------    Using User Routers     -----------------------------
app.use('/user', userRoutes);
app.use('/post', postRouter);
app.use('/comment', commentRouter);
// app.use(errorHandler);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});