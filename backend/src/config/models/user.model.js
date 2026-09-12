import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, // removes whitespace from both ends of a string
            minlength: 3,
            maxlength: 30
        },   
        password: {
            type: String,
            required: true,
            minlength: 8
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        loggedIn: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true
    }
);
//before saving any password, we need to hash it
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});
//compare passwords 
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};
export const User = mongoose.model("User", userSchema);

         