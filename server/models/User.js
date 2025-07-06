import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        requiredq: true,
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    profilePic: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    }
})

const User = mongoose.model("User", userSchema);

export default User;