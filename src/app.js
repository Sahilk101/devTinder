const express = require('express');
const connectDB = require('./config/database'); // Ensure database connection is established
const User = require('./models/user'); // Import the User model
const { validateSignUpData } = require('./utils/validation')
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser'); // Middleware to parse cookies
const jwt = require('jsonwebtoken'); // For JWT token generation and verification\
const { userAuth } = require('./middlewares/auth');

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Use cookie parser middleware to handle cookies

app.post('/sign-up', async (req, res) => {
    try {
        validateSignUpData(req); // Validate the request data

        const { firstName, lastName, email, password, age } = req.body; // Destructure request body

        const existingUser = await User.findOne({ email: req.body.email }); // Check if user already exists
        if (existingUser) {
            return res.status(400).send('User already exists'); // If user exists, return 400
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10); // Hash the password
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword, // Use hashed password
            age
        }); // Create a new user instance with the request body

        await user.save(); // Save the user to the database
        return res.status(201).send('User created successfully');
    } catch (error) {
        console.error('Error creating user:', error.message);
        return res.status(500).send(error.message); // Return error message if user creation fails
    }
})

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body; // Get email and password from request body
        if (!email || !password) {
            return res.status(400).send('Email and password are required'); // If email or password is missing, return 400
        }
        const user = await User.findOne({ email }); // Find user by email
        if (!user || user.length === 0) {
            return res.status(404).send('User not found');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).send('Invalid password');
        }

        const token = await user.getJWT(); // Generate JWT token using user method
        console.log('Generated token:', token); // Log the generated token


        res.cookie('token', token); // Set the token in a cookie
        return res.status(200).send('Login successful');
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).send('Internal Server Error'); // Return 500 if an error occurs
    }

})

app.get('/profile', userAuth, async (req, res) => {
    try {
        const user = req.user // Find user by ID from token
        if (!user) {
            return res.status(404).send('User not found'); // If user not found, return 404
        }
        return res.status(200).json(user); // Return user profile as JSON
    } catch (error) {
        console.error('Error fetching profile:', error);
        return res.status(500).send('Internal Server Error'); // Return 500 if an error occurs
    }
})

app.get('/users', async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database
        if (!users || users.length === 0) {
            return res.status(404).send('No users found'); // If no users, return 404
        }
        return res.status(200).json(users); // Return the users as JSON
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).send('Internal Server Error');
    }
})

app.get('/user', async (req, res) => {
    try {
        const email = req.body.email; // Get email from query parameters
        if (!email) {
            return res.status(400).send('Email is required');
        }
        const user = await User.findOne({ email }); // Find user by email
        if (!user) {
            return res.status(404).send('User not found');
        }
        return res.status(200).json(user); // Return the user data as JSON
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).send('Internal Server Error');
    }
})

// Connect to the database  
connectDB().then(() => {
    console.log('Database connected successfully');
    app.listen(3000, () => {
        console.log('Server is up on port 3000');
    });
}).catch(err => {
    console.error('Database connection failed:', err);
});