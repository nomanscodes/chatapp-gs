import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Controller for user authentication
export const signUp = async (req, res) => {

    try {
        // Extract user details from the request body
        const { email, fullName, password, bio } = req.body

        // Validate input
        if (!email || !fullName || !password) {
            return res.status(400).json({
                message: 'All fields are required'
            })
        }

        // Check if user already exists
        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                message: 'Account already exists'
            })
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create new user 
        const newUser = await User.create({
            email,
            fullName,
            password: hashedPassword,
            bio,
        })

        // Generate a token for the user
        const token = generateToken(newUser._id);

        res.json({
            success: true,
            message: 'User created successfully',
            newUser,
            token,
        })
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }

}

// Controller for user login
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // valide inputs 
        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            })
        }

        const userData = await User.findOne({ email })

        const isPasswordCorrect = await bcrypt.compare(password, userData.password)

        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: 'Invalide Credentials'
            })
        }

        const token = generateToken(userData._id)

        res.status(200).json({
            sussess: true,
            message: 'Login successfully',
            userData,
            token
        })

    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: e.message
        })
    }
}

// controller to check if user is athenticated 
export const checkAuth = async (req, res) => {
    return res.status(200).json({
        success: true,
        user: req.user
    })
}

// Controller to update user profile
export const updateProfile = async (req, res) => {
    try {
        const { fullName, bio, profilePic } = req.body;

        if (!fullName || !bio) {
            return res.status(400).json({
                message: 'Name and bio fields are required'
            })
        }

        const userId = req.user._id;

        let updatedUser

        if (!profilePic) {
            updatedUser = await User.findByIdAndUpdate(userId, {
                fullName,
                bio
            }, {
                new: true, // Return the updated document
            })
        } else {

            const upload = await cloudinary.uploader.upload(profilePic)

            updatedUser = await User.findByIdAndUpdate(userId, {
                fullName,
                bio,
                profilePic: upload.secure_url
            }, {
                new: true, // Return the updated document
            })
        }

        if (!updatedUser) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            updatedUser
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}