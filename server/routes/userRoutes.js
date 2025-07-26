import express from 'express';
import { checkAuth, login, signUp, updateProfile } from '../controller/userController.js';
import { protectRoute } from '../middleware/auth.js';

const router = express.Router();

// ✅ Signup
router.route('/signup')
    .post(signUp)
    .all((req, res) => {
        res.status(405).json({ message: 'Method Not Allowed on /signup' });
    });

// ✅ Login
router.route('/login')
    .post(login)
    .all((req, res) => {
        res.status(405).json({ message: 'Method Not Allowed on /login' });
    });

// ✅ Update Profile (Protected)
router.route('/update-profile')
    .put(protectRoute, updateProfile)
    .all((req, res) => {
        res.status(405).json({ message: 'Method Not Allowed on /update-profile' });
    });

// ✅ Check Auth (Protected)
router.route('/check-auth')
    .get(protectRoute, checkAuth)
    .all((req, res) => {
        res.status(405).json({ message: 'Method Not Allowed on /check-auth' });
    });

export default router;
