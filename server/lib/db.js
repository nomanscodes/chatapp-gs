import mongoose from "mongoose";

// function to connect to the mongodb database 
export const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log('Connected to MongoDB');
        });

        await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`)
    }
    catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
}