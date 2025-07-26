import express from 'express';
import 'dotenv/config';
import cors from 'cors'
import http from 'http'
import { connectDB } from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { Server } from 'socket.io'

// create express app and http server 
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;

// Initialize Socket.IO Server 
export const io = new Server(server, {
    cors: {
        origin: "*"
    }
})

// store online users 
export const userSocketMap = {};

// socket handler function 
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId
    console.log(`User connected: ${userId}`);

    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    // emit online user to all connected clients 
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // handle user disconnect

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${userId}`);

        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})

// Middleware setup 
app.use(express.json({
    limit: '4mb'
}));

app.use(cors())

// route setup 
app.use('/api/auth', userRouter)
app.use('/api/messages', messageRouter)

// fallback route 
// app.use("/", (req, res) => {
//     res.send('Server running')
// })

// connect to the database 
await connectDB();

// Start the server and listen on the specified port
server.listen(PORT, () => {
    console.log('Server is runnig on PORT' + PORT)
})