const mongoose = require("mongoose")

const RefreshTokenSchema = new mongoose.Schema({
    token: {
        type: String,
    }
},{timestamps: true})

module.exports = mongoose.model("RefreshTokens", RefreshTokenSchema)