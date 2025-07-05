const jwt = require('jsonwebtoken'); // For JWT token generation and verification
const User = require('../models/user'); // Import the User model


const userAuth = async (req, res, next) => {

    const { token } = req.cookies; // Get the token from cookies
    if (!token) {
        return res.status(401).send('Access denied. No token provided'); // If no token, return 401
    }

    console.log('Token received:', token); // Log the received token for debugging

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        const id = decoded.id; // Extract user ID from the decoded token
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send('User not found'); // If user not found, return 404
        }
        req.user = user
        next(); // Call next middleware or route handler
    } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(400).send('Invalid token'); // If token is invalid, return 400
    }

}

module.exports = {
    userAuth
}