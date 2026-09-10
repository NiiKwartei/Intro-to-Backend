import express from "express";

// Initialize Express application
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Import routes
import userRouter from "./routes/user.route.js";

// Mount routes
app.use("/api/v1/users", userRouter);
// app.use("/api/v1/posts", postRouter); // Example: uncomment once postRouter is created

// Example endpoint: http://localhost:4000/api/v1/users/register

export default app; 