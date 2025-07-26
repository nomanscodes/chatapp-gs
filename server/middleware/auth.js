import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.headers.token

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decoded.userId).select('-password')

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized access'
            })
        }

        req.user = user
        next()
    } catch (error) {
        console.error('Error in protectRoute middleware:', error)
        res.status(401).json({
            success: false,
            message: 'Unauthorized access',
            error: error.message
        })
    }
}