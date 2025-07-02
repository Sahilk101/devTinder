const validator = require('validator');

const validateSignUpData = (req) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || typeof firstName !== 'string' || firstName.length < 4 || firstName.length > 50) {
        return { error: 'First name must be a string between 4 and 50 characters.' };
    }
    if (lastName && typeof lastName !== 'string') {
        return { error: 'Last name must be a string.' };
    }

    if (!email || !validator.isEmail(email)) {
        return { error: 'Invalid email format.' };
    }
    if (!password || password.length < 6 || !validator.isStrongPassword(password)) {
        return { error: 'Password must be at least 6 characters long and strong.' };
    }
    if (req.body.age && (typeof req.body.age !== 'number' || req.body
        .age < 18)) {
        return { error: 'Age must be a number and at least 18.' };
    }
    return null; // No validation errors
}

module.exports = {
    validateSignUpData,
};