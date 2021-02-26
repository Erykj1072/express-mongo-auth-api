const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    googleId: {
        type: String,
    },
    facebookId: {
        type: String,
    },
    username: {
        type: String,
        min: 6,
        max: 32
    },
    email: {
        type: String,
        max: 255
    },
    password: {
        type: String,
        max: 1024,
        min: 8
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpries: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model("Users", UserSchema)