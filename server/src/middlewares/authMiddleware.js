import User from '../models/User.js';

// Middleware to check if user is authenticated
export const protect = async (req, res, next) => {
    const { userId } = req.auth;
    console.log(req.auth);
    if (!userId) {
        res.json({ success: false, message: 'not authenticated' });
    } else {
        const user = await User.findById(userId);
        console.log(user);
        req.user = user;
        next();
    }
}
