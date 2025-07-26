import express from 'express';
import { protectRoute } from '../middleware/auth.js';
import { getMessages, getUsersForSidebar, markMessageAsSeen, sendMessage } from '../controller/messageController.js';

const messageRouter = express.Router();

messageRouter.route('/users').get(protectRoute, getUsersForSidebar).all((req, res) => {
    res.status(405).json({ message: 'Method Not Allowed on /users' });
});

messageRouter.route('/:id').get(protectRoute, getMessages).all((req, res) => {
    res.status(405).json({ message: 'Method Not Allowed on /:id' });
});

messageRouter.route('/mark/:id').put(protectRoute, markMessageAsSeen).all((req, res) => {
    res.status(405).json({ message: 'Method Not Allowed on /:id' });
});

// send message  /api/messages/send
messageRouter.route('/send/:id').post(protectRoute, sendMessage).all((req, res) => {
    res.status(405).json({ message: 'Method Not Allowed on HHHH', success: false });
});


export default messageRouter;