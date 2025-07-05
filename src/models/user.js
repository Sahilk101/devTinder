const mongoose = require('mongoose');
const validate = require('validator');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (validate.isEmail(value) === false) {
                throw new Error('Invalid email format');
            }
        },
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        validate(value) {
            if (!validate.isStrongPassword(value)) {
                throw new Error("Enter strong password")
            }
        },
    },
    age: {
        type: Number,
        minValue: 18,
    },
}, { timestamps: true });

userSchema.methods.getJWT = async function () {
    const user = this; // 'this' refers to the current user instance
    const token = await jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    return token; // Return the generated JWT token
};


mongoose.model('User', userSchema);

module.exports = mongoose.model('User');