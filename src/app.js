const express = require('express');
const connectDB = require('./config/database'); // Ensure database connection is established
const User = require('./models/user'); // Import the User model

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

app.post('/sign-up', async (req, res) => {
    try {
        const user = new User(req.body); // Create a new user instance with the request bod
        await user.save(); // Save the user to the database
        return res.status(201).send('User created successfully');
    } catch (error) {
        console.error('Error creating user:', error.message);
        return res.status(500).send(error.message); // Return error message if user creation fails
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