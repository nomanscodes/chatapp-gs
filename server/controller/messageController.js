import cloudinary from "../lib/cloudinary.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { userSocketMap, io } from "../server.js";

// Get all users except the logged in user
export const getUsersForSidebar = async (req, res) => {
    try {
        const userId = req.user._id;

        console.log("Fetching users for sidebar, excluding user ID:", userId);

        const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");

        // Count number of messages not seen
        const unseenMessages = {}

        const promises = filteredUsers.map(async (user) => {
            const messages = await Message.find({
                senderId: user._id, receiverId:
                    userId, seen: false
            })

            if (messages.length > 0) {
                unseenMessages[user._id] = messages.length;
            }
        })

        await Promise.all(promises);

        return res.status(200).json({
            success: true,
            users: filteredUsers,
            unseenMessages
        });

    } catch (error) {
        console.error('Error fetching users for sidebar:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

// get all messages for selected user 
export const getMessages = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: myId }
            ]
        })

        // Mark messages as seen if they are from the selected user
        await Message.updateMany(
            { senderId: selectedUserId, receiverId: myId, seen: false },
            { $set: { seen: true } }
        );

        res.status(200).json({
            success: true,
            messages
        });

    } catch (error) {
        console.error('Error fetching messages:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

// api to mark message as seen using message id 
export const markMessageAsSeen = async (req, res) => {
    try {
        const { messageId } = req.params;

        // Find the message by ID and update its seen status
        const updatedMessage = await Message.findByIdAndUpdate(
            messageId,
            { seen: true },
            { new: true }
        );

        if (!updatedMessage) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Message marked as seen',
            updatedMessage
        });

    } catch (error) {
        console.error('Error marking message as seen:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

// send message to slected user
export const sendMessage = async (req, res) => {
    try {
        const { image, text } = req.body;

        const receiverId = req.params.id

        const senderId = req.user._id;

        let imageUrl = ''

        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url;
        }

        const message = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Failed to send message'
            });
        }

        // Emit the new message to the receiver socket 
        const receiverSocketId = userSocketMap[receiverId];
        
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', {
                message
            });
        }

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: message
        });

    } catch (error) {
        console.error('Error sending message EEE:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error E',
            error: error.message
        });
    }
}