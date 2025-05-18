const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    name:
    {
        type: String,
        required: true
    },
    accessToken: {
        type: String,
        default: null,
        unique: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String,
        default: null
    },
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;