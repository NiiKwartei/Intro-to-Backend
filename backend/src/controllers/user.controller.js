import { User } from "../config/models/user.model.js";

// Register a new user
const registerUser = async (req, res) => {
    try {
        // Get data from request body
        const { username, email, password } = req.body;

        // Check if any field is missing
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }   

        // Check if user already exists (by username or email)
        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create new user in database
        const user = await User.create({
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            password,
            loggedIn: false,
        });

        // Return success response (without password)
        res.status(200).json({
            message: "User registered successfully",
            user: { id: user._id, email: user.email, username: user.username }
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export { registerUser };