import express from 'express';
import 'dotenv/config';
import cors from 'cors'
import http from 'http'
import { connectDB } from './lib/db.js';

// create express app and http server 
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;

// Middleware setup 
app.use(express.json({
    limit: '4mb'
}));
app.use(cors())
app.use("/api/status", (req, res) => {
    res.send('Server is live')
})

// connect to the database 
await connectDB();

// Start the server and listen on the specified port
server.listen(PORT, () => {
    console.log('Server is runnig on PORT' + PORT)
})