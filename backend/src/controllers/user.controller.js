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

        // Check password length (matches schema minlength: 8)
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
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

        // Return success response (without password) - 201 Created
        res.status(201).json({
            message: "User registered successfully",
            user: { id: user._id, email: user.email, username: user.username }
        });
    } catch (error) {
        console.error("Registration error:", error);

        // Handle Mongoose validation errors as 400 instead of 500
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
        }

        res.status(500).json({ message: "Internal server error" });
    }
};
const loginUser = async (req,res) => {
    try {
        const {username,email,password} = req.body;
        const user = await User.findOne({ 
            email: email.toLowerCase(),
          });
          if(!user){
            return res.status(400).json({ message: "User not found" });
        
          }
        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(400).json({ message: "Invalid password" });
        }
        user.loggedIn = true;
        await user.save();
        res.status(200).json({ message: "User logged in successfully", 
            user : {
                 id: user._id, 
                 email: user.email, 
                 username: user.username 
             }
         });
     } catch (error) {
         console.error("Login error:", error);
         res.status(500).json({ message: "Internal server error" });
     }
 } 

 const logoutUser = async (req,res) => {
    try {
        const { username, email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const user = await User.findOne({ 
            email: email.toLowerCase(),
        });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        user.loggedIn = false;
        await user.save();
        res.status(200).json({ message: "User logged out successfully", 
            user : {
                 id: user._id, 
                 email: user.email, 
                 username: user.username 
             }
         });
     } catch (error) {
         console.error("Logout error:", error);
         res.status(500).json({ message: "Internal server error" });
     }
 } 

export { registerUser ,
        loginUser,
        logoutUser,
};